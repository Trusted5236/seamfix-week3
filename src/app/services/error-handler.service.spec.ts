import { TestBed } from '@angular/core/testing';

import { ErrorHandlerServiceTsService } from './error-handler.service';

describe('ErrorHandlerServiceTsService', () => {
  let service: ErrorHandlerServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
