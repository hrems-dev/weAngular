import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SupplierApi } from './supplier-api';

describe('SupplierApi', () => {
  let service: SupplierApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SupplierApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /api/suppliers with pagination', () => {
    service.getAll(2, 15, 'prov').subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === 'http://172.22.12.50:8080/api/suppliers' && request.method === 'GET',
    );

    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('15');
    expect(req.request.params.get('q')).toBe('prov');
    req.flush({ content: [], totalElements: 0 });
  });

  it('should call POST /api/suppliers when saving', () => {
    const payload = {
      name: 'Proveedor',
      contactName: 'Contacto',
      email: 'proveedor@test.com',
      phone: '123456',
      isActive: true,
    };

    service.save(payload).subscribe();

    const req = httpMock.expectOne('http://172.22.12.50:8080/api/suppliers');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...payload, id: '1' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
