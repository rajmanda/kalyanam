import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureGalleryComponent } from './picture-gallery.component';

describe('PictureGalleryComponent', () => {
  let component: PictureGalleryComponent;
  let fixture: ComponentFixture<PictureGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictureGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
