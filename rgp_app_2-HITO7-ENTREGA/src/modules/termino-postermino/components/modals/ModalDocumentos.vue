<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Documentos"
    no-margin-bottom
  >
    <TablaDocumentosFlujoPreclasificador
      v-model:first="firstRecord"
      class="col-12"
      :dirige-investigacion="true"
      :loading="isLoading"
      read-only
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="documentos"
      @page="getDocumentos"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import TablaDocumentosFlujoPreclasificador from '@/modules/global/components/documentos/TablaDocumentosFlujoPreclasificador.vue'
import { useDocumentoStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useTermino } from '../../composables'

const { idDenuncia } = useTermino()

const { documentos, paginacion, documento_getDocumentosByIdDenuncia } = useDocumentoStore()

const isLoading = ref(false)
const firstRecord = ref(0)

async function getDocumentos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        page: pagination?.page,
        size: pagination?.rows || 5
      }
    }
  })
}

onMounted(async () => {
  getDocumentos()
})
</script>
