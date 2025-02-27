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
      :total-records="documentos.length"
      :value="documentos"
      @page="getDocumentos"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useDocumentoStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaDocumentosFlujoPreclasificador from '@/modules/global/components/documentos/TablaDocumentosFlujoPreclasificador.vue'

const { idDenuncia, ruc } = useDirigirInvestigacionStore()

const {
  documentos,
  paginacion,
  documento_getDocumentosByIdDenuncia
} = useDocumentoStore()

const isLoading = ref(false)
const firstRecord = ref(0)

async function getDocumentos () {
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: {
      ruc: ruc.value,
      idDenuncia: idDenuncia.value
    }
  })
}

onMounted(async () => {
  getDocumentos()
})
</script>
