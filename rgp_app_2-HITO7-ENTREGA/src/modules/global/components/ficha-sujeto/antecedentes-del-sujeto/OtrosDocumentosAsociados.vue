<template>
<AppDataTable
  id="otros-documentos-asociados"
  class="col-12"
  :value="tablaFormalizacion"
>
  <Column
    field="numeroDocumento"
    header="Número documento"
  >
    <template #body="slotProps">
      {{ slotProps.data.numeroDocumento }}
    </template>
  </Column>
  <Column
    field="tipoDocumento"
    header="Tipo documento"
  >
    <template #body="slotProps">
      {{ slotProps.data.tipoDocumento }}
    </template>
  </Column>
  <Column
    field="serie"
    header="Serie"
  >
    <template #body="slotProps">
      {{ slotProps.data.nroSerie }}
    </template>
  </Column>
  <Column
    field="nacionalidad"
    header="Nacionalidad"
  >
    <template #body="slotProps">
      {{ slotProps.data.nacionalidad }}
    </template>
  </Column>
  <Column
    field="tipoVisa"
    header="Tipo visa"
  >
    <template #body="slotProps">
      {{ slotProps.data.tipoVisa }}
    </template>
  </Column>
  <Column
    field="fechaVencimiento"
    header="Fecha vencimiento"
  >
    <template #body="slotProps">
      {{ slotProps.data.fechaVencimiento }}
    </template>
  </Column>
</AppDataTable>
</template>
