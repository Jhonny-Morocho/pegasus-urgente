<template>
<div>
  <AppFieldset
    legend="Medidas de Protección"
  >
    <AppDataTable
      class="col-12"
      :value="medidasDeProteccion"
    >
      <Column header="Medida de Protección">
        <template #body="{ data }">
          {{ data.medidasProteccion }}
        </template>
      </Column>
      <Column header="Vigencia">
        <template #body="{ data }">
          {{ data.vigencia }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</div>
</template>

<script setup>

const medidasDeProteccion = [
  {
    medidasProteccion: 'Contacto telefónico prioritario con la victima',
    vigencia: '23-11-2019 al 24-12-2019'
  },
  {
    medidasProteccion: 'Rondas Periódicas de Carabineros',
    vigencia: '23-11-2018 al 24-12-2018'
  }
]

</script>
