<template>
<hr>
<div
  v-if="documento.isLoading"
  class="loaderWidth p-fluid h-full p-3"
>
  <LoaderSkeleton
    class="w-full"
    heigth="73vh"
  />
</div>
<div
  v-else
  class="p-fluid w-full h-full p-3"
>
  <iframe
    :src="documentoFormated"
    title="titulo"
  />
</div>
</template>

<script setup>
import { requestUtil } from '@/utils'
import { inject, onMounted, reactive, computed } from 'vue'
import { useDocumentoStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const dialogRef = inject('dialogRef')

const data = reactive({ ...dialogRef.value.data })
const options = reactive({ ...dialogRef.value.options })

const idDocumentoSolicitud = computed(() => removeCurlyBraces(data?.idDocumentoSolicitud))

const { documento_getDocumentoByIdDocumentoSolicitud } = useDocumentoStore()

const documento = reactive({
  isLoading: false,
  base64File: null
})

const documentoFormated = computed(() => `data:application/pdf;base64,${documento.base64File}`)

function getDocumento () {
  requestUtil({
    action: documento_getDocumentoByIdDocumentoSolicitud,
    payload: {
      idDocumentoSolicitud: idDocumentoSolicitud.value
    },
    loader: (l) => { documento.isLoading = l },
    resolve: ({ titulo, base64File }) => {
      options.props.header = titulo
      documento.base64File = base64File
    },
    reject: () => {
      options.props.header = 'Documento Solicitud'
    }
  })
}

function removeCurlyBraces (value) {
  return value?.replace('{', '').replace('}', '')
}

onMounted(() => {
  getDocumento()
})
</script>

<style scoped>
iframe {
  width: 90vw;
  height: 73vh
}

.loaderWidth{
  width: 90vw;
}
</style>
