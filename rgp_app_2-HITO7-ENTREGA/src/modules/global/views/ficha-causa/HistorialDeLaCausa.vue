<template>
<section>
  <div class="grid">
    <div class="col-12 md:col-6 lg:col-3">
      <AppDropdown
        id="agruparPor"
        v-model="agruparPor"

        label="Agrupar por"
        option-label="name"
        option-value="name"
        :options="listaAgruparPor"
        show-clear
        style="width: 100%"
      />
    </div>
    <AppFieldset
      class="w-full"
      legend="Historial de la Causa"
    >
      <AppFilters
        v-model="historial.filters"
        class="col-12"
        @filter="getDataBandeja"
      />
      <AppDataTable
        id="dataTableDocumentos"
        class="col-12"
        :lazy="true"
        :value="documentos"
      >
        <Column header="Actividad">
          asdf
        </Column>
        <Column header="Fecha del Evento">
          asdf
        </Column>
        <Column header="Etapa">
          asdf
        </Column>
        <Column header="Origen">
          asdf
        </Column>
        <Column header="Autor o Ejecutor">
          asdf
        </Column>
        <Column header="Rol">
          asdf
        </Column>
        <Column header="Documento">
          asdf
        </Column>
        <Column
          header="Acciones"
          style="width: 98px"
        >
          asdf
        </Column>
      </AppDataTable>
    </AppFieldset>
  </div>
</section>
</template>

<script setup>
import { reactive } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
const listaAgruparPor = [
  { name: 'Actividad' },
  { name: 'Etapa del proceso' }
]

const historial = reactive({
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined
  },
  firstRecord: 0
})
</script>
