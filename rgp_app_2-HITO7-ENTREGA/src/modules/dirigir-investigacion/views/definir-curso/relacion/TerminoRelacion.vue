<template>
<section>
  <AppForm
    id="id-relacion-cierre-form"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="scope-cierre-relacion"
  >
    <AppFieldset legend="Relación - Término">
      <TablaRelaciones
        v-model:first="firstRecord"
        v-model:selection="relacionesSeleccionadas"
        class="mb-3"
        is-preclasificador
        :loading="isLoading"
        :read-only="true"
        :rows="paginacion?.tamanoPagina"
        selectable
        :total-records="paginacion?.elementosTotales"
        :value="relacionesVigentes"
        @page="getRelaciones"
      />
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import {
  useFormValidation,
  useAppToast,
  useConfirmDialog
} from '@/modules/common/composables'
import {
  useRelacionesStore,
  useMantenedorStore,
  usePamStore
} from '@/modules/global/composables'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import MotivoTerminoCausa from '@/modules/dirigir-investigacion/components/definir-curso-relacion/termino/MotivoTerminoRelacion.vue'

const { toastError, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const router = useRouter()

const {
  paginacion,
  relaciones,
  relaciones_getRelaciones
} = useRelacionesStore()
const {
  mantenedor_getTiposTermino,
  mantenedor_getAllEstadoRelacion,
  estadoRelacion
} = useMantenedorStore()
const { procesoPam } = usePamStore()
const {
  seleccionDecision,
  idDenuncia,
  dirigirInvestigacion_completarTomarDecisionCausaRelacion
} = useDirigirInvestigacionStore()

const isLoading = ref(false)
const firstRecord = ref(0)
const relacionesSeleccionadas = ref([])
const isLoadingBtnConfirmacion = ref(false)

const formData = reactive({
  tipoTermino: '',
  subtipoTermino: '',
  motivoTermino: ''
})
const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'scope-cierre-relacion'
})

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => {
      isLoading.value = l
    }
  })
}

const relacionesVigentes = computed(() => {
  return relaciones.value.filter((el) => {
    return el.idEstadoRelacion === getEstadoRelacion('VIGENTE')
  })
})

function getEstadoRelacion (estado) {
  const id = estadoRelacion.value.find((el) => el.descripcion === estado)
  return id?.id
}

function generarIdsRelaciones (_relacionesSelec) {
  return _relacionesSelec.map((el) => el.idRelacionDelito)
}

async function completarTareaPam () {
  let quedanRelacionesACerrar = false

  // si las relaciones seleccionadas son menores al total de relaciones
  // quiere decir que si quedan relaciones por cerrar
  if (relacionesSeleccionadas.value.length < relacionesVigentes.value.length) {
    quedanRelacionesACerrar = true
  }

  const idsRelacionesAConcluir = generarIdsRelaciones(relacionesSeleccionadas.value)

  const payload = {
    decisionSobreCausa: false,
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
    quedanRelaciones: quedanRelacionesACerrar,
    taskId: procesoPam.value?.taskId,
    idsRelacionesTermino: idsRelacionesAConcluir
  }

  requestUtil({
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

function openModalConfirmacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (relacionesSeleccionadas.value.length <= 0) {
    toastError('Debe seleccionar una relación para poder continuar')
    return
  }

  launchConfirmDialog({
    header: 'Definir Curso de la Causa',
    message: `¿Está seguro de querer Definir Curso?`,
    acceptLabel: 'Terminar Relación',
    accept: () => {
      completarTareaPam()
    }
  })
}

onMounted(async () => {
  requestUtil({ action: mantenedor_getTiposTermino })
  requestUtil({ action: mantenedor_getAllEstadoRelacion })
  await getRelaciones()
})
</script>
