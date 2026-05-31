import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientRequest, ClientResponse } from './client.models';
import { PaginationModel } from '../../../shared/models/pagination-model';

@Injectable({
  providedIn: 'root',
})
export class ClientApi {
  private http = inject(HttpClient);

  getAll(page: number = 0, size: number = 10, q?: string) {
    const params: any = { page, size };
    if (q) params['q'] = q;
    return this.http.get<PaginationModel<ClientResponse[]>>('http://localhost:8080/api/clients', {
      params,
    });
  }

  getById(id: string) {
    return this.http.get<ClientResponse>('http://localhost:8080/api/clients/' + id);
  }

  save(client: ClientRequest) {
    return this.http.post<ClientResponse>('http://localhost:8080/api/clients', client);
  }

  update(id: string, client: ClientRequest) {
    return this.http.put<ClientResponse>('http://localhost:8080/api/clients/' + id, client);
  }

  delete(id: string) {
    return this.http.delete<void>('http://localhost:8080/api/clients/' + id);
  }
