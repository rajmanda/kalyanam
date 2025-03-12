import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [ MatDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  eventName: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any ) {
    this.eventName = data.eventName;
  }
  
}
