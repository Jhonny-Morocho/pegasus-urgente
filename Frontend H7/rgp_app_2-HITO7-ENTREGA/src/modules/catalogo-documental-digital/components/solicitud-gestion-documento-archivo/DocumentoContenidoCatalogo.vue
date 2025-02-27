<template>
<TabView
  v-model:activeIndex="activeTab"
  class="tabview"
  @tab-change="tabChange"
>
  <TabPanel
    v-for="tab in tabs"
    :key="tab.title"
    :header="tab.title"
  >
    <DocumentoContenidoTabla
      v-model:fecha-desde="fechaDesde"
      v-model:fecha-hasta="fechaHasta"
      v-model:first="first"
      :loading="isLoadingTable"
      :origen-tabla="tab.origenTabla"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="especiesDinero"
      @actualizar-prioridad="actualizarPrioridad"
      @buscar-causa="buscarCausa"
      @page="changePage($event)"
    />
  </TabPanel>
</TabView>
</template>

<script setup>
import { ref } from 'vue'
import DocumentoContenidoTabla from './DocumentoContenidoTabla'

const tabs = ref([
  { title: 'Agregar Documento o Archivo', origenTabla: 'Agregar' },
  { title: 'Actualizar documento o archivo ', origenTabla: 'Actualizar' },
  { title: 'Recuperar Documento Físico', origenTabla: 'Recuperar' }
])
</script>
