<template>
<section>
  <AppFieldset
    legend="Directriz de Investigación de Causa"
  >
    <AppDataTable
      class="col-12 w-full p-fluid"
      :loading="isLoadingDCausa"
      :rows="paginacionDCausa?.tamanoPagina"
      :total-records="paginacionDCausa?.elementosTotales"
      :value="directricesCausa"
      @page="getHistorialDirectrizCausa"
    >
      <Column header="Directriz de Investigación">
        <template #body="{ data }">
          {{ data?.descripcionDirectriz }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>

  <AppFieldset
    legend="Directriz de Investigación Relación"
  >
    <AppDataTable
      class="col-12"
      :loading="isLoadingDRelacion"
      :rows="paginacionDRelacion?.tamanoPagina"
      :total-records="paginacionDRelacion?.elementosTotales"
      :value="directricesRelaciones"
      @page="getHistorialDirectrizRelacion"
    >
      <Column header="Directriz de Investigación">
        <template #body="{ data }">
          {{ data?.descripcionDirectriz || 'N/A' }}
        </template>
      </Column>
      <Column header="Víctima">
        <template #body="{ data }">
          {{ data?.nombreVictima || 'N/A' }}
        </template>
      </Column>
      <Column header="Imputado">
        <template #body="{ data }">
          {{ data?.nombreImputado || 'N/A' }}
        </template>
      </Column>
      <Column header="Delito">
        <template #body="{ data }">
          {{ data?.nombreDelito || 'N/A' }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types.js'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables/useDirigirInvestigacionStore.js'
import { requestUtil } from '@/utils'

const props = defineProps({
  idCausa: propTypes.string
})

const directricesCausa = ref([])
const directricesRelaciones = ref([])

const isLoadingDCausa = ref(false)
const isLoadingDRelacion = ref(false)

const paginacionDCausa = ref({})
const paginacionDRelacion = ref({})

const {
  dirigirInvestigacion_getObtenerHistorialDirectrizCausa,
  dirigirInvestigacion_getObtenerHistorialDirectrizRelacion
} = useDirigirInvestigacionStore()

async function getHistorialDirectrizCausa (pagination = undefined) {
  requestUtil({
    action: dirigirInvestigacion_getObtenerHistorialDirectrizCausa,
    payload: {
      idCausa: props.idCausa,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    resolve: (_data) => {
      directricesCausa.value = _data?.data
      paginacionDCausa.value = _data?.paginacion
    },
    loader: (l) => (isLoadingDCausa.value = l)
  })
}
async function getHistorialDirectrizRelacion (pagination = undefined) {
  requestUtil({
    action: dirigirInvestigacion_getObtenerHistorialDirectrizRelacion,
    payload: {
      idCausa: props.idCausa,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    resolve: (_data) => {
      directricesRelaciones.value = _data?.data
      paginacionDRelacion.value = _data?.paginacion
    },
    loader: (l) => (isLoadingDRelacion.value = l)
  })
}

onMounted(async () => {
  await getHistorialDirectrizCausa()
  await getHistorialDirectrizRelacion()
})
</script>
