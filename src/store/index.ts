import { createStore } from "vuex";
import Invoices from "@/types/Invoice";
import { Invoice } from "@/types/InvoiceDetail";

interface StateTypes {
  invoices: Invoices[];
  invoiceModal: boolean;
  currentInvoice: Invoice | null;
}

export default createStore({
  state: <StateTypes>{
    invoices: [],
    invoiceModal: false,
    currentInvoice: null,
  },
  getters: {
    getInvoices: (state) => {
      return state.invoices;
    },
    getInvoiceModal: (state) => {
      return state.invoiceModal;
    },
    getInvoice: (state) => {
      return state.currentInvoice;
    },
  },
  mutations: {
    setInvoices: (state, payload) => {
      state.invoices = [];
      payload.forEach((invoice: Invoices) => {
        state.invoices.push(invoice);
      });
    },
    setInvoiceModal: (state) => {
      state.invoiceModal = !state.invoiceModal;
    },
    setCurrentInvoice: (state, payload) => {
      state.currentInvoice = payload;
    },
    setDeleteInvoice: (state, payload) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.uid !== payload
      );
    },
  },
  actions: {
    fetchInvoices: async (context) => {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/invoices",
        requestOptions
      );
      const data = await response.json();
      context.commit("setInvoices", data);
    },
    createInvoice: async (context, payload: Invoice) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const data = JSON.stringify({
        uid: (Math.round(Math.random() * 4000) + "GBF").toString(),
        from_address: payload.from_address,
        from_city: payload.from_city,
        from_zip_code: payload.from_zip_code,
        from_country: payload.from_country,
        client_name: payload.client_name,
        client_email: payload.client_email,
        client_address: payload.client_address,
        client_zip_code: payload.client_zip_code,
        client_city: payload.client_city,
        client_country: payload.client_country,
        invoice_date: payload.invoice_date,
        payment_due_date: payload.payment_due_date,
        terms: payload.terms,
        description: payload.description,
        status: payload.status,
        items: payload.items,
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: data,
      };
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/invoices/",
        requestOptions
      );
      const res = await response.json();
      if (res.ok) {
        setTimeout(function() {
          context.dispatch("fetchInvoices");
        }, 2000);
      }
    },
    getCurrentInvoice: async (context, payload) => {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/invoice/${payload}/`,
        requestOptions
      );
      const data = await response.json();
      context.commit("setCurrentInvoice", data);
    },
    updateStatus: async (context, payload) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        status: payload.status,
      });
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/invoice/${payload.id}/`,
        requestOptions
      );
      const res = await response.json();
      if (res.ok) {
        context.dispatch("getCurrentInvoice", payload.id);
        context.dispatch("fetchInvoices");
      }
    },
    deleteInvoice: async (context, payload) => {
      const requestOptions = {
        method: "DELETE",
      };
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/invoice/${payload}/`,
        requestOptions
      );
      const res = await response.json();
      if (res.ok) {
        context.commit("setCurrentInvoice", null);
        context.dispatch("fetchInvoices");
      }
    },
  },
  modules: {},
});
