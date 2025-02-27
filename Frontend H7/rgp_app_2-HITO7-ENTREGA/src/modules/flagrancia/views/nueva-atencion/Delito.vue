<template>
<LoaderSkeleton v-if="delitosPag.isloadingPage" />
<section v-show="!delitosPag.isloadingPage">
  <div class="p-fluid">
    <AppFieldset legend="Delitos Registrados">
      <TablaDelitos
        v-model:first="delitosPag.firstRecord"
        v-model:isLoadingTable="delitosPag.isLoadingTable"
        :data-delitos="delitos"
        :is-disabled="isFolioCerrado"
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
    :is-folio-cerrado="isFolioCerrado"
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
    v-if="
      $hasSomeRoles([
        `zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`,
      ]) || esNuevaAtencionFiscal
    "
    :disabled="isCollapsed"
    label="Relaciones"
    :loading="delitosPag.isLoadingStepRelaciones"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { defineEmits, onMounted, provide, reactive, ref, computed, nextTick } from 'vue'

// components
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import FormDelitos from '@/modules/global/components/forms/FormDelitos.vue'
// composables
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useDelitoProvide } from '@/modules/global/composables/useDelito'
import {
  useDocumentoStore,
  useMantenedorStore,
  usePamStore,
  useDelitoStore
} from '@/modules/global/composables'
import { useProcedimientosBandejaStore } from '@/modules/flagrancia/composables/useProcedimientosBandejaStore'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

// utils
import { appUtil, requestUtil } from '@/utils'
import {
  generateDelitoContract,
  populateDelito
} from '@/modules/global/contracts'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const {
  mantenedor_getTiposDelito, mantenedor_getFamiliasDelito,
  seccionesFUD, mantenedor_getCategoriasDocumento
} = useMantenedorStore()

const { idCatalogo } = useIdentificacionDenunciaStore()

const { esNuevaAtencionFiscal, estadoFolio } = useProcedimientosBandejaStore()

const { toastError, toastSuccess, toastWarning, TOAST_MESSAGES } =
  useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const { procesoPam } = usePamStore()

const {
  delitos,
  delito_addDelito,
  delito_updateDelito,
  mediosTransporte,
  delito_deleteDelito,
  delito_SET_MEDIOSTRANSPORTE,
  delito_RESET_MEDIOSTRANSPORTE,
  delito_getDelitoByIdDenuncia,
  delito_getDelitoByIdDetalleHechoDelictual,
  paginacion
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

// Composable delito (useDelito)
const { formData, delitoValidationScope } = useDelitoProvide()

// Validacion
const { isFormValid, formSubmitted, resetFormData } = useFormValidation({
  formData,
  validationScope: delitoValidationScope
})

const delitosPag = reactive({
  isloadingPage: false,
  isLoadingTable: false,
  isLoadingBoton: false,
  isLoadingStepRelaciones: false,
  firstRecord: 0
})

// Provide
provide(delitoValidationScope, formData)

// states
const isCollapsed = ref(false)
const editando = ref(false)
const bodyRequest = ref([])
const isFolioCerrado = computed(() => estadoFolio.value === 'Cerrado')
const seccionVideo = seccionesFUD.value.find((x) => x.codigo === '13') // MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 13: DELITO VIDEO
const seccionDenuncia = seccionesFUD.value.find((x) => x.codigo === '10')// MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 10: FORMULARIO DENUNCIA
const tablaDocumentos = reactive({
  isLoading: false,
  firstRecord: 0
})

onMounted(() => {
  delitosPag.isloadingPage = true
  getDelitos()
  getDocumentosEnSeccion()
})

async function getTiposFamiliasDelito () {
  await requestUtil({ action: mantenedor_getFamiliasDelito })
  await requestUtil({ action: mantenedor_getTiposDelito })
  await requestUtil({ action: mantenedor_getCategoriasDocumento })
}
getTiposFamiliasDelito()

function getDelitos (pagination = undefined) {
  delitosPag.isLoadingTable = true
  if (!pagination) {
    delitosPag.firstRecord = 0
  }
  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value?.idDenuncia,
      params: {
        page: pagination?.page,
        size: pagination?.rows
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

  if (!editando.value && !delitosPag.isLoadingTable) {
    const { idDenuncia, idProcedimiento } = procesoPam.value
    delitosPag.isLoadingTable = true
    const payload = generateDelitoContract({
      ...formData,
      idDenuncia: idDenuncia,
      idProcedimiento: idProcedimiento,
      mediosTransporte: mediosTransporte.value
    })
    requestUtil({
      action: delito_addDelito,
      payload: payload,
      resolve: (r) => {
        addDocumentosDelito(r)
        toastSuccess('Delito agregado correctamente')
        cancelarEdicion(0)
        isCollapsed.value = false
        getDelitos()
      },
      reject: (r) => {
        console.log('error: ', r)
        toastError('Ocurrió un error inesperado')
      },
      loader: (_v) => {
        handleLoading()
      }
    })
  }

  if (editando.value) {
    const payload = generateDelitoContract({
      ...formData,
      mediosTransporte: mediosTransporte.value
    })
    launchConfirmDialog({
      message: '¿Estás seguro de modificar el Delito?',
      accept: () => {
        delitosPag.isLoadingTable = true
        requestUtil({
          action: delito_updateDelito,
          payload: payload,
          resolve: () => {
            getDelitos()
            toastSuccess('Delito modificado correctamente')
            cancelarEdicion(0)
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
      delitosPag.isLoadingTable = true
      requestUtil({
        action: delito_deleteDelito,
        payload: data,
        resolve: () => {
          toastWarning('Delito Eliminado')
          cancelarEdicion()
          getDelitos()
        },
        reject: (r) => {
          console.log('error: ', r)
          toastError('Ocurrió un error inesperado')
          cancelarEdicion()
        },
        loader: (_v) => {
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
    reject: (r) => {
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

const emit = defineEmits(['next-step'])

function handleLoading () {
  setTimeout(() => {
    delitosPag.isLoadingTable = false
  }, 1500)
}

function handleNextStep () {
  if (delitos.value?.length > 0) {
    delitosPag.isLoadingStepRelaciones = true
    setTimeout(() => {
      delitosPag.isLoadingStepRelaciones = false
      emit('next-step', 'FlagranciaNuevaAtencionRelaciones')
    }, 600)
  } else {
    toastError('Debes registrar al menos un Delito')
  }
}
</script>
