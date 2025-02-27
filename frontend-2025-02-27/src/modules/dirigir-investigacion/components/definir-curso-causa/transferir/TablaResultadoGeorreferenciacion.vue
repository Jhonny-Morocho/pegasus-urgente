<template>
<div class="w-full">
  <AppDataTable
    id="tabla-causas-relacionadas-guardadas"
    breakpoint="960px"
    responsive-layout="scroll"
    :total-records="resultadosGeorreferenciacion.length"
    :value="resultadosGeorreferenciacion"
  >
    <Column header="Delito">
      <template #body="{ data }">
        {{ data?.delito }}
      </template>
    </Column>
    <Column header="Región">
      <template #body="{ data }">
        {{ data?.region }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ data?.comuna }}
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ data?.direccion }}
      </template>
    </Column>
    <Column header="Fiscalía Competente">
      <template #body="{ data }">
        {{ data?.nombreFiscalia }}
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  resultadosGeorreferenciacion: propTypes.array
})
</script>
