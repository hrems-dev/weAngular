export interface SaleLine {
  id?: string; // UUID
  quantity: number;
  unit_price: number;
  sub_total: number;
  sale_id?: string;
  product_id: string;
}

export interface SaleResponse {
  id: string; // UUID
  sale_date: string; // timestamp
  total: number;
  client_id: string; // FK to Client(id)
  clientName?: string; // optional display name if API provides it
  items?: SaleLine[];
}

export interface SaleRequest {
  sale_date: string; // timestamp
  total: number;
  client_id: string;
  items: Array<{ product_id: string; quantity: number; unit_price: number }>;
}

export interface SaleReportResponse {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrder: number;
}
