import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { FileUploadService, ListImagesResponse, UploadResult } from '../services/file-upload/file-upload.service';
import { AuthService } from '../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { FileSizePipe } from '../shared/pipes/file-size.pipe';

// Types
type GalleryView = 'all' | 'mine';

interface GalleryImage {
  url: string;
  uploadedBy?: string;
  uploadedAt?: string;
  eventName?: string;
  fileName?: string;
  isVideo?: boolean;
  posterUrl?: string;
}

@Component({
  selector: 'app-picture-gallery',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatListModule,
    FileSizePipe
  ],
  templateUrl: './picture-gallery.component.html',
  styleUrls: ['./picture-gallery.component.css']
})
export class PictureGalleryComponent implements OnInit, OnDestroy {
  images: GalleryImage[] = [];
  filteredImages: GalleryImage[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  selectedFiles: File[] = [];
  fileLimit = 30;
  uploadErrors: string[] = [];
  uploadProgress = 0;
  isUploading = false;
  activeView: GalleryView = 'all';
  currentUserEmail: string | null = null;
  currentEvent = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUserEmail = this.authService.getUserEmail();

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.currentEvent = params['event'] ? decodeURIComponent(params['event']) : '';

        if (!this.currentEvent) {
          this.errorMessage = 'No event specified. Please navigate from an event page.';
        } else {
          this.errorMessage = null;
        }

        this.fetchImages();
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    this.uploadErrors = [];

    if (files.length > this.fileLimit) {
      this.uploadErrors.push(`You can only upload up to ${this.fileLimit} files at once.`);
      return;
    }

    const invalidFiles = files.filter(
      (file) => !file.type.startsWith('image/') && !file.type.startsWith('video/')
    );
    if (invalidFiles.length > 0) {
      this.uploadErrors.push('Only image and video files are allowed.');
      return;
    }

    this.selectedFiles = files;
  }

  async uploadImages(): Promise<void> {
    if (!this.selectedFiles.length || !this.currentEvent) {
      this.uploadErrors.push('No files selected or event not set');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 25;
    this.errorMessage = null;

    this.fileUploadService
      .uploadMultipleFiles(this.selectedFiles, this.currentEvent)
      .subscribe({
        next: (results: UploadResult[]) => {
          const failures = results.filter((r) => !r.success);
          this.uploadErrors = failures.map(
            (f) => `Failed: ${f.fileName} - ${f.error || 'Unknown error'}`
          );

          this.uploadProgress = 100;
          this.isUploading = false;
          this.selectedFiles = [];
          this.fetchImages();
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.errorMessage = 'Upload failed. Please try again.';
          this.isUploading = false;
          this.uploadProgress = 0;
        }
      });
  }

  fetchImages(): void {
    this.isLoading = true;

    const userEmail =
      this.activeView === 'mine' && this.currentUserEmail ? this.currentUserEmail : undefined;

    this.fileUploadService.listImages(this.currentEvent, userEmail).subscribe({
      next: (response: ListImagesResponse) => {
        this.images = response.images.map((url) => {
          const isVid = this.isVideoUrl(url);
          return {
            url,
            uploadedBy: this.extractUsernameFromUrl(url) || this.currentUserEmail || 'Unknown',
            uploadedAt: new Date().toISOString(),
            eventName: this.currentEvent,
            fileName: this.getBaseNameFromUrl(url),
            isVideo: isVid,
            posterUrl: isVid ? this.buildVideoPoster(url) : undefined
          } as GalleryImage;
        });

        this.filteredImages = [...this.images];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('[PictureGallery] Error fetching images:', error);
        this.errorMessage = 'Failed to load images. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private extractUsernameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length >= 4) {
        return pathParts[3]; // username
      }
    } catch (e) {
      console.error('Error parsing image URL:', e);
    }
    return null;
  }

  private getBaseNameFromUrl(url: string): string | undefined {
    try {
      const u = new URL(url);
      const path = u.pathname;
      const lastSegment = path.split('/').filter(Boolean).pop() || '';
      const rawName = decodeURIComponent(lastSegment);
      if (!rawName) return undefined;
      return rawName; // keep extension
    } catch {
      const cleaned = url.split('?')[0];
      const parts = cleaned.split('/');
      const candidate = parts[parts.length - 1];
      return decodeURIComponent(candidate || '');
    }
  }

  private buildVideoPoster(url: string): string | undefined {
    // Best-effort: if your storage writes sidecar thumbnails with same basename as .jpg
    try {
      const u = new URL(url);
      const path = u.pathname;
      const idx = path.lastIndexOf('.');
      if (idx > -1) {
        const posterPath = path.substring(0, idx) + '.jpg';
        return u.origin + posterPath + (u.search || '');
      }
    } catch {
      const cleaned = url.split('?')[0];
      return cleaned.replace(/\.(mp4|webm|ogg|mov|avi|wmv|mkv)$/i, '.jpg');
    }
    return undefined;
  }

  isVideoUrl(url: string): boolean {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.mkv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowerUrl.endsWith(ext));
  }

  onTabChange(event: any): void {
    const tabIndex = event?.index ?? 0;
    const view: GalleryView = tabIndex === 1 ? 'mine' : 'all';
    this.filterImages(view);
  }

  filterImages(view: GalleryView): void {
    this.activeView = view;
    if (this.currentEvent) {
      this.fetchImages();
    } else {
      this.errorMessage = 'No event specified. Please navigate from an event page.';
      this.isLoading = false;
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    if (!fileInput) {
      this.errorMessage = 'Upload functionality not available';
      return;
    }
    fileInput.value = '';
    fileInput.click();
  }

  onImageClick(image: GalleryImage): void {
    this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl: image.url,
        altText: `${image.isVideo ? 'Video' : 'Image'} uploaded by ${image.uploadedBy || 'unknown user'}`
      },
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'image-dialog-container'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
