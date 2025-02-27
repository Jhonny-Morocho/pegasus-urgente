<template>
<AppFieldset
  class="col-12 p-fluid"
  legend="Generar Etiqueta"
>
  <GenerarEtiquetaDatos
    ref="generarEtiquetaDatos"
    :data-etiqueta="datosEtiquetaQr"
  />
</AppFieldset>
<AppFieldset
  class="col-12"
  legend="Código QR y RUE"
>
  <GenerarEtiquetaCodigoQR
    ref="generarEtiquetaCodigoQR"
    :data-etiqueta="datosEtiquetaQr"
  />
</AppFieldset>

<AppBtnRightTeleported>
  <Button
    class="p-button-outlined px-5"
    icon="pi pi-arrow-left"
    icon-pos="left"
    label="Volver a Ingresar Datos"
    @click="handleIngresarDatosEspecies"
  />
</AppBtnRightTeleported>
<AppBtnNextTeleported
  label="Registrar Ingreso"
  @click="handleNextStep"
/>
</template>

<script setup>
import { ref } from 'vue'
import GenerarEtiquetaDatos from '../../components/generar-etiqueta/GenerarEtiquetaDatos.vue'
import GenerarEtiquetaCodigoQR from '../../components/generar-etiqueta/GenerarEtiquetaCodigoQR.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import ModalRegistrarIngreso from '@/modules/recepcion-especies-dinero/components/generar-etiqueta/Modals/ModalRegistrarIngreso.vue'

// composables
import { useIngresoDinero } from '@/modules/recepcion-especies-dinero/composables'
import { useRouter } from 'vue-router'
import { useAppDialog } from '@/modules/common/composables'

const { datosEtiquetaQr, rues } = useIngresoDinero()
const { launchDialog } = useAppDialog()
const router = useRouter()
const generarEtiquetaDatos = ref()
const generarEtiquetaCodigoQR = ref()

function handleNextStep () {
  launchDialog({
    component: ModalRegistrarIngreso,
    width: '50%',
    confirmLabel: 'Cerrar',
    cancelLabel: 'hideCancelLabel',
    header: 'Registro de Ingreso',
    props: {
      data: datosEtiquetaQr.value,
      rues: rues.value
    },
    accept: () => router.push({ name: 'BandejaCustodio' })
  })
}

function handleIngresarDatosEspecies () {
  router.push({ name: 'IngresarDatosAdicionales' })
}
</script>
