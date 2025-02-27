<template>
<div class="flex flex-column">
  <p><strong>RUC: </strong>{{ causa?.ruc }}</p>
  <p><strong>Nombre Causa: </strong>{{ causa?.nombreCausa }}</p>
  <p
    v-if="existeDiligenciaEnEsperaResultado"
    class="flex flex-row"
  >
    <i class="pi pi-exclamation-triangle mr-3" />
    <span>Existe al menos una diligencia en espera de resultado</span>
  </p>
  <div class="flex flex-column">
    <p class="mb-3 text-center">
      <strong>¿Desea desactivar la Alerta?</strong>
    </p>
    <AppSelectButton
      id="id-es-urgente"
      v-model="isDesactivarAlerta"
      class="w-full"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
      :rules="{ required }"
    />
  </div>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const causa = reactive({
  ruc: '',
  nombreCausa: ''
})

const existeDiligenciaEnEsperaResultado = ref(true)

const isDesactivarAlerta = ref(false)
</script>
