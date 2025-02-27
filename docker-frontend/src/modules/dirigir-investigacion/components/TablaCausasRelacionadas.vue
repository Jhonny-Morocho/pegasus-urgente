<template>
<AppDataTable
  id="candidatas-causas-relacionadas"
  v-bind="$attrs"
  class="w-full"
  responsive-layout="scroll"
>
  <Column
    v-if="!readOnly"
    header-style="width: 3em"
    selection-mode="multiple"
  />
  <Column header="RUC">
    <template #body="{ data }">
      {{ data?.ruc }}
    </template>
  </Column>
  <Column header="Víctima">
    <template #body="{ data }">
      {{ data?.victima }}
    </template>
  </Column>
  <Column header="Imputado">
    <template #body="{ data }">
      {{ data?.imputado }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.estado }}
    </template>
  </Column>
  <Column header="Delito">
    <template #body="{ data }">
      {{ data?.delito }}
    </template>
  </Column>
  <Column header="Fecha Delito">
    <template #body="{ data }">
      {{ data?.fechaDelito }}
    </template>
  </Column>
  <Column header="Alerta">
    <template #body="{ data }">
      <div class="flex justify-content-around">
        <ChipAlerta
          v-for="(alerta, index) in data.alertas"
          :key="index"
          :alerta="alerta"
        />
      </div>
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { defineProps } from 'vue'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'

defineProps({
  readOnly: Boolean
})
</script>
