# Actualización de la feature Sale

Se completó la feature `sale` para que tenga una estructura funcional similar a `product`.

## Cambios realizados

- Se actualizó `src/app/features/sale/sale.routes.ts` para soportar:
  - `/sales/sales`
  - `/sales/sales/create`
  - `/sales/sales/edit/:id`
  - `/sales/report`

- Se implementó la API de ventas en `src/app/features/sale/data/sale-api.ts` con métodos:
  - `getAll`
  - `getById`
  - `save`
  - `update`
  - `delete`
  - `getReport`

- Se añadieron los modelos de ventas en `src/app/features/sale/data/sale.models.ts`.

- Se completó el listado de ventas con búsqueda, paginación, creación, edición y eliminación:
  - `src/app/features/sale/ui/sale-list/sale-list.ts`
  - `src/app/features/sale/ui/sale-list/sale-list.html`
  - `src/app/features/sale/ui/sale-list/sale-list.scss`

- Se creó el formulario de ventas para creación y edición:
  - `src/app/features/sale/ui/sale-list/sale-form/sale-form.ts`
  - `src/app/features/sale/ui/sale-list/sale-form/sale-form.html`
  - `src/app/features/sale/ui/sale-list/sale-form/sale-form.scss`
  - `src/app/features/sale/ui/sale-list/sale-form/sale-form.spec.ts`

- Se implementó el reporte de ventas en la UI:
  - `src/app/features/sale/ui/sale-report/sale-report.ts`
  - `src/app/features/sale/ui/sale-report/sale-report.html`
  - `src/app/features/sale/ui/sale-report/sale-report.scss`

## Notas

Esta implementación replica la filosofía de `product`, con rutas de listado y formulario, API REST y reporte en una página dedicada.
