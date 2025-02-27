<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="pageDescription"
    :page-subtitle="pageSubtitle"
    page-title="Definir Nueva Causa"
  />
  <AppFieldset
    class="mt-8"
    legend="Resumen de la Causa"
    toggleable
  >
    <LoaderSkeleton
      v-if="isLoadingResumen"
      height="369px"
    />
    <DetalleResumenCausa
      v-else
      :resumen-causa="resumenCausa"
    />
  </AppFieldset>
  <AppFieldset
    legend="Relaciones"
    toggleable
  >
    <TablaRelaciones
      v-model:first="tables.relaciones.firstRecord"
      v-model:selection="relacionesSeleccionadas"
      class="col-12"
      :loading="tables.relaciones.isLoading"
      :rows="paginacionRelaciones?.tamanoPagina"
      selectable
      :total-records="paginacionRelaciones?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>
  <AppFieldset
    legend="Especies / Dinero"
    toggleable
  >
    <TablaDefinirEspecies
      v-model:first="tables.especies.firstRecord"
      v-model:selection="especiesSeleccionadas"
      class="col-12"
      definir-nueva-causa
      :loading="tables.especies.isLoading"
      :rows="paginacionEspecies?.tamanoPagina"
      selectable
      :total-records="paginacionEspecies?.elementosTotales"
      :value="especies"
      @page="getEspecies"
    />
  </AppFieldset>
  <AppFieldset
    class="mb-6"
    legend="Diligencias"
    toggleable
  >
    <TablaDiligencias
      v-model:first="tables.diligencias.firstRecord"
      v-model:selection="diligenciasSeleccionadas"
      class="col-12"
      definir-nueva-causa
      :loading="tables.diligencias.isLoading"
      :rows="paginacionActividades?.tamanoPagina"
      selectable
      :total-records="paginacionActividades?.elementosTotales"
      :value="actividades"
      @page="getDiligencias"
    />
  </AppFieldset>

  <AppBtnsSteps :no-button-back="true" />

  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined px-5"
      icon="pi pi-arrow-left"
      icon-pos="left"
      label="Volver a Revisar Antecedentes de la Causa"
      @click="handleVolverARevisarAntecedentes"
    />
  </AppBtnRightTeleported>

  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-clone"
    icon-pos="right"
    label="Separar Causa"
    :loading="isLoadingBtnSeparar"
    @click="openModalConfirmacion"
  />
</section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'
import { useActividadStore, useEspeciesDineroStore, usePamStore, useRelacionesStore } from '@/modules/global/composables'
import { useConfirmDialog, useAppToast, useAppDialog } from '@/modules/common/composables'
import DetalleResumenCausa from '@/modules/dirigir-investigacion/components/resumen-causa/DetalleResumenCausa.vue'
import TablaRelaciones from '../components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaRelaciones.vue'
import TablaDefinirEspecies from '../components/analizar-causas-a-agrupar/TablaDefinirEspecies.vue'
import TablaDiligencias from '../components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaDiligencias.vue'
import ModalCausaGenerada from '@/modules/dirigir-investigacion/views/definir-curso/modals/ModalCausaGenerada.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastError } = useAppToast()
const { launchDialog } = useAppDialog()

const {
  ruc,
  causa,
  idDenuncia,
  resumenCausa,
  dirigirInvestigacion_getResumenCausa,
  dirigirInvestigacion_iniciarYReservar,
  dirigirInvestigacion_putSepararCausa,
  dirigirInvestigacion_completarDefinirNuevaCausa
} = useDirigirInvestigacionStore()
const {
  relaciones,
  paginacion: paginacionRelaciones,
  relaciones_getRelaciones
} = useRelacionesStore()
const {
  especies,
  especiesDinero_getEspecieByIdDenuncia,
  paginacionEspecies
} = useEspeciesDineroStore()
const {
  actividades,
  paginacionActividades,
  actividad_getActividades
} = useActividadStore()
const {
  procesoPam
} = usePamStore()
const {
  includeWord
} = appUtil

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const pageSubtitle = computed(() => `RUC ${ruc?.value}`)
const pageDescription = computed(() => `Nombre Causa: ${causa.value?.data?.causa?.nombre}`)

const idCausa = computed(() => causa.value?.data?.causa?.idCausa)

const tables = reactive({
  sujetos: {
    firstRecord: 0,
    isLoading: false
  },
  delitos: {
    firstRecord: 0,
    isLoading: false
  },
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  especies: {
    firstRecord: 0,
    isLoading: false
  },
  diligencias: {
    firstRecord: 0,
    isLoading: false
  }
})

const isLoadingBtnSeparar = ref(false)
const relacionesSeleccionadas = ref(null)
const especiesSeleccionadas = ref(null)
const diligenciasSeleccionadas = ref(null)

const getRelaciones = async (pagination = undefined) => {
  getNewPage(tables.relaciones, 'relaciones', pagination)
}
const getEspecies = async (pagination = undefined) => {
  getNewPage(tables.especies, 'especies', pagination)
}
const getDiligencias = async (pagination = undefined) => {
  getNewPage(tables.diligencias, 'diligencias', pagination)
}

const getNewPage = async (tableObject, type, pagination) => {
  if (!pagination) {
    tableObject.firstRecord = 0
  }

  let params = {
    page: pagination?.page,
    size: pagination?.rows,
    estado: 'finalizada' // instruída -> se rompe el edp, cambiar cuando funcione
  }

  let action = null

  switch (type) {
    case 'relaciones':
      action = relaciones_getRelaciones
      break
    case 'especies':
      action = especiesDinero_getEspecieByIdDenuncia
      break
    case 'diligencias':
      params = {
        'id-origen-actividad': idCausa.value,
        'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
        'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
      action = actividad_getActividades
      break
    default:
      console.log('Agregar tipo por favor')
  }
  if (action) {
    requestUtil({
      action: action,
      payload: {
        ruc: ruc.value,
        idDenuncia: idDenuncia.value,
        params: { ...params }
      },
      loader: (l) => (tableObject.isLoading = l)
    })
  }
}

function handleVolverARevisarAntecedentes () {
  launchConfirmDialog({
    header: 'Volver a Revisar Antecedentes de la Causa',
    message: `¿Está seguro de Volver a Revisar Antecedentes de la Causa?`,
    accept: () => router.push({ name: 'DIRAResumenCausa' })
  })
}

async function separarCausa ({ resolve }) {
  const payloadParsed = {
    ruc: ruc.value, // ruc de la causa principal
    listaIdRelacionesParaSeparar: relacionesSeleccionadas.value?.map((el) => el?.idRelacionDelito) || [],
    listaIdEspeciesDinero: especiesSeleccionadas.value?.map((el) => el?.idEspecie) || [],
    idTarea: procesoPam.value?.taskId,
    separacion: false
  }

  await iniciarYReservarTarea({
    taskId: procesoPam.value?.taskId
  })

  await requestUtil({
    action: dirigirInvestigacion_putSepararCausa,
    payload: { ...payloadParsed },
    resolve,
    loader: (l) => { isLoadingBtnSeparar.value = l }
  })
}

function openModalConfirmacion () {
  // Si no a seleccionado ninguna relacion no dejarlo hacer nada
  if (!relacionesSeleccionadas.value) {
    toastError('Debe seleccionar como minimo 1 relación para poder Separar la Causa')
    return
  }

  launchConfirmDialog({
    header: 'Separar Causa',
    message: `¿Está seguro de querer Separar la Causa?`,
    acceptLabel: 'Separar Causas',
    accept: async () => {
      if (includeWord(procesoPam.value?.taskName, 'Definir redistribución')) {
        await separarCausa({
          resolve: (_res) => {
            mostrarModalSeparacionExitosa(_res)
          }
        })
      } else {
        await completarTareaDefinirNuevaCausa({
          resolve: (_res) => {}
        })
        await separarCausa({
          resolve: (_res) => {
            mostrarModalSeparacionExitosa(_res)
          }
        })
      }
    },
    reject: () => {
      isLoadingBtnSeparar.value = false
    }
  })
}

async function completarTareaDefinirNuevaCausa ({ resolve }) {
  await requestUtil({
    action: dirigirInvestigacion_completarDefinirNuevaCausa,
    payload: {
      taskId: procesoPam.value?.taskId
    },
    resolve,
    loader: (l) => { isLoadingBtnSeparar.value = l }
  })
}

function mostrarModalSeparacionExitosa (_response) {
  launchDialog({
    component: ModalCausaGenerada,
    header: 'Causa Generada',
    confirmLabel: 'Aceptar',
    width: '35%',
    props: {
      informacion: {
        ruc: _response?.ruc,
        fechaHoraCreacion: _response?.fechaHoraCreacion,
        cantidadEspecieDinero: _response?.cantidadEspecieDinero,
        cantidadDiligencias: _response?.cantidadDiligencias,
        cantidadRelaciones: _response?.cantidadRelaciones
      }
    },
    accept: () => {
      toastSuccess('Causa Generada!')
      router.push({ name: 'BandejaDirigirInvestigacion' })
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
    loader: (l) => { isLoadingBtnSeparar.value = l }
  })
}

const isLoadingResumen = ref(false)
onMounted(async () => {
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: { ruc: ruc.value },
    loader: (l) => { isLoadingResumen.value = l }
  })
  getRelaciones()
  getEspecies()
  getDiligencias()
})
</script>
