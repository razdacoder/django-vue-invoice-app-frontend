interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  invoice: number;
}
interface Invoice {
  id: number | null;
  uid: string | null;
  from_address: string | null;
  from_city: string | null;
  from_zip_code: string | null;
  from_country: string | null;
  client_name: string | null;
  client_address: string | null;
  client_city: string | null;
  client_zip_code: string | null;
  client_email: string | null;
  client_country: string | null;
  invoice_date: string;
  payment_due_date: string | null;
  terms: string | null;
  description: string | null;
  status: string | null;
  total: number | null;
  items: InvoiceItem[];
}

export { Invoice, InvoiceItem };
