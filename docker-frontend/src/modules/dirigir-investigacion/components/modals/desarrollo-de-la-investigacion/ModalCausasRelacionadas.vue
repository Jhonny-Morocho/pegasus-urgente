<template>
<div>
  <AppFieldset
    legend="Causas Relacionadas Guardadas"
  >
    <TablaCausasRelacionadasGuardadas
      :causas-relacionadas-guardadas="causasRelacionadasGuardadas"
      :loading="isLoadingTabla"
      read-only
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import { onMounted, defineProps, ref, computed } from 'vue'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useCausasRelacionadasStore } from '@/modules/global/composables'
import TablaCausasRelacionadasGuardadas from '../../resumen-causa/TablaCausasRelacionadasGuardadas.vue'

const props = defineProps({
  ruc: propTypes.string,
  idCausa: propTypes.string
})

const { causasRelacionadas, causasRelacionadas_getCausasRelacionadas, paginacion } = useCausasRelacionadasStore()

const isLoadingTabla = ref(false)

async function obtenerCausasRelacionadasGuardadas (pagination = undefined) {
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  await requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      idCausa: props.idCausa,
      params
    },
    loader: (l) => { isLoadingTabla.value = l }
  })
}

const causasRelacionadasGuardadas = computed(() => {
  let causas = []

  if (causasRelacionadas.value) {
    causas = causasRelacionadas.value.filter(c => c.ruc !== props.ruc)
  }

  return causas
})

onMounted(() => {
  obtenerCausasRelacionadasGuardadas()
})
</script>
