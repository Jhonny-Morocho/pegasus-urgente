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
      :loading="isLoading"
      read-only
      :rows="paginacion?.tamanoPagina"
      :total-records="relaciones.length"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { requestUtil } from '@/utils'
import { useRelacionesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { propTypes } from '@/modules/common/types'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'

const props = defineProps({
  pIdDenuncia: propTypes.string
})

const { idDenuncia } = useDirigirInvestigacionStore()

const isLoading = ref(false)
const firstRecord = ref(0)

const { paginacion, relaciones, relaciones_getRelaciones, relaciones_SET_DEFAULT_STATE } = useRelacionesStore()

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: {
      idDenuncia: props.pIdDenuncia ? props.pIdDenuncia : idDenuncia.value,
      params
    },
    loader: (l) => { isLoading.value = l }
  })
}

onMounted(async () => {
  relaciones_SET_DEFAULT_STATE()
  await getRelaciones()
})
</script>
