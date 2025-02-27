<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Testigo(s)"
>
  <div class="col-12 md:col-9 lg:col-4 text-center">
    <h4 class="mb-2">
      ¿Conoce algún Testigo(s)?
    </h4>
    <AppSelectButton
      id="conoceTestigo"
      v-model="form.conoceTestigo"
      option-label="descripcion"
      option-value="id"
      :options="filterTipoRespuestaBasicaNNA"
      :rules="{ required }"
    />
  </div>
</AppFieldset>
</template>

<script setup>
import { computed } from 'vue'

import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'

const { required } = useFormValidation()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const { tipoRespuestaBasica } = useMantenedorStore()

const form = sujetosIntervinientesInject

 const filterTipoRespuestaBasicaNNA = computed(() => {
  const fixedLabel = tipoRespuestaBasica.value.map((e) => {
    if (e.descripcion.includes('No Informado')) {
      return { ...e, descripcion: 'No Consultado' }
    }
    return e
  })
  return fixedLabel.filter((respuesta) => respuesta.codigo !== '4')
})
</script>
