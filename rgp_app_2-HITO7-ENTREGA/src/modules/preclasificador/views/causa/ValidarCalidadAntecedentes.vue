<template>
<section>
  <section class="flex justify-content-center mb-4">
    <TabMenu :model="tabsValidar" />
  </section>
  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnNextTeleported
    label="Proponer Asignación"
    :loading="isLoading || loadingState.completarSolicitudAntecedentes || loadingState.iniciarYReservar"
    @click="handleNextStep"
  />
</section>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { usePamStore } from '@/modules/global/composables'
import { useCausaPreclasificadorStore, useLoadingStates, useFlujoPamPreclasificador } from '@/modules/preclasificador/composables'
import TabMenu from 'primevue/tabmenu'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const { procesoPam } = usePamStore()

const router = useRouter()

const { toastError } = useAppToast()

const {
  causaPreclasificador_iniciarYReservar,
  causaPreclasificador_completarValidarCalidadAntecedentes,
  causaPreclasificador_SET_BOTON_BACK_FROM_PA, isBotonBackFromPA
} = useCausaPreclasificadorStore()

const { loadingState } = useLoadingStates()
const { flujoPreclasificador } = useFlujoPamPreclasificador()

const isLoading = ref(false)

function completarValidarCalidadAntecedentes () {
  isLoading.value = true
  if (isBotonBackFromPA.value) {
    router.push({ name: 'PAAnalizarPreclasificacion' })
  } else {
    requestUtil({
      action: causaPreclasificador_completarValidarCalidadAntecedentes,
      payload: {
        ...procesoPam.value,
        antecedentes: {
          diligenciasSolicitar: [],
          antecedentesSuficientes: true,
          cambiarTipificacionOtro: flujoPreclasificador.cambiarTipificacionOtro, // Requiere cambiar tipificacion
          obtieneAntecedentesEsp: flujoPreclasificador.obtieneAntecedentesEsp,
          revisaEspecies: flujoPreclasificador.revisaEspecies,
          revisaInformacionDelictual: flujoPreclasificador.revisaInformacionDelictual
        }
      },
      reject: () => {
        isLoading.value = false
        toastError('Ha ocurrido un error en el servidor, intente de nuevo')
      },
      resolve: () => {
        causaPreclasificador_SET_BOTON_BACK_FROM_PA(true)
        // iniciar y reservar siguiente tarea
        requestUtil({
          action: causaPreclasificador_iniciarYReservar,
          payload: { ...procesoPam.value },
          reject: () => {
            isLoading.value = false
            toastError('Ha ocurrido un error en el servidor, intente de nuevo')
          },
          resolve: () => {
            router.push({ name: 'PAAnalizarPreclasificacion' })
          }
        })
      }
    })
  }
}

function handleNextStep () {
  completarValidarCalidadAntecedentes()
}

const baseUrl = '/preclasificador/causa/validar-calidad-antecedentes'

const tabsValidar = [
  { label: 'Antecedentes de la Causa', to: `${baseUrl}/antecedentes-causa` },
  { label: 'Sujetos Intervinientes', to: `${baseUrl}/sujetos-intervinientes` },
  { label: 'Delitos', to: `${baseUrl}/delitos` },
  { label: 'Relaciones', to: `${baseUrl}/relaciones` },
  { label: 'Especies/Dinero', to: `${baseUrl}/especies-dinero` },
  { label: 'Relato del Hecho', to: `${baseUrl}/relato` },
  { label: 'Documentos', to: `${baseUrl}/documentos` },
  { label: 'Diligencias', to: `${baseUrl}/diligencias` }
  // { label: 'Historial de la Causa', to: `${baseUrl}/historial-causa` }
]
</script>
<style scoped lang="scss">
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
