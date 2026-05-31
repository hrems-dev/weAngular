import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ClientApi } from './client-api';

describe('ClientApi', () => {
  let service: ClientApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ClientApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /api/clients with pagination', () => {
    service.getAll(1, 20, 'test').subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === 'http://172.22.12.50:8080/api/clients' && request.method === 'GET',
    );

    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('20');
    expect(req.request.params.get('q')).toBe('test');
    req.flush({ content: [], totalElements: 0 });
  });

  it('should call POST /api/clients when saving', () => {
    const payload = {
      name: 'Cliente',
      email: 'test@test.com',
      phone: '123456',
      address: 'Dirección',
      isActive: true,
    };

    service.save(payload).subscribe();

    const req = httpMock.expectOne('http://172.22.12.50:8080/api/clients');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...payload, id: '1' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
