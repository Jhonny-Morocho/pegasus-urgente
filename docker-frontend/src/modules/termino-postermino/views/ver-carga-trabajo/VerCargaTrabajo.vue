<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-title="Visualizar Carga de Trabajo FL"
/>
<section class="flex justify-content-start my-4">
  <TabMenu :model="tabsCargaTrabajo" />
</section>

<div class="wrapper-routes">
  <RouterView />
</div>

<AppBtnsSteps
  @back-step="handleBackStep"
/>
</template>

<script setup>
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const emitter = inject('emitter')
const router = useRouter()

const baseUrl = '/termino-postermino/fiscal-jefe/ver-carga-trabajo'
const tabsCargaTrabajo = ref([
  { label: 'Carga de trabajo por Fiscal', to: `${baseUrl}/carga-fiscal` },
  { label: 'Carga de Trabajo por Unidad', to: `${baseUrl}/carga-unidad` }
])

function handleBackStep () {
  router.push({ name: 'BandejaFiscalJefe' })
}

function recargarPagina () {
  location.reload()
}

function exportTable () {
  emitter.emit('table:export')
}

function gestionarNecesidadServicio () {
  router.push('/termino-postermino/fiscal-jefe/ver-carga-trabajo/carga-fiscal')
}

const itemsMenuSuperior = ref([
  {
    label: 'Procesos Transversales',
    icon: 'pi pi-plus-circle',

    items: [
      {
        label: 'Option1',
        command: async () => {}
      }
    ]
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',

    items: [
      {
        label: 'Carga de Trabajo FL',
        command: () => gestionarNecesidadServicio()
      }
    ]
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',

    command: () => recargarPagina()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',

    command: () => exportTable()
  }
])
</script>
