<template>
<div class="grid">
  <div class="col-12 md:col-4">
    <AppFieldset
      class="pb-0"
      legend="¿Existen Lesionados? (*)"
    >
      <AppSelectButton
        id="existen-lesionados"
        v-model="formData.existenLesionados"
        class="col-12"
        :disabled="readOnly"
        option-label="descripcion"
        option-value="id"
        :options="filterTipoRespuestaBasica"
        :rules="{ required }"
      />
    </AppFieldset>
  </div>
  <div class="col-12 md:col-4">
    <AppFieldset
      class="pb-0"
      legend="¿Existen Fallecidos? (*)"
    >
      <AppSelectButton
        id="existen-fallecidos"
        v-model="formData.existenMuertos"
        class="col-12"
        :disabled="readOnly"
        option-label="descripcion"
        option-value="id"
        :options="filterTipoRespuestaBasica"
        :rules="{ required }"
      />
    </AppFieldset>
  </div>
  <div class="col-12 md:col-4">
    <AppFieldset
      class="pb-0"
      legend="¿Existen Detenidos? (*)"
    >
      <AppSelectButton
        id="existen-detenidos"
        v-model="formData.existenDetenidos"
        class="col-12"
        :disabled="readOnly"
        option-label="descripcion"
        option-value="id"
        :options="filterTipoRespuestaBasica"
        :rules="{ required }"
      />
    </AppFieldset>
  </div>
</div>
</template>
<script setup>
import { defineProps, computed } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useMantenedorStore } from '@/modules/global/composables'

const { tipoRespuestaBasica } = useMantenedorStore()

const filterTipoRespuestaBasica = computed(() => {
  const fixedLabel = tipoRespuestaBasica.value.map(e => {
    if (e.descripcion.includes('No Informado')) return { ...e, descripcion: 'No Consultado' }
    return e
  })
  return fixedLabel.filter(respuesta => respuesta.codigo !== '4')
})
const { delitoInject } = useDelitoInject()

const { required } = useFormValidation()

defineProps({
  readOnly: Boolean
})

const formData = delitoInject
</script>
