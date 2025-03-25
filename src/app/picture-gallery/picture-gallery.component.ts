import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FileUploadService } from '../services/file-upload/file-upload.service';

@Component({
  selector: 'app-picture-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './picture-gallery.component.html',
  styleUrls: ['./picture-gallery.component.css']
})
export class PictureGalleryComponent implements OnInit {
  imageUrls: string[] = []; // Will store full public URLs from GCP bucket
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {
    this.fetchImagesFromBucket();
  }

  fetchImagesFromBucket(): void {
    this.fileUploadService.listImages().subscribe({
      next: (response) => {
        this.imageUrls = response.images;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching images:', err);
        this.errorMessage = 'Failed to load images. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
