<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5 pb-0"
    legend="Relato del Hecho"
    no-margin-bottom
  >
    <EditorRelato
      class="mb-0 pb-0"
      :is-loading-plantilla="isLoading"
      read-only
      :relato="propRelato"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { onMounted } from 'vue'
import EditorRelato from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import { useRelatoStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { computed, ref } from '@vue/reactivity'
import { useTermino } from '../../composables'

const { idDenuncia } = useTermino()
const { relato, relato_getRelatoByIdDenuncia } = useRelatoStore()

const isLoading = ref(false)

const propRelato = computed(() => {
  return {
    relato: relato.value?.relato
  }
})

function getRelato () {
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => (isLoading.value = l)
  })
}

onMounted(() => {
  getRelato()
})
</script>
