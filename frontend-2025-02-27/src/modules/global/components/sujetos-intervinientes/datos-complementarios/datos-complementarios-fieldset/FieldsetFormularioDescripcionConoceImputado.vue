<template>
<AppFieldset
  class="col-12 mt-2"
  legend="Descripción del imputado"
>
  <div class="col-12 md:col-9 lg:col-4 text-center">
    <h4>
      ¿Conoce al Imputado(s) o puede entregar descripción de él o ellos? (*)
    </h4>
    <AppSelectButton
      id="conoceImputado"
      v-model="form.conoceImputado"
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
import {
  useSujetosIntervinientesInject,
  useMantenedorStore
} from '@/modules/global/composables/'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const {
  tipoRespuestaBasica, mantenedor_getIdTipoRespuestaBasicaByCodigo
} = useMantenedorStore()

const { required } = useFormValidation()

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
if (!form.conoceImputado) form.conoceImputado = mantenedor_getIdTipoRespuestaBasicaByCodigo('3')
</script>
