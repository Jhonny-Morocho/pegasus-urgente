<template>
<div class="p-fluid">
  <AppFieldset
    class="pb-3"
    legend="Lista de Diligencias Realizadas e Instruidas"
  >
    <AppInput
      id="input-filtro"
      v-model="inputFiltro"
      class="col-12 md:col-4 md:col-offset-8"
      label="Buscar Diligencias"
    />
    <TablaDiligencias
      :total-records="diligenciasInstruidas.length"
      :value="filtroDiligencias"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { requestUtil, appUtil } from '@/utils'
import { useDiligenciaStore, useMantenedorStore, usePamStore } from '@/modules/global/composables'
import TablaDiligencias from '@/modules/dirigir-investigacion/components/TablaDiligencias.vue'
const inputFiltro = ref('')

const { includeWord } = appUtil

const { diligenciasInstruidas, stepDiligenciasEInstrucciones_getDiligenciasPorIdProcedimiento } = useDiligenciaStore()

const { procesoPam } = usePamStore()

const { mantenedor_getAllSubTiposDiligencias, mantenedor_getFamiliaEspecies, mantenedor_getTiposEspecies, mantenedor_getAmbitoEspecie, mantenedor_getInstituciones, mantenedor_getTiposDiligencias } = useMantenedorStore()

const isLoading = ref(false)

function getDiligenciasInstruidas () {
  const payload = procesoPam.value?.taskId

  if (!payload) return

  requestUtil({
    action: stepDiligenciasEInstrucciones_getDiligenciasPorIdProcedimiento,
    payload: { idProcedimiento: payload },
    loader: (l) => (isLoading.value = l),
    reject: (e) => {
      console.error(e.message)
    }
  })
}
async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getAllSubTiposDiligencias })
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getTiposEspecies })
  requestUtil({ action: mantenedor_getAmbitoEspecie })
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getTiposDiligencias })
}

const filtroDiligencias = computed(() => {
  const diligencias = diligenciasInstruidas.value

  if (inputFiltro.value) {
    return diligencias?.filter(
      (diligencia) =>
        includeWord(diligencia.observacionDiligencia, inputFiltro.value) ||
        includeWord(diligencia.institucionEjecutora, inputFiltro.value) ||
        includeWord(diligencia.estado, inputFiltro.value) ||
        includeWord(diligencia.diligenciaInstruccion, inputFiltro.value) ||
        includeWord(diligencia.subtipoDiligencia, inputFiltro.value) ||
        includeWord(diligencia.tipoDiligencia, inputFiltro.value)
    )
  }
  return diligencias
})

onMounted(async () => {
  getDiligenciasInstruidas()
  getDataMantenedor()
})
</script>
