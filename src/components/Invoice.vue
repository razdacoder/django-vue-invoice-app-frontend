<template>
  <router-link
    class="invoice flex"
    :to="{ name: 'InvoiceView', params: { invoiceId: invoice.uid } }"
  >
    <div class="left flex">
      <span class="tracking-number">#{{ invoice.uid }}</span>
      <span class="due-date">{{ invoice.payment_due_date }}</span>
      <span class="person">{{ invoice.client_name }}</span>
    </div>
    <div class="right flex">
      <span class="price">${{ invoice.total.toFixed(2) }}</span>
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
      <div class="icon">
        <img src="@/assets/icon-arrow-right.svg" alt="" />
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "invoice",
  props: ["invoice"],
});
</script>

<style lang="scss" scoped>
.invoice {
  text-decoration: none;
  cursor: pointer;
  gap: 16px;
  margin-bottom: 16px;
  color: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  background-color: #1e2139;
  align-items: center;

  span {
    font-size: 13px;
  }

  .left {
    align-items: center;
    flex-basis: 60%;
    gap: 16px;

    span {
      flex: 1;
    }

    .tracking-number {
      text-transform: uppercase;
    }
  }

  .right {
    gap: 16px;
    flex-basis: 40%;
    align-items: center;

    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600px;
    }
  }
}
</style>
