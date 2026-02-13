import { TestBed } from '@angular/core/testing';

import { StateServiceTsService } from './state.service';

describe('StateServiceTsService', () => {
  let service: StateServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
