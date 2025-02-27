<template>
<div class="w-full">
  <div class="grid">
    <div class="grid col-6">
      <AppDropdown
        id="id-tipo-cierre"
        v-model="form.tipoSuspension"
        class="col-12 md:col-6 p-fluid"
        label="Tipo de Suspensión"
        option-label="descripcion"
        option-value="id"
        :options="tiposSuspension"
        :rules="{
          required
        }"
        @change="getSubtiposSuspensionById"
      />
      <AppDropdown
        id="id-subtipo-cierre"
        v-model="form.subtipoSuspension"
        class="p-fluid col-12 md:col-6"
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
    <AppTextarea
      id="id-comentario-cierre"
      v-model="form.motivoSuspension"
      class="p-fluid col-12 mb-0"
      label="Motivo de Suspensión"
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

const { required } = useFormValidation()

const {
  tiposSuspension,
  subtiposSuspension,
  mantenedor_getSubTiposSuspensionByIdSuspension
} = useMantenedorStore()

const props = defineProps({
  modelValue: propTypes.object
})
const emit = defineEmits(['update:modelValue'])

const form = ref(props.modelValue)

const loadingSubtipoSuspension = ref(false)

async function getSubtiposSuspensionById () {
  loadingSubtipoSuspension.value = true
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
