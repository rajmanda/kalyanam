import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpAllComponent } from './rsvp-all.component';

describe('RsvpAllComponent', () => {
  let component: RsvpAllComponent;
  let fixture: ComponentFixture<RsvpAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsvpAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsvpAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
