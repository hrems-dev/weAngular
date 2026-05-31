import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SaleApi } from '../../data/sale-api';
import { SaleReportResponse } from '../../data/sale.models';

@Component({
  selector: 'app-sale-report',
  imports: [CommonModule, CardModule, TableModule, ToastModule],
  providers: [MessageService],
  templateUrl: './sale-report.html',
  styleUrl: './sale-report.scss',
})
export class SaleReport implements OnInit {
  private saleApi = inject(SaleApi);
  private messageService = inject(MessageService);

  $report = signal<SaleReportResponse[]>([]);

  $totalSales = computed(() =>
    this.$report().reduce((sum, item) => sum + (item.totalSales || 0), 0),
  );
  $totalOrders = computed(() =>
    this.$report().reduce((sum, item) => sum + (item.totalOrders || 0), 0),
  );
  $averageOrder = computed(() => {
    const sales = this.$totalSales();
    const orders = this.$totalOrders();
    return orders > 0 ? sales / orders : 0;
  });

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.saleApi.getReport().subscribe({
      next: (report) => {
        this.$report.set(report || []);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el reporte de ventas',
        }),
    });
  }
}
