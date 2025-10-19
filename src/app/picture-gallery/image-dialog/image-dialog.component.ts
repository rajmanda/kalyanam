import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <div class="media-dialog" data-testid="image-dialog-root">
      <img
        *ngIf="!showVideo"
        [src]="data.imageUrl"
        class="enlarged-media"
        [alt]="'Enlarged ' + (data.altText || 'image')"
        data-testid="image-dialog-img">

      <video
        *ngIf="showVideo"
        [src]="data.imageUrl"
        class="enlarged-media"
        controls
        [attr.aria-label]="'Video ' + (data.altText || 'media')"
        data-testid="image-dialog-video">
        Your browser does not support the video tag.
      </video>

      <div class="dialog-actions">
        <button mat-button (click)="onClose()" color="primary" data-testid="image-dialog-close-btn">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .media-dialog {
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .enlarged-media {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      margin-bottom: 16px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
  `]
})
export class ImageDialogComponent {
  showVideo: boolean;

  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string, altText?: string }
  ) {
    // Decide media type using robust extension check (querystring-safe)
    this.showVideo = this.isLikelyVideo(data.imageUrl);
  }

  private isLikelyVideo(url: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.mkv'];
    try {
      const u = new URL(url);
      const path = u.pathname.toLowerCase();
      return videoExtensions.some(ext => path.endsWith(ext));
    } catch {
      const cleaned = (url || '').split('?')[0].toLowerCase();
      return videoExtensions.some(ext => cleaned.endsWith(ext));
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
