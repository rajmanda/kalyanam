import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirmation-snackbar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction,
    MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './confirmation-snackbar.component.html',
  styleUrl: './confirmation-snackbar.component.css'
})
export class ConfirmationSnackbarComponent {

}
