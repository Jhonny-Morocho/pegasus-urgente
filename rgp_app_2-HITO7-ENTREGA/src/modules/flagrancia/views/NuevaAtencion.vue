<template>
<section>
  <PageHeader
    :hide-items-menu-superior="route.path === '/flagrancia/nueva-atencion' ? false : true "
    :page-subtitle="subtitulo"
    :page-title="usuario"
    steps-flagrancia-btns
    @action:exit="$router.push('/flagrancia')"
  />
  <AppSteps
    class="pr-0"
    :model="flagranciaFormularioSteps"
  />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    :button-back-disabled="
      $route.path === `${toRoutePrefix}/nueva-atencion/registro-contacto`
    "
    :no-button-back="$route.path === '/flagrancia/nueva-atencion/registro-contacto'"
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
import { useProcedimientosBandejaStore, useStepRegistroContactoStore } from '@/modules/flagrancia/composables'
import { useSessionStore } from '@/modules/session/composables'

const { tieneFolio } = useProcedimientosBandejaStore()
const { folio } = useStepRegistroContactoStore()
const { $hasSomeRoles, $userFiscaliaActual } = useAppGlobalProperties()
const { perfiles } = useSessionStore()

const route = useRoute()
const router = useRouter()

const usuario = ref('')
const subtitulo = ref('')

const fiscalTurno = computed(() => perfiles.value[6].fiscal_turno)

onMounted(() => {
  if (($hasSomeRoles(fiscalTurno.value) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`])) && !tieneFolio.value) {
    usuario.value = 'Fiscal Turno'
    subtitulo.value = 'Nuevo Procedimiento'
  } else if ($hasSomeRoles(fiscalTurno.value) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`])) {
    usuario.value = 'Fiscal Turno'
    subtitulo.value = 'Procedimiento ' + folio.value
  } else {
    usuario.value = 'Equipo Turno'
    subtitulo.value = 'Nuevo Procedimiento'
  }
})

// si existe el param idProcedimiento(cuando se accede en modo lectura) lo agrega como prefijo
const toRoutePrefix = route.params.idProcedimiento ? `/flagrancia/${route.params.idProcedimiento}` : '/flagrancia'

const flagranciaFormularioSteps = [
  {
    label: 'Registro Contacto',
    to: `${toRoutePrefix}/nueva-atencion/registro-contacto`
  },
  {
    label: 'Sujetos Intervinientes',
    to: `${toRoutePrefix}/nueva-atencion/sujeto-intervinientes`
  },
  {
    label: 'Delito',
    to: `${toRoutePrefix}/nueva-atencion/delito`
  },
  {
    label: 'Relaciones',
    to: `${toRoutePrefix}/nueva-atencion/relaciones`
  },
  {
    label: 'Especies y Dinero',
    to: `${toRoutePrefix}/nueva-atencion/especies-dinero`
  },
  {
    label: 'Relato del Hecho',
    to: `${toRoutePrefix}/nueva-atencion/relato-hecho`
  },
  {
    label: 'Documentos',
    to: `${toRoutePrefix}/nueva-atencion/documentos`
  },
  {
    label: 'Emitir Instrucciones',
    to: `${toRoutePrefix}/nueva-atencion/diligencias-e-instrucciones`
  },
  {
    label: 'Decidir Detenidos Pasan a ACD',
    to: `${toRoutePrefix}/nueva-atencion/detenidos-acd`,
    visible: () => $hasSomeRoles(fiscalTurno.value) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`])
  }
]
// devolver arriba  && folio.value
function handleBackStep () {
  const flagranciaFormulatioStepIndexToBack = flagranciaFormularioSteps.findIndex((s) => s.to === route.path)

  router.push(flagranciaFormularioSteps[flagranciaFormulatioStepIndexToBack - 1].to)
}

function handleNextStep (to) {
  router.push({
    name: to,
    params: {
      idProcedimiento: route.params.idProcedimiento
    }
  })
}
</script>
