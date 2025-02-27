<template>
<AppDataTable
  class="col-12"
  v-bind="$attrs"
>
  <Column header="Actividad">
    <template #body="{ data }">
      {{ data?.actividad }}
    </template>
  </Column>
  <Column header="Fecha Actividad">
    <template #body="{ data }">
      {{ data?.actividad }}
    </template>
  </Column>
  <Column header="Etapa">
    <template #body="{ data }">
      {{ data?.etapa }}
    </template>
  </Column>
  <Column header="Origen">
    <template #body="{ data }">
      {{ data?.tipoAudiencia }}
    </template>
  </Column>
  <Column header="Autor o Ejecutor">
    <template #body="{ data }">
      {{ data?.fiscalLitigador }}
    </template>
  </Column>
  <Column header="Rol">
    <template #body="{ data }">
      {{ data?.rol }}
    </template>
  </Column>
  <Column header="Documento">
    <template #body="{}">
      <i class="pi pi-file" />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import AppDataTable from '@/modules/common/components/AppDataTable.vue'
</script>
