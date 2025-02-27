<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Relaciones"
    no-margin-bottom
  >
    <TablaRelaciones
      v-model:first="firstRecord"
      :loading="tablaRelaciones.isLoading"
      read-only
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import { onMounted, reactive, defineProps } from 'vue'
import { requestUtil } from '@/utils'
import { useRelacionesStore } from '@/modules/global/composables'
import { propTypes } from '@/modules/common/types'

const tablaRelaciones = reactive({
  isLoading: false,
  isEditando: false,
  firstRecord: 0
})

const props = defineProps({
  idDenuncia: propTypes.string
})

const { paginacion, relaciones, relaciones_getRelaciones } =
  useRelacionesStore()

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    tablaRelaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: props.idDenuncia, params },
    loader: (l) => (tablaRelaciones.isLoading = l)
  })
}

onMounted(async () => {
  getRelaciones()
})
</script>
