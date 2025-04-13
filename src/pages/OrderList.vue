<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/api'

import TablePagination from 'components/TablePagination.vue'
import OrderFilters from 'components/OrderFilters.vue'

const route = useRoute()
const router = useRouter()

const rows = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const selected = ref([])

const filters = ref({
  order_status: '',
  financial_status: '',
  fulfillment_status: '',
  delivery_date: null,
  city: [],
})

const pagination = ref({ sortBy: 'created_at', descending: true, page: 1, rowsPerPage: 20 })

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

const fetchData = async () => {
  loading.value = true

  try {
    const res = await api.get('/orders', {
      params: {
        page: pagination.value.page - 1,
        size: pagination.value.rowsPerPage,

        sort_by: pagination.value.sortBy,
        is_descending: pagination.value.descending,

        order_status: filters.value.order_status || null,
        financial_status: filters.value.financial_status || null,
        fulfillment_status: filters.value.fulfillment_status || null,
        delivery_date: filters.value.delivery_date || null,
        city: filters.value.city.length > 0 ? filters.value.city : null,
      },
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          const value = params[key]
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(`${key}[]`, v))
          } else if (value !== null && value !== undefined) {
            searchParams.append(key, value)
          }
        })
        return searchParams.toString()
      },
    })

    rows.value = res.data.content
    totalRecords.value = res.data.total_elements
  } catch (err) {
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${totalRecords.value}`
}

const updateFilters = (newFilters) => {
  filters.value = newFilters
  pagination.value.page = 1
  updateRouteQuery()
  fetchData()
}

const updatePagination = (newPagination) => {
  pagination.value = newPagination
  updateRouteQuery()
  fetchData()
}

const updateRouteQuery = () => {
  router.replace({
    query: {
      ...route.query,
      order_status: filters.value.order_status || undefined,
      financial_status: filters.value.financial_status || undefined,
      fulfillment_status: filters.value.fulfillment_status || undefined,
      delivery_date: filters.value.delivery_date || undefined,
      city: filters.value.city.length > 0 ? filters.value.city : undefined,

      sort_by: pagination.value.sortBy,
      desc: pagination.value.descending,
      page: pagination.value.page,
      size: pagination.value.rowsPerPage,
    },
  })
}

watch(
  pagination,
  () => {
    fetchData()
  },
  { deep: true },
)

onMounted(() => {
  const q = route.query

  // 初始化 filters（你可以針對 key 做更多防呆）
  filters.value = {
    order_status: q.order_status || '',
    financial_status: q.financial_status || '',
    fulfillment_status: q.fulfillment_status || '',
    delivery_date: q.delivery_date || null,
    city: Array.isArray(q.city) ? q.city : q.city ? [q.city] : [], // 如果只有一筆，也包成 array
  }

  pagination.value = {
    sortBy: q.sort_by || 'created_at',
    descending: q.desc === 'true', // 因為 query 是 string，要轉 boolean
    page: parseInt(q.page || 1),
    rowsPerPage: parseInt(q.size || 20),
  }

  fetchData()
})
</script>

<template>
  <q-page class="q-pa-md">
    <order-filters @update:filters="updateFilters" />

    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      bordered
      selection="multiple"
      :selected-rows-label="getSelectedString"
      :rows-per-page-options="[]"
      :loading="loading"
      v-model:selected="selected"
      :pagination="pagination"
    >
      <template v-slot:top>
        <table-pagination
          :pagination="pagination"
          :orders="rows"
          :total="totalRecords"
          @update:pagination="updatePagination"
        />
      </template>

      <template v-slot:bottom>
        <table-pagination
          :pagination="pagination"
          :orders="rows"
          :total="totalRecords"
          @update:pagination="updatePagination"
        />
      </template>
    </q-table>
  </q-page>
</template>
