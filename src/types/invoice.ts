export interface TaxInfo {
  matriculeFiscal: string;
  rne: string;
  signature?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatType: 'standard' | 'reduced' | 'timbre';
  vatAmount: number;
  total: number;
}

export interface ClientDetails {
  id: string;
  name: string;
  matriculeFiscal?: string;
  email: string;
  address: string;
  phone: string;
  language: 'ar' | 'fr';
}

export interface CompanyDetails {
  name: string;
  matriculeFiscal: string;
  rne: string;
  email: string;
  address: string;
  phone: string;
  logo?: string;
  signature?: string;
  website?: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  client: ClientDetails;
  company: CompanyDetails;
  items: LineItem[];
  notes: string;
  terms: string;
  language: 'ar' | 'fr';
  status: 'draft' | 'final' | 'paid' | 'cancelled';
  vatBreakdown: {
    standard: number;
    reduced: number;
    timbre: number;
  };
  totals: {
    subtotal: number;
    vat: number;
    timbre: number;
    total: number;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}