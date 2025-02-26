<template>
<section class="mt-4">
  <AppFieldset
    class="pb-3"
    legend="Consultar"
  >
    <div class="col-12 md:col-4">
      <Button
        class="btn-consultar"
        icon="pi pi-angle-double-right"
        icon-pos="right"
        label="Ver Carga de Trabajo FL y Unidades"
        @click="handleModalCargaTrabajo"
      />
    </div>
    <div class="col-12 md:col-4">
      <Button
        class="btn-consultar"
        icon="pi pi-angle-double-right"
        icon-pos="right"
        label="Ver Competencia Territorial"
        @click="handleModalCompetenciaTerritorial"
      />
    </div>
    <div class="col-12 md:col-4">
      <Button
        class="btn-consultar"
        icon="pi pi-angle-double-right"
        icon-pos="right"
        label="Causas Relacionadas"
        :loading="loadingState.guardarCausasRelacionadas"
        @click="openCausasRelacionadas"
      />
    </div>
  </AppFieldset>
  <AppFieldset
    class="col-12"
    legend="Proponer Asignación"
  >
    <AppDropdown
      id="decision-causa"
      v-model="decision"
      class="col-12 lg:col-4 p-fluid"
      label="Seleccione Decisión"
      option-label="descripcion"
      option-value="codigo"
      :options="decisionAsignacion"
      placeholder
      :retrieve-data-action="mantenedor_getDecisionAsignacion"
      show-clear
    />
    <div
      class="col-9 lg:col-3 p-fluid ml-8 lg:ml-0"
    >
      <Button
        class="btn-primary"
        :disabled="!decision"
        icon="pi pi-angle-double-right"
        icon-pos="right"
        label="Continuar"
        :loading="isLoading || loadingState.guardarCausasRelacionadas"
        @click="handleDecisionCausa"
      />
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useAppDialog, useAppToast, useConfirmDialog, useDynamicDialog } from '@/modules/common/composables'
import { usePamStore, useMantenedorStore, useCausasRelacionadasStore, useGeorreferenciaStore } from '@/modules/global/composables'
import {
  useCausaPreclasificadorStore,
  useLoadingStates
} from '@/modules/preclasificador/composables'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'
import ModalConsultarCausasRelacionadas from '@/modules/global/components/causas-relacionadas/ModalConsultarCausasRelacionadas.vue'
import ModalCompetenciaTerritorial from '@/modules/global/components/competencia-territorial/ModalCompetenciaTerritorial.vue'

const router = useRouter()

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { loadingState } = useLoadingStates()

const { toastSuccess } = useAppToast()

const { procesoPam } = usePamStore()

const {
  idDenuncia,
  causaActual,
  causaPreclasificador_iniciarYReservar,
  causaPreclasificador_completarAnalizarPreclasificacion
} = useCausaPreclasificadorStore()

const { georreferencia_SET_FISCALIAS_COMPETENTES } = useGeorreferenciaStore()

const {
  causasRelacionadas_guardarCausasRelacionadas
} = useCausasRelacionadasStore()

const {
  decisionAsignacion,
  mantenedor_getDecisionAsignacion,
  mantenedor_getNombreDecisionAsignacionByCodigo
} = useMantenedorStore()

const decision = ref('')
const isLoading = ref(false)

const idCausa = computed(() => causaActual.value?.causa?.idCausa)

function handleDecisionCausa () {
  launchConfirmDialog({
    message: `Estas a punto de "${descripcionDecision(decision.value)}", ¿Estas Seguro(a)?`,
    accept: () => {
      requestUtil({
        action: causaPreclasificador_completarAnalizarPreclasificacion,
        payload: {
          ...procesoPam.value,
          decisionCausa: {
            decisionAsignacion: decision.value,
            revisaCargaTrabajo: false,
            revisaGeorreferenciacion: false
          }
        },
        loader: (value) => {
          isLoading.value = value
        },
        resolve: () => {
          nextTick()
          iniciarYReservar()
        }
      })
    }
  })
}

function iniciarYReservar () {
  requestUtil({
    action: causaPreclasificador_iniciarYReservar,
    payload: { ...procesoPam.value },
    resolve: () => {
      pushToDecision(decision.value)
    }
  })
}

function handleModalCargaTrabajo () {
  launchDialog({
    component: ModalCargaTrabajo,
    header: 'Carga de Trabajo FL y Unidades',
    width: '90%'
  })
}

function handleModalCompetenciaTerritorial () {
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
        georreferencia_SET_FISCALIAS_COMPETENTES(data)
        toastSuccess('Se guardó la competencia territorial')
      }
    }
  })
}

function openCausasRelacionadas () {
  launchDynamicDialog({
    component: ModalConsultarCausasRelacionadas,
    header: 'Consultar Causas Relacionadas',
    width: '80%',
    onClose: ({ data }) => {
      if (data?.length) {
        const causas = data.map(c => {
          return {
            idCausa: idCausa.value,
            idCausaRelacionada: c?.idCausa
          }
        })
        guardarCausasRelacionadas(causas)
      }
    }
  })
}

function guardarCausasRelacionadas (causas) {
  requestUtil({
    action: causasRelacionadas_guardarCausasRelacionadas,
    payload: {
      causasRelacionadas: causas
    },
    loader: (l) => { loadingState.guardarCausasRelacionadas = l },
    resolve: () => {
      toastSuccess('Se Guardaron las Causas Relacionadas')
    }
  })
}

function pushToDecision (codigoDecision) {
  switch (codigoDecision) {
    case 'clasificacion':
      router.push({ name: 'PASeguirLineaInvestigativa' })
      break
    case 'transferencia':
      router.push({ name: 'PATransferirCausa' })
      break
    case 'agrupacion':
      router.push({ name: 'PAAgruparCausa' })
      break
    case 'desestimacion':
      router.push({ name: 'PADesestimarCausa' })
      break
  }
}

function descripcionDecision (codigoDecision) {
  return mantenedor_getNombreDecisionAsignacionByCodigo(codigoDecision)
}

</script>

<style lang="scss" scoped>
.btn-consultar {
  background-color: #2196f3 !important;
  text-align: center;
  padding: 16px;
  width: 100%;

  &:disabled{
    background-color: #e0e0e0 !important;
  }
}
</style>
