<template>
<div class="w-full">
  <div class="grid">
    <div class="grid col-6">
      <AppDropdown
        id="id-tipo-cierre"
        v-model="form.tipoTermino"
        class="p-fluid col-12 md:col-6"
        label="Tipo de Término"
        option-label="descripcion"
        option-value="id"
        :options="tiposTermino"
        :rules="{
          required
        }"
        @change="getSubtiposTerminoById"
      />
      <AppDropdown
        id="id-subtipo-cierre"
        v-model="form.subtipoTermino"
        class="p-fluid col-12 md:col-6"
        label="Subtipo de Término"
        :loading="loadingSubtipoTermino"
        option-label="descripcion"
        option-value="id"
        :options="subtiposTermino"
        :rules="esCampoRequerido(subtiposTermino)"
      />
    </div>
    <AppTextarea
      id="id-comentario-cierre"
      v-model="form.motivoTermino"
      class="p-fluid col-12 mb-0"
      label="Motivo de Término"
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
import { requestUtil } from '@/utils'
import AppDropdown from '@/modules/common/components/inputs/AppDropdown.vue'

const {
  tiposTermino,
  subtiposTermino,
  mantenedor_getSubTiposTerminoByIdTermino
} = useMantenedorStore()

const { required } = useFormValidation()

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
