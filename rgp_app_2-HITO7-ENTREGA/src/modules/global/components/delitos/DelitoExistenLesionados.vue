<template>
<AppFieldset legend="¿Existen Lesionados? (*)">
  <div class="col-12">
    <span>
      <AppSelectButton
        id="existenLesionados"
        v-model="form.existenLesionados"
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
    </span>
  </div>
</AppFieldset>
</template>
<script setup>
import { useFormValidation } from '@/modules/common/composables'

import { useDelitoInject } from '@/modules/global/composables/useDelito'

const { required } = useFormValidation()

const { delitoInject } = useDelitoInject()

const form = delitoInject.formData
</script>
