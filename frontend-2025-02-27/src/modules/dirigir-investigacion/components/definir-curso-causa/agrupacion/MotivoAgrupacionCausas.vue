<template>
<div class="w-full">
  <div class="grid">
    <p
      v-if="causaPrincipal?.ruc"
      class="col-12 mb-4"
    >
      La Causa con <strong>RUC {{ causaPrincipal?.ruc }}</strong> es la más avanzada. Las otras Causas de la tabla se agruparán a la Causa Principal.
    </p>
    <AppDropdown
      id="id-decision-causa"
      v-model="form.motivoAgrupacion"
      class="p-fluid col-12 md:col-4"
      label="Motivo de Agrupación"
      option-label="descripcion"
      option-value="id"
      :options="motivoAgrupacion"
      placeholder
      :retrieve-data-action="mantenedor_getMotivoAgrupacion"
      :rules="{
        required
      }"
      show-clear
    />

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
import { useMantenedorStore } from '@/modules/global/composables'

const {
  motivoAgrupacion,
  mantenedor_getMotivoAgrupacion
} = useMantenedorStore()

const props = defineProps({
  modelValue: propTypes.object,
  causaPrincipal: propTypes.object
})

const emit = defineEmits(['update:modelValue'])

const { required } = useFormValidation()

const form = ref(props.modelValue)

watch(form, (newValues) => {
  emit('update:modelValue', newValues)
})
</script>
