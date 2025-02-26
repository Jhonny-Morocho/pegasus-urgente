<template>
<section>
  <AppForm
    id="id-form-agrupar-causa"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="form-agrupar-causa"
  >
    <AppFieldset legend="Causas a Agrupar">
      <TablaCausasAgrupar
        v-model:selection="formData.causaPrincipal"
        :loading="isLoadingTablaCausasRelacionadas"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="causasRelacionadas"
        @page="getCausasRelacionadas"
      >
        <template #acciones>
          <Column
            header="Acciones"
          >
            <template #body="{ data }">
              <Button
                class="p-button-rounded p-button-outlined p-button-danger"
                :disabled="esCausaPrincipal(data)"
                icon="pi pi-trash"
                @click="deleteCausaRelacionada(data)"
              />
            </template>
          </Column>
        </template>
      </TablaCausasAgrupar>
      <MotivoAgrupacionCausas
        v-model="formData"
        :causa-principal="formData.causaPrincipal"
        class="mt-4"
      />
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
import { reactive, onMounted, computed, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useRouter } from 'vue-router'
import { useFormValidation, useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useCausasRelacionadasStore, usePamStore } from '@/modules/global/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaCausasAgrupar from '@/modules/global/components/causas-relacionadas/TablaCausasAgrupar.vue'
import MotivoAgrupacionCausas from '@/modules/dirigir-investigacion/components/definir-curso-causa/agrupacion/MotivoAgrupacionCausas.vue'

const router = useRouter()
const { toastError, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const {
  procesoPam
} = usePamStore()
const {
  causa,
  seleccionDecision,
  dirigirInvestigacion_completarTomarDecisionCausaRelacion,
  dirigirInvestigacion_iniciarYReservar
} = useDirigirInvestigacionStore()
const {
  paginacion,
  causasRelacionadas,
  causasRelacionadas_getCausasRelacionadas,
  causasRelacionadas_eliminarCausasRelacionadas
} = useCausasRelacionadasStore()

const idCausa = computed(() => {
  return causa.value?.data?.causa?.idCausa
})

const isLoadingBtnConfirmacion = ref(false)

function esCausaPrincipal (_data) {
  return idCausa.value === _data?.causaId
}

const isLoadingTablaCausasRelacionadas = ref(false)

const formData = reactive({
  motivoAgrupacion: '',
  comentario: '',
  causaPrincipal: null
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
    acceptLabel: 'Agrupar Causas',
    accept: async () => {
      await completarTareaPam()
    }
  })
}

async function iniciarYReservarTarea ({ resolve, taskId }) {
  await requestUtil({
    action: dirigirInvestigacion_iniciarYReservar,
    payload: {
      taskId: taskId
    },
    resolve,
    reject: (err) => {
      console.error(err)
    },
    loader: (l) => { isLoadingBtnConfirmacion.value = l }
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
    tipoTermino: formData.motivoAgrupacion,
    subTipoTermino: '--',
    motivoTermino: formData.comentario,
    quedanRelaciones: false,
    taskId: procesoPam.value?.taskId
  }

  await requestUtil({
    action: dirigirInvestigacion_completarTomarDecisionCausaRelacion,
    payload: payload,
    resolve: () => {
      setTimeout(() => {
        launchConfirmDialog({
          header: '¿Desea volver a Bandeja o continuar con la Agrupacion?',
          message: `Seleccione si volver a la bandeja de entrada o continuar con la Agrupacion`,
          acceptLabel: 'Continuar Agrupar',
          rejectLabel: 'Volver a Bandeja',
          accept: () => {
            iniciarYReservarTarea({
              taskId: procesoPam.value?.taskId,
              resolve: () => {
                router.push({ name: 'DIACADefinirCausasAgrupar' })
              }
            })
          },
          reject: () => router.push({ name: 'BandejaDirigirInvestigacion' })
        })
      }, 369)
    },
    loader: (l) => { isLoadingBtnConfirmacion.value = l }
  })
}

const firstRecord = ref(0)
async function getCausasRelacionadas (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  await requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      idCausa: idCausa.value,
      params
    },
    loader: (l) => { isLoadingTablaCausasRelacionadas.value = l }
  })
}

function deleteCausaRelacionada (causaEliminar) {
  console.log('🚀 ~ file: ResumenCausa.vue:124 ~ deleteCausaRelacionada ~ causaEliminar', causaEliminar)
  launchConfirmDialog({
    header: 'Eliminar Causa Relacionada',
    message: `¿Estás seguro(a) de eliminar la causa con RUC: N° ${causaEliminar?.ruc}`,
    accept: async () => {
      isLoadingTablaCausasRelacionadas.value = true
      // params payload { idCausaPadre, idsCausasHijas[] }
      await requestUtil({
        action: causasRelacionadas_eliminarCausasRelacionadas,
        payload: {
          idCausaPadre: idCausa.value,
          idsCausasHijas: [causaEliminar.causaId]
        },
        resolve: () => {
          getCausasRelacionadas()
        }
      })
    }
  })
}

onMounted(() => {
  getCausasRelacionadas()
})
</script>
