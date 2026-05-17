import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CategoryApi } from '../../data/category-api';
import { CategoryResponse } from '../../data/category.models';

@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ToggleSwitchModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit, OnDestroy {
  private categoryApi = inject(CategoryApi);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  $categories = signal<CategoryResponse[]>([]);
  $totalRecords = signal(0);
  $dialogVisible = signal(false);
  $isEditing = signal(false);
  $selectedCategory = signal<CategoryResponse | null>(null);

  page = 0;
  size = 10;
  searchQuery = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    isActive: [true],
  });

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
    this.$isEditing.set(false);
    this.$selectedCategory.set(null);
    this.form.reset({ isActive: true });
    this.$dialogVisible.set(true);
  }

  openEdit(category: CategoryResponse) {
    this.$isEditing.set(true);
    this.$selectedCategory.set(category);
    this.form.patchValue(category);
    this.$dialogVisible.set(true);
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.form.value;
    const selected = this.$selectedCategory();

    if (this.$isEditing() && selected) {
      this.categoryApi.update(selected.id, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Categoría actualizada correctamente',
          });
          this.$dialogVisible.set(false);
          this.loadCategories();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la categoría',
          });
        },
      });
    } else {
      this.categoryApi.save(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Categoría creada correctamente',
          });
          this.$dialogVisible.set(false);
          this.loadCategories();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la categoría',
          });
        },
      });
    }
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
