import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryRequest, CategoryResponse } from './category.models';
import { PaginationModel } from '../../../shared/models/pagination-model';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  private http: HttpClient = inject(HttpClient);

  getAll(page: number = 0, size: number = 10, q?: string) {
    const params: any = { page, size };
    if (q) params['q'] = q;
    return this.http.get<PaginationModel<CategoryResponse[]>>(
      'http://localhost:8080/api/categories',
      { params },
    );
  }
  getById(id: string) {
    return this.http.get<CategoryResponse>('http://localhost:8080/api/categories/' + id);
  }
  save(category: CategoryRequest) {
    return this.http.post<CategoryResponse>('http://localhost:8080/api/categories', category);
  }

  update(id: string, category: CategoryRequest) {
    return this.http.put<CategoryResponse>('http://localhost:8080/api/categories/' + id, category);
  }
  delete(id: string) {
    return this.http.delete<CategoryResponse>('http://localhost:8080/api/categories/' + id);
  }
}
