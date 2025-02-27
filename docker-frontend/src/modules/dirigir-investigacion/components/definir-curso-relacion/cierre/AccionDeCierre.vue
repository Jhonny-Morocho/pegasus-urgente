<template>
<div class="w-full">
  <div class="grid">
    <AppDropdown
      id="id-accion-cierre"
      v-model="form.accionCierre"
      class="p-fluid col-12 md:col-4"
      label="Acción de Cierre"
      option-label="descripcion"
      option-value="id"
      :options="tiposAccionCierre"
      :rules="{
        required
      }"
    />
    <AppTextarea
      id="id-comentario-cierre"
      v-model="form.motivoCierre"
      class="p-fluid col-12 mb-0"
      label="Motivo de Cierre de Investigación"
      :rows="8"
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
import { useMantenedorStore } from '@/modules/global/composables'
import AppDropdown from '@/modules/common/components/inputs/AppDropdown.vue'

const {
  tiposAccionCierre
} = useMantenedorStore()

const { required } = useFormValidation()

const props = defineProps({
  modelValue: propTypes.object
})
const emit = defineEmits(['update:modelValue'])

const form = ref(props.modelValue)

watch(form, (newValues) => {
  emit('update:modelValue', newValues)
})
</script>
