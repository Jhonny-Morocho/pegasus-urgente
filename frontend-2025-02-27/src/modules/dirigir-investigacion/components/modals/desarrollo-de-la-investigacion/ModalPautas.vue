<template>
<div>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Pautas"
    no-margin-bottom
  >
    <AppDataTable
      class="col-12"
      :value="pautas"
    >
      <Column header="Pauta">
        <template #body="{ data }">
          {{ data.pauta }}
        </template>
      </Column>
      <Column header="Fecha de Registro">
        <template #body="{ data }">
          {{ data.fechaRegistro }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</div>
</template>

<script setup>

const pautas = [
  {
    pauta: 'Pauta Det. Necesidades',
    fechaRegistro: '13-06-2021'
  },
  {
    pauta: 'Pauta de Intimidación',
    fechaRegistro: '13-06-2021'
  }
]

</script>
