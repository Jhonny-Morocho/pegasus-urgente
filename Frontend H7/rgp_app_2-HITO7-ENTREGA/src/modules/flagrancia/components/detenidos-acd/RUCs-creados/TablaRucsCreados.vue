<template>
<div class="col-12">
  <AppDataTable
    id="tabla-delitos"
    class="col-12"
    :loading="isLoadingTable"
    :value="dataDelitos"
    v-bind="{ ...$attrs }"
  >
    <Column header="Institución">
      <template #body="{ data }">
        {{ data?.institucion }}
      </template>
    </Column>
    <Column header="Folio">
      <template #body="{ data }">
        {{ data?.folio }}
      </template>
    </Column>
    <Column header="RUC">
      <template #body="{ data }">
        {{ data?.ruc }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{ data }">
        {{ data?.delito }}
      </template>
    </Column>
    <Column header="Detenidos">
      <template #body="{ data }">
        {{ data?.detenidos }}
      </template>
    </Column>
    <Column header="Fecha/Hora Creación RUC">
      <template #body="{ data }">
        {{ data?.fechaCreacion }}
      </template>
    </Column>
    <Column header="Fiscal Turno">
      <template #body="{ data }">
        {{ data?.fiscal }}
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup></script>
