import { TestBed } from '@angular/core/testing';

import { SaleApi } from './sale-api';

describe('SaleApi', () => {
  let service: SaleApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
