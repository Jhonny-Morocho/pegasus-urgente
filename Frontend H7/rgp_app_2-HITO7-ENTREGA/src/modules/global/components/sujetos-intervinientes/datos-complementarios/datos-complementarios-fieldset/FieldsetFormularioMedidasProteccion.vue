<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Medidas de Protección"
>
  <div class="mt-2 col-12 md:col-6 lg:col-3 text-center">
    <h4 class="">
      ¿Pidió Medidas de Protección?
    </h4>
    <span>
      <AppSelectButton
        id="pidioMedidasDeProteccion"
        v-model="form.pidioMedidasDeProteccion"
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
  <div class="col-12 lg:col-9 my-auto">
    <MultiSelect
      v-if="form.pidioMedidasDeProteccion"
      v-model="form.medidasProteccion.idsMedidas"
      :disabled="form.readonly"
      :max-selected-labels="1"
      option-label="descripcion"
      option-value="id"
      :options="medidasProteccion"
      placeholder="Medidas de Protección"
      :rules="{ required }"
      selected-items-label="{0} Medidas de Protección selecionadas"
    />
  </div>
</AppFieldset>
</template>

<script setup>
import { watch } from 'vue'

import { useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject, useMantenedorStore } from '@/modules/global/composables/'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const { mantenedor_getMedidasProteccion, medidasProteccion } = useMantenedorStore()

const form = sujetosIntervinientesInject

const { required } = useFormValidation()

mantenedor_getMedidasProteccion()

watch(() => form.pidioMedidasDeProteccion, () => {
  if (!form.pidioMedidasDeProteccion) {
    form.medidasProteccion.idsMedidas = ''
  }
})
</script>
