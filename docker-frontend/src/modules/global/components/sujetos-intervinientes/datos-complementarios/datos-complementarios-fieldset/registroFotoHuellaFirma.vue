<template>
<AppFieldset legend="Foto/Huella/Firma">
  <h4 class="my-3">
    En esta sección debe adjuntar los siguientes 3 archivos en formato JPG o
    PNG: Fotografía Huella y Firma
  </h4>

  <SubirArchivoIncrustado
    ref="formularioFotoHuellaFirma"
    choose-label="Seleccionar Archivo"
    :data-archivos="fotoHuellaFirma"
    :is-loading="isLoading"
    :relacion-front="seccion.id"
    :tipos-archivo="'image/*'"
    @subir-archivo:adjuntar="adjuntarDocumento"
    @subir-archivo:eliminar="eliminarDocumento"
  />
</AppFieldset>
</template>

<script setup>
import { ref } from 'vue-demi'
import SubirArchivoIncrustado from '@/modules/global/components/documentos/SubirArchivoIncrustado.vue'
import { requestUtil } from '@/utils'
import { useConfirmDialog } from '@/modules/common/composables'
import {
  useDocumentoStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { launchConfirmDialog } = useConfirmDialog()
const { idCatalogo } = useIdentificacionDenunciaStore()
const {
  fotoHuellaFirma,
  documento_addDocumentoCDD,
  documento_deleteDocumentoCDD,
  documento_getDocumentoBySeccionCDD
} = useDocumentoStore()
const { seccionesFUD } = useMantenedorStore()
const seccion = seccionesFUD.value.find((x) => x.codigo === '5') // Código Firma => se debe cambiar descripcion del mantenedor a Foto/Huella/Firma
const isLoading = ref(false)
const formularioFotoHuellaFirma = ref()

function adjuntarDocumento (file) {
  requestUtil({
    action: documento_addDocumentoCDD,
    payload: file,
    resolve: () => {
      formularioFotoHuellaFirma.value.resetFormData()
      getDocumentosEnSeccion()
    }
  })
}

function eliminarDocumento (documento) {
  launchConfirmDialog({
    message: `¿Estás seguro de querer eliminar el documento ${documento.nombre}?`,
    accept: () => {
      requestUtil({
        action: documento_deleteDocumentoCDD,
        payload: { idDocumento: documento.id },
        resolve: () => {
          getDocumentosEnSeccion()
        },
        loader: (l) => {
          isLoading.value = l
        }
      })
    }
  })
}

function getDocumentosEnSeccion () {
  requestUtil({
    action: documento_getDocumentoBySeccionCDD,
    payload: {
      size: 10,
      page: 0,
      idCategoriaDocumento: seccion.id,
      idCatalogo: idCatalogo.value,
      categoria: 'Foto/Huella/Firma'
    },
    loader: (l) => {
      isLoading.value = l
    }
  })
  console.log(fotoHuellaFirma.value)
}

</script>
