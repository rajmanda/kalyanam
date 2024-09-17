import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaEventsComponent } from './gala-events.component';

describe('GalaEventsComponent', () => {
  let component: GalaEventsComponent;
  let fixture: ComponentFixture<GalaEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalaEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalaEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
