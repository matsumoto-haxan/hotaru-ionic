import { TestBed } from '@angular/core/testing';

import { GlowService } from './glow.service';

describe('GlowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlowService = TestBed.get(GlowService);
    expect(service).toBeTruthy();
  });
});
