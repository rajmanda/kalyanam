// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-picture-gallery',
//   imports: [],
//   templateUrl: './picture-gallery.component.html',
//   styleUrl: './picture-gallery.component.css'
// })
// export class PictureGalleryComponent {

// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-picture-gallery',
  templateUrl: './picture-gallery.component.html',
  styleUrls: ['./picture-gallery.component.css'],
  imports:[CommonModule]
})
export class PictureGalleryComponent implements OnInit {
  // Array of image file names
  imageFiles: string[] = [
    'Haldi & Mehendi.jpg',
    'Shravani.jpg',
    'Satyanarana Swamy Pooja.jpg',
  'Shravani at sangeet.jpg',
  'pellikuturu shravs pose.jpg',
'shravs with family dance',
'Shravs dancing pose.jpg',
'vijayram family pic.jpg',
'shravs.jpg']; // Add your image file names here

  // Base path for images
  basePath: string = '/assets/images/';

  constructor() {}

  ngOnInit(): void {}

  // Method to get the full URI for an image
  getImageUri(imageFile: string): string {
    return `${this.basePath}${imageFile}`;
  }
}
