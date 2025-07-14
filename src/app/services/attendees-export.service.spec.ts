import { TestBed } from '@angular/core/testing';

import { AttendeesExportService } from './attendees-export.service';

describe('AttendeesExportService', () => {
  let service: AttendeesExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendeesExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
