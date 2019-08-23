import { TestBed } from '@angular/core/testing';

import { QrtokenService } from './qrtoken.service';

describe('QrtokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QrtokenService = TestBed.get(QrtokenService);
    expect(service).toBeTruthy();
  });
});
