import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="image-dialog">
      <img [src]="data.imageUrl" class="enlarged-image" [alt]="'Enlarged ' + (data.altText || 'image')">
      <div class="dialog-actions">
        <button mat-button (click)="onClose()" color="primary">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .image-dialog {
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .enlarged-image {
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
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string, altText?: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
