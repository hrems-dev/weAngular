export interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}
