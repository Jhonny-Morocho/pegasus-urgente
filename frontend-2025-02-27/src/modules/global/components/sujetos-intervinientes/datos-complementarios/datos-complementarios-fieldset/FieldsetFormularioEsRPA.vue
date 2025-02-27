<template>
<AppFieldset
  class="col-12 pb-3"
>
  <div
    class="grid col-12 lg:col-8 lg:pt-5"
  >
    <AppDropdown
      id="rolEnElHechoDelictual"
      v-model="form.rolHechoDelictual"
      class="col-12 md:col-6"
      label="Rol en el hecho delictual"
      option-label="descripcion"
      option-value="id"
      :options="rolHechoDelictual"
      :retrieve-data-action=" mantenedor_getRolHechoDelictual"
      show-clear
    />
    <AppDropdown
      id="perfilImputado"
      v-model="form.perfilImputado"
      class="col-12 md:col-6"
      label="Perfil del Imputado"
      option-label="descripcion"
      option-value="id"
      :options="perfilImputado"
      :retrieve-data-action=" mantenedor_getPerfilImputado"
      show-clear
    />
  </div>
</AppFieldset>
<AppFieldset
  class="col-12 pb-3"
  legend="RPA"
>
  <div class="col-12 md:col-9 lg:col-4 text-center mt-1">
    <h4>¿Es RPA?</h4>
    <span>
      <AppSelectButton
        id="EsRpa"
        v-model="form.esRPA"
        option-label="descripcion"
        option-value="id"
        :options="filterTipoRespuestaBasica"
      />
    </span>
  </div>
</AppFieldset>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useMantenedorStore } from '@/modules/global/composables'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const {
  mantenedor_getRolHechoDelictual, rolHechoDelictual,
  mantenedor_getPerfilImputado, perfilImputado,
  tipoRespuestaBasica
} = useMantenedorStore()

const form = sujetosIntervinientesInject

const filterTipoRespuestaBasica = computed(() => {
  const fixedLabel = tipoRespuestaBasica.value.map(e => {
    if (e.descripcion.includes('No Consultado')) return { ...e, descripcion: 'No Informado' }
    return e
  })
  return fixedLabel.filter(respuesta => respuesta.codigo !== '4')
})

// Se rompe el endpoint si van null
watch(() => form.rolHechoDelictual, () => { if (!form.rolHechoDelictual)form.rolHechoDelictual = '' })
watch(() => form.perfilImputado, () => { if (!form.perfilImputado)form.perfilImputado = '' })
</script>
