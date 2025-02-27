<template>
<section class="col-12 p-0">
  <h2 class="mt-0 mb-4 p-2">
    Desestimar Causa
  </h2>
  <AppFieldset
    v-if="hasPropuestaAsignacion"
    class="w-full"
    legend="Propuesta del Preclasificador"
  >
    <PropuestaPreclasificador :propuesta="preclasificacion" />
  </AppFieldset>
  <AppFieldset legend="Desestimar Causa">
    <AppForm
      id="formulario-desestimar"
      class="grid"
      :form-submitted="formSubmitted"
      validation-scope="formulario-desestimar"
    >
      <AppDropdown
        id="motivoDeAgrupacion"
        v-model="formData.tipoTermino"
        class="col-12 lg:col-4"
        label="Tipo de Término"
        option-label="descripcion"
        option-value="id"
        :options="tiposTermino"
        placeholder
        :retrieve-data-action="mantenedor_getTiposTermino"
        :rules="{ required }"
        show-clear
      />
      <AppDropdown
        id="motivoDeDestinamiento"
        v-model="formData.motivoDesistimiento"
        class="col-12 lg:col-4"
        label="Motivo Desistimiento"
        option-label="descripcion"
        option-value="id"
        :options="motivosDesestimacion"
        placeholder
        :retrieve-data-action="mantenedor_getMotivosDesestimacion"
        :rules="{ required }"
        show-clear
      />
      <AppTextarea
        id="comentario"
        v-model="formData.comentario"
        class="col-12"
        cols="150"
        label="Comentario"
        rows="5"
        :rules="{ required }"
      />
    </AppForm>
  </AppFieldset>
  <AppFieldset
    class="col-12"
    disabled
    legend="Proponer Destino de la Especie"
  >
    <TablaDestinoDeLasEspecies
      :value="especies"
      @action:proponer-destino="proponerDestinoEspecie"
    />
  </AppFieldset>
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-send"
    icon-pos="right"
    label="Confirmar Desistimiento"
    :loading="isSomethingLoading"
    @click="openConfirmarDesistimiento"
  />
</section>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import { onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import {
  useAppDialog,
  useAppToast,
  useFormValidation
} from '@/modules/common/composables'
import {
  useEspeciesDineroStore,
  useMantenedorStore,
  usePamStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import { useCausaAsignacionStore } from '@/modules/asignacion/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ModalDiligenciasPendientes from '@/modules/global/components/diligencias/desestimar-causa/ModalDiligenciasPendientes.vue'
import TablaDestinoDeLasEspecies from '@/modules/preclasificador/components/proponer-asignacion/common/TablaDestinoDeLasEspecies.vue'
import ModalProponerDestinoEspecie from '@/modules/preclasificador/components/modals/ModalProponerDestinoEspecie.vue'
import PropuestaPreclasificador from '@/modules/asignacion/components/propuesta-asignacion/PropuestaPreclasificador.vue'

const router = useRouter()

const { launchDialog } = useAppDialog()
const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()

const { procesoPam } = usePamStore()

const {
  motivosDesestimacion,
  tiposTermino,
  mantenedor_getMotivosDesestimacion,
  mantenedor_getTiposTermino,
  mantenedor_getDescripcionTipoTerminoById,
  mantenedor_getDescripcionMotivoDesestimacionById,
  mantenedor_getAllSubTiposDiligencias,
  mantenedor_getFamiliaEspecies,
  mantenedor_getTiposEspecies,
  mantenedor_getAmbitoEspecie,
  mantenedor_getInstituciones
} = useMantenedorStore()

const {
  ruc,
  idDenuncia,
  preclasificacion,
  causaActual,
  hasPropuestaAsignacion,
  causaAsignacion_completarDesestimarCausa,
  causaAsignacion_guardarCausaDesestimacion
} = useCausaAsignacionStore()

const {
  especies,
  especiesDinero_getEspecieByIdDenuncia,
  especiesDinero_proponerDestinoEspecieEnCausa
} = useEspeciesDineroStore()

const { paginacion, sujetosIntervinientes_getSujetosByIdGlobal } =
  useSujetosIntervinientesStore()

const formData = reactive({
  tipoTermino: '',
  motivoDesistimiento: '',
  comentario: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'formulario-desestimar'
})

const isLoading = reactive({
  guardarCausaDesestimacion: false,
  completarDesestimarCausa: false
})

const isSomethingLoading = computed(() => {
  const loadingValues = Object.values(isLoading)
  return loadingValues.some((loading) => loading)
})

const idCausa = computed(() => causaActual.value?.causa?.idCausa)

function getEspecies () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    resolve: () => console.log(especies.value)
  })
}

function proponerDestinoEspecie (especie) {
  launchDialog({
    component: ModalProponerDestinoEspecie,
    header: 'Proponer Destino de la Especie',
    width: '65%',
    props: { especie },
    confirmLabel: 'Definir Destino',
    accept: (res) => {
      patchProponerDestinoEspecie(especie, res)
    }
  })
}
function patchProponerDestinoEspecie (especie, proposito) {
  requestUtil({
    action: especiesDinero_proponerDestinoEspecieEnCausa,
    payload: {
      idEspecie: especie?.idEspecie,
      destino: proposito?.destinoEspecie,
      motivo: proposito?.motivo
    },
    resolve: () => getEspecies()
  })
}

function guardarCausaDesestimacion () {
  requestUtil({
    action: causaAsignacion_guardarCausaDesestimacion,
    payload: {
      idCausa: idCausa.value,
      body: {
        idTipoTermino: formData.tipoTermino,
        idMotivo: formData.motivoDesistimiento,
        comentario: formData.comentario
      }
    },
    loader: (l) => {
      isLoading.guardarCausaDesestimacion = l
    },
    resolve: () => {
      completarDesestimarCausa()
    }
  })
}

const reemplazarTildes = (string) => {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function completarDesestimarCausa () {
  requestUtil({
    action: causaAsignacion_completarDesestimarCausa,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId,
      motivo: {
        idTipoTermino: formData.tipoTermino,
        idMotivo: formData.motivoDesistimiento,
        comentario: reemplazarTildes(formData.comentario)
      }
    },
    loader: (l) => {
      isLoading.completarDesestimarCausa = l
    },
    resolve: () => {
      router.push({ name: 'BandejaAsignacion' })
      toastSuccess('Exitoso! Asignación Confirmada')
    }
  })
}

function openConfirmarDesistimiento () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  const { idCausa } = causaActual.value?.causa

  launchDialog({
    component: ModalDiligenciasPendientes,
    header: 'Diligencias Pendientes',
    width: '90%',
    confirmLabel: 'Confirmar Desistimiento',
    props: {
      tipoTermino: descripcionTermino(formData.tipoTermino),
      motivoDesistimiento: descripcionDesestimacion(
        formData.motivoDesistimiento
      ),
      ruc: ruc.value,
      nroIntervinientes: nroIntervinientes.value,
      isAsignacion: true,
      idCausa: idCausa
    },
    accept: () => {
      // guardarCausaDesestimacion()
      completarDesestimarCausa()
    }
  })
}

function setPropuestaCausa () {
  const { desestimar } = preclasificacion.value
  formData.comentario = desestimar?.comentario
  formData.motivoDesistimiento = desestimar?.idMotivo
  formData.tipoTermino = desestimar?.idTipoTermino
}

function descripcionTermino (idTipoTermino) {
  return mantenedor_getDescripcionTipoTerminoById(idTipoTermino)
}

function descripcionDesestimacion (idMotivo) {
  return mantenedor_getDescripcionMotivoDesestimacionById(idMotivo)
}

const nroIntervinientes = computed(() => paginacion.value?.elementosTotales)

function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getAllSubTiposDiligencias })
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getTiposEspecies })
  requestUtil({ action: mantenedor_getAmbitoEspecie })
  requestUtil({ action: mantenedor_getInstituciones })
}

onMounted(() => {
  setPropuestaCausa()
  getEspecies()
  getSujetos()
  getDataMantenedor()
})
</script>
