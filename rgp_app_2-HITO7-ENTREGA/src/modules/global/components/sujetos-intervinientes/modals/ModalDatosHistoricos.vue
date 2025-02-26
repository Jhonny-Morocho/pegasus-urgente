<template>
<div>
  <div
    v-if="data?.length == 0"
    class="flex justify-content-center py-4"
  >
    <i
      class="pi pi-exclamation-triangle mr-2"
      style="font-size: 2rem"
    />
    <p class="mt-2">
      No se encontraron Datos Históricos del Intervinientes
    </p>
  </div>
  <AppDataTable
    v-else
    id="dataTableDatoshistoricos"
    ref="dt"
    v-bind="$attrs"
    class="mt-5 col-12"
    filter-display="menu"
    :value="data"
  >
    <Column
      field="direccion"
      header="Dirección"
      sortable
    >
      <template #body="slotProps">
        {{ slotProps.data.calle + " " + slotProps.data.numeroCalle || "N/A" }}
      </template>
    </Column>
    <Column
      field="telefono"
      header="Teléfono"
      sortable
    >
      <template #body="slotProps">
        {{ slotProps.data.telefonoCelular || "N/A" }}
      </template>
    </Column>
    <Column
      field="correo"
      header="Correo Electronico"
      sortable
    >
      <template #body="slotProps">
        {{ slotProps.data.mail || "N/A" }}
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
