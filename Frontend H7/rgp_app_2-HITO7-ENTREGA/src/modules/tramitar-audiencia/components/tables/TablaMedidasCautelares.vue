<template>
<AppDataTable
  class="w-full"
  :total-records="medidasCautelares?.length"
  :value="medidasCautelares"
>
  <Column :header="isIntrusiva ? 'Medida Intrusiva' : 'Medida Cautelar'">
    <template #body="{ data }">
      {{ data.medida ? mantenedor_getDescripcionMedidasCautelaresById(data.medida) : 'N/A' }}
    </template>
  </Column>
  <Column header="Imputado">
    <template #body="{ data }">
      {{ data.imputado?.nombreCompleto }}
    </template>
  </Column>
  <Column header="Descripcion">
    <template #body="{ data }">
      {{ data.delito ?? data.descripcionMedidaCautelar }}
    </template>
  </Column>
  <Column
    v-if="tieneAcciones"
    class="text-center"
    header="Acciones"
    style="width: 79px"
  >
    <template #body="{ data }">
      <Button
        class="p-button-rounded p-button-outlined p-button-danger"
        icon="pi pi-trash"
        @click="deleteMedidaCautelar(data)"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { useMantenedorStore } from '@/modules/global/composables'

defineProps({
  medidasCautelares: propTypes.array,
  tieneAcciones: Boolean,
  isIntrusiva: Boolean
})

const { mantenedor_getDescripcionMedidasCautelaresById } = useMantenedorStore()

const emit = defineEmits(['medidas:eliminar'])

function deleteMedidaCautelar (data) {
  emit('medidas:eliminar', data)
}
</script>
