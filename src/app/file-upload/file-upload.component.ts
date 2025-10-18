import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadService, UploadResult } from '../services/file-upload/file-upload.service';

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

      console.group('Selected File Details');
      console.log('Name:', this.selectedFile.name);
      console.log('Type:', this.selectedFile.type);
      console.log('Size (bytes):', this.selectedFile.size);
      console.groupEnd();
    }
  }

  onUpload(event: Event): void {
    event.preventDefault();
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 10; // Start
    this.uploadMessage = 'Requesting upload URL...';

    this.fileUploadService.uploadFile(this.selectedFile, this.eventId).subscribe({
      next: (result: UploadResult) => {
        // Stage progress since fetch doesn't provide granular progress
        this.uploadProgress = 100;
        this.isUploading = false;
        if (result.success) {
          this.uploadMessage = 'Upload successful!';
        } else {
          this.uploadMessage = `Upload failed: ${result.error || 'Unknown error'}`;
        }

        // Reset file input
        this.selectedFile = null;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        this.uploadMessage = 'Upload failed. Please try again.';
        console.error('Upload error:', error);
      }
    });
  }
}
