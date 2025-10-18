import { Component, inject, Input, OnInit, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { RsvpService } from '../services/rsvp/rsvp.service';
import { RsvpDTO } from '../models/rsvpDTO';
import { CommonModule } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { RsvpDialogComponent } from '../rsvp-dialog/rsvp-dialog.component';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarHorizontalPosition,
  MatSnackBarLabel,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationSnackbarComponent } from '../confirmation-snackbar/confirmation-snackbar.component';
import { AuthService } from '../services/auth/auth.service';
import { AttendeesDialogComponent } from '../attendees-dialog/attendees-dialog.component';
import { GalaEventDTO, GalaEventDetails } from '../models/galaEventDTO'; // Import the GalaEventDTO and GalaEventDetails interfaces
import { GalaService } from '../services/gala/gala.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileUploadService } from '../services/file-upload/file-upload.service';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-gala-event',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIcon,
    MatProgressBarModule,
    RouterModule // Add RouterModule to the imports array
  ],
  templateUrl: './gala-event.component.html',
  styleUrl: './gala-event.component.css'
})
export class GalaEventComponent implements OnInit, OnChanges {
  @Input() galaEventDTO!: GalaEventDTO;
  showAttendees: boolean = false;
  showRsvp: boolean = false;
  message: string = "";
  selectedEvent: GalaEventDetails | undefined;
  respEvent: any;
  durationInSeconds: number = 5;
  userProfilex: any;
  loggedin: boolean = false;

  showEditForm: boolean = false; // Toggle for edit form visibility
  isAdmin: boolean = false;

  // New properties for file upload
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  currentPhase: 'upload' | 'update' | null = null;

  // For handling signed URLs for image display
  displayImageUrl: string = '';

  constructor(
    private _rsvpService: RsvpService,
    public _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private galaService: GalaService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to userProfile$ observable to react immediately to login events
    this.authService.userProfile$.subscribe(profile => {
      if (profile && Object.keys(profile).length > 0) {
        console.log('User Logged In:', profile);
        this.userProfilex = profile;
        this.loggedin = true;
      } else {
        console.log('No user logged in');
        this.userProfilex = null;
        this.loggedin = false;
      }
    });

    const userEmail = this.authService.getUserEmail();
    this.authService.isAdmin(userEmail).subscribe(
      (isAdmin) => {
        this.isAdmin = isAdmin;
        console.log("****  IS ADMIN **");
      },
      (error) => {
        console.error('Error checking admin status:', error);
      }
    );

    // Load the image URL
    this.loadImageUrl();
  }

  ngOnChanges(): void {
    // Reload image URL if galaEventDTO changes
    this.loadImageUrl();
  }

  private loadImageUrl(): void {
    if (!this.galaEventDTO?.galaEventDetails?.image) {
      return;
    }

    const imageValue = this.galaEventDTO.galaEventDetails.image;

    // Check if it's already a full URL (http/https)
    if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
      this.displayImageUrl = imageValue;
      return;
    }

    // Otherwise, it's a blobPath - get signed URL
    this.fileUploadService.getSignedViewUrl(imageValue).subscribe({
      next: (response) => {
        this.displayImageUrl = response.signedUrl;
      },
      error: (error) => {
        console.error('Failed to load signed URL for image:', error);
        // Fallback to the original value
        this.displayImageUrl = imageValue;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (!this.galaEventDTO) return;

    if (this.selectedFile) {
      this.uploadImageAndUpdateEvent();
    } else {
      this.updateEventOnly();
    }
  }

  private uploadImageAndUpdateEvent() {
    this.isUploading = true;
    this.currentPhase = 'upload';
    this.uploadProgress = 10;

    if (!this.selectedFile) {
      this.handleError('No file selected', null);
      return;
    }

    // Get the event ID from the current event
    const eventId = this.galaEventDTO?.galaEventId?.toString() || 'default-event';

    this.fileUploadService.uploadFile(this.selectedFile, eventId).subscribe({
      next: (result) => {
        // Image upload complete
        if (result.success) {
          console.log('Upload successful, blobPath:', result.blobPath);
          
          // Update progress to 50%
          this.uploadProgress = 50;
          
          // Use blobPath as the image reference
          // The backend will serve/sign this when needed
          this.galaEventDTO.galaEventDetails.image = result.blobPath;

          // Proceed to update event
          this.updateEventOnly();
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      },
      error: (uploadError) => {
        this.handleError('Image upload failed', uploadError);
      }
    });
  }

  private updateEventOnly() {
    this.currentPhase = 'update';
    this.uploadProgress = 50;

    this.galaService.updateGalaEvent(
      this.galaEventDTO.galaEventId,
      this.galaEventDTO.galaEventDetails
    ).subscribe({
      next: (updatedEvent) => {
        this.handleSuccess(updatedEvent);
      },
      error: (updateError) => {
        this.handleError('Event update failed', updateError);
      }
    });
  }

  private handleSuccess(updatedEvent: any) {
    this.isUploading = false;
    this.currentPhase = null;
    this.uploadProgress = 100;
    this.toggleEditForm();

    // Reload the image URL to get the new signed URL
    this.loadImageUrl();

    this._snackBar.open('Event updated successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    this.resetFileInput();
  }

  private handleError(context: string, error: any) {
    this.isUploading = false;
    this.currentPhase = null;
    console.error(`${context}:`, error);
    this._snackBar.open(`${context}. Please try again.`, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private resetFileInput() {
    this.selectedFile = null;
    const fileInput = document.getElementById('eventImageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

// Delete a GalaEvent
deleteEvent(eventDTO: GalaEventDTO) {
  // Open the confirmation dialog
  const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
    width: '300px',
    data: { eventName: eventDTO.galaEventDetails.name } // Pass the event name to the dialog
  });

  // Handle the dialog result
  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      // User confirmed the deletion
      this.galaService.deleteGalaEventById(eventDTO.galaEventId).subscribe(
        () => {
          console.log('Event deleted successfully');

          // Show a success message
          this.message = `Event "${eventDTO.galaEventDetails.name}" deleted successfully.`;
          this.openSnackBar(this.message);

          // Emit the eventDeleted event with the deleted event's ID
          this.galaService.eventDeleted.emit(eventDTO.galaEventId);

          // Navigate to the /home route
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error deleting event:', error);

          // Show an error message
          this.message = `Failed to delete event "${eventDTO.galaEventDetails.name}". Please try again.`;
          this.openSnackBar(this.message);
        }
      );
    } else {
      // User canceled the deletion
      console.log('Deletion canceled by user');
    }
  });
}
  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
  }


  openRsvpDialog(event: GalaEventDetails) {
    let dialogRef = this._matDialog.open(RsvpDialogComponent, {
      data: { selectedEvent: event }  // Pass event data to the dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    dialogRef.componentInstance.rsvpEvent.subscribe((rsvpDetails) => {
      this.onRsvpEvent(rsvpDetails);
      console.log(`rsvpDetails: ${JSON.stringify(rsvpDetails, null, 2)}`); // Pretty-printing the object
    });
  }

  openAttendeesDialog(event: GalaEventDetails) {
    let dialogRef = this._matDialog.open(AttendeesDialogComponent, {
      data: { selectedEvent: event }  // Pass event data to the dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  attendees(event: GalaEventDetails) {
    this.showAttendees = !this.showAttendees;
    this.selectedEvent = event;
    console.log(event.name);
    this.showRsvp = false;
  }

  onRsvpEvent(rsvpEvent: any): void {
    console.log(`Received rsvp event - ${rsvpEvent}`);
    rsvpEvent.userName = this.userProfilex.name;
    rsvpEvent.userEmail = this.userProfilex.email;

    this._rsvpService.saveRsvp(rsvpEvent).subscribe(
      (response: RsvpDTO) => {
        console.log("RSVP saved:", response);
        this.showRsvp = false;
        this.message = `Thanks! Your RSVP Recorded for - ${response.rsvpDetails.name} - for ${response.rsvpDetails.adults} Adults & ${response.rsvpDetails.children} kids.`;
        this.openSnackBar(this.message);
      },
      (error) => {
        console.error("Error saving RSVP:", error);
      }
    );
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
  }

  navigateToGallery() {
    if (!this.galaEventDTO?.galaEventDetails?.name) {
      console.error('Cannot navigate to gallery: No event name available');
      return;
    }

    // Encode the event name to handle spaces and special characters
    const eventName = encodeURIComponent(this.galaEventDTO.galaEventDetails.name);

    this.router.navigate(['/pictures'], {
      queryParams: { event: eventName }
    });
  }
}
