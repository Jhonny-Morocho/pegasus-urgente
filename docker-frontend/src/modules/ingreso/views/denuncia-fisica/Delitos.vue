<template>
<LoaderSkeleton v-if="delitosPag.isloadingPage" />
<section v-show="!delitosPag.isloadingPage">
  <div class="p-fluid">
    <AppFieldset legend="Delitos Registrados">
      <TablaDelitos
        v-model:first="delitosPag.firstRecord"
        v-model:isLoadingTable="delitosPag.isLoadingTable"
        :data-delitos="delitos"
        :list-value="delitos"
        :loading="delitosPag.isLoadingTable"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        @page="getDelitos"
        @tabla-delito:eliminar="eliminarDelito"
        @tabla-delito:modificar="setModoEdicion"
      />
    </AppFieldset>
  </div>
  <FormDelitos
    :editando="editando"
    :form-submitted="formSubmitted"
    :is-collapsed="isCollapsed"
    :loading-button="delitosPag"
    :loading-docs="tablaDocumentos.isLoading"
    :seccion-denuncia="seccionDenuncia"
    :seccion-video="seccionVideo"
    :validation-scope="delitoValidationScope"
    @cancelar-edicion="cancelarEdicion"
    @emit-adjuntar="adjuntarDocumento"
    @emit-agregar="guardarDelito"
    @emit-boton-agregar="botonAgregarDelito"
    @emit-eliminar="eliminarDocumento"
    @emit-reset="resetFormData"
  />
  <AppBtnNextTeleported
    :disabled="isCollapsed"
    label="Relaciones"
    :loading="delitosPag.loadingStepRelaciones"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { defineEmits, onMounted, provide, reactive, ref, nextTick, computed } from 'vue'
// components
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import FormDelitos from '@/modules/global/components/forms/FormDelitos.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

// composables
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useDelitoProvide } from '@/modules/global/composables/useDelito'
import {
  useDelitoStore,
  useDocumentoStore,
  useMantenedorStore,
  usePamStore
} from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

// utils
import { appUtil, requestUtil } from '@/utils'
import {
  generateDelitoContract,
  populateDelito
} from '@/modules/global/contracts'

const {
  seccionesFUD,
  mantenedor_getCategoriasDocumento,
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito
} = useMantenedorStore()

const { toastError, toastSuccess, toastWarning, TOAST_MESSAGES } =
  useAppToast()

const { launchConfirmDialog } = useConfirmDialog()

const {
  delitos,
  delito_crearDenuncia,
  delito_addDelito,
  delito_updateDelito,
  paginacion,
  mediosTransporte,
  delito_deleteDelito,
  delito_SET_MEDIOSTRANSPORTE,
  delito_RESET_MEDIOSTRANSPORTE,
  delito_getDelitoByIdDenuncia,
  delito_getDelitoByIdDetalleHechoDelictual
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

const { idCatalogo } = useIdentificacionDenunciaStore()
const { procesoPam } = usePamStore()

// Composable delito (useDelito)
const { formData, delitoValidationScope } = useDelitoProvide()

// Validacion
const { isFormValid, formSubmitted, resetFormData } = useFormValidation({
  formData,
  validationScope: delitoValidationScope
})

// Provide
provide(delitoValidationScope, formData)

// states
const delitosPag = reactive({
  isloadingPage: false,
  isLoadingTable: false,
  isLoadingBoton: false,
  isLoadingStepRelaciones: false,
  isLoadingDoc: false,
  firstRecord: 0
})
const tablaDocumentos = reactive({
  isLoading: false,
  firstRecord: 0
})
const isCollapsed = ref(false)
const editando = ref(false)
const bodyRequest = ref([])
const seccionVideo = seccionesFUD.value.find((x) => x.codigo === '13') // MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 13: DELITO VIDEO
const seccionDenuncia = seccionesFUD.value.find((x) => x.codigo === '10')// MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 10: FORMULARIO DENUNCIA

const existeDelitoIncompleto = computed(() => delitos.value.filter((delito) => delito.estaCompleto === false))

const emit = defineEmits(['next-step'])

onMounted(() => {
  delitosPag.isloadingPage = true
  getDelitos()
})

async function getTiposFamiliasDelito () {
  await requestUtil({
    action: mantenedor_getFamiliasDelito
  })
  await requestUtil({
    action: mantenedor_getTiposDelito
  })
  await requestUtil({
    action: mantenedor_getCategoriasDocumento
  })
}

getTiposFamiliasDelito()

function completarDelito () {
  if (existeDelitoIncompleto.value.length) {
    const delito = existeDelitoIncompleto.value[0]
    launchConfirmDialog({
      header: 'Datos del delito incompletos',
      message: `La información del delito debe ser completada para poder avanzar`,
      acceptLabel: 'Completar',
      accept: () => {
        setModoEdicion(delito)
      }
    })
  }
}

function getDelitos (pagination = undefined) {
  delitosPag.isLoadingTable = true
  if (!pagination) {
    delitosPag.firstRecord = 0
  }

  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    resolve: ({ data }) => {
      if (data.length > 0) {
        completarDelito()
      }
    },
    loader: (l) => {
      if (delitosPag.isloadingPage === true) delitosPag.isloadingPage = l
      handleLoading()
    }
  })
}

function botonAgregarDelito () {
  documento_SET_DEFAULT_STATE()
  if (isCollapsed.value) resetFormData()
  isCollapsed.value = !isCollapsed.value
}

function guardarDelito () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  if (!editando.value) {
    const payload = generateDelitoContract({
      ...formData,
      idDenuncia: procesoPam.value.idDenuncia,
      mediosTransporte: mediosTransporte.value
    })
    payload.idProcedimiento = null
    requestUtil({
      action: delito_crearDenuncia,
      payload: payload,
      resolve: (res) => {
        payload.idDenuncia = procesoPam.value.idDenuncia
        payload.numeroDenuncia = res?.numeroDenuncia
        requestUtil({
          action: delito_addDelito,
          payload: payload,
          resolve: (r) => {
            addDocumentosDelito(r)
            toastSuccess('Delito agregado correctamente')
            cancelarEdicion(0)
            getDelitos()
            isCollapsed.value = false
          },
          loader: () => handleLoading(),
          reject: () => {
            toastError(
              'Error, el delito no se pudo guardar, intenta nuevamente'
            )
          }
        })
      },
      loader: () => handleLoading(),
      reject: (r) => {
        console.error('agregarDelito -> delito_crearDenuncia: ', r)
        toastError('Error, no se pudo crear el delito, intenta nuevamente')
      }
    })
  }

  if (editando.value) {
    const payload = generateDelitoContract({
      ...formData,
      mediosTransporte: mediosTransporte.value
    })
    payload.estaCompleto = true
    launchConfirmDialog({
      message: '¿Estás seguro de modificar el Delito?',
      accept: () => {
        requestUtil({
          action: delito_updateDelito,
          payload: payload,
          resolve: () => {
            toastSuccess('Delito modificado correctamente')
            cancelarEdicion(0)
            getDelitos()
            isCollapsed.value = false
          },
          loader: () => handleLoading(),
          reject: (r) => {
            console.log('error: ', r)
            toastError('Ocurrió un error inesperado')
          }
        })
      }
    })
  }
}

function eliminarDelito (data) {
  launchConfirmDialog({
    message: '¿Estás seguro de eliminar el Delito?',
    accept: () => {
      requestUtil({
        action: delito_deleteDelito,
        payload: data,
        resolve: () => {
          cancelarEdicion(0)
          isCollapsed.value = false
          documento_SET_DEFAULT_STATE('delito')
          getDelitos()
          toastWarning('Delito Eliminado')
        },
        reject: () => {
          toastError('Ocurrió un error inesperado')
          cancelarEdicion()
          getDelitos()
        },
        loader: () => {
          handleLoading()
        }
      })
    }
  })
}

function setModoEdicion (data) {
  requestUtil({
    action: delito_getDelitoByIdDetalleHechoDelictual,
    payload: data,
    resolve: (_delito) => {
      editando.value = true
      isCollapsed.value = true
      nextTick(() => {
        populateDelito(data, formData)
        delito_SET_MEDIOSTRANSPORTE(data?.mediosTransportes)
      })
    },
    loader: (l) => {
      delitosPag.isLoadingBoton = l
    },
    reject: () => {
      toastError('Ocurrió un error inesperado')
      cancelarEdicion()
    }
  })
}

function cancelarEdicion (destination) {
  editando.value = false
  isCollapsed.value = false
  delitosPag.isloadingPage = false
  resetFormData()
  delito_RESET_MEDIOSTRANSPORTE()
  documento_SET_DEFAULT_STATE()
  if (destination >= 0) appUtil.scrollTo(destination)
}

function handleLoading () {
  setTimeout(() => {
    delitosPag.isLoadingTable = false
  }, 1500)
}

function handleNextStep () {
  if (delitos.value?.length > 0 && !existeDelitoIncompleto.value.length) {
    delitosPag.isLoadingStepRelaciones = true
    setTimeout(() => {
      delitosPag.isLoadingStepRelaciones = false
      emit('next-step', '/ingreso/denuncia-fisica/nueva-denuncia/relaciones')
    }, 600)
  } else if (!delitos.value?.length > 0) {
    toastError('Debes registrar al menos un Delito')
  } else completarDelito()
}

// === DOCUMENTOS === //

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
