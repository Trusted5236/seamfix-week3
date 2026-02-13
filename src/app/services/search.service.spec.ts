import { TestBed } from '@angular/core/testing';

import { SearchServiceTsService } from './search.service';

describe('SearchServiceTsService', () => {
  let service: SearchServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
