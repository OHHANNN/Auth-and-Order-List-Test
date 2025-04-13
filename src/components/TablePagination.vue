<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  orders: Array,
  pagination: Object,
  total: Number,
})

const emit = defineEmits(['update:pagination'])

const rowsPerPageOptions = [
  { label: '5 筆', value: 5 },
  { label: '10 筆', value: 10 },
  { label: '15 筆', value: 15 },
  { label: '20 筆', value: 20 },
  { label: '50 筆', value: 50 },
  { label: 'All', value: 0 },
]

const localPagination = computed({
  get() {
    return props.pagination
  },

  set(value) {
    emit('update:pagination', { ...value })
  },
})

const maxPage = computed(() => {
  return localPagination.value.rowsPerPage === 0
    ? 1
    : Math.ceil(props.total / localPagination.value.rowsPerPage)
})

const startIndex = computed(() => {
  const start = (localPagination.value.page - 1) * localPagination.value.rowsPerPage + 1
  return start > props.total ? props.total : start
})

const endIndex = computed(() => {
  const end = localPagination.value.page * localPagination.value.rowsPerPage
  return end > props.total ? props.total : end
})

// 監聽本地 pagination，並發送更新到父層
watch(
  localPagination,
  (newVal) => {
    emit('update:pagination', newVal)
  },
  { deep: true },
)
</script>

<template>
  <div class="flex no-wrap items-center q-gutter-x-md">
    <q-select
      v-model="localPagination.rowsPerPage"
      :options="rowsPerPageOptions"
      label="每頁顯示筆數"
      color="primary"
      borderless
      emit-value
      map-options
      style="min-width: 150px"
    />

    <!-- 顯示起始和結束索引 -->
    <span> 顯示第 {{ startIndex }} - {{ endIndex }} 筆，共 {{ props.total }} 筆 </span>

    <div v-if="localPagination.rowsPerPage < props.total" class="flex no-wrap">
      <q-btn
        icon="first_page"
        color="grey-8"
        round
        dense
        flat
        :disable="localPagination.page === 1"
        @click="localPagination.page = 1"
      />
      <q-btn
        icon="chevron_left"
        color="grey-8"
        round
        dense
        flat
        :disable="localPagination.page === 1"
        @click="localPagination.page--"
      />
      <q-btn
        icon="chevron_right"
        color="grey-8"
        round
        dense
        flat
        :disable="localPagination.page === maxPage"
        @click="localPagination.page++"
      />

      <q-btn
        icon="last_page"
        color="grey-8"
        round
        dense
        flat
        :disable="localPagination.page === maxPage"
        @click="localPagination.page = maxPage - 1"
      />
    </div>
  </div>
</template>
