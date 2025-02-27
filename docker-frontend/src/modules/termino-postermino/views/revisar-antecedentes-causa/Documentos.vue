<template>
<div class="p-fluid">
  <AppFieldset legend="Lista de Documentos">
    <div
      v-if="loaderDocumentos"
      class="col-12"
    >
      <LoaderSkeleton />
    </div>
    <TablaDocumentos
      v-else
      class="col-12"
      :dirige-investigacion="true"
      :value="documentos"
      @ver-documento="verDocumento"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import { useDocumentoStore, useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'
import TablaDocumentos from '@/modules/dirigir-investigacion/components/TablaDocumentos.vue'
import { useTermino } from '../../composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const { launchDialog } = useAppDialog()

const { documentos, documento_getDocumentosByIdDenuncia } = useDocumentoStore()

const { idDenuncia } = useTermino()

const { mantenedor_getTiposAntecedentes, mantenedor_getTiposOrigenAntecedentes } = useMantenedorStore()

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposAntecedentes })
  requestUtil({ action: mantenedor_getTiposOrigenAntecedentes })
}

/** Obtener documentos asociados a un ruc */
const loaderDocumentos = ref(false)
async function getDocumentosEnCausa () {
  loaderDocumentos.value = true
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value
    },
    resolve: (r) => { loaderDocumentos.value = false }
  })
}

function verDocumento () {
  launchDialog({
    component: ModalVerDocumento,
    header: `Informe Alcoholemia`,
    width: '90%'
  })
}

onMounted(async () => {
  getDocumentosEnCausa()
  getDataMantenedor()
})
</script>
