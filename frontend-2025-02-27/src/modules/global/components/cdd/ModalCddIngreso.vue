<template>
<AntecedentesCatalogo :data="catalogo" />
<AppFieldset
  class="fieldset"
  legend="Documentos contenidos en el catálogo"
>
  <TablaDocumentosContenidosEnCatalogo
    :loading="isLoadingTable"
    :origen-tabla="'agregar'"
    :rows="paginacionDocumentos?.tamanoPagina"
    :total-records="paginacionDocumentos?.elementosTotales"
    @page="getDocumentosfiltrados"
    @row-select="buscarBase64DocSeleccionado"
  />
</AppFieldset>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesCatalogo'
import TablaDocumentosContenidosEnCatalogo from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/TablaDocumentosContenidosEnCatalogo.vue'

import { requestUtil } from '@/utils'
import { useCreacionYGestionDeCDD } from '@/modules/catalogo-documental-digital/composables'
import { useAppToast } from '@/modules/common/composables'

const { documentos, creacionYGestionDeCDD_getDocumentoById, paginacionDocumentos, catalogo } = useCreacionYGestionDeCDD()
const { toastSuccess, toastError } = useAppToast()
const { creacionYGestionDeCDD_buscarCatalogoByNombre } = useCreacionYGestionDeCDD()

const documentoSeleccionado = ref([])
const refActualizarDocumento = ref(null)

const tablaDocumentos = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})

function getDocumentosfiltrados () {
  console.log('se filtro')
  requestUtil({
    action: creacionYGestionDeCDD_buscarCatalogoByNombre,
    payload: {
      payload: { nombreCatalogo: catalogo.value[0].nombreCatalogo },
      params: {
        search: tablaDocumentos?.filters?.buscador?.trim().length ? tablaDocumentos.filters.buscador : undefined,
        page: tablaDocumentos?.page || 0,
        size: tablaDocumentos?.rows || 10
      }
    },
    resolve: () => {
      toastSuccess('La busqueda se realizo con exito')
    },

    reject: () => {
      toastError(`La busqueda no se realizo con exito`)
    }
  })
}
onMounted(() => {
  if (documentos) {
    toastSuccess('Se encontró el catálogo exitosamente')
  }
})

function buscarBase64DocSeleccionado () {
  console.log('buscarBase64DocSeleccionado', documentoSeleccionado.value)

  requestUtil({
    action: creacionYGestionDeCDD_getDocumentoById,
    payload: { id: documentoSeleccionado.value.idFilenet },
    resolve: () => {
      refActualizarDocumento.value.populateForm(documentoSeleccionado.value)
    }
  })
}
</script>
