import { TestBed } from '@angular/core/testing';

import { GatheringService } from './gathering.service';

describe('GatheringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatheringService = TestBed.get(GatheringService);
    expect(service).toBeTruthy();
  });
});
