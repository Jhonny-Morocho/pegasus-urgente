<template>
<div class="p-fluid">
  <AppFieldset
    class="pb-3"
    legend="Lista de Diligencias Realizadas e Instruidas"
  >
    <AppInput
      id="input-filtro"
      v-model="diligencias.filtro"
      class="col-12 md:col-4 md:col-offset-8"
      label="Buscar Diligencias"
    />
    <TablaDiligencias
      id="diligencias-instruidas"
      v-model:first="diligencias.first"
      :loading="diligencias.isLoading"
      :rows="paginacionActividades?.tamanoPagina"
      :total-records="paginacionActividades?.elementosTotales"
      :value="actividadesFiltradas"
      @page="getDiligenciasInstruidas"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '../../composables'
import { useActividadStore, useMantenedorStore } from '@/modules/global/composables'
import TablaDiligencias from '@/modules/dirigir-investigacion/components/TablaDiligencias.vue'

const { includeWord } = appUtil

const { causa } = useDirigirInvestigacionStore()

const {
  actividades,
  paginacionActividades,
  actividad_getActividades
} = useActividadStore()

const {
  mantenedor_getInstituciones,
  mantenedor_getEstadosDiligencia,
  mantenedor_getPlazosDiligencia
} = useMantenedorStore()

const diligencias = reactive({
  isLoading: false,
  first: 0,
  filtro: null
})

function getDiligenciasInstruidas (pagination = undefined) {
  const idCausa = causa.value?.data?.causa.idCausa
  if (!idCausa) return

  if (!pagination) {
    diligencias.first = 0
  }

  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': idCausa,
        'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
        'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => { diligencias.isLoading = l },
    reject: (error) => {
      console.error(error)
    }
  })
}

const actividadesFiltradas = computed(() => {
  const filtro = actividades.value

  if (diligencias.filtro) {
    return filtro.filter(
      (actividad) =>
        includeWord(actividad.nombreSubTipoActividad, diligencias.filtro) ||
        includeWord(actividad.nombreSubSubTipoActividad, diligencias.filtro) ||
        includeWord(actividad.nombreUnidadEjecutora, diligencias.filtro) ||
        includeWord(actividad.nombreEstado, diligencias.filtro)
    )
  }

  return filtro
})

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getEstadosDiligencia })
  requestUtil({ action: mantenedor_getPlazosDiligencia })
}

onMounted(() => {
  getDataMantenedor()
  getDiligenciasInstruidas()
})
</script>
