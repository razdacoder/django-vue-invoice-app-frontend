interface Invoices {
  id: number;
  uid: string;
  status: string;
  client_name: string;
  payment_due_date: string;
  total: number;
}

export default Invoices;
