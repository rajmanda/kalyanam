import { TestBed } from '@angular/core/testing';

import { GalaService } from './gala.service';

describe('GalaService', () => {
  let service: GalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
