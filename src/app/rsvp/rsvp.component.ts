/*
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RsvpComponent {
  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
*/

import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

/** @title Form field with hints */
@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.css',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RsvpComponent implements OnInit {
  rsvpForm: FormGroup;
  adultOptions = [1, 2, 3, 4];
  totalGuests = 0;
  isRsvpYes: boolean | undefined;

  constructor(private fb: FormBuilder) {
    this.rsvpForm = this.fb.group({
      rsvp: ['yes'],
      adults: [1],
      children: [0]
    });
  }

  onRsvpChange(): void {
    const rsvpValue = this.rsvpForm.get('rsvp')?.value;
    this.isRsvpYes = rsvpValue === 'yes';
  }
  
  ngOnInit(): void {
    this.rsvpForm.valueChanges.subscribe(values => {
      this.updateTotalGuests(values);
    });
  }

  updateTotalGuests(values: any): void {
    const { adults, children } = values;
    this.totalGuests = (adults || 0) + (children || 0);
  }
}
