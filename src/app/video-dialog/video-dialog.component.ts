import { NgFor, CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, RouterLink } from '@angular/router';
import { GalaEventComponent } from '../gala-event/gala-event.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TimeFormatPipe } from "./time-format.pipe";
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-video-dialog',
  template: `
    <div class="video-container">
      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="spinner-container">
        <mat-spinner diameter="50" color="accent"></mat-spinner>
      </div>

      <!-- Video Element -->
      <video #videoPlayer
             class="video-element"
             (canplay)="onCanPlay()"
             (waiting)="onVideoWaiting()"
             (timeupdate)="updateProgress()"
             (ended)="onVideoEnded()">
        <source src="https://storage.googleapis.com/shravani_kalyanam_bucket/invitation.mp4" type="video/mp4">
      </video>

      <!-- Custom Controls -->
      <div class="controls-container">
        <!-- Progress Bar -->
        <div class="progress-container">
          <mat-progress-bar mode="determinate" [value]="progress"></mat-progress-bar>
          <span class="time-display">
            {{ currentTime | timeFormat }} / {{ duration | timeFormat }}
          </span>
        </div>

        <!-- Main Controls -->
        <div class="main-controls">
          <button mat-icon-button (click)="togglePlay()" [disabled]="isLoading">
            <mat-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>

          <button mat-icon-button (click)="toggleMute()">
            <mat-icon>{{ isMuted ? 'volume_off' : 'volume_up' }}</mat-icon>
          </button>
<!-- 
          <div class="volume-slider" *ngIf="!isMuted">
            <mat-slider thumbLabel [max]="1" [min]="0" [step]="0.1"
                       [(value)]="volume" (input)="onVolumeChange()">
            </mat-slider>
          </div> -->

          <button mat-icon-button (click)="replayVideo()">
            <mat-icon>replay</mat-icon>
          </button>

          <button mat-icon-button (click)="toggleFullscreen()">
            <mat-icon>{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
          </button>

          <button mat-icon-button class="close-button" (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./video-dialog.component.css'],
  imports: [MatGridListModule, MatSliderModule, MatProgressSpinnerModule, MatProgressBarModule, MatCardModule, MatButtonModule, FlexLayoutModule, NgFor, CommonModule, GalaEventComponent, MatIcon, RouterModule, RouterLink, TimeFormatPipe],
})
export class VideoDialogComponent {

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef<HTMLDivElement>;

  isPlaying = false;
  isMuted = false;
  isLoading = true;
  isFullscreen = false;
  progress = 0;
  currentTime = 0;
  duration = 0;
  volume = 0.7;

  constructor(private dialogRef: MatDialogRef<VideoDialogComponent>) {}

  ngAfterViewInit() {
    this.setupVideoListeners();
    this.videoPlayer.nativeElement.volume = this.volume;
  }

  setupVideoListeners() {
    const video = this.videoPlayer.nativeElement;

    video.onplaying = () => {
      this.isPlaying = true;
      this.isLoading = false;
    };

    video.onpause = () => this.isPlaying = false;
    video.onvolumechange = () => this.isMuted = video.muted;
    video.ondurationchange = () => this.duration = video.duration;

    // Attempt autoplay
    video.play().catch(() => {
      video.controls = false;
      this.isLoading = false;
    });
  }

  // Keyboard controls
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'Space': this.togglePlay(); break;
      case 'KeyM': this.toggleMute(); break;
      case 'KeyF': this.toggleFullscreen(); break;
      case 'ArrowRight': this.seek(5); break;
      case 'ArrowLeft': this.seek(-5); break;
      case 'Escape':
        if (this.isFullscreen) {
          this.exitFullscreen();
        } else {
          this.closeDialog();
        }
        break;
    }
  }

  // Control Methods
  togglePlay() {
    if (this.isLoading) return;

    if (this.videoPlayer.nativeElement.paused) {
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoPlayer.nativeElement.pause();
    }
  }

  toggleMute() {
    this.videoPlayer.nativeElement.muted = !this.videoPlayer.nativeElement.muted;
  }

  toggleFullscreen() {
    if (!this.isFullscreen) {
      this.videoContainer.nativeElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  replayVideo() {
    this.videoPlayer.nativeElement.currentTime = 0;
    this.videoPlayer.nativeElement.play();
  }

  seek(seconds: number) {
    this.videoPlayer.nativeElement.currentTime += seconds;
  }

  onVolumeChange() {
    this.videoPlayer.nativeElement.volume = this.volume;
    this.videoPlayer.nativeElement.muted = false;
  }

  updateProgress() {
    const video = this.videoPlayer.nativeElement;
    this.progress = (video.currentTime / video.duration) * 100;
    this.currentTime = video.currentTime;
  }

  // Event Handlers
  onCanPlay() {
    this.isLoading = false;
  }

  onVideoWaiting() {
    this.isLoading = true;
  }

  onVideoEnded() {
    this.isPlaying = false;
  }

  closeDialog() {
    this.exitFullscreen();
    this.videoPlayer.nativeElement.pause();
    this.dialogRef.close();
  }

  private exitFullscreen() {
    if (this.isFullscreen) {
      document.exitFullscreen?.();
    }
  }
}
