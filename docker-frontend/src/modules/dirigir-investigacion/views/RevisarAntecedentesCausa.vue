<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`RUC: ${ruc}`"
    page-title="Revisar Antecedentes de la Causa"
  />

  <section class="flex justify-content-center mb-4 mt-5">
    <TabMenu :model="tabsRevisarAntecedentes" />
  </section>

  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnsSteps
    :loading="isLoading"
    @back-step="handleBackStep"
  />

  <AppBtnNextTeleported
    class="ml-8"
    label="Desarrollo de la Investigación"
    :loading="isLoading"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { h, ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppToast, useConfirmDialog, useDynamicDialog, useAppGlobalProperties } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { usePamStore, useCausasRelacionadasStore, useActividadStore } from '@/modules/global/composables'
import Button from 'primevue/button'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'
import ModalConsultaRF from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalConsultaRF.vue'
import ModalActualizarAntecedentes from '@/modules/dirigir-investigacion/components/modals/ModalActualizarAntecedentes.vue'
import ModalConsultarCausasRelacionadas from '@/modules/global/components/causas-relacionadas/ModalConsultarCausasRelacionadas.vue'
import ModalSolicitarAntecedentesEspecificos from '@/modules/dirigir-investigacion/components/modals/ModalSolicitarAntecedentesEspecificos.vue'

const router = useRouter()

const { procesoPam } = usePamStore()
const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { launchDynamicDialog } = useDynamicDialog()
const { toastSuccess, toastError } = useAppToast()
const { $userFiscaliaActual } = useAppGlobalProperties()

const {
  ruc,
  causa,
  idDenuncia,
  dirigirInvestigacion_completarRevisarAntecedentesInvestigacion,
  dirigirInvestigacion_iniciarYReservar,
  dirigirInvestigacion_SET_DIRECTRIZ_OBLIGATORIA
} = useDirigirInvestigacionStore()

const {
  causasRelacionadas_getCausasRelacionadas,
  causasRelacionadas_guardarCausasRelacionadas
} = useCausasRelacionadasStore()

const { actividad_getDirectrizAutomatica } = useActividadStore()

const loadingState = reactive({
  iniciarReservar: false,
  completarRevisarAntecedentes: false,
  directrizAutomatica: false
})

const isLoading = computed(() => {
  const loadingValues = Object.values(loadingState)
  return loadingValues.some(loading => loading)
})

const idCausa = computed(() => {
  return causa.value?.data?.causa?.idCausa
})

const nombreTareaPam = computed(() => procesoPam.value?.taskName)

function openConfirmIngresarDirectriz () {
  const conDirectrizExistente = false
  const messageCD = 'De acuerdo al delito o penalidad del delito, serás redirigido a Ingresar Directriz de Investigación'
  const messageSD = '¿Desea ingresar una Directriz de Investigación?'

  launchConfirmDialog({
    header: 'Ingresar Directriz de Investigación',
    message: conDirectrizExistente ? messageCD : messageSD,
    rejectClass: conDirectrizExistente ? 'hidden' : undefined,
    acceptLabel: conDirectrizExistente ? 'Aceptar' : 'Si',
    rejectLabel: 'No',
    accept: () => {
      if (conDirectrizExistente) {
        router.push({ name: 'DIActualizarDirectrizInvestigacion' })
      } else {
        completarRevisarAntecedentesInvestigacion({
          ingresaDirectriz: true
        })
      }
    },
    reject: () => {
      completarRevisarAntecedentesInvestigacion({
        ingresaDirectriz: false
      })
    }
  })
}

function openAcceptDirectrizObligatoria () {
  launchConfirmDialog({
    header: 'Ingresar Directriz de Investigación',
    message: 'De acuerdo al delito o penalidad del delito, serás redirigido a Ingresar Directriz de Investigación',
    rejectClass: 'hidden',
    acceptLabel: 'Aceptar',
    accept: () => {
      completarRevisarAntecedentesInvestigacion({
        ingresaDirectriz: true
      })
    }
  })
}

function completarRevisarAntecedentesInvestigacion ({ ingresaDirectriz }) {
  const requestBody = {
    alertaCruzada: false,
    alertaSinDecision: false,
    retipificarDelito: false,
    actualizarAntecedente: false,
    verCausaRelacionada: false,
    verFichaSujetos: false,
    solicitarAntecedentes: false,
    definirMedidas: false,
    verCompetencia: false,
    esSegundaAlerta: false,
    invocaProTransversales: false,
    ingresaDirectrices: ingresaDirectriz,
    codFiscalia: $userFiscaliaActual.value?.fiscalia,
    codRegion: $userFiscaliaActual.value?.region
  }

  requestUtil({
    action: dirigirInvestigacion_completarRevisarAntecedentesInvestigacion,
    payload: {
      ...procesoPam.value,
      requestBody,
      taskId: procesoPam.value?.taskId
    },
    loader: (l) => { loadingState.completarRevisarAntecedentes = l },
    reject: () => {
      toastError('Ha ocurrido un error en el servidor, intente de nuevo')
    },
    resolve: () => {
      iniciarYReservarTarea({
        resolve: () => {
          ingresaDirectriz
            ? router.push({ name: 'DIIngresarDirectrizInvestigacion' })
            : router.push({ name: 'DIDesarrolloInvestigacion' })
        }
      })
    }
  })
}

function iniciarYReservarTarea ({ resolve }) {
  requestUtil({
    action: dirigirInvestigacion_iniciarYReservar,
    payload: {
      ...procesoPam.value
    },
    loader: (l) => { loadingState.iniciarReservar = l },
    resolve,
    reject: (err) => {
      console.error(err)
    }
  })
}

function getDirectrizAutomatica () {
  requestUtil({
    action: actividad_getDirectrizAutomatica,
    payload: {
      params: {
        'id-denuncia': idDenuncia.value,
        'cod-region': $userFiscaliaActual.value.region
      }
    },
    loader: (l) => { loadingState.directrizAutomatica = l },
    resolve: (data) => {
      const directrizObligatoria = data?.some(value => value?.directriz)

      dirigirInvestigacion_SET_DIRECTRIZ_OBLIGATORIA(directrizObligatoria)

      if (directrizObligatoria) {
        openAcceptDirectrizObligatoria()
      } else {
        openConfirmIngresarDirectriz()
      }
    }
  })
}

function handleNextStep () {
  if (
    appUtil.includeWord(nombreTareaPam.value, 'Analizar Antecedentes de la Causa y Decidir')
  ) {
    // control si se devuelve a esta vista y el proceso pam esta pegado en otra tarea
    // enviar directamente a vista correspondiente y no mover flujo pam
    router.push({ name: 'DIDesarrolloInvestigacion' })
  } else if (nombreTareaPam.value === 'Solicitar Audiencia Formalizacion') {
    router.push({ name: 'DIDesarrolloInvestigacion' })
  } else if (nombreTareaPam.value === 'Tomar Decision de la Causa Relacion') {
    router.push({ name: 'DIDefinirCursoCausa' })
  } else if (nombreTareaPam.value === 'Definir nueva Causa') {
    router.push({ name: 'DIDefinirNuevaCausa' })
  } else {
    // si es cualquier otro proceso seguir flujo normal
    // Consulta si debe ingresar directriz obligatoria segun delito
    getDirectrizAutomatica()
  }
}

function handleBackStep () {
  router.push({ name: 'BandejaDirigirInvestigacion' })
}

function openModalCargaTrabajo () {
  launchDialog({
    component: ModalCargaTrabajo,
    header: 'Ver Carga de Trabajo FL y Unidades',
    width: '90%',
    cancelIcon: '',
    cancelLabel: 'Cerrar'
  })
}

function openModalSolicitarAntecedentes () {
  const modal = launchDynamicDialog({
    component: ModalSolicitarAntecedentesEspecificos,
    header: 'Solicitar Antecedentes Específicos',
    width: '85%',
    templates: {
      footer: () => {
        return [h(Button, { label: 'Cerrar', onClick: () => modal.close(), class: 'p-button-text' })]
      }
    }
  })
}

function openModalActualizarAntecedentes () {
  const modal = launchDynamicDialog({
    component: ModalActualizarAntecedentes,
    header: 'Actualizar Antecedentes',
    width: '85%',
    templates: {
      footer: () => {
        return [h(Button, { label: 'Cerrar', onClick: () => modal.close(), class: 'p-button-text' }), h(Button, { label: 'Actualizar Antecedentes', onClick: () => modal.close(), class: 'p-button' })]
      }
    }
  })
}

function openModalCausasRelacionadas () {
  launchDynamicDialog({
    component: ModalConsultarCausasRelacionadas,
    header: 'Consultar Causas Relacionadas',
    width: '80%',
    onClose: ({ data }) => {
      if (data?.length) {
        guardarCausasRelacionadas(data)
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
      toastSuccess('Se Guardaron las Causas Relacionadas')
    }
  })
}

function openModalConsultaFR () {
  launchDynamicDialog({
    component: ModalConsultaRF,
    header: 'Consultar al Fiscal Regional',
    width: '40vw',
    onClose: (options) => {
      const data = options.data
      if (data) {
        toastSuccess('Consulta Enviada!')
      }
    }
  })
}

const itemsMenuSuperior = ref([
  {
    label: 'Procesos Transversales',
    icon: 'pi pi-building',
    disabled: () => false,
    items: [
      {
        label: 'Consulta FR',
        command: () => openModalConsultaFR()
      },
      {
        label: 'Transferir Causa',
        disabled: () => true
      }
    ]
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',
    disabled: () => false,
    items: [
      {
        label: 'Causas Relacionadas',
        command: () => {
          openModalCausasRelacionadas()
        }
      },
      {
        label: 'Solicitar Antecedentes Específicos',
        command: () => {
          openModalSolicitarAntecedentes()
        },
        disabled: () => true
      },
      {
        label: 'Actualizar Antecedentes',
        command: () => {
          openModalActualizarAntecedentes()
        },
        disabled: () => true
      },
      {
        label: 'Carga de Trabajo FL',
        command: () => {
          openModalCargaTrabajo()
        }
      }
    ]
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => router.go()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    disabled: () => true
  }
])

const tabsRevisarAntecedentes = [
  { label: 'Resumen de la Causa', to: { name: 'DIRAResumenCausa' } },
  { label: 'Sujetos Intervinientes', to: { name: 'DIRASujetosIntervinientes' } },
  { label: 'Delitos', to: { name: 'DIRADelitos' } },
  { label: 'Relaciones', to: { name: 'DIRARelaciones' } },
  { label: 'Especies/Dinero', to: { name: 'DIRAEspeciesDinero' } },
  { label: 'Relato', to: { name: 'DIRARelato' } },
  { label: 'Documentos', to: { name: 'DIRADocumentos' } },
  { label: 'Diligencias', to: { name: 'DIRADiligencias' } },
  { label: 'Historial de la Causa', to: { name: 'DIRAHistorialCausa' } }
]
</script>

<style lang="scss" scoped>
::v-deep(.p-tabmenu) {
  .p-tabmenu-nav {
    .p-tabmenuitem {
      a.p-menuitem-link {
        height: 100%;
      }
    }
  }
}
</style>
