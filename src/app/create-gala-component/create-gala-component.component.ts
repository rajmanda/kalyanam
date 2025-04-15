
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from '../app.component';



import { EventEmitter, Inject, Input, Output } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { GalaEventDetails } from '../models/galaEventDTO';
import { GalaService } from '../services/gala/gala.service';



@Component({
  selector: 'app-create-gala-component',
  standalone: true,
  imports: [ MatDialogModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDialogModule
    ],
  templateUrl: './create-gala-component.component.html',
  styleUrl: './create-gala-component.component.css'
})
export class CreateGalaComponentComponent {
 eventForm: FormGroup;


  constructor(private galaService: GalaService, private fb: FormBuilder, private router: Router) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.eventForm.valid) {
      // Create a GalaEventDetails object from the form values
      const galaEventDetails: GalaEventDetails = {
        name: this.eventForm.value.name,
        date: this.eventForm.value.date,
        location: this.eventForm.value.location,
        image: this.eventForm.value.image,
        description: this.eventForm.value.description,
        comments: this.eventForm.value.comments
      };

      // Call the saveGalaEvent method from the GalaService
      this.galaService.saveGalaEvent(galaEventDetails).subscribe({
        next: (response) => {
          console.log('Gala Event saved successfully:', response);
          // Navigate to a different route after successful save
          this.router.navigate(['/home']); // Adjust the route as needed
        },
        error: (error) => {
          console.error('Error saving Gala Event:', error);
          // Handle the error (e.g., show a message to the user)
        }
      });
    } else {
      console.warn('Form is invalid. Please fill out all required fields.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/home']); // Navigate back to the home page or any other route
  }

  private generateId(): string {
    // Implement a method to generate a unique ID
    return Math.random().toString(36).substr(2, 9);
  }
  }
