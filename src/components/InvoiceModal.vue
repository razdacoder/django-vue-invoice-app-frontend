<template>
  <div class="invoice-wrap flex flex-column">
    <form @submit.prevent="publishInvoice" class="invoice-content">
      <Loading v-show="loading" />
      <h1>New Invoice</h1>

      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input
            required
            type="text"
            id="billerStreetAddress"
            v-model="invoice.from_address"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input
              required
              type="text"
              id="billerCity"
              v-model="invoice.from_city"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input
              required
              type="text"
              id="billerZipCode"
              v-model="invoice.from_zip_code"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input
              required
              type="text"
              id="billerCountry"
              v-model="invoice.from_country"
            />
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input
            required
            type="text"
            id="clientName"
            v-model="invoice.client_name"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <input
            required
            type="text"
            id="clientEmail"
            v-model="invoice.client_email"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Street Address</label>
          <input
            required
            type="text"
            id="clientStreetAddress"
            v-model="invoice.client_address"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input
              required
              type="text"
              id="clientCity"
              v-model="invoice.client_city"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input
              required
              type="text"
              id="clientZipCode"
              v-model="invoice.client_zip_code"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input
              required
              type="text"
              id="clientCountry"
              v-model="invoice.client_country"
            />
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input
              disabled
              type="text"
              id="invoiceDate"
              v-model="invoice.invoice_date"
            />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due</label>
            <input
              disabled
              type="text"
              id="paymentDueDate"
              v-model="invoice.payment_due_date"
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select
            required
            type="text"
            id="paymentTerms"
            @change="paymentDueDate($event.target.value)"
            v-model="invoice.terms"
          >
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            required
            type="text"
            id="productDescription"
            v-model="invoice.description"
          />
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Toal</th>
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in invoice.items"
              :key="index"
            >
              <td class="item-name">
                <input type="text" v-model="item.name" />
              </td>
              <td class="qty"><input type="text" v-model="item.quantity" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total flex">
                ${{ (item.total = item.quantity * item.price) }}
              </td>
              <img
                @click="deleteInvoiceItem(item.id)"
                src="@/assets/icon-delete.svg"
                alt=""
              />
            </tr>
          </table>

          <div @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="" />
            Add New Item
          </div>
        </div>
      </div>

      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
            Cancel
          </button>
        </div>
        <div class="right flex">
          <button type="button" @click="saveDraft" class="dark-purple">
            Save Draft
          </button>
          <button type="submit" class="purple">
            Create Invoice
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { Invoice } from "./../types/InvoiceDetail";
import Loading from "./Loading.vue";

export default defineComponent({
  components: {
    Loading,
  },
  setup() {
    const store = useStore();
    const invoiceWrap = ref(null);
    // Modal Data
    const invoice = ref<Invoice>({
      id: null,
      uid: null,
      from_address: null,
      from_city: null,
      from_zip_code: null,
      from_country: null,
      client_name: null,
      client_address: null,
      client_city: null,
      client_zip_code: null,
      client_email: null,
      client_country: null,
      invoice_date: null,
      payment_due_date: null,
      status: null,
      terms: "30",
      description: null,
      total: null,
      items: [],
    });

    const loading = ref<boolean | null>(null);
    // Modal Control
    const paymentDueDate = (term: string) => {
      const futureDate = new Date();
      const paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(term)
      );
      invoice.value.payment_due_date = new Date(paymentDueDateUnix)
        .toISOString()
        .split("T")[0];
    };

    const addNewInvoiceItem = () => {
      invoice.value.items.push({
        id: Math.round(Math.random() * 100),
        name: "",
        quantity: 0,
        price: 0,
        total: 0,
      });
    };
    const deleteInvoiceItem = (id: number) => {
      invoice.value.items = invoice.value.items.filter(
        (item) => item.id !== id
      );
    };

    const invoiceDateUnix = Date.now();
    invoice.value.invoice_date = new Date(invoiceDateUnix)
      .toISOString()
      .split("T")[0];
    paymentDueDate(invoice.value.terms);

    const saveDraft = async () => {
      loading.value = true;
      invoice.value.status = "draft";
      await store.dispatch("createInvoice", invoice.value);
      store.commit("setInvoiceModal");
      loading.value = false;
    };

    const publishInvoice = async () => {
      loading.value = true;
      invoice.value.status = "pending";
      await store.dispatch("createInvoice", invoice.value);
      store.commit("setInvoiceModal");
      loading.value = false;
    };
    const closeInvoice = () => {
      store.commit("setInvoiceModal");
    };

    return {
      closeInvoice,
      invoice,
      paymentDueDate,
      addNewInvoiceItem,
      deleteInvoiceItem,
      publishInvoice,
      loading,
      saveDraft,
      invoiceWrap,
    };
  },
});
</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
