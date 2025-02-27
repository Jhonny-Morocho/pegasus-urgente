<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Especies y Dinero"
    no-margin-bottom
  >
    <TablaEspecies
      v-model:first="especieDinero.firstRecord"
      :loading="especieDinero.isLoading"
      read-only
      :rows="paginacionEspecies?.tamanoPagina"
      :total-records="paginacionEspecies?.elementosTotales"
      :value="especies"
      @page="getEspecies"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useEspeciesDineroStore } from '@/modules/global/composables'
import TablaEspecies from '@/modules/dirigir-investigacion/components/TablaEspecies.vue'
import { useTermino } from '../../composables'

const { idDenuncia } = useTermino()

const { especies, paginacionEspecies, especiesDinero_getEspecieByIdDenuncia } = useEspeciesDineroStore()

const especieDinero = reactive({
  isLoading: false,
  firstRecord: 0
})

async function getEspecies (pagination = undefined) {
  if (!pagination) {
    especieDinero.firstRecord = 0
  }

  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (loading) => (especieDinero.isLoading = loading)
  })
}

onMounted(async () => {
  getEspecies()
})
</script>
