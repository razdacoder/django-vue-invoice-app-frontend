<template>
  <div class="invoice-view container">
    <router-link class="nav-link flex" :to="{ name: 'Home' }">
      <img src="@/assets/icon-arrow-left.svg" alt="" /> Go Back
    </router-link>
    <!-- Header -->
    <div class="header flex">
      <div class="left flex">
        <span>Status</span>
        <div
          class="status-button flex"
          :class="{
            paid: invoice.status === 'paid',
            draft: invoice.status === 'draft',
            pending: invoice.status === 'pending',
          }"
        >
          <span v-if="invoice.status === 'paid'">Paid</span>
          <span v-if="invoice.status === 'draft'">Draft</span>
          <span v-if="invoice.status === 'pending'">Pending</span>
        </div>
      </div>
      <div class="right flex">
        <button @click="deleteInvoice(invoice.uid)" class="red">
          Delete
        </button>
        <button
          v-if="invoice.status === 'pending'"
          @click="updateStatus(invoice.uid, 'paid')"
          class="green"
        >
          Mark as Paid
        </button>
        <button
          @click="updateStatus(invoice.uid, 'pending')"
          class="orange"
          v-if="invoice.status === 'paid' || invoice.status === 'draft'"
        >
          Mark as Pending
        </button>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p><span>#</span>{{ invoice.uid }}</p>
          <p>{{ invoice.description }}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{ invoice.from_address }}</p>
          <p>{{ invoice.from_city }}</p>
          <p>{{ invoice.from_zip_code }}</p>
          <p>{{ invoice.from_country }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>
            {{ invoice.invoice_date }}
          </p>
          <h4>Payment Date</h4>
          <p>
            {{ invoice.payment_due_date }}
          </p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{ invoice.client_name }}</p>
          <p>{{ invoice.client_address }}</p>
          <p>{{ invoice.client_city }}</p>
          <p>{{ invoice.client_zip_code }}</p>
          <p>{{ invoice.client_country }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Sent To</h4>
          <p>{{ invoice.client_email }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div
            v-for="(item, index) in invoice.items"
            :key="index"
            class="item flex"
          >
            <p>{{ item.name }}</p>
            <p>{{ item.quantity }}</p>
            <p>{{ item.price }}</p>
            <p>{{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Amount Due</p>
          <p>{{ invoice.total.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    store.dispatch("getCurrentInvoice", route.params.invoiceId);

    const invoice = computed(() => {
      return store.getters.getInvoice;
    });

    const updateStatus = (id: string, status: string) => {
      const payload = {
        id: id,
        status: status,
      };
      store.dispatch("updateStatus", payload);
    };
    const deleteInvoice = async (id: string) => {
      await store.dispatch("deleteInvoice", id);
      router.push({ name: "Home" });
    };

    return { invoice, updateStatus, deleteInvoice };
  },
});
</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
