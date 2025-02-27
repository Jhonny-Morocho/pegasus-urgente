<template>
<section class="col-12">
  <AppFieldset
    class="col-12"
    legend="Armas"
  >
    <div class="col-12 grid">
      <AppInput
        id="marca"
        v-model="formData.marca"
        class="col-3"
        :disabled="readOnly"
        label="Marca"
      />
      <AppInput
        id="Modelo"
        v-model="formData.modelo"
        class="col-3"
        :disabled="readOnly"
        label="Modelo"
      />
      <AppInput
        id="calibre"
        v-model="formData.calibre"
        class="col-3"
        :disabled="readOnly"
        label="Calibre"
      />
      <AppInput
        id="Serie"
        v-model="formData.serie"
        class="col-3"
        :disabled="readOnly"
        label="Serie"
      />
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
import { reactive, defineProps } from 'vue'
defineProps({
  readOnly: Boolean
})

const formData = reactive({
  marca: '',
  modelo: '',
  calibre: '',
  serie: ''
})
</script>
