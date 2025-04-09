<script setup>
import { ref, watch } from 'vue'
import {
  orderStatusOptions,
  financialStatusOptions,
  fulfillmentStatusOptions,
  cityOptions,
} from 'src/constants/filterOptions'

const emit = defineEmits(['update:filters'])

const filters = ref({
  order_status: '',
  financial_status: '',
  fulfillment_status: '',
  delivery_date: null,
  city: [],
})

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
