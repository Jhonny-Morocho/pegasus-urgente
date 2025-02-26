<template>
<div v-if="false">
  <LoaderSkeleton height="30vh" />
</div>
<AppFieldset
  v-else
  legend="Lista de Delitos"
>
  <TablaDelitos
    v-model:first="delitosPag.firstRecord"
    :data-delitos="delitos"
    :loading="delitosPag.isLoadingTable"
    :read-only="isCollapsed"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    @page="getDelitos"
    @tabla-delito:eliminar="eliminarDelito"
    @tabla-delito:modificar="setModoEdicion"
    @tabla-delito:ver-mas="setModoLectura"
  />
</AppFieldset>

<FormDelitos
  :editando="editando"
  :form-submitted="formSubmitted"
  :is-collapsed="isCollapsed"
  :loading-button="delitosPag"
  :loading-docs="tablaDocumentos.isLoading"
  :read-only="modoLectura"
  :seccion-denuncia="seccionDenuncia"
  :seccion-video="seccionVideo"
  :validation-scope="delitoValidationScope"
  @cancelar-edicion="toggleFormularioDelito"
  @emit-adjuntar="adjuntarDocumento"
  @emit-agregar="handleSubmitForm"
  @emit-boton-agregar="toggleFormularioDelito"
  @emit-eliminar="eliminarDocumento"
  @emit-reset="resetFormData"
/>
</template>
<script setup>
import { onMounted, provide, reactive, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import {
  useMantenedorStore,
  useDelitoStore,
  useDelitoProvide,
  useDocumentoStore
} from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

import { generateDelitoContract, populateDelito } from '@/modules/global/contracts'
import { useCausaAsignacionStore, useFlujoPamAsignacion } from '@/modules/asignacion/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import FormDelitos from '@/modules/global/components/forms/FormDelitos.vue'

const { launchConfirmDialog } = useConfirmDialog()

const {
  toastSuccess,
  toastWarning,
  toastError,
  TOAST_MESSAGES
} = useAppToast()

const { delitoValidationScope, formData } = useDelitoProvide()

provide(delitoValidationScope, formData)

const { formSubmitted, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: delitoValidationScope
})

const {
  seccionesFUD, mantenedor_getCategoriasDocumento,
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito, mantenedor_getComunas
} = useMantenedorStore()

const { idCatalogo } = useIdentificacionDenunciaStore()
const { idDenuncia } = useCausaAsignacionStore()
const { flujoAsignacion } = useFlujoPamAsignacion()

const {
  delitos,
  paginacion,
  mediosTransporte,
  delito_addDelito,
  delito_updateDelito,
  delito_deleteDelito,
  delito_getDelitoByIdDenuncia,
  delito_getDelitoByIdDetalleHechoDelictual,
  delito_RESET_MEDIOSTRANSPORTE,
  delito_SET_MEDIOSTRANSPORTE
} = useDelitoStore()

const {
  videosDelitos,
  formulariosDenuncia,
  documento_addDocumentoCDD,
  documento_deleteDocumentoCDD,
  documento_SET_DEFAULT_STATE,
  documento_getDocumentoBySeccionCDD,
  documento_asociarIdPropietarioDocumentoCDD
} = useDocumentoStore()

const tablaDocumentos = reactive({
  isLoading: false,
  firstRecord: 0
})
const delitosPag = reactive({
  isLoadingTable: false,
  isLoading: false,
  firstRecord: 0
})
const isCollapsed = ref(false)
const editando = ref(false)
const modoLectura = ref(false)
const bodyRequest = ref([])
const seccionVideo = seccionesFUD.value.find((x) => x.codigo === '13') // MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 13: DELITO VIDEO
const seccionDenuncia = seccionesFUD.value.find((x) => x.codigo === '10')// MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 10: FORMULARIO DENUNCIA

async function getDataMantenedor () {
  await requestUtil({ action: mantenedor_getFamiliasDelito })
  await requestUtil({ action: mantenedor_getTiposDelito })
  await requestUtil({ action: mantenedor_getComunas })
  await requestUtil({ action: mantenedor_getCategoriasDocumento })
}

getDataMantenedor()
async function getDelitos (pagination = undefined) {
  if (!pagination) {
    delitosPag.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (delitosPag.isLoadingTable = l)
  })
}

onMounted(async () => {
  getDelitos()
  getDocumentosEnSeccion()
})

function toggleFormularioDelito () {
  isCollapsed.value = !isCollapsed.value
  cancelarEdicion()
}

async function setModoLectura (delito) {
  console.log('Delito MODO LECTURA: ', delito)
  requestUtil({
    action: delito_getDelitoByIdDetalleHechoDelictual,
    payload: {
      idDetalleHechoDelictual: delito.idDetalleHechoDelictual
    },
    resolve: (response) => {
      isCollapsed.value = true
      modoLectura.value = true
      populateDelito(response, formData)
      delito_SET_MEDIOSTRANSPORTE(response.mediosTransportes || [])
    },
    reject: (e) => console.log(e)
  })
}

async function setModoEdicion (delito) {
  requestUtil({
    action: delito_getDelitoByIdDetalleHechoDelictual,
    payload: {
      idDetalleHechoDelictual: delito.idDetalleHechoDelictual
    },
    resolve: (response) => {
      isCollapsed.value = true
      editando.value = true
      populateDelito(response, formData)
      delito_SET_MEDIOSTRANSPORTE(response.mediosTransportes || [])
    },
    reject: (e) => console.log(e)
  })
}

function cancelarEdicion () {
  editando.value = false
  modoLectura.value = false
  resetFormData()
  delito_RESET_MEDIOSTRANSPORTE()
}

async function agregarDelito () {
  const payload = generateDelitoContract({
    ...formData,
    idDenuncia: idDenuncia.value,
    mediosTransporte: mediosTransporte.value
  })

  requestUtil({
    action: delito_addDelito,
    payload: payload,
    resolve: async (r) => {
      addDocumentosDelito(r)
      toastSuccess('Delito agregado correctamente')
      flujoAsignacion.requiereCambiarTipificacion = true
      cancelarEdicion()
      isCollapsed.value = false
      documento_SET_DEFAULT_STATE('delito')
      getDelitos()
    },
    loader: (l) => (delitosPag.isLoadingTable = l),
    reject: (r) => {
      console.log('error: ', r)
      toastError('Ocurrió un error inesperado')
    }
  })
}

function modificarDelito () {
  const delito = generateDelitoContract({
    ...formData,
    mediosTransporte: mediosTransporte.value
  })

  launchConfirmDialog({
    message: '¿Estás seguro de modificar el Delito?',
    accept: async () => {
      requestUtil({
        action: delito_updateDelito,
        payload: delito,
        resolve: async () => {
          toastSuccess('Delito modificado correctamente')
          flujoAsignacion.requiereCambiarTipificacion = true
          toggleFormularioDelito()
          getDelitos()
        },
        reject: (r) => {
          console.log('error: ', r)
          toastError('Ocurrió un error inesperado')
        }
      })
    }
  })
}

async function handleSubmitForm () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (!editando.value) {
    agregarDelito()
  } else {
    modificarDelito()
  }
}

async function eliminarDelito (delito) {
  launchConfirmDialog({
    message: '¿Estás seguro de eliminar el Delito?',
    accept: async () => {
      requestUtil({
        action: delito_deleteDelito,
        payload: {
          idDetalleHechoDelictual: delito.idDetalleHechoDelictual
        },
        resolve: async () => {
          toastWarning('Delito Eliminado')
          flujoAsignacion.requiereCambiarTipificacion = true
          getDelitos()
        },
        reject: (r) => {
          console.log('error: ', r)
          toastError('Ocurrió un error inesperado')
        }
      })
    }
  })
}

// CDD
function addDocumentosDelito (idDelito) {
  if (videosDelitos.value.data) {
    asociarDocumentosADelito(videosDelitos.value.data, idDelito)
  }
  if (formulariosDenuncia.value.data) {
    asociarDocumentosADelito(formulariosDenuncia.value.data, idDelito)
  }
  requestUtil({
    action: documento_asociarIdPropietarioDocumentoCDD,
    payload: { request: bodyRequest.value }
  })
}

function adjuntarDocumento (documento, resetFunc) {
  requestUtil({
    action: documento_addDocumentoCDD,
    payload: documento,
    resolve: () => {
      resetFunc()
      toastSuccess('Documento Adjuntado')
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
          toastWarning('Documento Eliminado')
          getDocumentosEnSeccion()
        },
        loader: (l) => {
          tablaDocumentos.isLoading = l
        }
      })
    }
  })
}

function asociarDocumentosADelito (documentos, idDelito) {
  if (documentos) {
    documentos.forEach((d) => {
      const doc = {
        id: d.id,
        idPropietario: idDelito
      }
      bodyRequest.value.push(doc)
    })
  }
}

function getDocumentosEnSeccion (pagination = undefined) {
  if (!idCatalogo.value) {
    console.log('Sin idCatalogo')
    return
  }

  if (!pagination) {
    tablaDocumentos.firstRecord = 0
  }
  const catalogoId = idCatalogo.value.replace('{', '').replace('}', '')

  requestUtil({
    action: documento_getDocumentoBySeccionCDD,
    payload: {
      size: 10,
      page: 0,
      idCategoriaDocumento: seccionVideo.id,
      idCatalogo: catalogoId,
      categoria: seccionVideo?.descripcion
    },
    loader: (l) => {
      tablaDocumentos.isLoading = l
    }
  })
  requestUtil({
    action: documento_getDocumentoBySeccionCDD,
    payload: {
      size: 10,
      page: 0,
      idCategoriaDocumento: seccionDenuncia.id,
      idCatalogo: catalogoId,
      categoria: seccionDenuncia.descripcion
    },
    loader: (l) => {
      tablaDocumentos.isLoading = l
    }
  })
}
</script>
