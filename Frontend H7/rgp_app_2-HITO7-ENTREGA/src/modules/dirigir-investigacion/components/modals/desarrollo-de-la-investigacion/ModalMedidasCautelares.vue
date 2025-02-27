<template>
<div>
  <AppFieldset
    legend="Medidas Cautelares"
  >
    <AppDataTable
      class="col-12"
      :value="medidasCautelares"
    >
      <Column
        header="Medida Cautelar"
      >
        <template #body="{ data }">
          {{ data.medidaCautelar }}
        </template>
      </Column>
      <Column header="Imputado">
        <template #body="{ data }">
          {{ data.imputado }}
        </template>
      </Column>
      <Column header="Delito">
        <template #body="{ data }">
          {{ data.delito }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</div>
</template>

<script setup>

const medidasCautelares = [
  {
    medidaCautelar: 'Arraigo Nacional',
    imputado: 'Jaime Carrasco Tapia',
    delito: '847 - Hurto Simple por un valor de 4 a 40 UTM'
  }
]

</script>
