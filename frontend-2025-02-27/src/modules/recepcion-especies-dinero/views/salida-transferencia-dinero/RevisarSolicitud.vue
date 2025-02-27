<template>
<AppFieldset
  class="col-12"
  :collapsed="false"
  legend="Solicitud de Salida"
  :toggleable="true"
>
  <SolicitudDeSalida :data-solicitud-de-salida="mockDataSolicitudSalida" />
</AppFieldset>
<AppFieldset
  class="col-12"
  :collapsed="true"
  legend="Causa"
  :toggleable="true"
>
  <Causa :data-causa="mockDataCausa" />
</AppFieldset>
<AppFieldset
  class="col-12s"
  :collapsed="true"
  legend="Dinero a Transferir"
  :toggleable="true"
>
  <DineroATransferir :data-dinero-a-transferir="mockDineroATransferir" />
</AppFieldset>
<AppBtnNextTeleported
  class="mr-2"
  icon="pi pi-arrow-right"
  icon-pos="right"
  label="Generar acta de Salida"
  @click="nextStep"
/>
</template>

<script setup>
import SolicitudDeSalida from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/SolicitudDeSalida.vue'
import Causa from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/Causa.vue'
import DineroATransferir from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/DineroATransferir.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mockDataSolicitudSalida = {
  fechaSolicitud: '29-09-2022',
  destinatario: 'Jorge Rojas',
  fechaDeSalida: '16-07-2022',
  runDestinatario: '5.642.777-2',
  fiscaliaDeOrigen: 'Casablanca',
  fiscaliaDeDestino: 'Valparaíso',
  fiscalDeOrigen: 'Samuel Nuñez P.',
  fiscalDeDestino: 'Cristián Andrade',
  numeroDeConvenioDeOrigen: 10608347,
  numeroDeConvenioDeDestino: 100004555,
  codigoDeFiscaliaDeOrigen: 1701703,
  codigoDeFiscaliaDeDestino: 1701080,
  cuentaDeFiscaliaDeOrigen: 9005153,
  cuentaDeFiscaliaDeDestino: 9000003

}
const mockDataCausa = {
  ruc: '2200938215-8',
  fechaCreacionCausa: '18-09-2022',
  fiscaliaRegional: 'Casablanca',
  estadoCausa: 'Vigente',
  fiscalAsignado: 'Samuel Núñez P.',
  nombreCausa: 'Hurto simple 4 A 40 UTM a Gustavo',
  delitos: ['810 - Robo en lugar no habitado']
}
const mockDineroATransferir = {
  nue: 1939402,
  fechaDeIngreso: '14-07-2022',
  rue: 12345 - 1,
  tipoDeMoneda: 'Peso Chileno',
  tipoDeDelito: 'Ley de Drogas',
  monto: 'CLP $2.500.000',
  responsableDeUAFDeOrigen: 'María González',
  tipoDeDeposito: 'Cuenta Bancaria',
  responsableDeUAFDeDestino: 'María González'
}
function nextStep () {
  router.push('/custodia/custodio/salida-transferencia-dinero/acta-salida-transferencia')
}
</script>
