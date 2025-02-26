<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Delitos"
    no-margin-bottom
  >
    <TablaDelitos
      v-model:first="firstRecord"
      :data-delitos="delitos"
      :is-dirigir-investigacion="true"
      :is-preclasificador="false"
      :loading="isLoading"
      :paginacion="paginacion"
      :read-only="true"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      @page="getDelitos"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useDelitoStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaDelitos from '@/modules/global/components/delitos/TablaDelitos.vue'

const { idDenuncia } = useDirigirInvestigacionStore()

const firstRecord = ref(0)
const isLoading = ref(false)

const { paginacion, delitos, delito_getDelitoByIdDenuncia } = useDelitoStore()

async function getDelitos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  await requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (isLoading.value = l)
  })
}

onMounted(() => {
  getDelitos()
})
</script>
