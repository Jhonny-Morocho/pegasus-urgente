<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registrar recepción de cheque"
  />
  <RegistrarChequeRecibido
    :data="dataCheque"
    :data-causa="causa"
  />
  <AppBtnsSteps
    :button-back-disabled="$route.path === `/custodia`"
    @back-step="handleBackStep"
  />
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-angle-double-right"
    icon-pos="right"
    label="Registrar Fijación Fotogáfica"
    :loading="isSomethingLoading"
    @click="handleRealizarFijacionFotografica"
  />
</section>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import RegistrarChequeRecibido from '@/modules/recepcion-especies-dinero/views/registrar-cheque-recibido/RegistrarChequeRecibido.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useConfirmDialog } from '@/modules/common/composables'
import { useRouter } from 'vue-router'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

const { launchConfirmDialog } = useConfirmDialog()

const router = useRouter()

function handleBackStep () {
  launchConfirmDialog({
    header: 'Fijación Fotográfica',
    message: 'Se encuentra por salir con una Fijación Fotográfica inconclusa.',
    acceptLabel: 'Salir',
    accept: () => router.push('/custodia/custodio')
  })
}

function handleRealizarFijacionFotografica () {
  launchConfirmDialog({
    header: 'Fijación Fotográfica',
    message: '¿Está seguro de Registrar Fijación Fotográfica?',
    acceptLabel: 'Aceptar',
    accept: () => router.push('/custodia/custodio')
  })
}

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
const mockDataSolicitud = ref([])
const dataCheque = {
  dataCol1: [
    { label: 'Fecha de Solicitud', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Fiscalía de Origen', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Fiscal de Origen', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Número de convenio origen', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Código de fiscalía de origen', value: mockDataSolicitud.value?.fechaSolicitud }
  ],
  dataCol2: [
    { label: 'Cuenta de fiscalía de origen', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Número de comprobante', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Código de fiscalía de Destino', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Cuenta de fiscalía de Destino', value: mockDataSolicitud.value?.fechaSolicitud }
  ]
}
const causa = {
  causa: {
    rolUnico: '12243224-6'
  },
  fechaCreacionCausa: '18-09-2022',
  estadoCausa: 'vigente',
  nombreCausa: 'Hurto Simple art.40',
  fiscalAsignado: 'José Goméz',
  delitos: '810 - Robo en lugar no habitado, 13001 - Lesiones leves 494 N°5',
  esRegistrocheque: true
}

</script>
