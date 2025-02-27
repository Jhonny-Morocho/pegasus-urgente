<template>
<LoaderSkeleton v-if="isLoadingPage" />
<section v-show="!isLoadingPage">
  <TablaProcedimientosConDetenidos
    ref="refTablaProcedimientosDetenidos"
    class="mb-6"
    :reload="refTablaNominaDetenidos?.reloadTablaProcedimientos"
  />
  <TablaNominaDeDetenidos
    ref="refTablaNominaDetenidos"
  />
  <Dialog
    v-model:visible="enviandoNomina"
    modal
    :style="{ width: '35vw' }"
  >
    <h3 class="mb-3 text-center">
      Enviando Nómina de Detenidos
    </h3>
    <ProgressBar
      v-if="enviandoNomina "
      class="my-4"
      mode="indeterminate"
      style="height: 0.5em"
    />
  </Dialog>
  <AppBtnsSteps no-button-back />
  <AppBtnNextTeleported
    :disabled="!procedimientoSinRucs.length"
    icon="pi pi-send"
    label="Enviar Nómina"
    :loading="enviandoNomina || isLoadingAnyTable"
    @click="handleNomina"
  />
</section>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import TablaProcedimientosConDetenidos from '@/modules/flagrancia/views/nueva-atencion/nomina-detenidos/TablaProcedimientosConDetenidos.vue'
import TablaNominaDeDetenidos from '@/modules/flagrancia/views/nueva-atencion/nomina-detenidos/TablaNominaDeDetenidos.vue'
import ModalNominaDetenidos from '@/modules/flagrancia/components/bandeja/modals/ModalNominaDetenidos.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import { useConfirmDialog, useAppDialog, useAppToast } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useStepDetenidosACDStore } from '@/modules/flagrancia/composables'
import { requestUtil } from '@/utils'

const router = useRouter()

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const refTablaNominaDetenidos = ref(null)
const refTablaProcedimientosDetenidos = ref(null)
const enviandoNomina = ref(false)
const isLoadingPage = ref(false)

const { mantenedor_getInstitucionesDenuncia, mantenedor_getjuzgados } = useMantenedorStore()
const {
  procedimientoDetenidos, stepDetenidosACD_creacionRucsMasivos, procedimientoSinRucs
} = useStepDetenidosACDStore()

const { toastWarning } = useAppToast()

onMounted(() => {
  isLoadingPage.value = true
  getDataMantenedor()
})

const stopLoading = computed(() => { return (!refTablaNominaDetenidos?.value?.loader && !refTablaProcedimientosDetenidos?.value?.loader) })
watch(() => stopLoading.value, () => { if (stopLoading.value) isLoadingPage.value = false })

const isLoadingAnyTable = computed(() => { return (refTablaNominaDetenidos?.value?.loader || refTablaProcedimientosDetenidos?.value?.loader) })

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getInstitucionesDenuncia })
  requestUtil({ action: mantenedor_getjuzgados })
}
function handleNomina () {
  const procedimientoSinDetenidosPendientes = []
  procedimientoDetenidos.value.map(({ poseeDetenidosPendientes, idProcedimiento }) => {
    if (!poseeDetenidosPendientes) return procedimientoSinDetenidosPendientes.push(idProcedimiento)
    return null
  })
  if (!procedimientoSinDetenidosPendientes.length) toastWarning('Sin procedimientos con detenidos con decisión pasar ACD')
  else {
    launchConfirmDialog({
      header: 'Enviar Nómina',
      message: '¿Estas Seguro(a) de Enviar la Nómina?',
      accept: () => {
        enviandoNomina.value = true
        requestUtil({
          action: stepDetenidosACD_creacionRucsMasivos,
          payload: { data: procedimientoSinDetenidosPendientes },
          resolve: () => {
            launchDialog({
              header: 'Nómina de Detenidos',
              component: ModalNominaDetenidos,
              width: '80vw',
              cancelLabel: 'Aceptar',
              resolve: () => {
                enviandoNomina.value = false
              },
              reject: () => {
                enviandoNomina.value = false
                router.push('/flagrancia')
              }
            })
          },
          loader: (l) => {
            enviandoNomina.value = l
          }
        })
      }
    })
  }
}
</script>
