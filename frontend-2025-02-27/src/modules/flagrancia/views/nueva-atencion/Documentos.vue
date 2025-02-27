<template>
<LoaderSkeleton v-if="isLoadingPage" />
<section v-show="!isLoadingPage">
  <div>
    <AppFieldset legend="Documentos Adjuntos">
      <div class="col-12">
        <TablaDocumentos
          :actualizar-tabla="actualizarTablaDocumentos"
          :data-documentos="documentos"
          :is-editando="isEditando"
          :loading="loadingTablaDocumentos"
          :rows="paginacion?.tamanoPagina"
          :total-records="paginacion?.elementosTotales"
          @documentos:editar-documento="setModoEdicion"
          @documentos:eliminar-documento="eliminarDocumento"
        />
      </div>
    </AppFieldset>
    <AppFieldset legend="Documentación Adjunta - Archivo Digitalizado">
      <div class="col-12">
        <AdjuntarDocumento
          ref="refAdjuntar"
          :data-documento="documentoSeleccionado"
          :is-editando="isEditando"
          @adjuntar-documento:adjuntar="adjuntarDocumento"
          @adjuntar-documento:cancelar-edicion="cancelarEdicion"
          @adjuntar-documento:editar="adjuntarDocumento"
        />
      </div>
    </AppFieldset>
  </div>
  <AppBtnNextTeleported
    v-if="$hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`]) || esNuevaAtencionFiscal"
    label="Emitir Instrucciones"
    :loading="isLoadingNextStep"
    @click="handleSubmitForm"
  />
</section>
</template>

<script setup>
import { defineEmits, onMounted, ref } from 'vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AdjuntarDocumento from '@/modules/global/components/documentos/AdjuntarDocumento.vue'
import TablaDocumentos from '@/modules/global/components/documentos/TablaDocumentos.vue'
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useDocumentoStore, usePamStore } from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { useProcedimientosBandejaStore } from '@/modules/flagrancia/composables'
import { useRoute } from 'vue-router'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const emit = defineEmits(['next-step'])
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastWarning, toastError } = useAppToast()

const route = useRoute()
const {
  documentos,
  paginacion,
  documento_addDocumentoCDD,
  documento_updateMetadataDocumentoCDD,
  documento_deleteDocumentoCDD,
  documento_getDocumentosByCatalogoCDD
} = useDocumentoStore()
const { procedimientosBandeja_crearFolio, tieneFolio, esNuevaAtencionFiscal, esDenunciaDirectaFlagrante } = useProcedimientosBandejaStore()
const { pam_reservarIniciarTarea } = usePamStore()
const { idCatalogo } = useIdentificacionDenunciaStore()

const isLoadingNextStep = ref(false)
const isEditando = ref(false)
const documentoSeleccionado = ref(null)
const loadingTablaDocumentos = ref(false)
const isLoadingPage = ref(false)
const idDocumentoSeleccionado = ref(null)

const refAdjuntar = ref(null)
const actualizarTablaDocumentos = ref(null)
const { procesoPam, pam_completarProcesoFlagrancia } = usePamStore()

onMounted(() => {
  isLoadingPage.value = true
  getDocumentos()
})

const params = ref('')
function getDocumentos () {
  if (!idCatalogo.value) {
    console.log('Sin idCatalogo')
    return
  }

  const idcatalogo = idCatalogo.value.replace('{', '').replace('}', '')
  params.value = `?page=${0}&size=${10}`

  requestUtil({
    action: documento_getDocumentosByCatalogoCDD,
    payload: {
      idCatalogo: idcatalogo,
      params: params.value
    },
    loader: (l) => {
      if (isLoadingPage.value === true) {
        // Simulando loader
        setTimeout(() => {
          isLoadingPage.value = l
        }, 500)
      }
    }

  })
}

function adjuntarDocumento (documento) {
  documento.idDenuncia = procesoPam.value.idDenuncia
  if (!isEditando.value) {
    requestUtil({
      action: documento_addDocumentoCDD,
      payload: { ...documento, idOrigen: documento?.metadata[0]?.procedencia },
      resolve: () => {
        toastSuccess('Documento Adjuntado')
        cancelarEdicion()
        getDocumentos()
      },
      loader: (l) => (loadingTablaDocumentos.value = l)
    })
  } else {
    requestUtil({
      action: documento_updateMetadataDocumentoCDD,
      payload: {
        idDocumento: idDocumentoSeleccionado.value,
        request: documento
      },
      resolve: () => {
        toastWarning('Documento Modificado')
        cancelarEdicion()
        getDocumentos()
      },
      loader: (l) => (loadingTablaDocumentos.value = l)
    })
  }
}

function eliminarDocumento (documento) {
  const nombreDocumento = documento.nombreArchivo
  launchConfirmDialog({
    message: `¿Estás seguro de querer eliminar el documento ${nombreDocumento}?`,
    accept: () => {
      requestUtil({
        action: documento_deleteDocumentoCDD,
        payload: { idDocumento: documento.id },
        resolve: () => {
          toastSuccess('Documento Eliminado con éxito.')
          cancelarEdicion()
          getDocumentos()
        }
      })
    }
  })
}

function setModoEdicion (documento) {
  isEditando.value = true
  documentoSeleccionado.value = documento
  idDocumentoSeleccionado.value = documento.id
}

function cancelarEdicion () {
  isEditando.value = false
  resetForm()
  actualizarTablaDocumentos.value = true
}
function resetForm () {
  documentoSeleccionado.value = null
  refAdjuntar.value.resetFormData()
  refAdjuntar.value.formData.metadata[0].procedencia = ''
}

function handleSubmitForm () {
  if (route.path === '/flagrancia/procedimiento-creado/analizar-procedimiento/documentos') {
    isLoadingNextStep.value = true
    emit('next-step', 'FlagranciaNuevaAtencionDiligenciasEInstruccionesFiscal')
  } else if (route.path !== '/flagrancia/procedimiento-creado/analizar-procedimiento/documentos') {
    if (tieneFolio.value) {
      isLoadingNextStep.value = true
      emit('next-step', 'FlagranciaNuevaAtencionDiligenciasEInstrucciones')
    } else reservarIniciarTareaDirectaFlagrante()
  }
}

function reservarIniciarTareaDirectaFlagrante () {
  isLoadingNextStep.value = true
  const payload = {
    taskInstanceId: procesoPam.value.taskInstanceId
  }
  if (esDenunciaDirectaFlagrante.value) {
    requestUtil({
      action: pam_reservarIniciarTarea,
      payload: payload,
      resolve: (r) => {
        crearFolio()
      },
      reject: (e) => {
        console.error('error pam_reservarIniciarTarea: ', e)
        toastError('Ha ocurrido un problema')
        isLoadingNextStep.value = false
      },

      loader: (l) => (loadingTablaDocumentos.value = l)
    })
  } else crearFolio()
}

function crearFolio () {
  const idProcedimientoPayload = {
    idProcedimiento: procesoPam.value.idProcedimiento,
    procesoPam: {
      ...procesoPam.value
    }
  }
  requestUtil({
    action: procedimientosBandeja_crearFolio,
    payload: idProcedimientoPayload,
    resolve: ({ data }) => {
      console.log({ data })
      completarProcesoFudFlagrancia()
    },
    reject: (e) => {
      console.error('error pam_completarProcesoFlagrancia: ', e)
      toastError('Ha ocurrido un problema al generar el número de Folio')
      isLoadingNextStep.value = false
    }
  })
}
function completarProcesoFudFlagrancia () {
  const payload = {
    idDenuncia: procesoPam.value.idDenuncia,
    idProcedimiento: procesoPam.value.idProcedimiento,
    processInstanceId: procesoPam.value.processInstanceId,
    taskInstanceId: procesoPam.value.taskInstanceId
  }
  requestUtil({
    action: pam_completarProcesoFlagrancia,
    payload: payload,
    resolve: (r) => {
      console.log('proceso completado pam', r)
      setTimeout(() => {
        isLoadingNextStep.value = true
        emit('next-step', 'FlagranciaNuevaAtencionDiligenciasEInstrucciones')
      }, 600)
    },
    reject: (e) => {
      console.error('error pam_completarProcesoFlagrancia: ', e)
      toastError('Ha ocurrido un problema')
      isLoadingNextStep.value = false
    },

    loader: (l) => (loadingTablaDocumentos.value = l)
  })
}
</script>
