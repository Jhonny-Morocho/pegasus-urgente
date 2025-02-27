<template>
<section class="col-12 p-0">
  <h2 class="mt-0 mb-4 p-2">
    Transferir Causa
  </h2>
  <AppFieldset
    legend="Datos para Transferir Causa"
  >
    <AppForm
      id="formulario-transferencia"
      class="grid"
      :form-submitted="formSubmitted"
      validation-scope="formulario-transferencia"
    >
      <div class="col-12 mb-5">
        <TablaResultadoGeorreferencia
          v-model:selection="fiscaliaCompetenteSelected"
          no-paginator
          :value="fiscaliasCompetentes"
        />
      </div>
      <div class="col-12 lg:col-6 grid">
        <AppDropdown
          id="motivo-transferencia"
          v-model="formData.motivoTransferencia"
          class="col-12 mb-4"
          label="Motivo de Transferencia"
          option-label="descripcion"
          option-value="id"
          :options="motivoTransferencia"
          placeholder
          :retrieve-data-action="mantenedor_getMotivosTransferencia"
          :rules="{ required }"
          show-clear
        />
        <AppDropdown
          id="fiscalia-competente"
          v-model="formData.fiscaliaCompetente"
          class="col-12"
          label="Fiscalía Competente"
          option-label="descripcion"
          option-value="id"
          :options="fiscalias"
          placeholder
          :retrieve-data-action="mantenedor_getFiscalias"
          :rules="{ required }"
          show-clear
        />
      </div>
      <AppTextarea
        id="comentario"
        v-model="formData.comentario"
        class="col-12 lg:col-6"
        cols="150"
        label="Comentario"
        rows="6"
        :rules="{ required }"
      />
    </AppForm>
  </AppFieldset>
  <AppFieldset legend="Revisar Diligencias Prioritarias">
    <TablaDiligenciasInstruidas
      :loading="isLoading.diligencias"
      :rows="paginacionActividades?.tamanoPagina"
      :total-records="paginacionActividades?.elementosTotales"
      :value="actividades"
      @page="getDiligencias"
    />
  </AppFieldset>
  <AppFieldset
    class="p-fluid"
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
    @click="handleEnviarPropuesta"
  />
</section>
</template>

<script setup>
import { reactive, onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import {
  useAppDialog,
  useAppGlobalProperties,
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import {
  useMantenedorStore,
  useEspeciesDineroStore,
  usePamStore,
  useGeorreferenciaStore,
  useActividadStore
} from '@/modules/global/composables'
import { useCausaPreclasificadorStore } from '@/modules/preclasificador/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaDiligenciasInstruidas from '@/modules/global/components/diligencias/TablaDiligenciasInstruidas.vue'
import TablaDestinoDeLasEspecies from '@/modules/preclasificador/components/proponer-asignacion/common/TablaDestinoDeLasEspecies.vue'
import TablaResultadoGeorreferencia from '@/modules/global/components/competencia-territorial/TablaResultadoGeorreferencia.vue'
import ModalProponerDestinoEspecie from '@/modules/preclasificador/components/modals/ModalProponerDestinoEspecie.vue'

const router = useRouter()

const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()
const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { procesoPam } = usePamStore()

const { $userFiscaliaActual } = useAppGlobalProperties()

const {
  actividades,
  paginacionActividades,
  actividad_getActividades
} = useActividadStore()

const {
  motivoTransferencia,
  fiscalias,
  mantenedor_getMotivosTransferencia,
  mantenedor_getSubtiposActividadList,
  mantenedor_getSubSubtiposActividadList,
  mantenedor_getInstituciones,
  mantenedor_getFiscalias,
  mantenedor_getCodigoMotivoTransferenciaById
} = useMantenedorStore()

const {
  idDenuncia,
  causaActual,
  causaPreclasificador_completarTransferirCausa
} = useCausaPreclasificadorStore()

const {
  especies,
  especiesDinero_getEspecieByIdDenuncia,
  especiesDinero_proponerDestinoEspecieEnCausa
} = useEspeciesDineroStore()

const { fiscaliasCompetentes } = useGeorreferenciaStore()

const formData = reactive({
  motivoTransferencia: '',
  fiscaliaCompetente: '',
  comentario: '',
  indicadorEvidencia: null,
  solicitudDeDiligencia: null
})

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'formulario-transferencia'
})

const isLoading = reactive({
  diligencias: false
})
const fiscaliaCompetenteSelected = ref(null)
const diligenciasFirst = ref(0)

const codigoTransferencia = computed(() => mantenedor_getCodigoMotivoTransferenciaById(formData.motivoTransferencia))

const idFiscaliaOrigen = computed(() => {
  const fiscalia = fiscalias.value.find((f) => f.codigo === $userFiscaliaActual.value?.idFiscalia)
  return fiscalia?.id
})

// eslint-disable-next-line no-unused-vars
const isAltaComplejidad = computed(() => {
  return codigoTransferencia.value === '4' // Código FIAC (Fiscalía Alta Complejidad)
})

watch(fiscaliaCompetenteSelected, (fiscaliaCompetente) => {
  const fiscalia = fiscalias.value?.find(f => appUtil.includeWord(f.id, fiscaliaCompetente?.idFiscalia))
  if (!fiscalia) {
    toastError('La fiscalía no se encuentra en el Mantenedor')
    return
  }
  const motivo = motivoTransferencia.value?.find(m => m.codigo === '0') // CODIGO 0: 'Incompetencia Territorial'

  formData.motivoTransferencia = motivo?.id
  formData.fiscaliaCompetente = fiscalia?.id
})

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

function getEspecies () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value }
  })
}

function transferirCausa () {
  requestUtil({
    action: causaPreclasificador_completarTransferirCausa,
    payload: {
      ...procesoPam.value,
      propuestaAsignacion: {
        propuestaTransferencia: true,
        proponerDiligenciasPrioritarias: false,
        instruyeDiligencias: false,
        comentario: formData.comentario,
        idFiscaliaOrgien: idFiscaliaOrigen.value, // DE DONDE SALE???
        idFiscaliaDestino: formData.fiscaliaCompetente, // DE DONDE SALE???
        idMotivoTransferencia: formData.motivoTransferencia,
        usuario: {
          fiscaliaId: $userFiscaliaActual.value?.fiscalia,
          modulo: 'IYA',
          regionId: $userFiscaliaActual.value?.region,
          zonaId: 2
        }
      }
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
  launchConfirmDialog({
    message: '¿Estás seguro(a) de enviar propuesta para Transferir Causa?',
    accept: () => {
      transferirCausa()
    }
  })
}

function getDiligencias (pagination = undefined) {
  const { idCausa } = causaActual.value?.causa
  if (!idCausa) return

  if (!pagination) {
    diligenciasFirst.value = 0
  }

  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': idCausa,
        'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
        'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => { isLoading.diligencias = l }
  })
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getSubtiposActividadList })
  requestUtil({ action: mantenedor_getSubSubtiposActividadList })
  requestUtil({ action: mantenedor_getInstituciones })
}

onMounted(() => {
  getDataMantenedor()
  getDiligencias()
  getEspecies()
})
</script>
