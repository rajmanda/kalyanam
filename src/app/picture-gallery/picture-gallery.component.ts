import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FileUploadService, ListImagesResponse, UploadResult } from '../services/file-upload/file-upload.service';
import { AuthService } from '../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { FileSizePipe } from '../shared/pipes/file-size.pipe';

type GalleryView = 'all' | 'mine';

interface GalleryImage {
  url: string;
  uploadedBy?: string;
  uploadedAt?: string;
  eventName?: string;
}

@Component({
  selector: 'app-picture-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatListModule,
    RouterModule,
    FileSizePipe
  ],
  templateUrl: './picture-gallery.component.html',
  styleUrls: ['./picture-gallery.component.css']
})
export class PictureGalleryComponent implements OnInit, OnDestroy {
  images: GalleryImage[] = [];
  filteredImages: GalleryImage[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  selectedFiles: File[] = [];
  fileLimit = 30;
  uploadErrors: string[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;
  activeView: 'all' | 'mine' = 'all';
  currentUserEmail: string | null = null;
  currentEvent: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUserEmail = this.authService.getUserEmail();

    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: Params) => {
      // Decode the event name from URL
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

    const invalidFiles = files.filter(file => !file.type.startsWith('image/') && !file.type.startsWith('video/'));
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
    this.uploadProgress = 25; // staged progress start
    this.errorMessage = null;

    this.fileUploadService.uploadMultipleFiles(this.selectedFiles, this.currentEvent).subscribe({
      next: (results: UploadResult[]) => {
        const successes = results.filter(r => r.success);
        const failures = results.filter(r => !r.success);

        this.uploadErrors = failures.map(f => `Failed: ${f.fileName} - ${f.error || 'Unknown error'}`);

        this.uploadProgress = 100;
        this.isUploading = false;
        this.selectedFiles = [];

        // Refresh the gallery
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

    const userEmail = this.activeView === 'mine' && this.currentUserEmail ? this.currentUserEmail : undefined;

    this.fileUploadService.listImages(this.currentEvent, userEmail).subscribe({
      next: (response: ListImagesResponse) => {
        this.images = response.images.map(url => ({
          url,
          uploadedBy: this.extractUsernameFromUrl(url) || this.currentUserEmail || 'Unknown',
          uploadedAt: new Date().toISOString(),
          eventName: this.currentEvent
        }));

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

  isVideoUrl(url: string): boolean {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.endsWith(ext));
  }

  onTabChange(event: any): void {
    const tabIndex = event.index;
    const view: 'all' | 'mine' = tabIndex === 1 ? 'mine' : 'all';
    this.filterImages(view);
  }

  filterImages(view: 'all' | 'mine'): void {
    this.activeView = view;
    if (this.currentEvent) {
      this.fetchImages();
    } else {
      this.errorMessage = 'No event specified. Please navigate from an event page.';
      this.isLoading = false;
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (!fileInput) {
      this.errorMessage = 'Upload functionality not available';
      return;
    }
    fileInput.value = '';
    fileInput.click();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
