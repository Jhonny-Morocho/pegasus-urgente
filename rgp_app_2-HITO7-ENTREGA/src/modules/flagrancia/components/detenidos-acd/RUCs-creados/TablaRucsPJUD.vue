<template>
<div class="col-12">
  <AppDataTable
    id="tabla-delitos"
    class="col-12"
    :loading="isLoadingTable"
    :value="dataDelitos"
    v-bind="{ ...$attrs }"
  >
    <Column header="RUC">
      <template #body="{ data }">
        {{ data?.ruc }}
      </template>
    </Column>
    <Column header="CRR">
      <template #body="{ data }">
        {{ data?.CRR }}
      </template>
    </Column>
    <Column header="Enviado al PJUD">
      <template #body="{ data }">
        <i
          v-if="data?.enviadoPJUD"
          class="pi pi-check text-green-500 text-lg"
        />
        <i
          v-else
          class="pi pi-times text-red-500 text-lg"
        />
      </template>
    </Column>
    <Column header="Código de error">
      <template #body="{ data }">
        {{ data?.codigoError }}
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup></script>
