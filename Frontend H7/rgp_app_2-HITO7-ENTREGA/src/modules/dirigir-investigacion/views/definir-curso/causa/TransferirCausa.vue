<template>
<section>
  <AppForm
    id="id-form-transferir-causa"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="form-transferir-causa"
  >
    <AppFieldset legend="Transferir Causa">
      <TablaResultadoGeorreferenciacion
        class="mb-6"
        :loading="isLoadingTablaCompetenciaTerritorial"
        :resultados-georreferenciacion="fiscaliasCompetentes"
      />
      <MotivoTransferenciaCausas v-model="formData" />
    </AppFieldset>
  </AppForm>

  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-send"
    icon-pos="right"
    label="Definir Curso"
    :loading="isLoading"
    @click="openModalConfirmacion"
  />
</section>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useGeorreferenciaStore, useMantenedorStore, usePamStore } from '@/modules/global/composables'
import {
  useFormValidation,
  useAppToast,
  useAppGlobalProperties,
  useDynamicDialog
} from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ModalTransferencia from '@/modules/dirigir-investigacion/components/modals/ModalPropuestaTransferencia.vue'
import MotivoTransferenciaCausas from '@/modules/dirigir-investigacion/components/definir-curso-causa/transferir/MotivoTransferenciaCausas.vue'
import TablaResultadoGeorreferenciacion from '@/modules/dirigir-investigacion/components/definir-curso-causa/transferir/TablaResultadoGeorreferenciacion.vue'

const { toastError, toastSuccess, TOAST_MESSAGES } = useAppToast()

const { launchDynamicDialog } = useDynamicDialog()

const router = useRouter()

const { $userFiscaliaActual, $userName } = useAppGlobalProperties()

const { procesoPam } = usePamStore()

const {
  causa,
  seleccionDecision,
  dirigirInvestigacion_completarElaborarPropuestaTransferencia,
  dirigirInvestigacion_persistirDecisionCausa,
  dirigirInvestigacion_crearNotificacionTransferencia
} = useDirigirInvestigacionStore()

const { tipoAsignacion, fiscalias, mantenedor_getTipoAsignacion } = useMantenedorStore()

const { fiscaliasCompetentes } = useGeorreferenciaStore()

const formData = reactive({
  motivoTransferencia: '',
  fiscaliaCompetente: '',
  comentario: ''
})

const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-transferir-causa'
})

const loadingStates = reactive({
  completarTareaPam: false,
  persistirDecisionCausa: false,
  getTiposAsignacion: false,
  crearNotificacionTransferencia: false
})

const isLoading = computed(() => {
  const loadingValues = Object.values(loadingStates)
  return loadingValues.some((loading) => loading)
})

const idTipoAsignacion = computed(() => {
  const tipoAsignacionFound = tipoAsignacion.value.find(
    (tipo) => tipo.codigo === '3' // CODIGO 3: Transferencia Propuesta
  )
  return tipoAsignacionFound?.id
})

const idFiscaliaOrigen = computed(() => {
  const fiscalia = fiscalias.value.find(
    (f) => f.codigo === $userFiscaliaActual.value?.idFiscalia
  )
  return fiscalia?.id
})

const idCausa = computed(() => causa.value?.data?.causa?.idCausa)

const isLoadingTablaCompetenciaTerritorial = ref(false)

function openModalConfirmacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  launchDynamicDialog({
    component: ModalTransferencia,
    header: 'Propuesta de Transferencia',
    width: '80%',
    data: {
      infoCausa: formData
    },
    onClose: ({ data }) => {
      if (!data) return

      crearNotificacionTransferencia(data)

      persistirDecisionCausa()
    }
  })
}

function crearNotificacionTransferencia (escrito) {
  const notificacion = {
    ...escrito,
    idFiscalia: idFiscaliaOrigen.value,
    idCausa: idCausa.value
  }

  requestUtil({
    action: dirigirInvestigacion_crearNotificacionTransferencia,
    payload: {
      notificacion
    },
    loader: (l) => {
      loadingStates.crearNotificacionTransferencia = l
    }
  })
}

function persistirDecisionCausa () {
  const persistData = {
    idTipo: idTipoAsignacion.value, // Mantenedor Tipo Asignacion -> Transferencia Propuesta
    descripcion: formData.comentario,
    idMotivo: formData.motivoTransferencia,
    idFiscaliaOrigen: idFiscaliaOrigen.value,
    idFiscaliaDestino: formData.fiscaliaCompetente,
    idFuncionarioRol: $userName.value, // nombre del usuario
    idCausa: idCausa.value
  }

  requestUtil({
    action: dirigirInvestigacion_persistirDecisionCausa,
    payload: {
      persistData
    },
    loader: (l) => {
      loadingStates.persistirDecisionCausa = l
    },
    resolve: () => {
      completarTareaPam()
    }
  })
}

async function completarTareaPam () {
  const payload = {
    taskId: procesoPam.value?.taskId,
    body: {
      decisionCausa: seleccionDecision.value?.id,
      decisionSobreCausa: true,
      enviarSolicitud: false,
      mismoFiscal: true,
      motivoTermino: formData.comentario,
      quedanRelaciones: false,
      subTipoTermino: formData.fiscaliaCompetente,
      tipoTermino: formData.motivoTransferencia,
      solicitud: {
        idActividad: 'string',
        idTipo: 'string',
        idSubTipo: 'string',
        idSubSubTipo: 'string',
        idInstitucionEjecutora: 'string',
        idResponsableMaterializar: 'string',
        requiereApoyo: false,
        materializarSolicitud: false,
        revisarSolicitud: false
      },
      idMotivoTransferencia: formData.motivoTransferencia,
      idFiscaliaOrigen: idFiscaliaOrigen.value,
      idFiscaliaDestino: formData.fiscaliaCompetente,
      comentario: formData.comentario
    }
  }

  await requestUtil({
    action: dirigirInvestigacion_completarElaborarPropuestaTransferencia,
    payload: payload,
    resolve: () => {
      router.push({ name: 'BandejaDirigirInvestigacion' })
      toastSuccess('¡Transferencia Confirmada con éxito!')
    },
    loader: (l) => {
      loadingStates.completarTareaPam = l
    }
  })
}

function getTiposAsignacion () {
  requestUtil({
    action: mantenedor_getTipoAsignacion,
    loader: (l) => {
      loadingStates.getTiposAsignacion = l
    }
  })
}

onMounted(() => {
  getTiposAsignacion()
})
</script>
