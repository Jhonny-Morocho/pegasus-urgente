<template>
<AppFieldset
  class="w-full col-12 p-4"
  legend="Nuevo Pide Cuenta"
>
  <div class="col-6">
    <AppCalendar
      id="nuevo-plazo"
      v-model="formData.nuevoPlazo"
      label="Nuevo Plazo"
      :rules="{ required }"
      show-icon="true"
    />
  </div>
  <div class="col-6">
    <h3>¿Desea Informar a Fiscal Jefe?</h3>
    <AppSelectButton
      id="informe-fiscal-jefe"
      v-model="formData.informarFiscalJefe"
      class="col-4"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
      :rules="{ required }"
    />
  </div>
</AppFieldset>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import { propTypes } from '@/modules/common/types'
import { useFormValidation } from '@/modules/common/composables'

const props = defineProps({
  modelValue: propTypes.object
})

const emit = defineEmits(['update:modelValue'])

const formData = ref(props.modelValue)

watch(formData.value, (newValues) => {
  emit('update:modelValue', newValues)
})

const { required } = useFormValidation()
</script>

<style scoped lang="scss">
::v-deep(#informe-fiscal-jefe .p-button) {
  width: 25%;
}
::v-deep(#nuevo-plazo) {
  width: 50%;
}
.p-fieldset-content .grid div.col-6 {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.field {
  width: 100%;
}
h3 {
  margin-right: auto;
  margin-bottom: 0.5rem;
}
</style>
