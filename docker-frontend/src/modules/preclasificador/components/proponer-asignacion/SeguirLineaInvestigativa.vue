<template>
<section class="col-12 p-0">
  <h2 class="mt-0 mb-4 p-2">
    Seguir Línea Investigativa
  </h2>
  <AppFieldset
    legend="Datos para Seguir Línea Investigativa"
  >
    <AppForm
      id="seguir-linea-investigativa"
      class="grid"
      :form-submitted="formSubmitted"
      validation-scope="form-seguir-linea-investigativa"
    >
      <AppDropdown
        id="complejidad"
        v-model="formData.complejidad"
        class="col-12 lg:col-3 p-fluid"
        empty-filter-message="Sin resultados"
        filter
        label="Complejidad"
        option-label="descripcion"
        option-value="codigoPam"
        :options="complejidadPamOptions"
        placeholder
        :retrieve-data-action="mantenedor_getTiposComplejidad"
        :rules="{ required }"
        show-clear
      />
      <AppDropdown
        id="especialidad"
        v-model="formData.especialidad"
        class="col-12 lg:col-3 p-fluid"
        empty-filter-message="Sin resultados"
        filter
        label="Especialidad"
        option-label="descripcion"
        option-value="id"
        :options="especialidadesOptions"
        placeholder
        :retrieve-data-action="mantenedor_getEspecialidadesFiscalia"
        :rules="{ required }"
        show-clear
        @change="getFiscales"
      />
      <AppDropdown
        id="fiscales"
        v-model="formData.fiscal"
        class="col-12 lg:col-3 p-fluid"
        empty-filter-message="Sin resultados"
        filter
        label="Fiscales"
        :loading="isLoading.fiscales"
        option-label="nombresCompletos"
        option-value="funcionarioId"
        :options="fiscales"
        placeholder
        :rules="{ required }"
        show-clear
      />

      <AppTextarea
        id="comentario"
        v-model="formData.comentario"
        class="col-12 p-fluid"
        cols="150"
        label="Comentario"
        rows="5"
        :rules="{ required }"
      />
    </AppForm>
  </AppFieldset>
  <AppFieldset
    legend="Revisar Diligencias Prioritarias"
  >
    <TablaDiligenciasInstruidas
      :loading="isLoading.diligencias"
      :rows="paginacionActividades?.tamanoPagina"
      :total-records="paginacionActividades?.elementosTotales"
      :value="actividades"
      @page="getDiligencias"
    />
  </AppFieldset>
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar Propuesta"
    :loading="isSomethingLoading"
    @click="handleEnviarPropuesta"
  />
</section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import {
  useAppGlobalProperties,
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useActividadStore, useMantenedorStore, usePamStore } from '@/modules/global/composables'
import { useCausaPreclasificadorStore } from '@/modules/preclasificador/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaDiligenciasInstruidas from '@/modules/global/components/diligencias/TablaDiligenciasInstruidas.vue'
import { computed } from '@vue/reactivity'

const router = useRouter()

const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const { $userFiscaliaActual } = useAppGlobalProperties()

const {
  actividades,
  paginacionActividades,
  actividad_getActividades
} = useActividadStore()

const {
  causaActual,
  causaPreclasificador_completarSeguirLineaInvestigativa
} = useCausaPreclasificadorStore()

const { procesoPam } = usePamStore()

const {
  tiposComplejidad,
  especialidadesFiscalia,
  fiscales,
  mantenedor_getTiposComplejidad,
  mantenedor_getEspecialidadesFiscalia,
  mantenedor_getSubtiposActividadList,
  mantenedor_getInstituciones,
  mantenedor_getSubSubtiposActividadList,
  mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad,
  mantenedor_getFiscalias
} = useMantenedorStore()

const formData = reactive({
  complejidad: '',
  motivoAsignacion: '',
  especialidad: '',
  fiscal: '',
  comentario: '',
  indicadorEvidencia: null,
  dataNuevaDiligencia: null
})

const isLoading = reactive({
  diligencias: false,
  fiscales: false,
  completar: false
})

const isSomethingLoading = computed(() => {
  return isLoading.completar || isLoading.diligencias || isLoading.fiscales
})

const idFiscalia = ref('')
const diligenciasFirst = ref(0)

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-seguir-linea-investigativa'
})

const complejidadPamOptions = computed(() => {
  return tiposComplejidad.value.map((c) => {
    let complex = ''

    if (c.codigo === '1') complex = 'alta'
    if (c.codigo === '2') complex = 'media'
    if (c.codigo === '3') complex = 'baja'

    return {
      ...c,
      codigoPam: complex
    }
  })
})

const especialidadesOptions = computed(() => {
  const sinEspecialidad = { id: '-1', descripcion: 'Sin Especialidad' }
  return especialidadesFiscalia.value.concat(sinEspecialidad)
})

function seguirLineaInvestigativa () {
  const completarSLI = {
    comentario: formData.comentario,
    idComplejidad: formData.complejidad,
    idEspecialidad: formData.especialidad,
    idFiscalAsignado: formData.fiscal,
    clasificacionCausa: formData.complejidad,
    proponerDiligenciasPrioritarias: false,
    instruyeDiligencias: false,
    usuario: {
      fiscaliaId: $userFiscaliaActual.value?.fiscalia,
      regionId: $userFiscaliaActual.value?.region,
      zonaId: 2, // se tiene que agregar al SSO?
      modulo: 'IYA'
    }
  }

  requestUtil({
    action: causaPreclasificador_completarSeguirLineaInvestigativa,
    payload: {
      ...procesoPam.value,
      completarSLI
    },
    loader: (value) => {
      isLoading.completar = value
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
    message: '¿Estás seguro(a) de enviar propuesta para Seguir Línea Investigativa?',
    accept: () => {
      seguirLineaInvestigativa()
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

function getFiscales () {
  formData.fiscal = null
  requestUtil({
    action: mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad,
    payload: {
      idFiscalia: idFiscalia.value,
      idEspecialidad: formData.especialidad
    },
    loader: (loadState) => { isLoading.fiscales = loadState }
  })
}

function getIdFiscalia () {
  requestUtil({
    action: mantenedor_getFiscalias,
    payload: {
      params: {
        codigo: $userFiscaliaActual.value?.fiscalia // CODIGO FISCALIA
      }
    },
    loader: (loadState) => { isLoading.fiscales = loadState },
    resolve: (data) => {
      idFiscalia.value = data?.[0].id
    }
  })
}

function getDataMantenedor () {
  getIdFiscalia()
  requestUtil({ action: mantenedor_getSubtiposActividadList })
  requestUtil({ action: mantenedor_getSubSubtiposActividadList })
  requestUtil({ action: mantenedor_getInstituciones })
}

onMounted(() => {
  getDataMantenedor()
  getDiligencias()
})
</script>
