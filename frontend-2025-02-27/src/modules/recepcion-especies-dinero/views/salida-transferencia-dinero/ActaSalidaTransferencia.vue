<template>
<AppFieldset legend="Acta de Salida por Transferencia">
  <ActaDeSalidaPorTransferencia
    v-if="!porCajaFuerte"
    :data-acta-de-salida-por-transferencia="dataActaDeSalida"
  />
  <ActaDeSalidaPorTransferenciaPorDineroEnCajaFuerte
    v-else
    :data-acta-de-salida-por-transferencia="dataActaDeSalida"
  />
  <AppTextarea
    id="observaciones"
    v-model="observaciones"
    class="col-12 mt-3"
    cols="135"
    label="Observaciones"
    rows="5"
  />
  <div class="col-12 grid ">
    <div class="col-4">
      <Button
        class="btn-form h-full px-7"
        icon="pi pi-file-pdf"
        icon-pos="right"
        label="Vista Previa"
        @click="openModalVistaPrevia"
      />
    </div>
    <div class="col-4" />
    <div class="col-4">
      <Button
        class="btn-form h-full  px-7"
        icon="pi pi-external-link"
        icon-pos="right"
        label="Firmar Comprobante"
        @click="openFimarComprobante"
      />
    </div>
  </div>
</AppFieldset>
<AppBtnNextTeleported
  class="mr-2"
  icon="pi pi-arrow-right"
  icon-pos="right"
  label="Registrar Salida"
  @click="nextStep"
/>
</template>

<script setup>
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useAppDialog } from '@/modules/common/composables'
import ActaDeSalidaPorTransferenciaPorDineroEnCajaFuerte from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/ActaSalidaPorDineroEnCajaFuerte.vue'
import ActaDeSalidaPorTransferencia from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/ActaDeSalidaPorTransferencia.vue'
import ModalComprobanteDeSalida from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/modals/ModalComprobanteDeSalida.vue'
import ModalComprobanteSalidaPorCajaFuerte from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/modals/ModalComprobanteSalidaPorCajaFuerte.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { launchDialog } = useAppDialog()

const porCajaFuerte = true
const dataActaDeSalida = {
  nue: 1939406,
  ruc: 2200938215 - 8,
  nombreCausa: 'Hurto simple 4 A 40 UTM a Gustavo',
  fechaHoraDeSalida: '15-07-22 11:00',
  fiscaliaDeOrigen: 'Casablanca',
  tipoDeMoneda: 'Peso Chileno',
  fiscalDeOrigen: 'Samuel Nuñez P.',
  monto: 'CLP $2.500.000',
  fiscaliaDeDestino: 'Valparaíso',
  interes: 'CLP $25.000',
  fiscalDeDestino: 'Cristián Andrade',
  responsableDeUAFDeOrigen: 'María González',
  custodioDeDestino: 'Camilo Zapata',
  runResponsableUAF: '18.652.258-1',
  runCustodioDeDestino: '12.345.567-9'
}

function openModalVistaPrevia (dataActaDeSalida) {
  launchDialog({
    component: porCajaFuerte ? ModalComprobanteSalidaPorCajaFuerte : ModalComprobanteDeSalida,
    header: 'Comprobante de Salida',
    width: '60%',
    props: {
      dataActaDeSalida
    },
    cancelLabel: 'Cerrar'
  })
}

function nextStep () {
  router.push('/custodia/custodio')
}
</script>
<style scoped>
.styleNue{
    font-size: 1.6em;
}
</style>
