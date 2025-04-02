import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-glogin',
  templateUrl: './glogin.component.html',
  styleUrls: ['./glogin.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],

})
export class GloginComponent implements OnInit {
  loginMessage: string | null = null;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Reset viewport scaling
    document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1.0');

    // Get the query parameter message
    this.route.queryParams.subscribe(params => {
      this.loginMessage = params['message'];
    });

    setTimeout(() => {
      const image = document.getElementById('introImage') as HTMLImageElement;
      const video = document.getElementById('introVideo') as HTMLVideoElement;

      if (image && video) {
        console.log('Switching from image to video');

        // Hide the image and show the video
        image.style.display = 'none';
        video.style.display = 'block';

        // Ensure the video is muted
        video.muted = true;

        // Play the video
        video.play().then(() => {
          console.log('Video is playing');
        }).catch((error) => {
          console.error('Error playing video:', error);
        });
      }
    }, 2000); // 2-second delay
  }
}
