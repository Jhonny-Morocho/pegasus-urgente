<template>
<div class="w-full">
  <div class="grid">
    <AppDropdown
      id="id-cierre-causa"
      v-model="form.motivoCierre"
      class="p-fluid col-12 md:col-4"
      label="Acción de cierre"
      option-label="descripcion"
      option-value="id"
      :options="tiposAccionCierre"
      :rules="{
        required
      }"
    />
    <AppTextarea
      id="id-comentario-cierre-causa"
      v-model="form.comentario"
      class="p-fluid col-12"
      label="Motivo de Cierre de Investigación"
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
import { useMantenedorStore } from '@/modules/global/composables'

const {
  tiposAccionCierre
} = useMantenedorStore()

const props = defineProps({
  modelValue: propTypes.object
})
const emit = defineEmits(['update:modelValue'])

// eslint-disable-next-line no-unused-vars
const { ruc } = useDirigirInvestigacionStore()

const { required } = useFormValidation()

const form = ref(props.modelValue)

watch(form, (newValues) => {
  emit('update:modelValue', newValues)
})
</script>
