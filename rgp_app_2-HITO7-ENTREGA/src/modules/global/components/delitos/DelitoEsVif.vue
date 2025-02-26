<template>
<AppFieldset
  legend="¿Es VIF (Violencia Intra Familiar)?
"
>
  <div class="col-12">
    <span>
      <AppSelectButton
        id="esVif"
        v-model="form.esVIF"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
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

const form = delitoInject.infoAdicional
</script>
