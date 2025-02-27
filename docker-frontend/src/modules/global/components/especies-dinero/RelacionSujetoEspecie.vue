<template>
<section>
  <AppFieldset
    class="col-12"
    legend="Relación de la Especie con los intervinientes"
  >
    <div class="col-12 lg:col-4">
      <MultiSelect
        v-model="formData.sujetosEspecie"
        class="w-full"
        :disabled="readOnly"
        :max-selected-labels="1"
        option-label="nombreCompleto"
        option-value="idPersona"
        :options="sujetosIntervinientesNombreCompleto"
        placeholder="Sujetos / Intervinientes"
        style="max-height: 34px"
      />
    </div>
    <AppInput
      id="nombre-tenedor-especie"
      v-model="formData.observacionRelacionSujeto"
      class="col-12 lg:col-8"
      :disabled="readOnly"
      label="Observación"
    />
  </AppFieldset>
</section>
</template>
<script setup>
import { computed, defineProps } from 'vue'
import { useMantenedorStore, useSujetosIntervinientesStore } from '@/modules/global/composables/'
import { useEspeciesDineroInject } from '../../composables/useEspeciesDinero'

const { especiesDineroInject } = useEspeciesDineroInject()

const formData = especiesDineroInject

defineProps({
  readOnly: Boolean
})

const { mantenedor_getNombreTipoSujeto } = useMantenedorStore()

const { sujetosIntervinientes } = useSujetosIntervinientesStore()

const sujetosIntervinientesNombreCompleto = computed(() => {
  return sujetosIntervinientes?.value.map((s) => {
    const nombreCompleto = s.razonSocial ? `${s.razonSocial} (${mantenedor_getNombreTipoSujeto(s.tipoSujeto)})` : `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno} (${mantenedor_getNombreTipoSujeto(s.tipoSujeto)})`
    return {
      ...s,
      nombreCompleto
    }
  })
})
</script>
