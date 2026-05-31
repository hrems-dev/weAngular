import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SaleApi } from '../../../data/sale-api';
import { SaleResponse, SaleLine } from '../../../data/sale.models';
import { ProductApi } from '../../../../product/data/product-api';
import { ProductResponse } from '../../../../product/data/product.models';
import { ClientApi } from '../../../../person/data/client-api';
import { ClientResponse } from '../../../../person/data/client.models';

@Component({
  selector: 'app-sale-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
    TableModule,
    ToastModule,
    CalendarModule,
  ],
  providers: [MessageService],
  templateUrl: './sale-form.html',
  styleUrl: './sale-form.scss',
})
export class SaleForm implements OnInit {
  private readonly saleApi = inject(SaleApi);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productApi = inject(ProductApi);
  private readonly clientApi = inject(ClientApi);

  $isEditing = signal(false);
  private saleId: string | null = null;

  $lines = signal<SaleLine[]>([]);
  $productSuggestions = signal<ProductResponse[]>([]);
  $clientSuggestions = signal<ClientResponse[]>([]);

  form: FormGroup = this.fb.group({
    client_id: ['', Validators.required],
    sale_date: ['', Validators.required],
    total: [0, [Validators.required, Validators.min(0.01)]],
  });

  ngOnInit() {
    this.saleId = this.route.snapshot.paramMap.get('id');
    if (this.saleId) {
      this.$isEditing.set(true);
      this.loadSale(this.saleId);
    } else {
      // initialize with one empty line only for new sales
      this.addLine();
    }
  }

  loadSale(id: string) {
    this.saleApi.getById(id).subscribe({
      next: (sale: SaleResponse) => {
        this.form.patchValue({
          client_id: { id: sale.client_id, name: sale.clientName },
          sale_date: sale.sale_date ? new Date(sale.sale_date) : null,
          total: sale.total,
        });
        if (sale.items?.length) {
          this.$lines.set(
            sale.items.map((it) => ({ ...it, productName: (it as any).productName })),
          );
        }
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la venta',
        }),
    });
  }

  submit() {
    if (this.form.invalid) return;

    const val = this.form.getRawValue();
    const payload = {
      ...val,
      sale_date: val.sale_date instanceof Date ? val.sale_date.toISOString() : val.sale_date,
      client_id: val.client_id?.id || val.client_id,
      items: this.$lines().map((l) => ({
        product_id: l.product_id,
        quantity: l.quantity,
        unit_price: l.unit_price,
      })),
    };

    if (this.$isEditing() && this.saleId) {
      this.saleApi.update(this.saleId, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Venta actualizada correctamente',
          });
          setTimeout(() => this.router.navigate(['/sales/sales']), 1000);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la venta',
          }),
      });
    } else {
      this.saleApi.save(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Venta creada correctamente',
          });
          setTimeout(() => this.router.navigate(['/sales/sales']), 1000);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la venta',
          }),
      });
    }
  }

  goBack() {
    this.router.navigate(['/sales/sales']);
  }

  // --- Lines management ---
  searchClient(event: any) {
    this.clientApi.getAll(0, 10, event.query).subscribe({
      next: (res) => this.$clientSuggestions.set(res.content),
      error: () => this.$clientSuggestions.set([]),
    });
  }

  addLine() {
    this.$lines.update((prev) => [
      ...prev,
      { quantity: 1, unit_price: 0, sub_total: 0, product_id: '' },
    ]);
    this.recalcTotal();
  }

  removeLine(index: number) {
    this.$lines.update((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    this.recalcTotal();
  }

  searchProduct(event: { query: string }) {
    this.productApi.getAll(0, 10, event.query).subscribe({
      next: (res) => this.$productSuggestions.set(res.content),
      error: () => this.$productSuggestions.set([]),
    });
  }

  setProduct(index: number, product?: ProductResponse) {
    if (!product) return;
    this.$lines.update((prev) => {
      const next = [...prev];
      const line = next[index];
      line.product_id = product.id;
      (line as any).productName = product.name;
      line.unit_price = (product as any).price ?? 0;
      line.sub_total = Number((line.unit_price * line.quantity).toFixed(2));
      return next;
    });
    setTimeout(() => this.recalcTotal());
  }

  updateQuantity(index: number, q: number) {
    this.$lines.update((prev) => {
      const next = [...prev];
      const line = next[index];
      line.quantity = q;
      line.sub_total = Number((line.unit_price * line.quantity).toFixed(2));
      return next;
    });
    setTimeout(() => this.recalcTotal());
  }

  recalcTotal() {
    const total = this.$lines().reduce((s, l) => s + (l.sub_total || 0), 0);
    this.form.patchValue({ total: Number(total.toFixed(2)) });
  }
}
