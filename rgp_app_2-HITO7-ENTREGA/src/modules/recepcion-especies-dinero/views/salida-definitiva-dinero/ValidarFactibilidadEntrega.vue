<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Validar factibilidad entrega"
  />
  <AppFieldset
    class="col-12 mx-auto mt-6"
    legend="Solicitud de Salida de Dineros"
    toggleable
  >
    <SolicitudDeSalida
      class="col-12"
      :data-solicitud-de-salida="mockDataSolicitudSalida"
    />
  </AppFieldset>
  <AppFieldset
    class="col-12"
    legend="Dinero"
    toggleable
  >
    <DetalleDinero :data="mockDataDinero" />
  </AppFieldset>
  <FactibilidadEntrega
    :data="mockDataDinero"
    @validar-entrega="validarEntrega"
  />
  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>
  <AppBtnsSteps
    :button-back-disabled="$route.path === `/custodia`"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import { useConfirmDialog } from '@/modules/common/composables'

import SolicitudDeSalida from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/SolicitudDeSalida.vue'
import DetalleDinero from '@/modules/recepcion-especies-dinero/components/salida-definitiva-dinero/DetalleDinero.vue'
import FactibilidadEntrega from '@/modules/recepcion-especies-dinero/components/salida-definitiva-dinero/FactibilidadEntrega.vue'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

const router = useRouter()

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

const { launchConfirmDialog } = useConfirmDialog()

function handleBackStep () {
  router.push('/custodia/custodio')
}

function validarEntrega (data) {
  console.log(data)
  launchConfirmDialog({
    header: 'Validar factibilidad entrega',
    message: '¿Está seguro de Validar factibilidad entrega?',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Aceptar',
    acceptIcon: '',
    accept: () => {
      router.push('/custodia/custodio')
    }
  })
}

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

const mockDataDinero = {
  nue: 123423,
  rue: 123423,
  tipoDelito: 123423,
  responsableUaf: 123423,
  tipoMoneda: 123423,
  monto: 123423,
  interes: 123423
}
</script>
