import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGalaComponentComponent } from './create-gala-component.component';

describe('CreateGalaComponentComponent', () => {
  let component: CreateGalaComponentComponent;
  let fixture: ComponentFixture<CreateGalaComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGalaComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGalaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
