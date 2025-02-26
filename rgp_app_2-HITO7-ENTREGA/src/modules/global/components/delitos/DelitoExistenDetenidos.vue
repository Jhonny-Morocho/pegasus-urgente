<template>
<AppFieldset legend="¿Existen Detenidos? (*)">
  <AppSelectButton
    id="existenDetenidos"
    v-model="form.existenDetenidos"
    class="col-12"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Si', value: true },
      { name: 'No', value: false },
      { name: 'No aplica', value: null },
    ]"
    :rules="{
      required,
    }"
  />
</AppFieldset>
</template>
<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { useDelitoInject } from '@/modules/global/composables/useDelito'

const { required } = useFormValidation()

const { delitoInject } = useDelitoInject()

const form = delitoInject.existenLesionados
</script>
