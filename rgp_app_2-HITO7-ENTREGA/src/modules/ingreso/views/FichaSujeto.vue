<template>
<section class="mx-4">
  <PageHeader
    class="mb-5"
    hide-items-menu-superior
    :items-menu-superior="itemsMenuSuperior"
    page-title="Ficha Sujeto"
  />
  <InformacionSujeto />
  <TabView>
    <TabPanel header="Antecedentes del Sujeto">
      <AntecedentesDelSujeto />
    </TabPanel>
    <TabPanel header="Antecedentes Procesales">
      <AntecedentesProcesales />
    </TabPanel>
    <TabPanel
      v-if="false"
      header="Antecedentes de Atención"
    >
      <AntecedentesDeAtencion />
    </TabPanel>
  </TabView>

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
/*eslint-disable*/
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import InformacionSujeto from '@/modules/global/components/ficha-sujeto/InformacionSujeto.vue'
import AntecedentesDelSujeto from '@/modules/global/components/ficha-sujeto/AntecedentesDelSujeto.vue'
import AntecedentesProcesales from '@/modules/global/components/ficha-sujeto/AntecedentesProcesales.vue'
import AntecedentesDeAtencion from '@/modules/global/components/ficha-sujeto/AntecedentesDeAtencion.vue'

import { useCrearCausaStore } from '../composables'

const { ruc } = useCrearCausaStore()
const router = useRouter()

function handleBackStep() {
  router.push(`/ficha-causa/${ruc.value}`)
}
const itemsMenuSuperior = ref([
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => recargarPagina()
  }
])

function recargarPagina() {
  location.reload()
}
</script>
