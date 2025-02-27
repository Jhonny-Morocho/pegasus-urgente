<template>
<AppFieldset
  class="col-12"
  legend="¿Es información aportada anónimamente?"
>
  <AppSelectButton
    id="es-info-anonima"
    v-model="formData.esInformacionAnonima"
    class="col-12 md:col-4"
    :disabled="readOnly"
    option-label="name"
    option-value="value"
    :options="[
      { name: 'Si', value: true },
      { name: 'No', value: false },
    ]"
    @change="resetData"
  />
  <AppInput
    id="programa-razon-anonimato"
    v-model="formData.programaRazonAnonimato"
    class="col-12 mb-0"
    :disabled="!formData.esInformacionAnonima || readOnly"
    label="Indicar programa y/o razones del anonimato"
  />
  <AppDropdown
    id="via-info-aportada"
    v-model="formData.viaInformacionAportada"
    class="col-12 mb-0"
    :disabled="!formData.esInformacionAnonima || readOnly"
    label="Vía de información aportada anonimamente"
    option-label="descripcion"
    option-value="descripcion"
    :options="viaInfoOptions"
    show-clear
  />
</AppFieldset>
</template>
<script setup>
import { ref, defineProps } from 'vue'
import { useDelitoInject } from '@/modules/global/composables/useDelito'

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()

const formData = delitoInject

const resetData = () => {
  formData.programaRazonAnonimato = ''
  formData.viaInformacionAportada = ''
}

const viaInfoOptions = ref([
  { id: 1, descripcion: 'Presencial' },
  { id: 2, descripcion: 'Telefónica' },
  { id: 3, descripcion: 'Oficio' },
  { id: 4, descripcion: 'Carta' },
  { id: 5, descripcion: 'Correo Electrónico' },
  { id: 99, descripcion: 'Otro' }
])
</script>
