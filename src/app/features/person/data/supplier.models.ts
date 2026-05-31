export interface SupplierResponse {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export interface SupplierRequest {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  isActive: boolean;
}
