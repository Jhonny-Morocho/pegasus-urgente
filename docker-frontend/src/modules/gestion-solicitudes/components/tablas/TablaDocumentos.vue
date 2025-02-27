<template>
<AppDataTable
  id="dataTableDocumentos"
  v-bind="$attrs"
  class="w-full"
>
  <Column
    v-if="selectionMode"
    selection-mode="multiple"
    style="width: 3em"
  />
  <Column header="Nombre del Archivo">
    <template #body="{ data }">
      {{ data.nombre }}
    </template>
  </Column>
  <Column header="Descripción del Archivo">
    <template #body="{ data }">
      {{ data.descripcion }}
    </template>
  </Column>
  <Column header="Tipo de Archivo">
    <template #body="{ data }">
      {{ data.tipo }}
    </template>
  </Column>
  <Column header="Tamaño">
    <template #body="{ data }">
      {{ data.tamaño }}
    </template>
  </Column>
  <Column
    v-if="actionOptions.length > 0 ||!isEditando && !readOnly"
    class="text-center"
    header="Acciones"
    style="width:0"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="model"
        :menu-options="actionOptions"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  actionOptions: {
    type: Array,
    default: () => []
  },
  selectionMode: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  isEditando: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit(`update:modelValue`, value)
})

</script>
