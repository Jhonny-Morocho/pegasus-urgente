<template>
<section>
  <AppForm
    id="id-form-cierre-investigacion-causa"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="form-cierre-investigacion-causa"
  >
    <AppFieldset legend="Causa - Cierre de Investigacion">
      <MotivoCierreInvestigacion v-model="formData" />
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
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useMantenedorStore, usePamStore, useRelacionesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useFormValidation, useAppToast, useConfirmDialog } from '@/modules/common/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import MotivoCierreInvestigacion from '@/modules/dirigir-investigacion/components/definir-curso-causa/cierre-investigacion/MotivoCierreInvestigacion.vue'

const {
  procesoPam
} = usePamStore()
const {
  mantenedor_getTiposAccionCierre
} = useMantenedorStore()
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
  motivoCierre: '',
  comentario: ''
})

const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-cierre-investigacion-causa'
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
    acceptLabel: 'Cerrar Investigación',
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
    tipoTermino: formData.motivoCierre,
    subTipoTermino: '--',
    motivoTermino: formData.comentario,
    quedanRelaciones: false,
    taskId: procesoPam.value?.taskId,
    idsRelacionesCierre: idsRelacionesAConcluir
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
  requestUtil({ action: mantenedor_getTiposAccionCierre })
})
</script>
