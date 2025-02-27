<template>
<section>
  <AppFieldset
    :legend="candidata?.delitos.length > 1 ? 'Direcciones Delitos' : 'Dirección Delito'"
  >
    <AppDataTable
      v-if="candidata?.delitos"
      class="w-full"
      responsive-layout="scroll"
      :total-records="candidata.delitos.length"
      :value="candidata.delitos"
    >
      <Column
        header="Delito"
      >
        <template #body="{ data }">
          {{ mantenedor_getNombreTipoDelito(data.idTipoDelito) ?? 'Sin Información' }}
        </template>
      </Column>

      <Column
        header="Región"
      >
        <template #body="{ data }">
          {{ data.region ?? 'Sin Información' }}
        </template>
      </Column>
      <Column
        header="Comuna"
      >
        <template #body="{ data }">
          {{ data.comuna ?? 'Sin Información' }}
        </template>
      </Column>
      <Column
        header="Calle"
      >
        <template #body="{ data }">
          {{ data.calle ?? 'Sin Información' }}
        </template>
      </Column>
      <Column
        header="Número"
      >
        <template #body="{ data }">
          {{ data.numeroCalle ?? 'Sin Información' }}
        </template>
      </Column>
    </AppDataTable>
    <p v-else>
      Sin información
    </p>
  </AppFieldset>
  <AppFieldset
    legend="Relato"
  >
    <p class="mx-2">
      {{ descripcionRelato ?? 'Sin Información' }}
    </p>
  </AppFieldset>
</section>
</template>

<script setup>
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps, ref, watchEffect } from 'vue'
const {
  mantenedor_getNombreTipoDelito
} = useMantenedorStore()

const props = defineProps({
  candidata: {
    type: Object,
    default: () => null
  }
})

// evitando el v-html
const sinTagFinal = ref('')
const descripcionRelato = ref('')
watchEffect(() => {
  sinTagFinal.value = props.candidata?.relato ? props.candidata?.relato.replace('</p>', '') : null
  descripcionRelato.value = sinTagFinal.value ? sinTagFinal.value?.replace('<p>', '') : null
})

</script>
