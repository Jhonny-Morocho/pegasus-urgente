<template>
<section class="p-fluid">
  <div v-if="generandoCausa">
    <LoaderSkeleton />
  </div>
  <div v-else>
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
    label="Generar Denuncia"
    :loading="loadingSUbmitForm || generandoCausa"
    @click="handleSubmitForm"
  />
</section>
</template>

<script setup>
// COMPONENTS
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ModalCausaGenerada from '@/modules/ingreso/componentes/documentos/ModalGenerarDenuncia.vue'
import AdjuntarDocumento from '@/modules/global/components/documentos/AdjuntarDocumento.vue'
import TablaDocumentos from '@/modules/global/components/documentos/TablaDocumentos.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

// UTILS
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// COMPOSABLES
import { requestUtil, dateTimeUtil } from '@/utils'
import { useFichaCausa } from '@/modules/ficha-causa/composables'
import { useCrearCausaStore, useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { useAppDialog, useConfirmDialog, useAppToast, useAppGlobalProperties } from '@/modules/common/composables'
import { useDocumentoStore, useMantenedorStore, useSujetosIntervinientesStore, useDelitoStore, useRelacionesStore, useEspeciesDineroStore, useRelatoStore, usePamStore } from '@/modules/global/composables'

const router = useRouter()
const { relato } = useRelatoStore()
const { delitos } = useDelitoStore()
const { procesoPam } = usePamStore()
const { launchDialog } = useAppDialog()
const { relaciones } = useRelacionesStore()
const { especies } = useEspeciesDineroStore()
const { tipoDenuncia } = useCrearCausaStore()
const { toastSuccess, toastError } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { flujoOrigen, sendToFichaCausa } = useFichaCausa()
const { sujetosIntervinientes } = useSujetosIntervinientesStore()
const { mantenedor_getIdFiscaliaByCodigo } = useMantenedorStore()
const { $userFiscaliaActual, $userRoles, $userSub } = useAppGlobalProperties()
const { identificacionDenuncia, identificacionDenuncia_addIdentificacion, tipoDenunciaObject } = useIdentificacionDenunciaStore()
const { documentos, paginacion, documento_addDocumentoCDD, documento_updateMetadataDocumentoCDD, documento_deleteDocumentoCDD, documento_getDocumentosByCatalogoCDD } = useDocumentoStore()
const { ruc, idCausa, idDenuncia, processInstanceId, causa, crearCausa_SET_DATOS_COMPLETOS, crearCausa_crearCausa, crearCausa_iniciarYReservarCausa, crearCausa_completarTareaCausa } = useCrearCausaStore()

// VALUES
const porcentaje = ref(0)
const isLoading = ref(false)
const delito = delitos.value
const isEditando = ref(false)
const refAdjuntar = ref(null)
const delitosFlagrantes = ref()
const generandoCausa = ref(false)
const loadingSUbmitForm = ref(false)
const documentoSeleccionado = ref(null)
const idDocumentoSeleccionado = ref(null)
const loadingTablaDocumentos = ref(false)
const procesoPamSanitizado = { ...procesoPam.value }
const delitosIds = delito.map(({ idDetalleHechoDelictual }) => idDetalleHechoDelictual)

delete procesoPamSanitizado.taskId
delete procesoPamSanitizado.taskProcessInstanceId

const documentosFilter = reactive({
  first: 0,
  isLoading: false
})

// LOGIC

onMounted(() => {
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
  esFlagrante()
})

function esFlagrante () {
  delitosFlagrantes.value = delitos.value.filter((d) => d.esFlagrante === true)
  return delitosFlagrantes.value.length > 0
}

function getDocumentos (pagination = undefined) {
  if (!pagination) {
    documentosFilter.first = 0
  }
  requestUtil({
    action: documento_getDocumentosByCatalogoCDD,
    payload: {
      payload: {
        nombreCatalogo: procesoPam.value.idDenuncia
      },
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    }
  })
}

function adjuntarDocumento (documento) {
  console.log(documento)
  if (!isEditando.value) {
    requestUtil({
      action: documento_addDocumentoCDD,
      payload: { ...documento, idOrigen: documento?.metadata[0]?.procedencia },
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
        request: documento
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

function eliminarDocumento (documento) {
  launchConfirmDialog({
    message: `¿Estás seguro de querer eliminar el documento ${documento.nombre}?`,
    accept: () => {
      requestUtil({
        action: documento_deleteDocumentoCDD,
        payload: { idDocumento: documento.id },
        resolve: () => {
          toastSuccess('Documento Eliminado con éxito.')
          getDocumentos()
        },
        loader: (l) => {
          isLoading.value = l
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
}

function resetForm () {
  documentoSeleccionado.value = null
  refAdjuntar.value.resetFormData()
  refAdjuntar.value.formData.metadata[0].procedencia = ''
}

const payloadCrearCausa = {
  procesoPam: procesoPamSanitizado,
  usuario: {
    userSub: $userSub.value,
    region: $userFiscaliaActual.value.region,
    fiscalia: $userFiscaliaActual.value.fiscalia,
    rol: $userRoles.value[0]
  },
  dataCausa: {
    idDenuncia: procesoPam.value.idDenuncia,
    idDetalleHechoDelictual: [...delitosIds],
    nombre: 'Recibir Denuncia',
    fecha: new Date(),
    esReservada: false,
    esPrioritaria: false,
    ruc: '',
    idFiscalia: `${mantenedor_getIdFiscaliaByCodigo(
      $userFiscaliaActual.value.fiscalia.toString()
    )}`,
    denuncias: [...delitosIds],
    hechosDelictuales: delito,
    recomendacionPreclasificacion: 'string',
    existenAntecedentesDelicutales: true,
    esFlagrante: esFlagrante(),
    solicitudAntecedentesEspecificos: false,
    registraRecomentacionesPreclasificador: false,
    contieneEspeciesNoDeclaradas: 'false',
    documentacionCompleta: 'true',
    tipoDenuncia: tipoDenuncia.value,
    identificadorUnicoDenuncia:
      identificacionDenuncia.value?.identificadorUnicoDenuncia, // backend te devuelve un M-00000000xx, esto ya se crea en el step 1, resolver
    codigoTipoDenuncia: tipoDenunciaObject.value.codigo
  }
}

function handleSubmitForm () {
  if (esFlagrante()) {
    launchConfirmDialog({
      header: '¡Delito Flagrante!',
      message:
        'Delito ingresado flagrante, será redirigido al turno de flagrancia',
      accept: () => {
        requestUtil({
          action: crearCausa_crearCausa,
          payload: payloadCrearCausa,
          resolve: () => {
            router.push('/')
          },
          reject: (e) => {
            console.error(e.message)
          }
        })
      },
      reject: () => {
        console.log('cancelar redirigir...')
      }
    })
  } else {
    launchConfirmDialog({
      message: '¿Está seguro de Generar Causa?',
      header: 'Generar Causa',
      accept: () => generarCausa()
    })
  }
}

function openModalCausaGenerada () {
  launchDialog({
    component: ModalCausaGenerada,
    header: 'Causa Generada',
    confirmLabel: 'Aceptar',
    cancelLabel: 'hideCancelLabel',
    closable: false,
    width: '35%',
    props: { identificacionDenuncia },
    accept: () => {
      completarTareaCausa()
    }
  })
}

function generarCausa () {
  generandoCausa.value = true
  requestUtil({
    action: identificacionDenuncia_addIdentificacion,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia,
      fechaDenuncia: dateTimeUtil.formatToBackendWithTime(
        identificacionDenuncia.value?.fechaDenuncia
      ),
      idOrigen: 'string',
      fechaIngreso: dateTimeUtil.formatToBackendWithTime(
        identificacionDenuncia.value?.fechaIngreso
      ),
      idFiscalia: `${mantenedor_getIdFiscaliaByCodigo(
        $userFiscaliaActual.value.fiscalia.toString()
      )}`,
      identificadorUnicoDenuncia:
        identificacionDenuncia.value?.identificadorUnicoDenuncia,
      idMedioRecepcion: 'Presencial',
      esReservada: false,
      formaEnvio: 1,
      tipoDenuncia: tipoDenuncia.value,
      idTipoDenuncia: tipoDenunciaObject.value.id
    },
    resolve: () => {
      requestUtil({
        action: crearCausa_crearCausa,
        payload: payloadCrearCausa,
        resolve: (r) => {
          requestUtil({
            action: crearCausa_iniciarYReservarCausa,
            payload: { idInstanciaTarea: r.data.idInstanciaTarea },
            resolve: () => {
              loadingSUbmitForm.value = true
              loadingSUbmitForm.value = false
              porcentaje.value = 0
              openModalCausaGenerada()
            },
            reject: (e) => {
              console.error(e.message)
            }
          })
        },
        reject: (e) => {
          console.error(e.message)
        }
      })
    },
    reject: (e) => {
      console.error('error de id denuncia: ' + e)
    }
  })
}

function completarTareaCausa () {
  setTimeout(() => {
    requestUtil({
      action: crearCausa_completarTareaCausa,
      payload: {
        idInstanciaTarea: processInstanceId.value,
        idDenuncia: idDenuncia.value,
        idCausa: idCausa.value
      },
      resolve: () => {
        generandoCausa.value = false

        sendToFichaCausa({
          origenCausa: flujoOrigen.DENUNCIA_DIRECTA,
          idCausa: idCausa.value,
          idDenuncia: idDenuncia.value,
          ruc: ruc.value,
          newTab: false,
          causa: causa.value
        })
      },
      reject: (e) => {
        console.error(e.message)
      }
    })
  }, 600)
}
</script>
