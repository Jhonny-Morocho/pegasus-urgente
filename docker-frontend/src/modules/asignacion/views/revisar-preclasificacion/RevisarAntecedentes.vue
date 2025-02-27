<template>
<div>
  <section class="flex justify-content-center mb-4">
    <TabMenu :model="tabsRevisarAntecedentes" />
  </section>

  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnRightTeleported v-if="hasPropuestaAsignacion">
    <Button
      class="btn-aprobar px-4"
      :icon="isAltaComplejidad ? 'pi pi-send' : 'pi pi-check-circle'"
      icon-pos="right"
      :label="lblIsAltaComplejidad"
      :loading="isLoading || loadingStates.completarSolicitudAntecedentes"
      @click="handleAprobarAsignacion"
    />
  </AppBtnRightTeleported>

  <AppBtnNextTeleported
    class="ml-8"
    :label="hasPropuestaAsignacion ? 'Modificar Asignación' : 'Decidir Asignación'"
    :loading="isLoading || loadingStates.completarSolicitudAntecedentes"
    @click="handleNextStep"
  />
</div>
</template>

<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useCausaAsignacionStore, useFlujoPamAsignacion, useLoadingStates } from '@/modules/asignacion/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AprobarRechazarAsignacionModal from '@/modules/asignacion/components/modals/AprobarRechazarAsignacionModal.vue'
import { usePamStore, useSujetosIntervinientesStore } from '@/modules/global/composables'

const emit = defineEmits(['next-step'])

const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()
const { toastSuccess } = useAppToast()

const {
  ruc,
  idDenuncia,
  esAnalizaAsignacion,
  causaActual,
  escritoConsultaFR,
  hasPropuestaAsignacion,
  causaAsignacion_completarRevisarCalidadAntecedentes,
  isBotonBackFromDa, causaAsignacion_SET_BOTON_BACK_FROM_DA
} = useCausaAsignacionStore()

const { flujoAsignacion } = useFlujoPamAsignacion()

const { paginacion, sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

const { procesoPam } = usePamStore()

const { loadingStates } = useLoadingStates()

const isLoading = ref(false)

const isAltaComplejidad = computed(() => {
  return appUtil.includeWord(causaActual.value?.causa?.complejidad, 'alta')
})

const lblIsAltaComplejidad = computed(() => {
  return isAltaComplejidad.value ? 'Enviar Consulta a FR' : 'Confirmar Asignación'
})

const nroIntervinientes = computed(() => paginacion.value?.elementosTotales)

const dataModal = {
  ruc: ruc.value,
  numeroIntervinientes: nroIntervinientes.value,
  complejidad: causaActual.value?.causa?.complejidad,
  consultaFiscal: escritoConsultaFR.value
}

function handleAprobarAsignacion () {
  launchDialog({
    component: AprobarRechazarAsignacionModal,
    header: lblIsAltaComplejidad.value,
    confirmLabel: lblIsAltaComplejidad.value,
    props: {
      isAprobado: true,
      isAltaComplejidad: isAltaComplejidad.value,
      data: dataModal
    },
    accept: () => {
      if (isAltaComplejidad.value) {
        router.push({ name: 'BandejaAsignacion' })
        toastSuccess('Exitoso! Consulta a FR Enviada')
        return
      }

      completarRevisarAntecedentes({
        aceptaPropuesta: true,
        analizaAsignacion: esAnalizaAsignacion.value,
        resolve: () => {
          toastSuccess('Exitoso! Causa Aprobada')
          router.push({ name: 'BandejaAsignacion' })
        }
      })
    }
  })
}

const baseUrl = '/asignacion/revisar-preclasificacion/antecedentes'
const tabsRevisarAntecedentes = [
  { label: 'Antecedentes de la Causa', to: `${baseUrl}/antecedentes-causa` },
  { label: 'Sujetos Intervinientes', to: `${baseUrl}/sujetos-intervinientes` },
  { label: 'Delitos', to: `${baseUrl}/delitos` },
  { label: 'Relaciones', to: `${baseUrl}/relaciones` },
  { label: 'Especies/Dinero', to: `${baseUrl}/especies-dinero` },
  { label: 'Relato del Hecho', to: `${baseUrl}/relato` },
  { label: 'Documentos', to: `${baseUrl}/documentos` },
  { label: 'Diligencias', to: `${baseUrl}/diligencias` },
  { label: 'Historial de la Causa', to: `${baseUrl}/historial-causa` }
]

function completarRevisarAntecedentes ({ aceptaPropuesta, analizaAsignacion, resolve }) {
  requestUtil({
    action: causaAsignacion_completarRevisarCalidadAntecedentes,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId,
      requiereCambiarTipificacion: flujoAsignacion.requiereCambiarTipificacion, // Cambiar tipificacion u otro
      revisaEspecies: flujoAsignacion.revisaEspecies,
      // revisaObtiene: flujoAsignacion.revisaObtiene, // Revisa y obtiene antecedentes
      revisaObtiene: false,
      antecedentesSuficientes: true,
      analizaAsignacion: esAnalizaAsignacion.value, // Analizar asignacion y cargas de trabajo o competencia
      aceptaPropuesta: aceptaPropuesta /// CUANDO APRUEBA VA EN TRUE Y MANDA LA BANDEJA
    },
    loader: (value) => {
      isLoading.value = value
    },
    resolve: () => {
      resolve()
    }
  })
}

function handleNextStep () {
  if (isBotonBackFromDa.value) {
    emit('next-step', '/asignacion/revisar-preclasificacion/decision')
  } else {
    launchConfirmDialog({
      header: hasPropuestaAsignacion.value ? 'Modificar Asignación' : 'Decidir Asignación',
      message: '¿Está seguro(a) de querer Decidir Asignación?',
      accept: () => {
        completarRevisarAntecedentes({
          aceptaPropuesta: false,
          analizaAsignacion: esAnalizaAsignacion.value,
          resolve: () => {
            causaAsignacion_SET_BOTON_BACK_FROM_DA(true)
            emit('next-step', '/asignacion/revisar-preclasificacion/decision')
          }
        })
      }
    })
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
::v-deep(.p-tabmenu) {
  .p-tabmenu-nav {
    .p-tabmenuitem {
      a.p-menuitem-link {
        height: 100%;
      }
    }
  }
}

.btn-aprobar {
  background-color: $primary-color;
  transition: all 0.5s ease;
  &:hover{
    background-color: $primary-color-hover !important;
  }
}
</style>
