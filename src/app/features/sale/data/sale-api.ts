import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationModel } from '../../../shared/models/pagination-model';
import { SaleRequest, SaleResponse, SaleReportResponse } from './sale.models';

@Injectable({
  providedIn: 'root',
})
export class SaleApi {
  private http = inject(HttpClient);

  getAll(page: number = 0, size: number = 10, q?: string) {
    const params: any = { page, size };
    if (q) params['q'] = q;
    return this.http.get<PaginationModel<SaleResponse[]>>('http://172.22.12.50:8080/api/sales', {
      params,
    });
  }

  getById(id: string) {
    return this.http.get<SaleResponse>('http://172.22.12.50:8080/api/sales/' + id);
  }

  save(sale: SaleRequest) {
    return this.http.post<SaleResponse>('http://172.22.12.50:8080/api/sales', sale);
  }

  update(id: string, sale: SaleRequest) {
    return this.http.put<SaleResponse>('http://172.22.12.50:8080/api/sales/' + id, sale);
  }

  delete(id: string) {
    return this.http.delete<void>('http://172.22.12.50:8080/api/sales/' + id);
  }

  getReport() {
    return this.http.get<SaleReportResponse[]>('http://172.22.12.50:8080/api/sales/report');
  }
}
