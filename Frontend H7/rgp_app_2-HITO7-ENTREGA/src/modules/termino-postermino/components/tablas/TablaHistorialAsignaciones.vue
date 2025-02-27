<template>
<AppDataTable
  id="tabla-historial"
  class="w-full"
  v-bind="$attrs"
>
  <template #body="{data}">
    {{ data.ruc }}
  </template>
  <Column header="Fiscal Asigando">
    <template #body="{data}">
      {{ data.fiscalAsignado }}
    </template>
  </Column>
  <Column header="Tipo Asignación">
    <template #body="{data}">
      {{ data.tipoAsignación }}
    </template>
  </Column>
  <Column header="Fiscalía Origen">
    <template #body="{data}">
      {{ data.fiscaliaOrigen }}
    </template>
  </Column>
  <Column header="Fiscalía Asignada">
    <template #body="{data}">
      {{ data.fiscaliaAsignada }}
    </template>
  </Column>
  <Column header="Fecha Asignación">
    <template #body="{data}">
      {{ data.fechaAsignacion }}
    </template>
  </Column>
  <Column header="Ultimo Fiscal">
    <template #body="{data}">
      {{ data.ultimoFiscal }}
    </template>
  </Column>
</AppDataTable>
</template>
