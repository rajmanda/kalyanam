import { Component, inject, Input } from '@angular/core';
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
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-gala-event',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIcon,
    MatProgressBarModule
  ],
  templateUrl: './gala-event.component.html',
  styleUrl: './gala-event.component.css'
})
export class GalaEventComponent {
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
    this.uploadProgress = 0;

    if (!this.selectedFile) {
      this.handleError('No file selected', null);
      return;
    }

    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Update progress for upload phase (0-50%)
          this.uploadProgress = Math.round(50 * (event.loaded / (event.total || 1)));
        } else if (event.type === HttpEventType.Response) {
          // Image upload complete - get publicUrl from response
          const publicUrl = event.body?.publicUrl;

          if (!publicUrl) {
            throw new Error('No public URL returned from server');
          }

          // Update the event DTO with the new image URL
          this.galaEventDTO.galaEventDetails.image = publicUrl;

          // Proceed to update event
          this.updateEventOnly();
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
}

