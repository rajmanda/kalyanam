import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadService } from '../services/file-upload/file-upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  uploadMessage: string = '';
  eventId: string = 'default-event'; // Default event ID

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadProgress = 0;
      this.uploadMessage = '';
    }
  }

  onUpload(event: Event): void {
    event.preventDefault();

    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadMessage = 'Uploading...';

    this.fileUploadService.uploadFile(this.selectedFile, this.eventId).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Calculate upload progress
          this.uploadProgress = Math.round(100 * (event.loaded / (event.total || 1)));
        } else if (event.type === HttpEventType.Response) {
          // Upload complete
          this.isUploading = false;
          this.uploadMessage = 'Upload successful!';
          console.log('Server response:', event.body);

          // Reset file input
          this.selectedFile = null;
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadMessage = 'Upload failed. Please try again.';
        console.error('Upload error:', error);
      }
    });
  }
}
