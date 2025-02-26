<template>
<AppFieldset legend="Direcciones y Contacto">
  <AppDataTable
    id="tabla-direcciones-historicas"
    v-model:selection="seleccionDireccion"
    class="w-full"
    :total-records="paginacion.elementosTotales"
    :value="direcciones"
  >
    <Column
      header="Seleccionar"
      selection-mode="single"
    />
    <Column header="Tipo Dirección">
      <template #body="{data}">
        {{ data?.idTipoDireccion }}
      </template>
    </Column>
    <Column header="Región">
      <template #body="{data}">
        {{ data?.region }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{data}">
        {{ data?.comuna }}
      </template>
    </Column>
    <Column header="Calle">
      <template #body="{data}">
        {{ data?.calle }}
      </template>
    </Column>
    <Column header="Número">
      <template #body="{data}">
        {{ data?.numeroCalle }}
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { useDireccionStore } from '@/modules/direccion/composables'

const {
  direcciones,
  paginacion
} = useDireccionStore()

const seleccionDireccion = ref(null)

function retrieveData (retrieve) {
  retrieve?.(seleccionDireccion.value)
}

defineExpose({ retrieveData })
</script>
