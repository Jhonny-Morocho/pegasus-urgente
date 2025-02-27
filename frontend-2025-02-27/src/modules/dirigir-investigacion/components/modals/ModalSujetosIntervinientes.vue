<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Sujetos/Intervinientes"
    no-margin-bottom
  >
    <TablaSujetos
      v-model:first="sujetos.firstRecord"
      class="w-full"
      :loading="sujetos.isLoading"
      read-only
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="sujetosIntervinientes"
      @page="getSujetos"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { requestUtil } from '@/utils'
import { useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaSujetos from '@/modules/dirigir-investigacion/components/TablaSujetos.vue'

const sujetos = reactive({
  firstRecord: 0,
  isLoading: false
})

const { idDenuncia } = useDirigirInvestigacionStore()

const {
  paginacion,
  sujetosIntervinientes,
  sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()

async function getSujetos (pagination = undefined) {
  if (!pagination) {
    sujetos.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  await requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (sujetos.isLoading = l)
  })
}

onMounted(() => {
  getSujetos()
})
</script>
