<template>
<section>
  <div class="flex flex-column lg:flex-row justify-content-between">
    <div
      v-if="!noDateFilters"
      class="flex"
    >
      <AppCalendar
        id="filter-dateFrom"
        v-model="filters['fecha-desde']"
        class="mb-0"
        label="Fecha Desde"
        :max-date="filters['fecha-hasta']"
        style="border-radius: 4px 0px 0px 4px;border-right: 0px;"
      />
      <div class="flex ml-0">
        <AppCalendar
          id="filter-dateTo"
          v-model="filters['fecha-hasta']"
          class="mb-0"
          label="Fecha Hasta"
          :min-date="filters['fecha-desde']"
          :style="(filters['fecha-desde'] || filters['fecha-hasta']) ? 'border-radius: 0px;' : 'border-radius: 0px 4px 4px 0px;'"
        />
        <Button
          v-if="filters['fecha-desde'] || filters['fecha-hasta']"
          class="p-button-sm btn-primary"
          icon="pi pi-times"
          style="border-radius: 0px 4px 4px 0px;"
          @click="handleClearDateFilters"
        />
      </div>
    </div>

    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0">
      <InputText
        id="filter-text"
        v-model="filters.buscador"
        class="p-inputtext-sm"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary p-button-sm"
        icon="pi pi-search"
        @click="emit('filter')"
      />
    </div>
  </div>
</section>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      'fecha-desde': '',
      'fecha-hasta': '',
      buscador: ''
    })
  },
  noDateFilters: Boolean
})

const emit = defineEmits(['update:modelValue', 'filter'])

const filters = ref(props.modelValue)

watch(filters.value, (newValueFilter) => {
  emit('update:modelValue', newValueFilter)
})

function handleClearDateFilters () {
  filters.value['fecha-desde'] = undefined
  filters.value['fecha-hasta'] = undefined
}
</script>
