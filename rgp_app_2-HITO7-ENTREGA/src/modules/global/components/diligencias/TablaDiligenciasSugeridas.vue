<template>
<AppDataTable
  id="diligencias-sugeridas"
  breakpoint="960px"
  class="col-12"
  responsive-layout="stack"
  v-bind="$attrs"
>
  <Column header="Código Diligencia">
    <template #body="{ data }">
      {{ data?.codSubSubTipo || 'N/A' }}
    </template>
  </Column>
  <Column header="Tipo Diligencia">
    <template #body="{ data }">
      {{ data?.tipoDiligencia }}
    </template>
  </Column>
  <Column header="Subtipo Diligencia">
    <template #body="{ data }">
      {{ data?.subTipoDiligencia || 'N/A' }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="{ data }">
      <Button
        v-tooltip.top="'Instruir Diligencia'"
        class="p-button-rounded p-button-warning p-button-outlined mr-2"
        icon="pi pi-pencil"
        @click="emitCompletarInfo(data)"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['instruir'])

function emitCompletarInfo (diligenciaSugerida) {
  emit('instruir', diligenciaSugerida)
}

</script>
