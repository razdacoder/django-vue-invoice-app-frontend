<template>
  <div class="home container">
    <!-- Header -->
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are total {{ invoices.length }} invoices</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span
            >Filter by status <span>: {{ filteredInvoice }}</span></span
          >
          <img src="@/assets/icon-arrow-down.svg" alt="" />
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filterInvoices('draft')">Draft</li>
            <li @click="filterInvoices('pending')">Pending</li>
            <li @click="filterInvoices('paid')">Paid</li>
            <li @click="filterInvoices('clear')">Clear Filter</li>
          </ul>
        </div>
        <div @click="toggleInvoiceModal" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </div>
    <!-- Invoices -->
    <div v-if="invoices.length > 0">
      <Invoice
        v-for="(invoice, index) in invoices"
        :invoice="invoice"
        :key="index"
      />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="" />
      <h3>There is nothing here</h3>
      <p>
        Create a new invoice by clicking the New Invoice button and get started
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import Invoices from "./../types/Invoice";
import Invoice from "./../components/Invoice.vue";

export default defineComponent({
  components: {
    Invoice,
  },
  setup() {
    const store = useStore();

    // Filter Menu
    const filterMenu = ref(false);
    const filteredInvoice = ref<string | null>(null);
    const toggleFilterMenu = () => {
      filterMenu.value = !filterMenu.value;
    };
    const filterInvoices = (status: string) => {
      if (status === "clear") {
        filteredInvoice.value = null;
        return;
      }
      filteredInvoice.value = status;
    };

    // Invoices
    const invoices = computed(() => {
      const invoiceData = store.getters.getInvoices;
      return invoiceData.filter((invoice: Invoices) => {
        if (filteredInvoice.value === invoice.status) {
          return true;
        }
        if (filteredInvoice.value === null) {
          return true;
        }

        return false;
      });
    });
    // Invoice Modal
    const toggleInvoiceModal = () => {
      store.commit("setInvoiceModal");
    };

    return {
      filterMenu,
      toggleFilterMenu,
      invoices,
      filterInvoices,
      toggleInvoiceModal,
      filteredInvoice,
    };
  },
});
</script>

<style lang="scss" scoped>
.home {
  color: #fff;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
