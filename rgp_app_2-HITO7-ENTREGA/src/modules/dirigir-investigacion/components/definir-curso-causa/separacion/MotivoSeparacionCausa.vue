<template>
<div class="w-full">
  <div class="grid">
    <p class="col-12 mb-4">
      <strong>RUC: </strong>
      <RouterLink
        class="ruc-link"
        to="#"
      >
        {{ ruc }}
      </RouterLink>
    </p>
    <p class="col-12 mb-4">
      <strong>Nombre Causa: {{ resumenCausa?.nombreCausa }}</strong>
    </p>
    <p class="col-12 mb-4">
      <strong>Causa Judicializada: {{ resumenCausa?.esJudicializada ? 'Si' : 'No' }}</strong>
    </p>

    <AppTextarea
      id="id-input-comentario"
      v-model="form.comentario"
      auto-resize
      class="p-fluid col-12 mb-0"
      label="Comentario"
      rows="5"
      :rules="{
        required
      }"
    />
  </div>
</div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useFormValidation } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

const props = defineProps({
  modelValue: propTypes.object
})
const emit = defineEmits(['update:modelValue'])

const {
  ruc,
  resumenCausa
} = useDirigirInvestigacionStore()

const { required } = useFormValidation()

const form = ref(props.modelValue)

watch(form, (newValues) => {
  emit('update:modelValue', newValues)
})
</script>

<style scoped>
.ruc-link {
  color: #2c6ddf;
  font-weight: 600;
  text-decoration: none;
}
.ruc-link:hover {
  color: #275bb4;
}
.ruc-link:active {
  color: #2d75f0;
}
</style>
