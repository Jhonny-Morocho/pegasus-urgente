<template>
<LoaderSkeleton v-if="loader" />
<section v-show="!loader">
  <AppForm
    id="solicitud-audiencia"
    :form-submitted="formSubmitted"
    validation-scope="elaborarAudiencia"
  >
    <h4 class="ml-2">
      ¿Desea derivar la Materialización al Equipo Jurídico?
    </h4>
    <AppSelectButton
      id="deriva-materializacion"
      v-model="formData.derivarEquipoJuridico"
      class="col-12 md:col-4 lg:col-3 mb-5"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
      :rules="{ required }"
      @change="resetForm"
    />
    <div
      v-if="formData.derivarEquipoJuridico !== null"
      class="col-12"
    >
      <MaterializaEquipoJuridico
        v-if="formData.derivarEquipoJuridico"
        v-model="formData"
      />
      <MaterializaFiscal
        v-else
        v-model="formData"
        :plantilla-options="plantillaEscritoFiscal"
        @get-plantilla="getPlantillaInstruccionFiscal"
        @guardar-escrito="guardarEscritoFiscal"
      />
    </div>
    <AgregarDocumentoSolicitud />
  </AppForm>
</section>

<AppBtnNextTeleported
  class="ml-8"
  label="Enviar Solicitud"
  @click="enviarSolicitud"
/>

<Dialog
  v-model:visible="isEnviandoSolicitud"
  modal
  :style="{ width: '35vw' }"
>
  <h3 class="mb-3 text-center">
    Enviando solicitud, esperando respuesta...
  </h3>
  <ProgressBar
    v-if="isEnviandoSolicitud"
    class="my-4"
    mode="indeterminate"
    style="height: 0.5em"
  />
</Dialog>
</template>

<script setup>
import { provide, reactive, onMounted, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import MaterializaFiscal from '@/modules/gestion-solicitudes/components/MaterializaFiscal.vue'
import MaterializaEquipoJuridico from '@/modules/gestion-solicitudes/components/MaterializaEquipoJuridico.vue'
import AgregarDocumentoSolicitud from '@/modules/gestion-solicitudes/components/AgregarDocumentoSolicitud.vue'
import ModalComunicaciónPJUD from '@/modules/solicitudes/components/modals/ModalComunicaciónPJUD.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import { requestUtil, appUtil } from '@/utils'
import {
  useAppToast,
  useFormValidation,
  useConfirmDialog,
  useAppGlobalProperties,
  useAppDialog
} from '@/modules/common/composables'
import {
  useDocumentoStore,
  useMantenedorStore,
  usePamStore,
  useRelacionesStore
} from '@/modules/global/composables'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'
import { useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'

const router = useRouter()

const { $userFiscaliaActual } = useAppGlobalProperties()
const { procesoPam, pam_SET_PROCESO } = usePamStore()

const { relacionesConMedidas } = useRelacionesStore()
const { documento_getDocumentosByIdDenuncia } = useDocumentoStore()
const {
  idDenuncia,
  relacionesSeleccionadas,
  solicitudes_enviarSolicitud,
  idCausa,
  dataSelector,
  resumenCausa,
  solicitudes_completarTareaPam,
  solicitudes_SET_DEFAULT_STATE,
  solicitudPJUD,
  solicitudes_SET_SOLICITUD_PJUD,
  solicitudes_getSolicitudById
} = useSolicitudesStore()

const { tipoOrigen, tipoActividad, mantenedor_getTipoOrigenByCodigoActividad } =
  useMantenedorStore()
const { toastError, TOAST_MESSAGES, toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const formData = reactive({
  // elaborar solicitud Audiencia
  derivarEquipoJuridico: null,
  // materializa fiscal
  idTribunal: null,
  // elaborar escrito
  idPlantillaEscritoFiscal: null,
  materializacionTextoFiscal: '',
  // materializa equipo juridico
  idTipoAudienciaEquipoJuridico: null,
  instruccionesEquipoJuridico: '',
  // revisar escrito
  revisarEscrito: null,
  // documentosSeleccionados
  documentosSeleccionados: [],
  carpetaInvestigacion: null
})

const loader = ref(false)
const isEnviandoSolicitud = ref(false)

provide('materializar-solicitud', formData)

const { launchDialog } = useAppDialog()

const { formSubmitted, isFormValid, required, resetFormData } =
  useFormValidation({
    formData,
    validationScope: 'elaborarAudiencia'
  })

onMounted(() => {
  getTipoOrigen()
  getDocumentos()
})

function resetForm () {
  const derivarEquipoJuridico = formData.derivarEquipoJuridico
  resetFormData()
  formData.derivarEquipoJuridico = derivarEquipoJuridico
}

const plantillaEscritoFiscal = [
  {
    descripcion: 'Plantilla 1',
    value: 1
  }
]
async function getTipoOrigen (codTipoOrigen = 1) {
  requestUtil({
    action: mantenedor_getTipoOrigenByCodigoActividad,
    payload: { codigo: codTipoOrigen }
  })
}

function enviarSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  launchConfirmDialog({
    header: 'Solicitar',
    message: '¿Está seguro de enviar la Solicitud?',
    acceptLabel: 'Aceptar',
    accept: () => {
      postEnviarSolicitud()
    }
  })
}

const {
  tramitarAudiencia_postSolicitudAudiencia
} = useTramitarAudiencia()

function postEnviarSolicitud () {
  isEnviandoSolicitud.value = true

  requestUtil({
    action: tramitarAudiencia_postSolicitudAudiencia,
    payload: {
      idActividad: dataSelector.value.selectorSubTipo,
      idTaskPrevious: procesoPam.value.taskId,
      esDeBandeja: false
    }
  })

  requestUtil({
    action: solicitudes_enviarSolicitud,
    payload: { contract: getContract() },
    resolve: (data) => {
      completarTareaPam(data)
    },
    reject: () => toastError('Ocurrió un error al enviar la solicitud')
  })
}

function getContract () {
  const idsRelacionDelito = relacionesSeleccionadas.value.map(
    ({ idRelacionDelito }) => idRelacionDelito
  )
  const idsMedidaCautelar = relacionesConMedidas.value.map(
    ({ idMedida }) => idMedida
  )
  return {
    idOrigenActividad: idCausa.value, // envio del idCausa
    idTipoOrigenActividad: tipoOrigen.value.id, // llamar al mantenedor /actividad/tipo-origen/1, envio del id del tipo origen CAUSA
    idTipoActividad: tipoActividad.value.id, // viene desde el selector de solicitudes
    idSubtipoActividad: dataSelector.value.selectorSubTipo, // viene desde el selector de solicitudes
    idSubSubtipoActividad: dataSelector.value.selectorSubSubTipo, // viene desde el selector el id || null
    idUnidadOrigen: resumenCausa.value.idFiscalia, // valor idFiscalia que trae en el resumen de la causa
    idUnidadDestino: formData.idTribunal, // id del tribunal seleccionado
    idUnidadEjecutora: formData.idTribunal, // id del tribunal seleccionado
    instruccionFiscal: formData.instruccionesEquipoJuridico, // si en caso se muestra el campo instrucciones del fiscal
    idFiscalia: resumenCausa.value.idFiscalia, // valor idFiscalia que trae en el resumen de la causa
    seDerivaEquipoJuridico: formData.derivarEquipoJuridico, // valor de la seleccion de deriva equipo juridico
    seRevisaEscrito: formData.revisarEscrito, // valor de la seleccion de revisar escrito, en caso seDerivaEquipoJuridico es false, este campo tambn es false
    idPlantilla: null, // formData.idPlantillaEscritoFiscal, // aun no operativo, enviar null
    textoHito: formData.materializacionTextoFiscal, // en caso se escribe el texto, se envia en string el html generado
    esUrgente: dataSelector.value.esUrgente, // boleano del selector
    esReservada: dataSelector.value.esReservada, // boleano del selector
    idsDocumentos: null, // array de ids
    idsRelacionDelito, // array de ids
    idsMedidaCautelar // array de ids
  }
}

function getDocumentos () {
  loader.value = true
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => {
      setTimeout(() => {
        loader.value = l
      }, 1000)
    },
    reject: () => toastError('Ocurrió un error al cargar los documentos')
  })
}
function getPlantillaInstruccionFiscal () {
  /* requestUtil({
    action: gestionSolicitudes_getPlantillaMaterializaFiscal,
    payload: {
      ruc: '12345678901',
      idPlantilla: formData.idPlantillaEscritoFiscal
    },
    resolve: ({ data }) => {
      formData.materializacionTextoFiscal = data.texto
    }
  }) */
  console.log('getPlantilla')
}

function guardarEscritoFiscal () {
  console.log(
    requestUtil({
      action: 'guardarEscritoFiscal',
      payload: {
        idDenuncia,
        idPlantilla: formData.idPlantillaEscritoFiscal,
        texto: formData.materializacionTextoFiscal
      }
    })
  )
}

function completarTareaPam (data) {
  const { idActividad } = data
  requestUtil({
    action: solicitudes_completarTareaPam,
    payload: {
      idActividad: idActividad,
      idTipoActividad: tipoActividad.value.id,
      idSubTipoActividad: dataSelector.value.selectorSubTipo,
      idSubSubTipoActividad: dataSelector.value.selectorSubSubTipo,
      idInstitucionEjecutora: 'PJUD', // enviar PJUD de forma estatica
      idResponsableMaterializar: 'Equipo Juridico', // enviaer "Equipo Juridico" de forma estatica por el momento
      requiereApoyo: formData.derivarEquipoJuridico,
      materializarSolicitud: formData.derivarEquipoJuridico,
      revisarSolicitud: formData.revisarEscrito ?? false,
      idTask: procesoPam.value.taskId, // idTask de la tarea PAM que retorno la bandeja
      codFiscalia: $userFiscaliaActual.value?.fiscalia, // codigo de la fiscalia del usuario
      codRegion: $userFiscaliaActual.value?.region.toString() // codigo de la region del usuario
    },
    resolve: async (data) => {
      if (dataSelector.value.fromSelector && !formData.derivarEquipoJuridico) {
        solicitudes_SET_SOLICITUD_PJUD(null)

        await appUtil.sleep(30000)

        requestUtil({
          action: solicitudes_getSolicitudById,
          resolve: () => {
            isEnviandoSolicitud.value = false

            const { observacionHito, crrInterconexion } = solicitudPJUD.value

            let title
            let buttonLabel

            if (crrInterconexion) {
              title = 'Solicitud enviada'
              buttonLabel = 'Cerrar'
            } else if (!crrInterconexion && observacionHito) {
              title = 'Error de conexión'
              buttonLabel = 'Reintentar'
            } else {
              title = 'Solicitud Pendiente'
              buttonLabel = 'Reintentar'
            }

            launchDialog({
              component: ModalComunicaciónPJUD,
              header: title || 'no disponible',
              props: {
                solicitudPJUD,
                title
              },
              confirmLabel: buttonLabel,
              cancelLabel: 'hideCancelLabel',
              closable: !crrInterconexion,
              width: '50vw',
              accept: () => {
                if (crrInterconexion) {
                  router.push('/dirigir-investigacion/desarrollo-investigacion')
                } else {
                  postEnviarSolicitud()
                }
              }
            })
          },
          reject: () => {
            toastError('Ocurrió un error al Obtener respuesta PJUD')
          }
        })
      } else {
        solicitudes_SET_DEFAULT_STATE()
        toastSuccess('La solicitud ha sido enviada con éxito')

        pam_SET_PROCESO({
          ...procesoPam.value,
          taskInstanceId: data.taskInstanceId
        })

        isEnviandoSolicitud.value = false

        nextTick(() => {
          router.push('/dirigir-investigacion/desarrollo-investigacion')
        })
      }
    },
    reject: () => {
      toastError('Ocurrió un error al completar proceso')
      isEnviandoSolicitud.value = false
    }
  })
}
</script>
