<template>
<section class="p-fluid">
  <div>
    <AppFieldset legend="Documentos Adjuntos">
      <div class="col-12">
        <TablaDocumentos
          :is-editando="isEditando"
          :loading="loadingTablaDocumentos"
          :rows="paginacion?.tamanoPagina"
          :total-records="paginacion?.elementosTotales"
          :value="documentos"
          @documentos:editar-documento="setModoEdicion"
          @documentos:eliminar-documento="eliminarDocumento"
          @page="getDocumentos"
        />
      </div>
    </AppFieldset>
    <AppFieldset legend="Documentación Adjunta - Archivo Digitalizado">
      <div class="col-12">
        <AdjuntarDocumento
          ref="refAdjuntar"
          clase-documental="Denuncia de Oficio"
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
    label="Ingresar Denuncia"
    :loading="loadingSUbmitForm"
    @click="generarDenuncia()"
  />
</section>
</template>

<script setup>
// IMPORTS
import TablaDocumentos from '@/modules/global/components/documentos/TablaDocumentos.vue'
import AdjuntarDocumento from '@/modules/global/components/documentos/AdjuntarDocumento.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ModalingresoDenunciaOficio from '@/modules/ingreso/componentes/documentos/ModalIngresoDenunciaOFicio.vue'

// UTILS
import { useRouter } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'
import { useCrearCausaStore, useIdentificacionDenunciaStore } from '../../composables'
import { useAppDialog, useConfirmDialog, useAppToast } from '@/modules/common/composables'
import { useDocumentoStore, useSujetosIntervinientesStore, useDelitoStore, useRelacionesStore, useEspeciesDineroStore, useRelatoStore, usePamStore } from '@/modules/global/composables'

const router = useRouter()
const { relato } = useRelatoStore()
const { delitos } = useDelitoStore()
const { procesoPam } = usePamStore()
const { launchDialog } = useAppDialog()
const { relaciones } = useRelacionesStore()
const { especies } = useEspeciesDineroStore()
const { launchConfirmDialog } = useConfirmDialog()
const { mantenedorCDD_getProcedencia } = useMantenedorCDD()
const { toastSuccess, toastWarning, toastError } = useAppToast()
const { sujetosIntervinientes } = useSujetosIntervinientesStore()
const { identificacionDenuncia } = useIdentificacionDenunciaStore()
const { datosCompletosCausa, crearCausa_SET_DATOS_COMPLETOS } = useCrearCausaStore()
const { documentos, paginacion, documento_addDocumentoCDD, documento_updateMetadataDocumentoCDD, documento_deleteDocumentoCDD, documento_getDocumentosByCatalogoCDD } = useDocumentoStore()

// VALUES
const porcentaje = ref(0)
const isEditando = ref(false)
const refAdjuntar = ref(null)
const loadingSUbmitForm = ref(false)
const documentoSeleccionado = ref(null)
const loadingTablaDocumentos = ref(false)
const idDocumentoSeleccionado = ref(null)
const dialogBuscandoDuplicidad = ref(false)

const tablaDocumentos = reactive({
  isLoading: false,
  firstRecord: 0
})

// LOGIC
onMounted(() => {
  requestUtil({ action: mantenedorCDD_getProcedencia })
  getDocumentos()
  const datos = {
    identificacion: identificacionDenuncia.value,
    intervinientes: sujetosIntervinientes.value,
    delitos: delitos.value,
    relaciones: relaciones.value,
    especies: especies.value,
    relato: relato.value,
    documentos: documentos.value
  }
  crearCausa_SET_DATOS_COMPLETOS(datos)
  console.log(JSON.parse(JSON.stringify(datosCompletosCausa.value)))
})

function getDocumentos (pagination = undefined) {
  if (!pagination) {
    tablaDocumentos.firstRecord = 0
  }

  requestUtil({
    action: documento_getDocumentosByCatalogoCDD,
    payload: {
      payload: { nombreCatalogo: procesoPam.value.idDenuncia },
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    }
  })
}

function adjuntarDocumento (file) {
  console.log(file)
  if (!isEditando.value) {
    requestUtil({
      action: documento_addDocumentoCDD,
      payload: { ...file, idOrigen: file?.metadata[0]?.procedencia },
      resolve: () => {
        toastSuccess('Documento Adjuntado')
        getDocumentos()
        cancelarEdicion()
      },
      loader: (l) => (loadingTablaDocumentos.value = l),
      reject: () => {
        toastError('Ocurrió un problema al adjuntar el documento')
      }
    })
  } else {
    requestUtil({
      action: documento_updateMetadataDocumentoCDD,
      payload: {
        idDocumento: idDocumentoSeleccionado.value,
        request: file
      },
      resolve: () => {
        toastSuccess('Documento Modificado con éxito.')
        cancelarEdicion()
        getDocumentos()
      },
      loader: (l) => (loadingTablaDocumentos.value = l),
      reject: () => {
        toastError('Ocurrió un problema al actualizar el documento')
      }
    })
  }
}
function setModoEdicion (documento) {
  console.log(documento)
  isEditando.value = true
  documentoSeleccionado.value = documento
  idDocumentoSeleccionado.value = documento.id
}

function cancelarEdicion () {
  isEditando.value = false
  resetForm()
}

function resetForm () {
  documentoSeleccionado.value = null
  refAdjuntar.value.resetFormData()
  refAdjuntar.value.formData.metadata[0].procedencia = ''
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
          cancelarEdicion()
          getDocumentos()
        }
      })
    }
  })
}

function generarDenuncia () {
  function buscandoDuplicidad () {
    dialogBuscandoDuplicidad.value = true
    const interval = setInterval(() => {
      porcentaje.value += 4
      if (porcentaje.value === 200) {
        clearInterval(interval)
        setTimeout(() => {
          router.push('/ingreso/validar-duplicidad')
        }, 1000)
      }
    }, 80)
    porcentaje.value = 0
  }
  launchDialog({
    component: ModalingresoDenunciaOficio,
    header: 'Ingreso Denuncia',
    confirmLabel: 'Aceptar',
    width: '40%',
    props: { identificacionDenuncia },
    accept: () => {
      loadingSUbmitForm.value = true
      buscandoDuplicidad()
    }
  })
}

</script>
