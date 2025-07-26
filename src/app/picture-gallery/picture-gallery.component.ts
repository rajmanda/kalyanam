import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FileUploadService, UploadResponse, ListImagesResponse } from '../services/file-upload/file-upload.service';
import { AuthService } from '../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { Subscription, Subject } from 'rxjs';
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
    console.log('Initializing PictureGalleryComponent');

    this.currentUserEmail = this.authService.getUserEmail();
    console.log('Current user email:', this.currentUserEmail);

    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: Params) => {
      console.log('Route query params:', params);

      // Decode the event name from URL
      this.currentEvent = params['event'] ? decodeURIComponent(params['event']) : '';

      console.log('Current event name:', this.currentEvent);

      if (!this.currentEvent) {
        console.warn('No event parameter found in URL');
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

    // Check total files don't exceed limit
    if (files.length > this.fileLimit) {
      this.uploadErrors.push(`You can only upload up to ${this.fileLimit} files at once.`);
      return;
    }

    // Check file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      this.uploadErrors.push('Only image files are allowed.');
      return;
    }

    this.selectedFiles = files;
    this.uploadImages();
  }

  uploadImages(): void {
    if (!this.selectedFiles.length || !this.currentEvent) {
      this.uploadErrors.push('No files selected or event not set');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = null;

    this.fileUploadService.uploadMultipleFiles(this.selectedFiles, this.currentEvent).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Update progress
          this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
        } else if (event.type === HttpEventType.Response) {
          // Handle successful upload
          console.log('Upload successful', event.body);
          this.uploadProgress = 100;
          this.selectedFiles = [];
          this.isUploading = false;
          // Refresh the gallery
          this.fetchImages();
        }
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

    // Get user email if in 'mine' view and we have a current user
    const userEmail = this.activeView === 'mine' && this.currentUserEmail
      ? this.currentUserEmail
      : undefined;

    console.log('[PictureGallery] fetchImages - Calling backend with:', {
      view: this.activeView,
      event: this.currentEvent,
      user: userEmail || 'undefined (showing all)',
      currentUserEmail: this.currentUserEmail
    });

    this.fileUploadService.listImages(this.currentEvent, userEmail).subscribe({
      next: (response: ListImagesResponse) => {
        console.log('[PictureGallery] Received response with', response.images?.length || 0, 'images');

        // Map the string URLs to GalleryImage objects
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
      // Assuming the format is /bucket/event/username/filename
      if (pathParts.length >= 4) {
        return pathParts[3]; // Returns the username part
      }
    } catch (e) {
      console.error('Error parsing image URL:', e);
    }
    return null;
  }

  onTabChange(event: any): void {
    // Get the index of the selected tab (0 = 'all', 1 = 'mine')
    const tabIndex = event.index;
    const view: 'all' | 'mine' = tabIndex === 1 ? 'mine' : 'all';

    console.log('[PictureGallery] onTabChange - Tab changed to:', view,
               '(tab index:', tabIndex, 'label:', event.tab.textLabel + ')');

    this.filterImages(view);
  }

  filterImages(view: 'all' | 'mine'): void {
    console.log('[PictureGallery] filterImages - Setting view to:', view,
               '(current user:', this.currentUserEmail + ')');

    // Update the active view
    this.activeView = view;

    // Only fetch images if we have a current event
    if (this.currentEvent) {
      this.fetchImages();
    } else {
      console.error('[PictureGallery] Cannot fetch images: No current event');
      this.errorMessage = 'No event specified. Please navigate from an event page.';
      this.isLoading = false;
    }
  }

  triggerFileInput(): void {
    console.log('Upload button clicked');
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    if (!fileInput) {
      console.error('File input element not found');
      this.errorMessage = 'Upload functionality not available';
      return;
    }

    // Reset the input value to allow selecting the same file again
    fileInput.value = '';

    console.log('Triggering file input click');
    fileInput.click();
  }

  onImageClick(image: GalleryImage): void {
    this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl: image.url,
        altText: `Image uploaded by ${image.uploadedBy || 'unknown user'}`
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
