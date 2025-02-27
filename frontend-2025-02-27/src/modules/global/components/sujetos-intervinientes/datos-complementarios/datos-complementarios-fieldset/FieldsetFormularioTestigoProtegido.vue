<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Testigo Protegido"
>
  <div class="col-12 md:col-6 lg:col-3 text-center mt-1">
    <h4>Marca de reserva del Testigo (Testigo Protegido)</h4>
    <AppSelectButton
      id="esTestigoProtegido"
      v-model="form.reservaTestigo"
      class="w-full"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
      :rules="{ required }"
    />
  </div>
  <div
    class="grid col-12 lg:col-9 lg:pt-6"
  >
    <AppDropdown
      id="fuenteInfoTestigo"
      v-model="form.fuenteInformacion"
      class="col-12 md:col-8"
      label="Fuente de la información sobre el Testigo"
      option-label="descripcion"
      option-value="id"
      :options="fuenteInfoTestigo"
      :retrieve-data-action=" mantenedor_getFuenteInformacionTestigo"
      :rules="{ required }"
      show-clear
    />
    <AppDropdown
      id="tipoDeTestigo"
      v-model="form.tipoTestigo"
      class="col-12 md:col-4 lg:col-4"
      label="Tipo de Testigo"
      option-label="descripcion"
      option-value="id"
      :options="tipoTestigo"
      :retrieve-data-action=" mantenedor_getTipoTestigo"
      :rules="{ required }"
      show-clear
    />
  </div>
</AppFieldset>
</template>
<script setup>

import { useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useMantenedorStore } from '@/modules/global/composables'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const { required } = useFormValidation()

const {
  mantenedor_getFuenteInformacionTestigo, fuenteInfoTestigo,
  mantenedor_getTipoTestigo, tipoTestigo
} = useMantenedorStore()

const form = sujetosIntervinientesInject

</script>
