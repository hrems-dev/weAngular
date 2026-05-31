import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SupplierRequest, SupplierResponse } from './supplier.models';
import { PaginationModel } from '../../../shared/models/pagination-model';

@Injectable({
  providedIn: 'root',
})
export class SupplierApi {
  private http = inject(HttpClient);

  getAll(page: number = 0, size: number = 10, q?: string) {
    const params: any = { page, size };
    if (q) params['q'] = q;
    return this.http.get<PaginationModel<SupplierResponse[]>>('http://localhost:8080/api/suppliers', {
      params,
    });
  }

  getById(id: string) {
    return this.http.get<SupplierResponse>('http://localhost:8080/api/suppliers/' + id);
  }

  save(supplier: SupplierRequest) {
    return this.http.post<SupplierResponse>('http://localhost:8080/api/suppliers', supplier);
  }

  update(id: string, supplier: SupplierRequest) {
    return this.http.put<SupplierResponse>('http://localhost:8080/api/suppliers/' + id, supplier);
  }

  delete(id: string) {
    return this.http.delete<void>('http://localhost:8080/api/suppliers/' + id);
  }
