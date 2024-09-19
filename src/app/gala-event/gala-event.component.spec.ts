import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaEventComponent } from './gala-event.component';

describe('GalaEventComponent', () => {
  let component: GalaEventComponent;
  let fixture: ComponentFixture<GalaEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalaEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalaEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
