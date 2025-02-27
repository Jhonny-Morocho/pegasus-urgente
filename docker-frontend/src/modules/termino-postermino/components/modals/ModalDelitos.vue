<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Delitos"
    no-margin-bottom
  >
    <TablaDelitos
      :data-delitos="delitos"
      :loading="tablaDelitos.isLoading"
      :paginacion="paginacion"
      read-only
      @page="getDelitos"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { useDelitoStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useTermino } from '../../composables'

const { idDenuncia } = useTermino()

const { paginacion, delitos, delito_getDelitoByIdDenuncia } = useDelitoStore()

const tablaDelitos = reactive({
  isLoading: false,
  firstRecord: 0
})

function getDelitos (pagination = undefined) {
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (tablaDelitos.isLoading = l)
  })
}

onMounted(() => {
  getDelitos()
})
</script>
