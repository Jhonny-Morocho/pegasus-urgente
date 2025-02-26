<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Diligencias"
    no-margin-bottom
  >
    <TablaDiligencias
      id="diligencias-instruidas"
      v-model:first="diligencias.first"
      :loading="diligencias.isLoading"
      read-only
      :rows="paginacionActividades?.tamanoPagina"
      :total-records="paginacionActividades?.elementosTotales"
      :value="actividades"
      @page="getDiligenciasInstruidas"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { requestUtil } from '@/utils'
import { useActividadStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaDiligencias from '@/modules/dirigir-investigacion/components/TablaDiligencias.vue'

const { causa } = useDirigirInvestigacionStore()

const { actividad_getActividades, actividades, paginacionActividades } = useActividadStore()

const diligencias = reactive({
  isLoading: false,
  first: 0
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

onMounted(() => {
  getDiligenciasInstruidas()
})
</script>
