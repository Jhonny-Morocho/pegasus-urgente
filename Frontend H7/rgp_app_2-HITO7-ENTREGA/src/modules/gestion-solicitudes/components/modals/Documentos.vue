<template>
<AppFieldset
  class="w-full m-0"
  legend="Documentos"
>
  <div class="col-12 p-0 m-0">
    <AppFilters
      v-model="documentosParams.filters"
      class="mb-4"
      :no-date-filters="true"
      @filter="getData"
    />
  </div>
  <TablaDocumentos
    v-model="documentosSeleccionado"
    v-model:selection="documentosSeleccionado"
    :action-options="options"
    :value="documentos"
  />
</AppFieldset>
</template>
<script setup>
import { ref, reactive } from 'vue'
import TablaDocumentos from '@/modules/gestion-solicitudes/components/tablas/TablaDocumentos.vue'
import documentos from '@/data/gestorSolicitudes/documentos.json'
import AppFilters from '@/modules/common/components/AppFilters.vue'

const documentosSeleccionado = ref()

const documentosParams = reactive({
  isLoading: false,
  filters: {
    buscador: undefined
  },
  firstRecord: 0
})

const options = ref([
  {
    label: 'Imprimir',
    command: () => {
      console.log('Imprimir')
    }
  }
])
</script>
