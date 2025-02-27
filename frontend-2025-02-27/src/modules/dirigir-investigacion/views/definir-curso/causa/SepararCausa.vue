<template>
<section>
  <AppForm
    id="id-form-agrupar-causa"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="form-agrupar-causa"
  >
    <AppFieldset legend="Causa a Separar">
      <MotivoSeparacionCausa v-model="formData" />
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
import { reactive, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useRouter } from 'vue-router'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { usePamStore } from '@/modules/global/composables'
import {
  useFormValidation,
  useAppToast,
  useConfirmDialog
} from '@/modules/common/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import MotivoSeparacionCausa from '@/modules/dirigir-investigacion/components/definir-curso-causa/separacion/MotivoSeparacionCausa.vue'

const router = useRouter()

const { toastError, TOAST_MESSAGES, toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const { procesoPam } = usePamStore()
const {
  seleccionDecision,
  dirigirInvestigacion_completarTomarDecisionCausaRelacion
} = useDirigirInvestigacionStore()

const isLoadingBtnConfirmacion = ref(false)

const formData = reactive({
  comentario: ''
})

const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-agrupar-causa'
})

function openModalConfirmacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  launchConfirmDialog({
    header: 'Definir Curso de la Causa',
    message: `¿Está seguro de querer Definir Curso?`,
    acceptLabel: 'Separar Causas',
    accept: async () => {
      await completarTareaPam()
    }
  })
}

async function completarTareaPam () {
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
    tipoTermino: formData.accionCierre,
    subTipoTermino: '--',
    motivoTermino: formData.comentario,
    quedanRelaciones: false,
    taskId: procesoPam.value?.taskId
  }

  await requestUtil({
    action: dirigirInvestigacion_completarTomarDecisionCausaRelacion,
    payload: payload,
    resolve: () => {
      toastSuccess('Se ha aceptado satisfactoriamente la decisión de Separar Causa')
      router.push({ name: 'BandejaDirigirInvestigacion' })
    },
    loader: (l) => {
      isLoadingBtnConfirmacion.value = l
    }
  })
}
</script>
