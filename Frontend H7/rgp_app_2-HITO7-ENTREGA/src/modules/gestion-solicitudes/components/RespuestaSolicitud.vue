<template>
<AppFieldset
  class="w-full"
  legend="Respuesta Solicitud de Ampliación de Plazo"
>
  <div class="col-12 p-0">
    <div class="col-8 flex">
      <AppDropdown
        id="decidirSolicitud"
        v-model="formData.decidirSolicitud"
        class="col-5 p-fluid"
        label="Decidir sobre la Solicitud de Ampliación (*)"
        option-label="descripcion"
        option-value="id"
        :options="[
          { id: 1, descripcion: 'Aprobar' },
          { id: 2, descripcion: 'Rechazar' },
        ]"
        placeholder
        show-clear
      />
      <AppDropdown
        id="plazo"
        v-model="formData.plazo"
        class="col-5 p-fluid"
        label="Plazo"
        option-label="descripcion"
        option-value="id"
        :options="plazos"
        placeholder
        show-clear
      />
    </div>
    <AppTextarea
      id="comentario"
      v-model="formData.observacion"
      class="px-3"
      cols="150"
      label="Comentario"
      rows="5"
      style="width: 100%"
    />
  </div>
</AppFieldset>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  modelValue: propTypes.object
})

const emit = defineEmits(['update:modelValue'])

const formData = ref(props.modelValue)

watch(formData.value, (newValues) => {
  emit('update:modelValue', newValues)
})

const plazos = [
  { id: 1, descripcion: '10 días' },
  { id: 2, descripcion: '15 días' },
  { id: 3, descripcion: '20 días' },
  { id: 4, descripcion: '30 días' },
  { id: 5, descripcion: '60 días' }
]
</script>
<style scoped>
.p-inputtextarea  {
  width: 100% !important;
}

</style>
