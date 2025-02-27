<template>
<div class="grid p-fluid col-6 m-0 p-0">
  <div class="col-6 pl-0">
    <AppDropdown
      id="id-tipo-termino"
      v-model="form.tipoTermino"
      label="Tipo de Término"
      option-label="descripcion"
      option-value="id"
      :options="tiposTermino"
      :rules="{
        required
      }"
      @change="getSubtiposTerminoById"
    />
  </div>
  <div class="col-6">
    <AppDropdown
      id="id-subtipo-termino"
      v-model="form.subtipoTermino"
      label="Subtipo de Término"
      :loading="loadingSubtipoTermino"
      option-label="descripcion"
      option-value="id"
      :options="subtiposTermino"
      :rules="esCampoRequerido(subtiposTermino)"
    />
  </div>
</div>
<AppTextarea
  id="id-motivo-termino"
  v-model="form.motivoTermino"
  class="w-full p-fluid"
  label="Motivo de Término"
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

// eslint-disable-next-line no-unused-vars
const { required } = useFormValidation()

const {
  tiposTermino,
  subtiposTermino,
  mantenedor_getSubTiposTerminoByIdTermino
} = useMantenedorStore()

const props = defineProps({
  modelValue: propTypes.object
})
const emit = defineEmits(['update:modelValue'])

const form = ref(props.modelValue)

const loadingSubtipoTermino = ref(false)
async function getSubtiposTerminoById () {
  loadingSubtipoTermino.value = true
  // formData.idTipoEspecie = null
  const payload = {
    id: form.value.tipoTermino
  }

  requestUtil({
    action: mantenedor_getSubTiposTerminoByIdTermino,
    payload,
    resolve: () => {
      loadingSubtipoTermino.value = false
    }
  })
}

function esCampoRequerido (_options) {
  if (_options.length) {
    return { required }
  }

  return {}
}

watch(form, (newValues) => {
  emit('update:modelValue', newValues)
})
</script>
