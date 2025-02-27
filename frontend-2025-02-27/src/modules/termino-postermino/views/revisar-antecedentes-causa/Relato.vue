<template>
<div class="p-fluid">
  <AppFieldset legend="Relato del Hecho">
    <EditorRelato
      :is-loading-plantilla="isLoading"
      no-dropdown
      :plantilla-options="plantillaOptions"
      read-only
      :relato="propRelato"
      @editor-relato:guardar-relato="guardarRelato"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import EditorRelato from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import { computed, onMounted, ref } from 'vue'
import { useRelatoStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useTermino } from '../../composables'

const { relato_getRelatoByIdDenuncia, relato_SET_DEFAULT_STATE, relato } = useRelatoStore()

const { idDenuncia } = useTermino()

const isLoading = ref(false)

const propRelato = computed(() => {
  return {
    relato: relato.value?.relato
  }
})

async function getRelato () {
  relato_SET_DEFAULT_STATE()
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => { isLoading.value = l }
  })
}

onMounted(() => {
  getRelato()
})

const plantillaOptions = [
  {
    idPlantilla: 1,
    labelPlantilla: 'Plantilla 1 - Robo Morada'
  }
]
</script>
