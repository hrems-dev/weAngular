import { TestBed } from '@angular/core/testing';

import { SupplierApi } from './supplier-api';

describe('SupplierApi', () => {
  let service: SupplierApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
