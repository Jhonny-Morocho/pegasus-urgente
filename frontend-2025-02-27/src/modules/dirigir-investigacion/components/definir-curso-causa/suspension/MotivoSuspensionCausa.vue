<template>
<div class="grid p-fluid col-6 m-0 p-0">
  <div class="col-6 pl-0">
    <AppDropdown
      id="id-tipo-suspension"
      v-model="form.tipoSuspension"
      label="Tipo de Suspensión"
      option-label="descripcion"
      option-value="id"
      :options="tiposSuspension"
      :rules="{
        required
      }"
      @change="getSubtiposSuspensionById"
    />
  </div>
  <div class="col-6">
    <AppDropdown
      id="id-subtipo-suspension"
      v-model="form.subtipoSuspension"
      label="Subtipo de Suspensión"
      :loading="loadingSubtipoSuspension"
      option-label="descripcion"
      option-value="id"
      :options="subtiposSuspension"
      :rules="{
        required
      }"
    />
  </div>
</div>
<AppTextarea
  id="id-motivo-suspension"
  v-model="form.motivoSuspension"
  class="w-full p-fluid"
  label="Motivo de Suspensión"
  rows="8"
  :rules="{
    required
  }"
/>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

const {
  tiposSuspension,
  subtiposSuspension,
  mantenedor_getSubTiposSuspensionByIdSuspension
} = useMantenedorStore()

const { required } = useFormValidation()

const props = defineProps({
  modelValue: propTypes.object
})
const emit = defineEmits(['update:modelValue'])

const form = ref(props.modelValue)

const loadingSubtipoSuspension = ref(false)
async function getSubtiposSuspensionById () {
  loadingSubtipoSuspension.value = true
  // formData.idTipoEspecie = null
  const payload = {
    id: form.value.tipoSuspension
  }

  requestUtil({
    action: mantenedor_getSubTiposSuspensionByIdSuspension,
    payload,
    resolve: () => {
      loadingSubtipoSuspension.value = false
    }
  })
}

watch(form, (newValues) => {
  emit('update:modelValue', newValues)
})
</script>
