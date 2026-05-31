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
import { SaleApi } from '../../data/sale-api';
import { SaleResponse } from '../../data/sale.models';

@Component({
  selector: 'app-sale-list',
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.scss',
})
export class SaleList implements OnInit, OnDestroy {
  private saleApi = inject(SaleApi);
  private messageService = inject(MessageService);
  private router = inject(Router);

  $sales = signal<SaleResponse[]>([]);
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
        this.loadSales();
      });

    this.loadSales();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSales() {
    this.saleApi.getAll(this.page, this.size, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.$sales.set(res.content);
        this.$totalRecords.set(res.totalElements);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar las ventas',
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
    this.loadSales();
  }

  goToCreate() {
    this.router.navigate(['/sales/sales/create']);
  }

  goToEdit(sale: SaleResponse) {
    this.router.navigate(['/sales/sales/edit', sale.id]);
  }

  delete(sale: SaleResponse) {
    this.saleApi.delete(sale.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Venta eliminada correctamente',
        });
        this.loadSales();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la venta',
        }),
    });
  }
}
