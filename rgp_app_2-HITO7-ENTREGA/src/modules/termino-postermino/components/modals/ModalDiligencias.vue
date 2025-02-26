<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Diligencias"
    no-margin-bottom
  >
    <TablaDiligencias
      v-model:first="firstRecord"
      read-only
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="diligenciasInstruidas"
      @page="getDiligenciasInstruidas"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useDiligenciaStore } from '@/modules/global/composables'
import TablaDiligencias from '@/modules/dirigir-investigacion/components/TablaDiligencias.vue'

const props = defineProps({
  ruc: propTypes.string
})

const {
  diligenciasInstruidas,
  paginacion,
  diligencia_getDiligenciasInstruidas
} = useDiligenciaStore()

const firstRecord = ref(0)

async function getDiligenciasInstruidas (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  requestUtil({
    action: diligencia_getDiligenciasInstruidas,
    payload: {
      ruc: props?.ruc,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    reject: (e) => {
      console.error(e.message)
    }
  })
}

onMounted(async () => {
  getDiligenciasInstruidas()
})
</script>
