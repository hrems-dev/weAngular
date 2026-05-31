import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SupplierApi } from '../../data/supplier-api';
import { SupplierResponse } from '../../data/supplier.models';

@Component({
  selector: 'app-supplier-list',
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss',
})
export class SupplierList implements OnInit, OnDestroy {
  private supplierApi = inject(SupplierApi);
  private messageService = inject(MessageService);
  private router = inject(Router);

  $suppliers = signal<SupplierResponse[]>([]);
  $totalRecords = signal(0);
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
        this.loadSuppliers();
      });

    this.loadSuppliers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSuppliers() {
    this.supplierApi.getAll(this.page, this.size, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.$suppliers.set(res.content);
        this.$totalRecords.set(res.totalElements);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar los proveedores',
        }),
    });
  }

  onSearch(event: Event) {
    const q = (event.target as HTMLInputElement).value;
    this.searchSubject.next(q);
  }

  onPageChange(event: any) {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.loadSuppliers();
  }

  goToCreate() {
    this.router.navigate(['/persons/suppliers/create']);
  }

  goToEdit(supplier: SupplierResponse) {
    this.router.navigate(['/persons/suppliers/edit', supplier.id]);
  }

  delete(supplier: SupplierResponse) {
    this.supplierApi.delete(supplier.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Proveedor eliminado correctamente',
        });
        this.loadSuppliers();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el proveedor',
        }),
    });
  }
}
