<template>
<main>
  <section class="w-full p-fluid">
    <AppDropdown
      id="agrupar-por"
      v-model="agruparPor"
      class="col-12 md:col-4"
      label="Agrupar por"
      option-label="descripcion"
      option-value="value"
      :options="agruparOptions"
      placeholder
    />
  </section>
  <section class="w-full">
    <AppFieldset legend="Historial de la Causa">
      <section
        v-show="agruparPor==='actividad'"
        id="actividad"
        class="w-full"
      >
        <HistorialActividad />
      </section>
      <section
        v-show="agruparPor==='etapa'"
        id="etapa-proceso"
        class="w-full"
      >
        <AppFilters
          v-model="historialByEtapa.filters"
          class="mb-5"
          @filter="getHistorialByEtapa"
        />
        <TablaHistorialEtapa :value="[]" />
      </section>
    </AppFieldset>
  </section>
</main>
</template>

<script setup>
import { defineProps, reactive, ref } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaHistorialEtapa from '../components/historial-causa/TablaHistorialEtapa.vue'
import HistorialActividad from '../components/historial-causa/HistorialActividad.vue'

defineProps({
  ruc: {
    type: String,
    required: true
  }
})

const agruparPor = ref('actividad')

const historialByEtapa = reactive({
  first: 0,
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined
  }
})

function getHistorialByEtapa (pagination = undefined) {
  if (!pagination) {
    historialByEtapa.first = 0
  }

  // AQUI LOGICA REQUESTUTIL
}

const agruparOptions = [
  { value: 'actividad', descripcion: 'Actividad' },
  { value: 'etapa', descripcion: 'Etapa del Proceso' }
]

</script>
