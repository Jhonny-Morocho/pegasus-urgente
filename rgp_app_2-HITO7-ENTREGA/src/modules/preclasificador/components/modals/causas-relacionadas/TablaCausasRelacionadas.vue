<template>
<AppDataTable
  id="dataTableCausasRelacionadas"
  class="w-full"
  :loading="loading"
  :value="causasRelacionadas"
>
  <Column header="RUC">
    <template #body="slotprops">
      {{ slotprops.data.ruc }}
    </template>
  </Column>
  <Column header="Victima">
    <template #body="slotprops">
      {{ slotprops.data.victima }}
    </template>
  </Column>
  <Column header="Imputado">
    <template #body="slotprops">
      {{ slotprops.data.imputado }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="slotprops">
      {{ slotprops.data.estado }}
    </template>
  </Column>
  <Column header="Delito">
    <template #body="slotprops">
      {{ slotprops.data.delito }}
    </template>
  </Column>
  <Column header="Fecha Delito">
    <template #body="slotprops">
      {{ slotprops.data.fechaDelito }}
    </template>
  </Column>
  <Column header="VIF">
    <template #body="slotprops">
      {{ slotprops.data.vif }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const loading = ref(false)
defineProps({
  causasRelacionadas: {
    type: Array,
    default: () => null
  }
})
</script>
