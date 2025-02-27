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
import { useEspeciesDineroStore, useMantenedorStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaEspecies from '@/modules/dirigir-investigacion/components/TablaEspecies.vue'

const { idDenuncia } = useDirigirInvestigacionStore()

const { especies, paginacionEspecies, especiesDinero_getEspecieByIdDenuncia } = useEspeciesDineroStore()
const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getAllTiposEspecie,
  mantenedor_getAmbitoEspecie
} = useMantenedorStore()

const especieDinero = reactive({
  isLoading: false,
  firstRecord: 0
})

async function getEspecies () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    resolve: () => console.log(especies.value),
    loader: (l) => (especieDinero.isLoading = l)
  })
}

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getAllTiposEspecie })
  requestUtil({ action: mantenedor_getAmbitoEspecie })
}

onMounted(async () => {
  await getDataMantenedor()
  await getEspecies()
})
</script>
