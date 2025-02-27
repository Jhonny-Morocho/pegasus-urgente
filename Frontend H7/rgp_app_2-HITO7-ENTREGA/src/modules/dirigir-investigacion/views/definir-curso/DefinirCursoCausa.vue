<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`Nombre Causa: ${resumenCausa?.nombreCausa}`"
    :page-subtitle="`RUC: ${ruc}`"
    page-title="Definir Curso de la Causa"
  />

  <div class="wrapper-routes">
    <section class="p-fluid mb-5">
      <h4 class="ml-2 col-12">
        Tomar decisión sobre Causa o Relación:
      </h4>
      <div class="col-12 md:col-4 grid">
        <AppSelectButton
          id="tomar-decision-sobre"
          v-model="esCausaORelacion"
          class="w-full"
          option-label="descripcion"
          option-value="id"
          :options="causaORelacionOptions"
          @change="resetDecision"
        />
      </div>
    </section>

    <AppFieldset
      v-if="esCausaORelacion"
      class="w-full pb-0"
      :legend="esCausaORelacion === 'causa' ? 'Seleccione curso de acción de Causa' : 'Seleccione curso de acción de Relación'"
    >
      <div class="col-6 grid m-0 p-fluid">
        <div class="col-6">
          <AppDropdown
            v-if="esCausaORelacion === 'causa'"
            id="decision-causa"
            v-model="decisionCausaORelacion"
            label="Seleccione Decisión"
            option-label="descripcion"
            option-value="id"
            :options="decisionesCausa"
            placeholder
            :retrieve-data-action="mantenedor_getDecisionesCausa"
            show-clear
            @change="checkDecisionEmpty"
          />
          <AppDropdown
            v-else
            id="decision-causa"
            v-model="decisionCausaORelacion"
            label="Seleccione Decisión"
            option-label="descripcion"
            option-value="id"
            :options="decisionesRelaciones"
            placeholder
            :retrieve-data-action="mantenedor_getDecisionesRelaciones"
            show-clear
            @change="checkDecisionEmpty"
          />
        </div>
        <div class="col-6">
          <Button
            class="btn-primary"
            :disabled="!decisionCausaORelacion"
            icon="pi pi-angle-double-right"
            icon-pos="right"
            label="Continuar"
            @click="openModalContinuarAccion"
          />
        </div>
      </div>

      <div
        v-if="showConsultas"
        class="col-6 grid m-0"
      >
        <div class="col-6">
          <Button
            class="p-button-outlined w-full"
            icon="pi pi-external-link"
            icon-pos="right"
            label="Ver Competencia Territorial"
            @click="openModalCompetenciaTerritorial"
          />
        </div>
        <div class="col-6">
          <Button
            class="p-button-outlined w-full"
            icon="pi pi-external-link"
            icon-pos="right"
            label="Ver Causas Relacionadas"
            @click="openModalCausasRelacionadas"
          />
        </div>
      </div>
    </AppFieldset>

    <RouterView />
  </div>

  <AppBtnsSteps no-button-back />
  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined px-5"
      icon="pi pi-arrow-left"
      icon-pos="left"
      label="Volver a Revisar Antecedentes de la Causa"
      @click="handleVolverARevisarAntecedentes"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useAppDialog, useAppToast, useConfirmDialog, useDynamicDialog } from '@/modules/common/composables'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'
import { useCausasRelacionadasStore, useGeorreferenciaStore, useMantenedorStore, useRelacionesStore } from '@/modules/global/composables'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import ModalConsultarCausasRelacionadas from '@/modules/global/components/causas-relacionadas/ModalConsultarCausasRelacionadas.vue'
import ModalCompetenciaTerritorial from '@/modules/global/components/competencia-territorial/ModalCompetenciaTerritorial.vue'

const { launchDynamicDialog } = useDynamicDialog()
const { launchDialog } = useAppDialog()
const { toastSuccess } = useAppToast()

const router = useRouter()

const {
  decisionesCausa,
  decisionesRelaciones,
  mantenedor_getDecisionesCausa,
  mantenedor_getDecisionesRelaciones
} = useMantenedorStore()

const {
  causasRelacionadas_getCausasRelacionadas,
  causasRelacionadas_guardarCausasRelacionadas
} = useCausasRelacionadasStore()
const {
  relaciones_getRelaciones
} = useRelacionesStore()

const { georreferencia_SET_FISCALIAS_COMPETENTES } = useGeorreferenciaStore()

const {
  ruc,
  idDenuncia,
  resumenCausa,
  dirigirInvestigacion_getResumenCausa,
  causa,
  dirigirInvestigacion_SET_SELECCION_DECISION
} = useDirigirInvestigacionStore()

const idCausa = computed(() => causa.value?.data?.causa?.idCausa)

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const { launchConfirmDialog } = useConfirmDialog()

const esCausaORelacion = ref('causa') // comienza en causa
const decisionCausaORelacion = ref(null)

const hasConsultas = ['Agrupar', 'Separar', 'Transferir']

const showConsultas = computed(() => {
  const decision = getDescripcioncausaOptions(decisionCausaORelacion.value)
  return hasConsultas.some(d => d === decision?.descripcion)
})

function checkDecisionEmpty () {
  if (!decisionCausaORelacion.value) {
    router.push({ name: 'DIDefinirCursoCausa' })
  }
}

function resetDecision () {
  router.push({ name: 'DIDefinirCursoCausa' })
  decisionCausaORelacion.value = null
}

function openModalContinuarAccion () {
  const decision = getDescripcioncausaOptions(decisionCausaORelacion.value)

  launchConfirmDialog({
    header: 'Decisión sobre Causa o Relación',
    message: `¿Estás seguro de la Decisión sobre Causa o Relación?, Decision: ${decision?.descripcion}`,
    accept: () => continuarAccion(decision)
  })
}

function continuarAccion (_decision) {
  dirigirInvestigacion_SET_SELECCION_DECISION(_decision)
  if (esCausaORelacion.value === 'causa') {
    switch (_decision.codigo) {
      case '1': // agrupar
        router.push({ name: 'DIDCCAgruparCausas' })
        break
      case '2': // separar
        router.push({ name: 'DIDCCSepararCausa' })
        break
      case '3': // transferir
        router.push({ name: 'DIDCCTransferirCausa' })
        break
      case '4': // cierre
        router.push({ name: 'DIDCCCierreInvestigacionCausa' })
        break
      case '5': // termino
        router.push({ name: 'DIDCCTerminoCausa' })
        break
      case '6': // suspension
        router.push({ name: 'DIDCCSuspensionCausa' })
        break
    }
  } else {
    switch (_decision.codigo) {
      case '1': // cierre
        router.push({ name: 'DIDCCCierreInvestigacionRelacionCausa' })
        break
      case '2': // termino
        router.push({ name: 'DIDCCTerminoRelacionCausa' })
        break
      case '3': // suspension
        router.push({ name: 'DIDCCSuspensionRelacionCausa' })
        break
    }
  }
}

function handleVolverARevisarAntecedentes () {
  launchConfirmDialog({
    header: 'Volver a Revisar Antecedentes de la Causa',
    message: `¿Está seguro de Volver a Revisar Antecedentes de la Causa?`,
    accept: () => router.push({ name: 'DIRAResumenCausa' })
  })
}

function getDescripcioncausaOptions (_idSeleccion) {
  let opcionCausa = null

  if (esCausaORelacion.value === 'causa') {
    opcionCausa = decisionesCausa.value.find((el) => el.id === _idSeleccion)
    return opcionCausa
  } else {
    opcionCausa = decisionesRelaciones.value.find((el) => el.id === _idSeleccion)
    return opcionCausa
  }
}

function openModalCausasRelacionadas () {
  launchDynamicDialog({
    component: ModalConsultarCausasRelacionadas,
    header: 'Consultar Causas Relacionadas',
    width: '80%',
    onClose: ({ data }) => {
      console.log('data de causar seleccionadas', data)
      if (data?.length) {
        guardarCausasRelacionadas(data)
      }
    }
  })
}

function openModalCompetenciaTerritorial () {
  launchDialog({
    component: ModalCompetenciaTerritorial,
    header: 'Competencia Territorial',
    width: '90%',
    confirmLabel: 'Guardar Georreferenciación',
    props: {
      idDenuncia: idDenuncia.value
    },
    accept: (data) => {
      if (data.length) {
        console.log('🚀 ~ file: DefinirCursoCausa.vue:278 ~ openModalCompetenciaTerritorial ~ data', data)
        georreferencia_SET_FISCALIAS_COMPETENTES(data)
        toastSuccess('Se guardó la competencia territorial')
      }
    }
  })
}

async function obtenerCausasRelacionadasGuardadas (pagination = undefined) {
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  await requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      idCausa: idCausa.value,
      params
    }
  })
}

function guardarCausasRelacionadas (_causas) {
  // payload { idCausa: id de la causa actual, idCausaRelacionada: id de causa seleccionada}
  let causasRelacionadasAGuardar = []

  // generar payload con las causas seleccionadas y sus valores correspondientes
  causasRelacionadasAGuardar = _causas.map((el) => {
    return {
      idCausa: idCausa.value,
      idCausaRelacionada: el.idCausa
    }
  })

  requestUtil({
    action: causasRelacionadas_guardarCausasRelacionadas,
    payload: {
      causasRelacionadas: causasRelacionadasAGuardar
    },
    resolve: () => {
      obtenerCausasRelacionadasGuardadas()
    }
  })
}

const firstRecord = ref(0)
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
    }
  })
}

const causaORelacionOptions = [
  { id: 'causa', descripcion: 'Causa' },
  { id: 'relacion', descripcion: 'Relacion' }
]

onMounted(() => {
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: {
      ruc: ruc.value
    }
  })
  getRelaciones()
})
</script>
