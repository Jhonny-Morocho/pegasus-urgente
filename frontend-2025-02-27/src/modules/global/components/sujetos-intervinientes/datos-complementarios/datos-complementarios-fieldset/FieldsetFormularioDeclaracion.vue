<template>
<AppFieldset
  class="col-12"
  legend="Relatar o Adjuntar Declaración"
  :toggleable="true"
>
  <div class="col-12 mb-2">
    <h4 class="mb-2 mt-0">
      Declaración
    </h4>
    <AppTextarea
      id="declaracion"
      v-model="form.declaracion"
      cols="50"
      label="Escriba la declaración"
      rows="3"
      :rules="{ required }"
    />
  </div>
  <SubirArchivoIncrustado
    ref="sujetoIntervinienteDeclaracion"
    choose-label="Seleccionar Archivo o Video"
    :data-archivos="declaraciones"
    :is-loading="isLoading"
    :read-only="form.readonly"
    :relacion-front="seccion.id"
    :tipos-archivo="'image/*, video/mp4, application/*'"
    @subir-archivo:adjuntar="adjuntarDocumento"
    @subir-archivo:eliminar="eliminarDocumento"
  />
</AppFieldset>
</template>

<script setup>
import { ref } from 'vue'
import { requestUtil } from '@/utils'
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import {
  useSujetosIntervinientesInject,
  useDocumentoStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { required } = useFormValidation()

const { toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const {
  declaraciones,
  documento_deleteDocumentoCDD,
  documento_addDocumentoCDD,
  documento_getDocumentoBySeccionCDD
} = useDocumentoStore()

const { idCatalogo } = useIdentificacionDenunciaStore()
const { seccionesFUD } = useMantenedorStore()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const form = sujetosIntervinientesInject
const seccion = seccionesFUD.value.find((x) => x.codigo === '8')
const sujetoIntervinienteDeclaracion = ref()

function adjuntarDocumento (documento) {
  requestUtil({
    action: documento_addDocumentoCDD,
    payload: documento,
    resolve: () => {
      sujetoIntervinienteDeclaracion.value.resetFormData()
      toastSuccess('Documento Adjuntado')
    }
  })
  getDocumentosEnSeccion()
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
      categoria: seccion.descripcion
    },
    loader: (l) => {
      isLoading.value = l
    }
  })
  console.log(seccionesFUD.value[8].descripcion)
  console.log(declaraciones.value)
}
const isLoading = ref(false)
</script>
