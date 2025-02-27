<template>
<div class="p-0 text-center">
  <p>
    Reproducir <strong>{{ audio?.name }}</strong>
  </p>
  <div class="grid mt-6">
    <audio
      ref="audiopanel"
      controls
    >
      <source
        ref="audioSource"
        type="audio/mp3"
      >
    </audio>
  </div>
  <h4 class="text-left my-4">
    Guardar un marcador:
  </h4>
  <div class="p-inputgroup">
    <InputText
      id="nombre-marcador"
      v-model="nombreMarcador"
      class="p-inputtext-sm col-10 p-fluid"
      placeholder="Nombre del marcador"
    />
    <Button
      class="btn-primary p-button-sm"
      icon="pi pi-save"
      icon-pos="right"
      @click="marcarAudio"
    />
  </div>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps, onMounted, ref } from 'vue-demi'
import { watch } from 'vue'
import { requestUtil } from '@/utils'
import { useTramitarAudiencia } from '../../composables'

const props = defineProps({
  audio: propTypes.object
})
const { audiosMarcados, tramitarAudiencia_ADD_MARCADOR } = useTramitarAudiencia()
const audioSource = ref(null)
const audiopanel = ref(null)
const nombreMarcador = ref('')

watch(
  () => props.audio.filePath,
  () => {
    audioSource.value.src = props.audio.filePath
    console.log('changed: ', audioSource.value.src)
  }
)

onMounted(() => {
  audioSource.value.src = props.audio.filePath
})

function marcarAudio () {
  const marcador = {
    name: nombreMarcador.value,
    duration: audiopanel.value.currentTime,
    filePath: audioSource.value.src
  }
  audiosMarcados.value.push(marcador)
  requestUtil({
    action: tramitarAudiencia_ADD_MARCADOR,
    payload: audiosMarcados,
    resolve: () => {
      console.log('after: ', audiosMarcados.value)
    }
  })
}
</script>

<style scoped>
.seek_slider {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 8px;
  width: 250px;
  background: #c4c4c4;
  transition: opacity 0.2s;
  -webkit-transition: 0.2s;
}

.seek_slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 8px;
  height: 8px;
  background: #152d57;
}

.play-btn {
  color: #fff;
  font-weight: 600;
  border-radius: 50%;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  cursor: pointer;
}
</style>
