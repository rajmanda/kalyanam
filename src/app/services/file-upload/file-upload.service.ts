import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap, filter, map } from 'rxjs/operators';

export interface UploadResponse {
  message: string;
  fileName: string;
  publicUrl: string;
  [key: string]: any; // For any additional properties
}

export interface ListImagesResponse {
  images: string[];
  count: number;
  [key: string]: any; // For any additional properties
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private fileUploadApiUrl = environment.apiBaseUrl + '/upload';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, event: string): Observable<HttpEvent<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('event', event);

    return this.http.post<UploadResponse>(
      `${this.fileUploadApiUrl}/picture-upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  uploadMultipleFiles(files: File[], event: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    formData.append('event', event);

    return this.http.post(
      `${this.fileUploadApiUrl}/multi-picture-upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  listImages(eventName?: string, user?: string): Observable<ListImagesResponse> {
    const params: any = {};
    if (eventName) {
      params.eventName = eventName;
    }
    if (user) {
      params.user = user;
    }

    console.log('[FileUploadService] listImages - Request parameters:', {
      eventName,
      user,
      finalParams: params
    });

    return this.http.get<ListImagesResponse>(`${this.fileUploadApiUrl}/list-images`, { params })
      .pipe(
        tap(response => {
          console.log('[FileUploadService] listImages - Response received with',
                     response.images?.length || 0, 'images');
        }),
        catchError(error => {
          console.error('[FileUploadService] Error listing images:', error);
          throw error;
        })
      );
  }
}
