import { TestBed } from '@angular/core/testing';

import { GeoCrudService } from './geo-crud.service';

describe('GeoCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoCrudService = TestBed.get(GeoCrudService);
    expect(service).toBeTruthy();
  });
});
