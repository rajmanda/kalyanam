import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaComponent } from './gala.component';

describe('GalaComponent', () => {
  let component: GalaComponent;
  let fixture: ComponentFixture<GalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
