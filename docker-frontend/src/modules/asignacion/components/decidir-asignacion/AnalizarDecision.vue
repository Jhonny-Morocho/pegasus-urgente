<template>
<section class="mt-4">
  <AppFieldset
    class="pb-3"
    legend="Consultar"
  >
    <div class="col-12 md:col-4">
      <Button
        class="btn-consultar h-full"
        icon="pi pi-angle-double-right"
        icon-pos="right"
        label="Ver Carga de Trabajo FL y Unidades"
        :loading="isLoading || loadingStates.guardarCausasRelacionadas"
        @click="handleModalCargaTrabajo"
      />
    </div>
    <div class="col-12 md:col-4">
      <Button
        class="btn-consultar h-full"
        icon="pi pi-angle-double-right"
        icon-pos="right"
        label="Ver Competencia Territorial"
        :loading="isLoading || loadingStates.guardarCausasRelacionadas"
        @click="handleModalCompetenciaTerritorial"
      />
    </div>
    <div class="col-12 md:col-4">
      <Button
        class="btn-consultar h-full"
        icon="pi pi-angle-double-right"
        icon-pos="right"
        label="Causas Relacionadas"
        :loading="isLoading || loadingStates.guardarCausasRelacionadas"
        @click="openCausasRelacionadas"
      />
    </div>
  </AppFieldset>

  <AppFieldset
    v-if="hasPropuestaAsignacion"
    class="col-12"
    legend="Propuesta del Preclasificador"
  >
    <PropuestaPreclasificador :propuesta="preclasificacion" />
  </AppFieldset>

  <AppFieldset
    class="col-12"
    legend="Decidir Asignación"
  >
    <AppDropdown
      id="decision-causa"
      v-model="decision"
      class="col-12 lg:col-4 p-fluid"
      label="Seleccione Decisión"
      option-label="descripcion"
      option-value="codigo"
      :options="decisionPropuestaAsignacion"
      placeholder
      :retrieve-data-action="mantenedor_getDecisionAsignacion"
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
        :loading="isLoading"
        @click="handleDecisionCausa"
      />
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useAppDialog, useAppGlobalProperties, useAppToast, useConfirmDialog, useDynamicDialog } from '@/modules/common/composables'
import {
  useCausasRelacionadasStore,
  useGeorreferenciaStore,
  useMantenedorStore,
  usePamStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import { useCausaAsignacionStore, useLoadingStates } from '@/modules/asignacion/composables'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'
import ModalConsultarCausasRelacionadas from '@/modules/global/components/causas-relacionadas/ModalConsultarCausasRelacionadas.vue'
import AprobarRechazarAsignacionModal from '@/modules/asignacion/components/modals/AprobarRechazarAsignacionModal.vue'
import PropuestaPreclasificador from '@/modules/asignacion/components/propuesta-asignacion/PropuestaPreclasificador.vue'
import ModalCompetenciaTerritorial from '@/modules/global/components/competencia-territorial/ModalCompetenciaTerritorial.vue'

const router = useRouter()

const { launchDynamicDialog } = useDynamicDialog()
const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()

const { toastSuccess } = useAppToast()

const { loadingStates } = useLoadingStates()

const { $userName, $userRoles } = useAppGlobalProperties()

const { georreferencia_SET_FISCALIAS_COMPETENTES } = useGeorreferenciaStore()

const {
  paginacion,
  sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()

const { procesoPam } = usePamStore()

const {
  ruc,
  causaActual,
  idDenuncia,
  preclasificacion,
  hasPropuestaAsignacion,
  causaAsignacion_completarDecidirAsignacion,
  causaAsignacion_completarAgregarComentarioPreclasificador
} = useCausaAsignacionStore()

const {
  decisionAsignacion,
  mantenedor_getDecisionAsignacion,
  mantenedor_getNombreDecisionAsignacionByCodigo
} = useMantenedorStore()

const {
  causasRelacionadas_guardarCausasRelacionadas
} = useCausasRelacionadasStore()

const decision = ref()
const isLoading = ref(false)

const nroIntervinientes = computed(() => paginacion.value?.elementosTotales)

const idCausa = computed(() => causaActual.value?.causa?.idCausa)

const propuestaPreclasificador = reactive({
  propuestaAsignacion: '',
  complejidad: '',
  especialidad: '',
  fiscales: '',
  motivoAsignacion: ''
})

const rolUsuario = computed(() => $userRoles.value.find(el => el.includes('jefe')) ? 'Fiscal Jefe' : 'Fiscal')

const decisionPropuestaAsignacion = computed(() => {
  const rechazaOption = [{ codigo: 'rechazo', descripcion: 'Rechazar Propuesta' }]

  return hasPropuestaAsignacion.value
    ? decisionAsignacion.value.concat(rechazaOption)
    : decisionAsignacion.value
})

function descripcionDecision (codigoDecision) {
  return mantenedor_getNombreDecisionAsignacionByCodigo(codigoDecision)
}

// CUANDO RECHAZA VA FALSE ACEPTARPROPUESTA Y LUEGO EJECUTA LA FUNCION POR PARAMETRO
function completarDecidirAsignacion ({ aceptaPropuesta, resolve, motivo, anotacion }) {
  requestUtil({
    action: causaAsignacion_completarDecidirAsignacion,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId,
      decision: {
        decisionAsignacion: decision.value,
        aceptaPropuesta,
        motivo,
        anotacion
      }
    },
    loader: (value) => {
      isLoading.value = value
    },
    resolve: () => {
      resolve()
    }
  })
}

async function handleDecisionCausa () {
  if (decision.value === 'rechazo') {
    rechazarPropuesta()
  } else {
    aceptarPropuesta()
  }
}

function aceptarPropuesta () {
  launchConfirmDialog({
    message: `Estas a punto de "${descripcionDecision(decision.value)}", ¿Estas Seguro(a)?`,
    accept: () => {
      completarDecidirAsignacion({
        aceptaPropuesta: true,
        resolve: () => pushToDecision(decision.value)
      })
    }
  })
}

function rechazarPropuesta () {
  launchDialog({
    component: AprobarRechazarAsignacionModal,
    header: 'Rechazar Asignación',
    confirmLabel: 'Confirmar Rechazo',
    props: {
      isAprobado: false,
      data: {
        ruc: ruc.value,
        numeroIntervinientes: nroIntervinientes.value,
        complejidad: propuestaPreclasificador?.complejidad,
        fiscalPropuesto: propuestaPreclasificador?.especialidadFiscales
      }
    },
    accept: ({ motivo }) => {
      completarDecidirAsignacion({
        aceptaPropuesta: false,
        motivo: motivo,
        anotacion: {
          denunciaId: idDenuncia.value,
          anotacion: motivo,
          autor: $userName.value,
          rol: rolUsuario.value,
          etapa: 'Asignacion'
        },
        resolve: () => completarAgregarComentarioPreclasificador()
      })
    }
  })
}

// eslint-disable-next-line no-unused-vars
function completarAgregarComentarioPreclasificador () {
  requestUtil({
    action: causaAsignacion_completarAgregarComentarioPreclasificador,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId,
      comentario: '' // PONER COMNETARIO CUANDO ENDPOINT LO RECIBA
    },
    loader: (value) => {
      isLoading.value = value
    },
    resolve: () => {
      toastSuccess('Exitoso! Causa Rechazada')
      router.push({ name: 'BandejaAsignacion' })
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

async function openCausasRelacionadas () {
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
    loader: (l) => { loadingStates.guardarCausasRelacionadas = l },
    resolve: () => {
      toastSuccess('Se Guardaron las Causas Relacionadas')
    }
  })
}

function pushToDecision (codigoDecision) {
  switch (codigoDecision) {
    case 'clasificacion':
      router.push({ name: 'DASeguirLineaInvestigativa' })
      break
    case 'transferencia':
      router.push({ name: 'DATransferirCausa' })
      break
    case 'agrupacion':
      router.push({ name: 'DAAgruparCausa' })
      break
    case 'desestimacion':
      router.push({ name: 'DADesestimarCausa' })
      break
  }
}

function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

onMounted(() => {
  getSujetos()
})
</script>

<style lang="scss" scoped>
.btn-consultar {
  background-color: #2196f3 !important;
  text-align: center;
  padding: 1rem;
  width: 100%;
  font-size: 1.1rem;

  &:disabled{
    background-color: #e0e0e0 !important;
  }
}
</style>
