<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/api'

import TablePagination from 'components/TablePagination.vue'
import OrderFilters from 'components/OrderFilters.vue'

const orders = ref([])
const selected = ref([])
const loading = ref(false)

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    return (
      ((!filters.value.order_status || order.order_status === filters.value.order_status) &&
        (!filters.value.financial_status ||
          order.financial_status === filters.value.financial_status) &&
        (!filters.value.fulfillment_status ||
          order.fulfillment_status === filters.value.fulfillment_status) &&
        (!filters.value.delivery_date || order.delivery_date === filters.value.delivery_date) &&
        filters.value.city.length === 0) ||
      filters.value.city.includes(order.city)
    )
  })
})

const filters = ref({
  order_status: '',
  financial_status: '',
  fulfillment_status: '',
  delivery_date: null,
  city: [],
})

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
})

const columns = [
  { name: 'order_name', label: 'Order', field: 'order_name', align: 'left', sortable: true },
  { name: 'customer_name', label: 'Customer', field: 'customer_name' },
  {
    name: 'total_price',
    label: 'Price',
    field: 'total_price',
    format: (val) => `$${val.toLocaleString()}`,
    sortable: true,
  },
  { name: 'receiver_address', label: 'Address', field: 'receiver_address', sortable: true },
  { name: 'delivery_date', label: 'Delivery Date', field: 'delivery_date', sortable: true },
  { name: 'created_at', label: 'Time', field: 'created_at', sortable: true },
  { name: 'order_status', label: 'Status', field: 'order_status', sortable: true },
  { name: 'financial_status', label: 'Payment', field: 'financial_status' },
  { name: 'fulfillment_status', label: 'Fulfillment', field: 'fulfillment_status' },
]

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await api.get('/orders')

    orders.value = res.data.content
  } catch (err) {
    console.error('Error: ', err)
  } finally {
    loading.value = false
  }
}

function getSelectedString() {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${orders.value.length}`
}

const updatePagination = (newPagination) => {
  pagination.value = newPagination
}

onMounted(fetchOrders)
</script>

<template>
  <q-page class="q-pa-md">
    <order-filters @update:filters="(newFilters) => (filters = newFilters)" />

    <q-table
      v-model:selected="selected"
      v-model:pagination="pagination"
      :rows="filteredOrders"
      :columns="columns"
      row-key="id"
      flat
      bordered
      selection="multiple"
      :selected-rows-label="getSelectedString"
      :loading="loading"
    >
      <template v-slot:top>
        <table-pagination
          :pagination="pagination"
          :orders="orders"
          @update:pagination="updatePagination"
        />
      </template>

      <template v-slot:bottom>
        <table-pagination
          :pagination="pagination"
          :orders="orders"
          @update:pagination="updatePagination"
        />
      </template>
    </q-table>
  </q-page>
</template>
