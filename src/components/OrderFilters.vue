<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  orderStatusOptions,
  financialStatusOptions,
  fulfillmentStatusOptions,
  cityOptions,
} from 'src/constants/filterOptions'

const emit = defineEmits(['update:filters'])
const route = useRoute()

const filters = ref({
  order_status: '',
  financial_status: '',
  fulfillment_status: '',
  delivery_date: null,
  city: [],
})

// 初始化 filter（根據 URL query）
onMounted(() => {
  const query = route.query

  filters.value.order_status = query.order_status || ''
  filters.value.financial_status = query.financial_status || ''
  filters.value.fulfillment_status = query.fulfillment_status || ''
  filters.value.delivery_date = query.delivery_date || null
  filters.value.city = query.city ? (Array.isArray(query.city) ? query.city : [query.city]) : []
})

// 發射 filters 給父層
watch(
  filters,
  (newFilters) => {
    emit('update:filters', newFilters)
  },
  { deep: true },
)
</script>

<template>
  <div class="row q-gutter-md items-center q-mb-md">
    <q-input
      outlined
      v-model="filters.delivery_date"
      label="配送日期"
      readonly
      dense
      class="filter-controller"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover>
            <q-date v-model="filters.delivery_date" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-select
      v-model="filters.order_status"
      :options="orderStatusOptions"
      label="訂單狀態"
      emit-value
      map-options
      outlined
      dense
      class="filter-controller"
    />
    <q-select
      v-model="filters.financial_status"
      :options="financialStatusOptions"
      label="付款狀態"
      emit-value
      map-options
      outlined
      dense
      class="filter-controller"
    />
    <q-select
      v-model="filters.fulfillment_status"
      :options="fulfillmentStatusOptions"
      label="運送狀態"
      emit-value
      map-options
      outlined
      dense
      class="filter-controller"
    />

    <q-select
      v-model="filters.city"
      :options="cityOptions"
      label="配送縣市"
      emit-value
      multiple
      map-options
      use-chips
      outlined
      dense
      class="filter-controller"
    />
  </div>
</template>

<style lang="scss" scoped>
.filter-controller {
  max-width: 170px;
  min-width: 150px;
}
</style>
