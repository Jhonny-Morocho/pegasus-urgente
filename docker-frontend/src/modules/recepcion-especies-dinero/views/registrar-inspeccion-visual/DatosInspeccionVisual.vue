<template>
<AppFieldset
  legend="Datos de la inspección"
  :toggleable="true"
>
  <DatosInspeccion :datos-inspeccion="datosInspeccion" />
</AppFieldset>

<AppFieldset
  :collapsed="true"
  legend="Especies/Dinero"
  :toggleable="true"
>
  <EspeciesDinero :especies-dineros="dataEspecies" />
</AppFieldset>

<AppFieldset
  :collapsed="true"
  legend="Causa"
  :toggleable="true"
>
  <Causa :data-causa="dataCausa" />
</AppFieldset>

<AppFieldset legend="Personas que asisten a Inspección Visual">
  <PersonasAsistenInspeccionVisual :personas-asisten="personasAsisten" />
</AppFieldset>

<AppFieldset legend="Registro de la inspección visual realizada">
  <RegistroInspeccionVisualRealizada
    :fecha-agendada-inspeccion="datosInspeccion"
    :registrando-loading="registrandoLoading"
    @inspeccion:registrar="registrarDatos"
  />
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-arrow-right"
    icon-pos="right"
    label="Comprobante de Inspección Visual"
    @click="nextStep"
  />
</AppFieldset>
</template>

<script setup>
import DatosInspeccion from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/DatosInspeccion.vue'
import EspeciesDinero from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/EspeciesDinero.vue'
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import PersonasAsistenInspeccionVisual from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/PersonasAsistenInspeccionVisual.vue'
import RegistroInspeccionVisualRealizada from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/RegistroInspeccionVisualRealizada.vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import { useIngresoDinero, useStepDatosInspeccionVisual } from '@/modules/recepcion-especies-dinero/composables'
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'

const {
  datosInspeccion,
  dataCausa,
  personasAsisten,
  stepDatosInspeccionVisual_registrarInspeccionVisualRealizada
} = useStepDatosInspeccionVisual()

const { dataInspeccionVisual, stepIngresoDinero_getEspeciesDinerosNoIngresados } = useIngresoDinero()

const registrandoLoading = ref(false)

const { toastSuccess } = useAppToast()

function registrarDatos (d) {
  registrandoLoading.value = true
  requestUtil({
    action: stepDatosInspeccionVisual_registrarInspeccionVisualRealizada,
    payload: d,
    resolve: (d) => {
      setTimeout(() => {
        toastSuccess(`Datos registrados correctamente`)
        registrandoLoading.value = false
      }, 2000)
    }
  })
}

const dataEspecies = ref()

function getEspecies () {
  requestUtil({
    action: stepIngresoDinero_getEspeciesDinerosNoIngresados,
    payload: { nue: dataInspeccionVisual.value.data.nue },
    resolve: (d) => {
      dataEspecies.value = d
    }
  })
}
getEspecies()

const router = useRouter()

function nextStep () {
  console.log('nextStep')
  router.push(
    '/custodia/custodio/registrar-inspeccion-visual/comprobante-inspeccion-visual'
  )
}
</script>
