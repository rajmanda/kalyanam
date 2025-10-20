import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, switchMap, tap } from 'rxjs/operators';

export interface SignedUrlResponse {
  signedUrl: string;
  blobPath: string;
  fileName: string;
}

export interface MultiUploadUrlItem {
  fileName: string;
  signedUrl: string;
  blobPath: string;
}

export interface MultiUploadUrlResponse {
  uploadUrls: MultiUploadUrlItem[];
  count: number;
}

export interface UploadResult {
  fileName: string;
  blobPath: string;
  success: boolean;
  error?: string;
}

export interface ListImagesResponse {
  images: string[];
  count: number;
  [key: string]: any; // For any additional properties
}

function sanitizeFilename(name: string): string {
  // Backend sanitization rule: replace characters not in [a-zA-Z0-9._-] with underscore
  return (name || '').replace(/[^a-zA-Z0-9._-]/g, '_');
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private fileUploadApiUrl = environment.apiBaseUrl + '/upload';

  constructor(private http: HttpClient) {}

  /**
   * Upload a single file using GCS signed URL (2-step process)
   * Step 1: Get signed URL from backend
   * Step 2: Upload file directly to GCS
   */
  uploadFile(file: File, event: string): Observable<UploadResult> {
    const contentType = file.type || 'application/octet-stream';
    const safeName = sanitizeFilename(file.name);

    return this.http.post<SignedUrlResponse>(
      `${this.fileUploadApiUrl}/generate-upload-url`,
      {
        fileName: safeName,
        contentType,
        event,
        eventName: event // support backends expecting 'eventName'
      }
    ).pipe(
      switchMap((response) => {
        console.log('[FileUploadService] uploadFile - Received signed URL:', response.signedUrl, 'blobPath:', response.blobPath);
        return from(
          fetch(response.signedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': contentType
            }
          }).then(async (gcsResponse) => {
            if (!gcsResponse.ok) {
              const bodyText = await gcsResponse.text().catch(() => '<unable to read body>');
              throw new Error(`GCS upload failed: ${gcsResponse.status} ${gcsResponse.statusText} - ${bodyText}`);
            }
            return {
              fileName: response.fileName,
              blobPath: response.blobPath,
              success: true
            } as UploadResult;
          })
        );
      }),
      catchError((error) => {
        console.error('[FileUploadService] uploadFile failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Upload multiple files using GCS signed URLs (2-step process)
   */
  uploadMultipleFiles(files: File[], event: string): Observable<UploadResult[]> {
    const fileInfos = files.map((f) => ({ fileName: f.name, contentType: f.type || 'application/octet-stream' }));

    return this.http.post<MultiUploadUrlResponse>(
      `${this.fileUploadApiUrl}/generate-multi-upload-urls`,
      {
        files: fileInfos,
        event
      }
    ).pipe(
      switchMap((response) => {
        const uploadUrls = response.uploadUrls || [];

        const results = uploadUrls.map(async (urlInfo, idx) => {
          // Preferred matching: by exact filename, then by sanitized filename, then by index fallback
          let file = files.find((f) => f.name === urlInfo.fileName)
            || files.find((f) => sanitizeFilename(f.name) === urlInfo.fileName)
            || files[idx];

          if (!file) {
            return {
              fileName: urlInfo.fileName,
              blobPath: urlInfo.blobPath,
              success: false,
              error: 'No matching file found for returned signed URL (filename may have been sanitized)'
            } as UploadResult;
          }

          const contentType = file.type || 'application/octet-stream';
          try {
            const gcsResponse = await fetch(urlInfo.signedUrl, {
              method: 'PUT',
              body: file,
              headers: { 'Content-Type': contentType }
            });
            if (!gcsResponse.ok) {
              const bodyText = await gcsResponse.text().catch(() => '<unable to read body>');
              throw new Error(`GCS upload failed for ${urlInfo.fileName}: ${gcsResponse.status} ${gcsResponse.statusText} - ${bodyText}`);
            }
            return {
              fileName: urlInfo.fileName,
              blobPath: urlInfo.blobPath,
              success: true
            } as UploadResult;
          } catch (err: any) {
            return {
              fileName: urlInfo.fileName,
              blobPath: urlInfo.blobPath,
              success: false,
              error: err?.message || 'Upload failed'
            } as UploadResult;
          }
        });

        return from(Promise.all(results));
      }),
      catchError((error) => {
        console.error('[FileUploadService] uploadMultipleFiles failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * List images - backend now returns signed URLs
   */
  listImages(eventName?: string, user?: string): Observable<ListImagesResponse> {
    let params = new HttpParams();
    if (eventName) params = params.set('eventName', eventName);
    if (user) params = params.set('user', user);

    console.log('[FileUploadService] listImages - Request parameters:', {
      eventName,
      user
    });

    return this.http.get<ListImagesResponse>(
      `${this.fileUploadApiUrl}/list-images`,
      { params }
    ).pipe(
      tap((response) => {
        console.log('[FileUploadService] listImages - Response received with', response.images?.length || 0, 'images (signed URLs)');
      }),
      catchError((error) => {
        console.error('[FileUploadService] Error listing images:', error);
        throw error;
      })
    );
  }

  /**
   * Get a signed URL for viewing a blob
   * @param blobPath - The blob path in GCS (e.g., "events/123/image.jpg")
   * @returns Observable with signed URL for viewing
   */
  getSignedViewUrl(blobPath: string): Observable<{ signedUrl: string }> {
    return this.http.post<{ signedUrl: string }>(
      `${this.fileUploadApiUrl}/generate-download-url`,
      { blobPath }
    ).pipe(
      tap((response) => {
        console.log('[FileUploadService] getSignedViewUrl - Generated signed URL for:', blobPath);
      }),
      catchError((error) => {
        console.error('[FileUploadService] Error generating signed view URL:', error);
        throw error;
      })
    );
  }
}
