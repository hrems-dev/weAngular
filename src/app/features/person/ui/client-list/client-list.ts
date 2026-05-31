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
import { ClientApi } from '../../data/client-api';
import { ClientResponse } from '../../data/client.models';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit, OnDestroy {
  private clientApi = inject(ClientApi);
  private messageService = inject(MessageService);
  private router = inject(Router);

  $clients = signal<ClientResponse[]>([]);
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
        this.loadClients();
      });

    this.loadClients();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClients() {
    this.clientApi.getAll(this.page, this.size, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.$clients.set(res.content);
        this.$totalRecords.set(res.totalElements);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar los clientes',
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
    this.loadClients();
  }

  goToCreate() {
    this.router.navigate(['/persons/clients/create']);
  }

  goToEdit(client: ClientResponse) {
    this.router.navigate(['/persons/clients/edit', client.id]);
  }

  delete(client: ClientResponse) {
    this.clientApi.delete(client.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Cliente eliminado correctamente',
        });
        this.loadClients();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el cliente',
        }),
    });
  }
}
