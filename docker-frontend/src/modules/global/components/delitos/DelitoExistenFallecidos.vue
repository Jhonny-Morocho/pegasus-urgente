<template>
<AppFieldset legend="¿Existen Fallecidos? (*)">
  <div class="col-12">
    <span>
      <AppSelectButton
        id="existenFallecidos"
        v-model="form.existenMuertos"
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

const form = delitoInject.existenLesionados
</script>
