import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CategoryApi } from '../../data/category-api';
import { CategoryResponse } from '../../data/category.models';
import { CategoryForm } from './category-form/category-form';

@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    CategoryForm,
  ],
  providers: [MessageService],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit, OnDestroy {
  private categoryApi = inject(CategoryApi);
  private messageService = inject(MessageService);

  $categories = signal<CategoryResponse[]>([]);
  $totalRecords = signal(0);
  $dialogVisible = signal(false);
  $selectedCategory = signal<CategoryResponse | null>(null);

  page = 0;
  size = 10;
  searchQuery = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((q) => {
        this.searchQuery = q;
        this.page = 0;
        this.loadCategories();
      });

    this.loadCategories();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.categoryApi.getAll(this.page, this.size, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.$categories.set(res.content);
        this.$totalRecords.set(res.totalElements);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar las categorías',
        });
      },
    });
  }

  onSearch(event: Event) {
    const q = (event.target as HTMLInputElement).value;
    this.searchSubject.next(q);
  }

  onPageChange(event: any) {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.loadCategories();
  }

  openCreate() {
    this.$selectedCategory.set(undefined as any);
    setTimeout(() => {
      this.$selectedCategory.set(null);
      this.$dialogVisible.set(true);
    });
  }
  openEdit(category: CategoryResponse) {
    this.$selectedCategory.set(category);
    this.$dialogVisible.set(true);
  }

  onSaved() {
    this.$dialogVisible.set(false);
    this.loadCategories();
  }

  onCancelled() {
    this.$dialogVisible.set(false);
  }

  delete(category: CategoryResponse) {
    this.categoryApi.delete(category.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Categoría eliminada correctamente',
        });
        this.loadCategories();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la categoría',
        });
      },
    });
  }
}
