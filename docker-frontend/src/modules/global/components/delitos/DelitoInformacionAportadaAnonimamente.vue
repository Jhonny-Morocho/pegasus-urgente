<template>
<AppFieldset legend="¿Es información aportada anónimamentesfdfsf?">
  <div class="col-12 md:col-3">
    <span>
      <AppSelectButton
        id="esInformacionAnonima"
        v-model="form.esInformacionAnonima"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
      />
    </span>
  </div>
  <div class="col-offset" />
  <div class="col-12 px-0">
    <AppInput
      id="programaRazonAnonimato"
      v-model="form.programaRazonAnonimato"
      class="col-12 mb-0"
      :disabled="!form.esInformacionAnonima"
      label="Indicar programa y/o razones del anonimato"
    />
  </div>
  <div class="col-12 px-0">
    <AppDropdown
      id="viaInformacionAportada"
      v-model="form.viaInformacionAportada"
      class="col-12 mb-0"
      :disabled="!form.esInformacionAnonima"
      label="Vía de información aportada anonimamente"
      option-label="name"
      option-value="name"
      :options="viaInformacionAportadaOption"
    />
  </div>
</AppFieldset>
</template>
<script setup>
import { viaInformacionAportadaOption } from '@/data/delito.json'

// ready

import { useDelitoInject } from '@/modules/global/composables/useDelito'

const { delitoInject } = useDelitoInject()

const form = delitoInject.informacionAnonima
</script>
