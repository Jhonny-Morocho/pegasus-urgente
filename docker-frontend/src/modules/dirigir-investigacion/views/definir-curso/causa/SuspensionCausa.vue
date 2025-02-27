<template>
<section>
  <AppForm
    id="id-form-suspension-causa"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="form-suspension-causa"
  >
    <AppFieldset legend="Causa - Suspención">
      <MotivoSuspensionCausa v-model="formData" />
    </AppFieldset>
  </AppForm>
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-send"
    icon-pos="right"
    label="Definir Curso"
    :loading="isLoadingBtnConfirmacion"
    @click="openModalConfirmacion"
  />
</section>
</template>

<script setup>
// eslint-disable no-unused-vars
import { reactive, onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useRouter } from 'vue-router'
import { useMantenedorStore, usePamStore, useRelacionesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import MotivoSuspensionCausa from '../../../components/definir-curso-causa/suspension/MotivoSuspensionCausa.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const {
  mantenedor_getTiposSuspension
} = useMantenedorStore()
const {
  procesoPam
} = usePamStore()
const {
  seleccionDecision,
  dirigirInvestigacion_completarTomarDecisionCausaRelacion
} = useDirigirInvestigacionStore()
const {
  relaciones
} = useRelacionesStore()

const { toastError, TOAST_MESSAGES } = useAppToast()

const router = useRouter()

const isLoadingBtnConfirmacion = ref(false)

const formData = reactive({
  tipoSuspension: '',
  subtipoSuspension: '',
  motivoSuspension: ''
})

const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-suspension-causa'
})

const { launchConfirmDialog } = useConfirmDialog()

function openModalConfirmacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  launchConfirmDialog({
    header: 'Definir Curso de la Causa',
    message: `¿Está seguro de querer Definir Curso?`,
    acceptLabel: 'Suspender Causa',
    accept: async () => {
      await completarTareaPam()
    }
  })
}

function generarIdsRelaciones (_relacionesSelec) {
  return _relacionesSelec.map((el) => el.idRelacionDelito)
}

async function completarTareaPam () {
  const idsRelacionesAConcluir = generarIdsRelaciones(relaciones.value)

  const payload = {
    decisionSobreCausa: true,
    decisionCausa: seleccionDecision.value?.id,
    enviarSolicitud: false,
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
    mismoFiscal: true,
    tipoTermino: formData.tipoSuspension,
    subTipoTermino: formData.subtipoSuspension,
    motivoTermino: formData.motivoSuspension,
    quedanRelaciones: false,
    taskId: procesoPam.value?.taskId,
    idsRelacionesTermino: idsRelacionesAConcluir
  }

  await requestUtil({
    action: dirigirInvestigacion_completarTomarDecisionCausaRelacion,
    payload: payload,
    resolve: () => {
      router.push({ name: 'BandejaDirigirInvestigacion' })
    },
    loader: (l) => { isLoadingBtnConfirmacion.value = l }
  })
}

onMounted(() => {
  requestUtil({ action: mantenedor_getTiposSuspension })
})
</script>
