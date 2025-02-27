<template>
<section class="mt-3">
  <h4 class="mb-6 text-bluegray-900">
    Definir Delitos y Relaciones
  </h4>
  <AppFieldset
    :legend="tituloResumen"
    toggleable
  >
    <div class="grid w-full py-3">
      <ResumenCausa :causa="resumenCausa" />
    </div>
  </AppFieldset>
  <AppFieldset
    collapsed
    legend="Sujetos Intervinientes"
    toggleable
  >
    <LoaderSkeleton
      v-if="tables.sujetos.isLoading"
      height="220px"
    />
    <TablaSujetosIntervinientes
      v-else
      v-model:first="tables.sujetos.firstRecord"
      class="col-12"
      :loading="tables.delitos.isLoading"
      :rows="paginacionSujetos?.tamanoPagina"
      :total-records="paginacionSujetos?.elementosTotales"
      :value="sujetosIntervinientes"
      @page="getAllSujetosByManyIdDenuncia"
    />
  </AppFieldset>
  <AppFieldset
    collapsed
    legend="Delitos"
    toggleable
  >
    <LoaderSkeleton
      v-if="tables.delitos.isLoading"
      height="220px"
    />
    <TablaDelitos
      v-else
      v-model:first="tables.delitos.firstRecord"
      class="col-12"
      :loading="tables.delitos.isLoading"
      :rows="paginacionDelitos?.tamanoPagina"
      :total-records="paginacionDelitos?.elementosTotales"
      :value="delitos"
    />
  </AppFieldset>
  <AppFieldset
    collapsed
    legend="Relaciones"
    toggleable
  >
    <LoaderSkeleton
      v-if="tables.relaciones.isLoading"
      height="220px"
    />
    <TablaRelaciones
      v-else
      v-model:first="tables.relaciones.firstRecord"
      class="col-12"
      :loading="tables.relaciones.isLoading"
      :rows="paginacionRelaciones?.tamanoPagina"
      :total-records="relaciones?.length"
      :value="relaciones"
    />
  </AppFieldset>
  <AppFieldset
    collapsed
    legend="Especies / Dinero"
    toggleable
  >
    <LoaderSkeleton
      v-if="tables.especies.isLoading"
      height="220px"
    />
    <TablaEspeciesDinero
      v-else
      v-model:first="tables.especies.firstRecord"
      class="col-12"
      :loading="tables.especies.isLoading"
      :rows="paginacionEspecies?.tamanoPagina"
      :total-records="paginacionEspecies?.elementosTotales"
      :value="especies"
    />
  </AppFieldset>
  <AppFieldset
    collapsed
    legend="Diligencias"
    toggleable
  >
    <LoaderSkeleton
      v-if="tables.diligencias.isLoading"
      height="220px"
    />
    <TablaDiligencias
      v-else
      v-model:first="tables.diligencias.firstRecord"
      class="col-12"
      :loading="tables.diligencias.isLoading"
      :rows="paginacionActividades?.tamanoPagina"
      :total-records="paginacionActividades?.elementosTotales"
      :value="actividades"
      @page="getAllDiligenciasByManyIdCausa"
    />
  </AppFieldset>
  <AppBtnNextTeleported
    label="Definir Agrupación"
    :loading="isLoadingBtnAgrupacion"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useActividadStore, useCausasRelacionadasStore, useDelitoStore, useEspeciesDineroStore, usePamStore, useRelacionesStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import ResumenCausa from '@/modules/dirigir-investigacion/components/ResumenCausa.vue'
import TablaEspeciesDinero from '@/modules/dirigir-investigacion/components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaEspeciesDinero.vue'
import TablaDelitos from '@/modules/dirigir-investigacion/components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaDelitos.vue'
import TablaSujetosIntervinientes from '@/modules/dirigir-investigacion/components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaSujetosIntervinientes.vue'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaRelaciones.vue'
import TablaDiligencias from '@/modules/dirigir-investigacion/components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaDiligencias.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess } = useAppToast()

const { resumenCausa, dirigirInvestigacion_putAgrupacionCausas, causaPrincipal } = useDirigirInvestigacionStore()
const {
  sujetosIntervinientes,
  sujetosIntervinientes_getManySujetosByIdDenuncia,
  paginacion: paginacionSujetos
} = useSujetosIntervinientesStore()
const { delitos, paginacion: paginacionDelitos } = useDelitoStore()
const { relaciones, paginacion: paginacionRelaciones } = useRelacionesStore()
const { especies, paginacionEspecies } = useEspeciesDineroStore()
const { causasRelacionadas } = useCausasRelacionadasStore()
const {
  actividades,
  paginacionActividades,
  actividad_getManyActividadesByIdCausa
} = useActividadStore()
const {
  procesoPam
} = usePamStore()

const tituloResumen = computed(() =>
  `Resumen Causa Principal  |  RUC ${resumenCausa.value?.ruc} - ${resumenCausa.value?.delito || 'Delito'}`
)

const isLoadingBtnAgrupacion = ref(false)

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

function getAllSujetosByManyIdDenuncia () {
  // desestructurar los delitos
  const relaciones = causasRelacionadas.value.map((el) => { return el?.delitos })

  // desestructurar los ids y si hay repetidos no tomarlos en cuenta
  const idDenuncias = new Set(relaciones.flatMap(arr => arr.map(obj => obj.idDenuncia)))

  // volver a transformar en un arreglo
  const uniqueIds = Array.from(idDenuncias)

  // llamar al servicio para traerme todos los delitos asociados a n causas
  requestUtil({
    action: sujetosIntervinientes_getManySujetosByIdDenuncia,
    payload: {
      listaDenuncias: uniqueIds
    },
    resolve: (_res) => {},
    reject: (_err) => { console.log(_err) },
    loader: (l) => { tables.sujetos.isLoading = l }
  })
}

function getAllDiligenciasByManyIdCausa () {
  // desestructurar los ids Causas
  const idCausas = causasRelacionadas.value.map((el) => { return el?.causaId })

  // llamar al servicio para traerme todos los delitos asociados a n causas
  requestUtil({
    action: actividad_getManyActividadesByIdCausa,
    payload: {
      params: {
        'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
        'cod-estados': '1,7,3,8' // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
      },
      listaCausas: idCausas
    },
    resolve: (_res) => {},
    reject: (_err) => { console.log(_err) },
    loader: (l) => { tables.sujetos.isLoading = l }
  })
}

function obtenerRucsDeCausas (_causasRelacionadas) {
  const rucCausaPrincipal = causaPrincipal.value?.ruc

  const rucs = _causasRelacionadas
    .filter((el) => el.ruc !== rucCausaPrincipal)
    .map((el) => el.ruc)

  return rucs
}

function obtenerIdsRelaciones (_relaciones) {
  const relacionesIds = _relaciones.map((el) => { return el?.idRelacionDelito })

  return relacionesIds
}

function obtenerIdsEspecies (_especies) {
  const especiesIds = _especies.map((el) => { return el?.idEspecie })

  return especiesIds
}

function obtenerIdsDiligencias (_diligencias) {
  const diligenciasIds = _diligencias.map((el) => { return el?.idActividad })

  return diligenciasIds
}

// eslint-disable-next-line no-unused-vars
async function completarAgrupacionDeCausas () {
  const rucCausaPrincipal = causaPrincipal.value?.ruc

  const payloadParsed = {
    listaRucAgrupados: obtenerRucsDeCausas(causasRelacionadas.value),
    listaIdRelacionesParaAgrupar: obtenerIdsRelaciones(relaciones.value),
    listaIdEspeciesDineroParaAgrupar: obtenerIdsEspecies(especies.value),
    listaIdDiligenciasParaAgrupar: obtenerIdsDiligencias(actividades.value),
    idTarea: procesoPam.value?.taskId,
    rucPrincipal: rucCausaPrincipal
  }

  await requestUtil({
    action: dirigirInvestigacion_putAgrupacionCausas,
    payload: {
      ...payloadParsed
    },
    resolve: (_res) => {
      toastSuccess('¡La agrupación ha sido registrada con éxito!')
      setTimeout(() => {
        router.push({ name: 'BandejaDirigirInvestigacion' })
      }, 136)
    },
    reject: (_res) => { console.log(_res) },
    loader: (l) => { isLoadingBtnAgrupacion.value = l }
  })
}

const handleNextStep = () => {
  launchConfirmDialog({
    header: 'Definir Agrupación',
    message: `¿Está seguro de querer Definir Agrupación?`,
    acceptLabel: 'Definir Agrupación',
    accept: () => {
      completarAgrupacionDeCausas()
    }
  })
}

onMounted(() => {
  getAllSujetosByManyIdDenuncia()
  getAllDiligenciasByManyIdCausa()
})
</script>
