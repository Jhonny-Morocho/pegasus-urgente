<template>
<Divider
  class="mt-0 mb-3"
  layout="horizontal"
/>
<AppFieldset
  class="w-full m-0"
  legend="Sujetos/Intervinientes"
>
  <div class="col-12 p-0 m-0">
    <AppFilters
      v-model="sujetosIntervinientesParams.filters"
      :no-date-filters="true"
      @filter="getData"
    />
  </div>
  <AppDataTable
    id="tabla-sujetos"
    ref="dt"
    v-model="sujetosIntervinientesParams.firstRecord"
    class="mt-4 w-full"
    filter-display="menu"
    :loading="sujetosIntervinientesParams.isLoading"
    responsive-layout="scroll"
    :value="sujetosIntervinientes"
  >
    <Column
      class="text-center"
      field="tipoSujeto"
      filter-field="tipoSujeto"
      header="Tipo Sujeto"
      :sortable="true"
      style="min-width: 128px"
    >
      <template #body="{ data }">
        {{ data.tipoSujeto }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="numeroDocumento"
      filter-field="numeroDocumento"
      header="N° Documento"
      :sortable="true"
      style="min-width: 128px"
    >
      <template #body="{ data }">
        {{ data.numeroDocumento }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreCompleto"
      filter-field="nombreCompleto"
      header="Nombre Completo"
      :sortable="true"
      style="min-width: 128px"
    >
      <template #body="{ data }">
        {{ data.nombreCompleto }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="edad"
      filter-field="edad"
      header="Edad"
      :sortable="true"
      style="min-width: 128px"
    >
      <template #body="{ data }">
        {{ data.edad }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="alerta"
      filter-field="alerta"
      header="Alerta"
      :sortable="true"
      style="min-width: 128px"
    >
      <template #body="{ data }">
        {{ data.alerta }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="dirección"
      filter-field="dirección"
      header="Dirección"
      :sortable="true"
      style="min-width: 128px"
    >
      <template #body="{ data }">
        {{ data.dirección }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="comuna"
      filter-field="comuna"
      header="Comuna"
      :sortable="true"
      style="min-width: 128px"
    >
      <template #body="{ data }">
        {{ data.comuna }}
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>
<script setup>
import { reactive } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'

// json
import sujetosIntervinientes from '@/data/gestorSolicitudes/sujetosIntervientes.json'

const sujetosIntervinientesParams = reactive({
  isLoading: false,
  filters: {
    buscador: undefined
  },
  firstRecord: 0
})

function getData () {
  console.log('get')
}
</script>

<style scoped>
.p-dialog-header {
  margin: 0;
}
</style>
