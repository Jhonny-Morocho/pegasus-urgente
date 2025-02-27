<template>
<section>
  <PageHeader
    :hide-items-menu-superior="route.path === '/flagranciaprocedimiento-creado' ? false : true "
    :page-subtitle="subtitulo"
    :page-title="usuario"
    steps-flagrancia-btns
    @action:exit="$router.push('/flagrancia')"
  />
  <AppSteps
    class="pr-0 col-5"
    :model="stepsNuevaAtencionFiscal"
  />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>
  <AppBtnsSteps
    :button-back-disabled="
      $route.path === `${toRoutePrefix}/procedimiento-creado/analizar-procedimiento/registro-contacto`
    "
    :no-button-back="$route.path === '/flagrancia/procedimiento-creado/analizar-procedimiento/registro-contacto'"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

import { useAppGlobalProperties } from '@/modules/common/composables'
import {
  useProcedimientosBandejaStore,
  useStepDiligenciaStore,
  useStepRegistroContactoStore
} from '@/modules/flagrancia/composables'
import { useSessionStore } from '@/modules/session/composables'
import { usePamStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

const { $hasSomeRoles, $userFiscaliaActual } = useAppGlobalProperties()
const { perfiles } = useSessionStore()
const { folio } = useStepRegistroContactoStore()
const { procesoPam, pam_reservarIniciarTarea } = usePamStore()

const { estadoFolio } = useProcedimientosBandejaStore()
const { stepDiligencia_SET_ES_BACK_DILIGENCIAS, esBackDiligencias, esbtnCerrarFolio } = useStepDiligenciaStore()

const route = useRoute()
const router = useRouter()

const usuario = ref('')
const subtitulo = ref('')

const fiscalTurno = computed(() => perfiles.value[6].fiscal_turno)

onMounted(() => {
  if ($hasSomeRoles(fiscalTurno.value) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`])) {
    usuario.value = 'Fiscal Turno'
    subtitulo.value = 'Procedimiento ' + folio.value
  }
})

// si existe el param idProcedimiento(cuando se accede en modo lectura) lo agrega como prefijo
const toRoutePrefix = route.params.idProcedimiento ? `/flagrancia/${route.params.idProcedimiento}` : '/flagrancia'

const stepsNuevaAtencionFiscal = [
  {
    label: 'Analizar Procedimiento',
    to: { name: 'FlagranciaNuevaAtencionRegistroContactoFiscal' }
  },
  {
    label: 'Emitir Instrucciones',
    to: { name: 'FlagranciaNuevaAtencionDiligenciasEInstruccionesFiscal' }
  },
  {
    label: 'Decidir Detenidos Pasan a ACD',
    to: { name: 'FlagranciaNuevaAtencionDetenidosACDFiscal' },
    disabled: estadoFolio.value !== 'Cerrado' && procesoPam.value.taskName !== ('Decidir si el detenido pasa a ACD y registrar bloque') && esbtnCerrarFolio.value,
    command: () => { if (procesoPam.value.taskStatus === 'Ready' && !esBackDiligencias.value) reservarIniciarTareaACD() }

  }
]
// devolver arriba  && folioProcedimientoData.value
function handleBackStep () {
  if (route.path === '/flagrancia/procedimiento-creado/diligencias-e-instrucciones') {
    router.push({ name: 'FlagranciaNuevaAtencionRegistroContactoFiscal' })
  } else if (route.path === '/flagrancia/procedimiento-creado/detenidos-acd') {
    router.push({ name: 'FlagranciaNuevaAtencionDiligenciasEInstruccionesFiscal' })
  }
}

function handleNextStep (to) {
  router.push({ name: 'FlagranciaNuevaAtencionDetenidosACDFiscal' })
}

function reservarIniciarTareaACD () {
  requestUtil({
    action: pam_reservarIniciarTarea,
    payload: { taskInstanceId: procesoPam.value.taskInstanceId },
    resolve: (r) => {
      stepDiligencia_SET_ES_BACK_DILIGENCIAS(true)
      console.log('reserva e inicia tarea')
    }
  })
}
</script>
