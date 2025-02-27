<template>
<PageHeader
  class="mb-5"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Registrar Ingreso de Caja Fuerte"
/>
<AppFieldset
  class="col-12"
  legend="Dinero Pendiente de Registro"
>
  <p class="col-12 md:col-6">
    <span class="font-bold">NUE: </span>{{ dineroPendienteRegistro.nue }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Tipo de Moneda: </span>{{ dineroPendienteRegistro.tipoMoneda }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">RUE: </span>{{ dineroPendienteRegistro.rue }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Monto: </span>{{ dineroPendienteRegistro.monto }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fecha de Ingreso: </span>{{ dineroPendienteRegistro.fechaIngreso }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscalía Local: </span>{{ dineroPendienteRegistro.fiscaliaLocal }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Custodio que recibe: </span>{{ dineroPendienteRegistro.custodioQueRecibe }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Tipo de Delito: </span>{{ dineroPendienteRegistro.tipoDelito }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Descripción: </span>{{ dineroPendienteRegistro.descripcion }}
  </p>
</AppFieldset>
<div class="grid mx-auto w-full">
  <div class="col-12 lg:col-6">
    <AppFieldset
      class="mx-auto"
      legend="Ingresar Observaciones"
    >
      <AppTextarea
        id="observacionIngresoDinero"
        v-model="observacionCadenaCustodia"
        class="col-12"
        cols="70"
        label="Observación a la Cadena de Custodia"
        rows="15"
      />
    </AppFieldset>
  </div>
  <div class="col-12 lg:col-6">
    <AppFieldset
      class="mx-auto"
      legend="Denominación del Dinero"
    >
      <TablaDesgloseDinero
        :data="dineroPendienteRegistro"
      />
      <h3 class="mt-3">
        <strong>Monto Total:</strong>
      </h3>
    </AppFieldset>
  </div>
</div>
<AppFooterBtns
  label="Registrar Ingreso"
  @back-step="handleBackStep"
  @next-step="openModalRegistroDeposito()"
/>
</template>

<script setup>
import { useItemsMenuSuperiorCadena } from '../../composables'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import { useConfirmDialog } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import TablaDesgloseDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaDesgloseDinero.vue'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const { launchConfirmDialog } = useConfirmDialog()

const router = useRouter()

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
function openModalRegistroDeposito () {
  launchConfirmDialog({
    header: 'Registrar Depósito',
    message: '¿Está seguro de Registrar el Ingreso de Caja Fuerte?',
    acceptLabel: 'Salir',
    accept: () => {
      // toastSuccess('El ingreso fue realizado exitosamente')
      router.push({ name: 'BandejaCustodio' })
    }
  })
}
function handleBackStep () {
  launchConfirmDialog({
    header: 'Registrar Ingreso',
    message: 'Se encuentra por salir con un Ingreso de Caja Fuerte Inconcluso',
    acceptLabel: 'Salir',
    accept: () => {
      router.push({ name: 'BandejaCustodio' })
    }
  })
}

const dineroPendienteRegistro = {
  nue: 1234,
  rue: '1234-6',
  fechaIngreso: '2023-04-23',
  custodioQueRecibe: 'custodioQueRecibe',
  descripcion: 'descripcion',
  fiscaliaLocal: 'fiscalia',
  tipoDelito: 'tipo delito',
  desglose: [
    {
      denominacion: 1000,
      tipoMoneda: 'PESO',
      tipoDinero: 'PESO',
      cantidad: 2,
      total: 2000
    },
    {
      denominacion: 2000,
      tipoMoneda: 'PESO',
      tipoDinero: 'Billete',
      cantidad: 4,
      total: 8000
    }
  ]
}
</script>
