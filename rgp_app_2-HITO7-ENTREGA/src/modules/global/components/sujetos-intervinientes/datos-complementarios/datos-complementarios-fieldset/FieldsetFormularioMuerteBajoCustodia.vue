<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Muerte bajo custodia"
>
  <div class="col-12 md:col-6 lg:col-3 text-center pl-4">
    <h4>¿Muerte bajo custodia?</h4>
    <span>
      <AppSelectButton
        id="muerteBajoCustodiaInimputable"
        v-model="form.muertesBajoCustodia"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
        :rules="{ required }"
      />
    </span>
  </div>
</AppFieldset>
</template>

<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const { required } = useFormValidation()

const form = sujetosIntervinientesInject
</script>
