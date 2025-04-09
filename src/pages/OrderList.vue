<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/api'
import TablePagination from 'components/TablePagination.vue'

const orders = ref([])
const selected = ref([])
const loading = ref(false)

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
    <q-table
      v-model:selected="selected"
      v-model:pagination="pagination"
      :pagination-label="(start, end, total) => `${end}筆中的的第 ${start} - ${end} 筆`"
      :rows="orders"
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
          @update:pagination="pagination = $event"
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
