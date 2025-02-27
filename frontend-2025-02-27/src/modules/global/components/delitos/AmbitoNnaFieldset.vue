<template>
<AppFieldset legend="Ambito NNA">
  <div class="col-12 lg:col-4">
    <h4 class="mb-2 text-center">
      ¿El NNA se Niega a Separar del Adulto?
    </h4>
    <span>
      <AppSelectButton
        id="nna-niega-separar-adulto"
        v-model="formData.nnaSeNiegaSepararAdulto"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
      />
    </span>
  </div>
  <div class="col-12 lg:col-8 lg:pt-5">
    <AppInput
      id="describir-conductas-nna"
      v-model="formData.describirConductasNNA"
      :disabled="readOnly"
      label="Describir manifestaciones conductuales NNA (1 o más víctimas)"
    />
  </div>
  <div class="col-12">
    <AppFieldset
      legend="Formulario de Denuncia"
      no-margin-bottom
    >
      <slot name="adjuntar-denuncia" />
    </AppFieldset>
  </div>
</AppFieldset>
</template>

<script setup>
import { defineProps } from 'vue'
import { useDelitoInject } from '@/modules/global/composables/useDelito'

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()

const formData = delitoInject
</script>
