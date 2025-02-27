<template>
<section class="col-12 p-0">
  <h2 class="mt-0 mb-4 p-2">
    Desestimar Causa
  </h2>
  <AppFieldset legend="Desestimar Causa">
    <AppForm
      id="formulario-desestimar"
      class="grid"
      :form-submitted="formSubmitted"
      validation-scope="formulario-desestimar"
    >
      <AppDropdown
        id="tipo-termino"
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
        id="motivo-desistimiento"
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
    label="Enviar Propuesta"
    :loading="isLoading"
    @click="handleEnviarPropuesta"
  />
</section>
</template>
<script setup>
import { computed, defineExpose, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import {
  useAppDialog,
  useAppGlobalProperties,
  useAppToast,
  useFormValidation
} from '@/modules/common/composables'
import {
  useEspeciesDineroStore,
  useMantenedorStore,
  usePamStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import { useCausaPreclasificadorStore } from '@/modules/preclasificador/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ModalDiligenciasPendientes from '@/modules/global/components/diligencias/desestimar-causa/ModalDiligenciasPendientes.vue'
import TablaDestinoDeLasEspecies from '@/modules/preclasificador/components/proponer-asignacion/common/TablaDestinoDeLasEspecies.vue'
import ModalProponerDestinoEspecie from '@/modules/preclasificador/components/modals/ModalProponerDestinoEspecie.vue'

const router = useRouter()

const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()
const { launchDialog } = useAppDialog()
const { procesoPam } = usePamStore()

const { $userFiscaliaActual } = useAppGlobalProperties()

const {
  motivosDesestimacion,
  tiposTermino,
  mantenedor_getMotivosDesestimacion,
  mantenedor_getTiposTermino,
  mantenedor_getDescripcionTipoTerminoById,
  mantenedor_getDescripcionMotivoDesestimacionById,
  mantenedor_getAllSubTiposDiligencias,
  mantenedor_getInstituciones
} = useMantenedorStore()

const {
  ruc,
  idDenuncia,
  causaActual,
  causaPreclasificador_completarDesestimarCausa
} = useCausaPreclasificadorStore()

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

const isLoading = ref(false)

function getEspecies () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value }
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

const reemplazarTildes = (string) => {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function desestimarCausa () {
  requestUtil({
    action: causaPreclasificador_completarDesestimarCausa,
    payload: {
      ...procesoPam.value,
      propuestaAsignacion: {
        tipoTermino: descripcionTermino(formData.tipoTermino),
        motivoDesestimacion: descripcionDesestimacion(
          formData.motivoDesistimiento
        ),
        comentario: reemplazarTildes(formData.comentario),
        idMotivo: formData.motivoDesistimiento,
        idTipoTermino: formData.tipoTermino,
        usuario: {
          fiscaliaId: $userFiscaliaActual.value?.fiscalia,
          modulo: 'IYA',
          regionId: $userFiscaliaActual.value?.region,
          zonaId: 2
        }
      }
    },
    loader: (value) => {
      isLoading.value = value
    },
    resolve: () => {
      toastSuccess('Propuesta Enviada con Éxito')
      router.push({ name: 'PreclasificadorBandeja' })
    }
  })
}

function handleEnviarPropuesta () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  launchDialog({
    component: ModalDiligenciasPendientes,
    header: 'Diligencias Pendientes',
    width: '90%',
    confirmLabel: 'Enviar Propuesta',
    props: {
      ruc: ruc.value,
      nroIntervinientes: nroIntervinientes.value,
      isAsignacion: false,
      tipoTermino: descripcionTermino(formData.tipoTermino),
      motivoDesistimiento: descripcionDesestimacion(
        formData.motivoDesistimiento
      ),
      idCausa: causaActual?.value?.causa?.idCausa
    },
    accept: () => {
      desestimarCausa()
    }
  })
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
  requestUtil({ action: mantenedor_getInstituciones })
}

onMounted(() => {
  getEspecies()
  getSujetos()
  getDataMantenedor()
})

defineExpose({ formData })
</script>
