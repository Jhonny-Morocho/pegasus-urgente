<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Realizar Fijación Fotográfica"
  />
  <RealizarFijacionFotografica />
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
import PageHeader from '@/modules/common/components/PageHeader.vue'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import RealizarFijacionFotografica from '@/modules/recepcion-especies-dinero/views/realizar-fijacion-fotografica/RealizarFijacionFotografica.vue'
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
</script>
