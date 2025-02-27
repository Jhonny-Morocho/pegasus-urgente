<template>
<div class="col-12">
  <AppDropdown
    id="agrupar"
    class="col-3 p-fluid"
    label="Agrupar por"
    option-label="value"
    option-value="id"
    :options="motivoAgrupacion"
    show-clear
  />
</div>
<AppFieldsetCustom
  class="pb-3"
  :panel="paneles.diligencias"
  :tooltip="true"
>
  <div class="flex flex-row-reverse col-12">
    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
      <InputText
        id="filter-text"
        v-model="inputFiltro"
        class="p-inputtext-sm"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary p-button-sm"
        icon="pi pi-search"
      />
    </div>
  </div>

  <TablaDiligencias
    class="col-12"
    :loading="isLoading"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="diligencias"
    @page="getDiligencias"
  />
</AppFieldsetCustom>
</template>

<script setup>
import TablaDiligencias from '../../../components/tables/TablaDiligencias.vue'
import AppFieldsetCustom from '@/modules/common/components/AppFieldsetCustom.vue'
import { onMounted, ref } from 'vue-demi'
import { requestUtil } from '@/utils'
import { usePanelesStore, useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'

const { ruc, diligencias, tramitarAudiencia_getDiligencias } = useTramitarAudiencia()
const { paneles } = usePanelesStore()

const isLoading = ref(false)
const firstRecord = ref(0)

const motivoAgrupacion = [
  {
    id: 1,
    value: 'Tipo Diligencia'
  },
  {
    id: 1,
    value: 'Institución Ejecutora'
  }
]

async function getDiligencias (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: tramitarAudiencia_getDiligencias,
    payload: { ruc: ruc, params },
    loading: (l) => (isLoading.value = l)
  })
}

onMounted(() => {
  getDiligencias()
})
</script>
