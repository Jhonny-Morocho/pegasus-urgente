<template>
<PageHeader
  class="mb-5"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Levantar Cadena Custodia"
/>
<section class="pb-5">
  <RotuloDeLaNue
    ref="rotuloNue"
    @activar-nue="openModalActivacionNue"
  />
  <Evidencias
    v-if="rotuloNue?.formData.nueEncontrado"
    ref="evidenciaLevantamiento"
    :collapsed="false"
  />
</section>
<AppBtnsSteps
  :button-back-disabled="$route.path === `/custodia/custodio`"
  @back-step="handleBackStep"
/>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RotuloDeLaNue from '../../components/levantar-cadena-custodia/RotuloDeLaNue.vue'
import Evidencias from '@/modules/recepcion-especies-dinero/components/levantar-cadena-custodia/Evidencias.vue'
import { useConfirmDialog, useAppToast } from '@/modules/common/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useLevantamientoCadenaCustodio } from '../../composables/useLevantamientoCadenaCustodio'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
// import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

const { launchConfirmDialog } = useConfirmDialog()
const { levantamientoCadena_addLevantamientoCadena, evidencias } = useLevantamientoCadenaCustodio()

const { toastSuccess } = useAppToast()
const router = useRouter()
const rotuloNue = ref(null)
const evidenciaLevantamiento = ref(null)
const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
function openModalActivacionNue (data) {
  console.log('rotuloNue', data)
  launchConfirmDialog({
    header: 'Activar NUE',
    message: `¿Estás seguro de Activar la NUE?`,
    accept: () => {
      const folioRotulo = data?.folioLevantamiento
      const rucRotulo = data?.rucLevantamiento
      requestUtil({
        action: levantamientoCadena_addLevantamientoCadena,
        payload: {
          idOrganismo: data?.idOrganismo ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          idUnidad: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          idGrado: '2229f1a9-26e7-40be-ac41-8e5f3239fdb9',
          idCargo: '1cae260e-c975-4db2-80ed-a3021b5b4411',
          idFuncionario: 'acb057d2-19fe-4d41-a437-58622cb91254',
          nue: data?.nue,
          ruc: rucRotulo,
          folio: folioRotulo === null ? 1 : folioRotulo,
          fechaHoraLevantamiento: dateTimeUtil.formatToBackendWithTime(
            new Date()
          ),
          direccionLevantamiento: data?.direccionDelSS,
          observaciones: 'Observaciones relativas al levantamiento de la Cadena de Custodia',
          especiesODineros: evidencias.value
        },
        resolve: () => {
          toastSuccess('Cadena Levantada exitosamente!')
          router.push({ name: 'BandejaCustodio' })
        }
      })
    }
  })
}
function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
}
</script>
