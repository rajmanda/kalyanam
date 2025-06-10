import { TestBed } from '@angular/core/testing';

import { RsvpAllService } from './rsvp-all.service';

describe('RsvpAllService', () => {
  let service: RsvpAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RsvpAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
