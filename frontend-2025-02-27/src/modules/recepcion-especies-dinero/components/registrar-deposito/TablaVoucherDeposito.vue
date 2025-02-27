<template>
<AppDataTable
  id="tableVoucherDeposito"
  class="col-12"
  :no-paginator="paginator"
  :total-records="totalRecords"
  :value="dineros"
>
  <Column header="NUE">
    <template #body="{ data }">
      {{ data.especie.nue }}
    </template>
  </Column>
  <Column header="RUE">
    <template #body="{ data }">
      {{ data.rue }}
    </template>
  </Column>
  <Column header="RUC">
    <template #body="{ data }">
      {{ data.ruc }}
    </template>
  </Column>
  <Column header="Fiscalía Regional">
    <template #body="{ data }">
      {{ data.cupon.fiscaliaRegional }}
    </template>
  </Column>
  <Column header="Fiscalia Local">
    <template #body="{ data }">
      {{ data.cupon.fiscaliaLocal }}
    </template>
  </Column>
  <Column header="Número de convenio">
    <template #body="{ data }">
      {{ data.cupon.numeroConvenio }}
    </template>
  </Column>
  <Column header="Monto">
    <template #body="{ data }">
      {{ data.cupon.monto }}
    </template>
  </Column>
  <Column header="Cuenta depósito">
    <template #body="{ data }">
      {{ data.cuentaDeposito }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { computed, defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  dineros: propTypes.array
})

const totalRecords = computed(() => props.dineros.length ?? 0)

const paginator = computed(() => (props.dineros.length <= 10))
</script>
