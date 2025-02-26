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
import { onMounted, ref } from 'vue'
import { useRelatoStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { computed } from '@vue/reactivity'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import EditorRelato from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'

const { idDenuncia } = useDirigirInvestigacionStore()

const { relato, relato_getRelatoByIdDenuncia, relato_SET_DEFAULT_STATE } = useRelatoStore()

const isLoading = ref(false)

const propRelato = computed(() => {
  return {
    relato: relato.value?.relato
  }
})

function getRelato () {
  relato_SET_DEFAULT_STATE()
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value
    },
    reject: (e) => {
      console.error('ERROR getRelatoById: ', e)
    },
    loader: (l) => (isLoading.value = l)
  })
}

onMounted(() => {
  getRelato()
})
</script>
