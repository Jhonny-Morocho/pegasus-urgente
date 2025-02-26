<template>
<AppDataTable
  class="col-12"
  v-bind="$attrs"
>
  <Column header="Fecha">
    <template #body="{ data }">
      {{ data?.fecha }}
    </template>
  </Column>
  <Column header="Tribunal">
    <template #body="{ data }">
      {{ data?.tribunal }}
    </template>
  </Column>
  <Column header="Sala">
    <template #body="{ data }">
      {{ data?.sala }}
    </template>
  </Column>
  <Column header="Tipo de Audiencia">
    <template #body="{ data }">
      {{ data?.tipoAudiencia }}
    </template>
  </Column>
  <Column header="Fiscal Litigador">
    <template #body="{ data }">
      {{ data?.fiscalLitigador }}
    </template>
  </Column>
  <Column
    v-if="estadoAudiencia"
    header="Estado"
  >
    <template #body="{ data }">
      {{ data?.estado }}
    </template>
  </Column>
  <Column header="Resultado">
    <template #body="{ data }">
      {{ data?.resultado }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import AppDataTable from '@/modules/common/components/AppDataTable.vue'
import defineProps from 'vue'

defineProps({
  estadoAudiencia: Boolean
})
</script>
