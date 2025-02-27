<template>
<section>
  <AppForm
    id="id-form-termino-causa"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="form-termino-causa"
  >
    <AppFieldset legend="Causa - Término">
      <MotivoTerminoCausa v-model="formData" />
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
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useMantenedorStore, usePamStore, useRelacionesStore } from '@/modules/global/composables'
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import MotivoTerminoCausa from '../../../components/definir-curso-causa/termino/MotivoTerminoCausa.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const { mantenedor_getTiposTermino } = useMantenedorStore()

const router = useRouter()

const { procesoPam } = usePamStore()
const {
  seleccionDecision,
  dirigirInvestigacion_completarTomarDecisionCausaRelacion
} = useDirigirInvestigacionStore()
const {
  relaciones
} = useRelacionesStore()

const { toastError, TOAST_MESSAGES } = useAppToast()

const formData = reactive({
  tipoTermino: '',
  subtipoTermino: '',
  motivoTermino: ''
})

const isLoadingBtnConfirmacion = ref(false)

const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-termino-causa'
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
    acceptLabel: 'Terminar Causa',
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
    tipoTermino: formData.tipoTermino,
    subTipoTermino: formData.subtipoTermino,
    motivoTermino: formData.motivoTermino,
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
    loader: (l) => {
      isLoadingBtnConfirmacion.value = l
    }
  })
}

onMounted(() => {
  requestUtil({ action: mantenedor_getTiposTermino })
})
</script>
