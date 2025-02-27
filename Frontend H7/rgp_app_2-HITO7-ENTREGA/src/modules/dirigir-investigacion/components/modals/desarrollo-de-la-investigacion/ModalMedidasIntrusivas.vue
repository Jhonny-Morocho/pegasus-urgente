<template>
<div>
  <AppFieldset
    legend="Medidas Intrusivas"
  >
    <AppDataTable
      class="col-12"
      :value="medidasIntrusivas"
    >
      <Column header="Medida Intrusiva">
        <template #body="{ data }">
          {{ data.medidasProteccion }}
        </template>
      </Column>
      <Column header="Imputado">
        <template #body="{ data }">
          {{ data.vigencia }}
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

const medidasIntrusivas = [
  {
    medidasProteccion: 'Entrada y registro en lugares cerrados',
    vigencia: 'Jaime Carrasco Tapia',
    delito: '847 - Hurto Simple por un valor de 4 a 40 UTM'
  }
]

</script>
