<template>
<div class="col-12">
  <AppFieldset
    legend="Dirección y Datos de Contacto de la Persona Jurídica"
  >
    <AppDropdown
      id="regionPersonaJuridica"
      v-model="form.regionPersonaJuridica"
      class="col-12 md:col-3"
      label="Región"
      option-label="descripcion"
      option-value="id"
      :options="regiones"
      :retrieve-data-action="mantenedor_getRegiones"
      :rules="{ required }"
      show-clear
    />
    <AppDropdown
      id="comunaPersonaJuridica"
      v-model="form.comunaPersonaJuridica"
      class="col-12 md:col-3"
      label="Comuna"
      option-label="descripcion"
      option-value="id"
      :options="comunasOption"
      :retrieve-data-action="mantenedor_getComunas"
      :rules="{ required }"
      show-clear
    />
    <AppInput
      id="callePersonaJuridica"
      v-model="form.callePersonaJuridica"
      class="col-3"
      label="Calle"
      :rules="{ required }"
    />
    <AppInput
      id="numeroCallePersonaJuridica"
      v-model="form.numeroCallePersonaJuridica"
      class="col-3"
      label="Número"
      :rules="{ required }"
    />
    <AppInputMask
      id="telefonoFijoPersonaJuridica"
      v-model="form.telefonoFijoPersonaJuridica"
      class="col-3"
      label="Teléfono Fijo"
      mask="99999999999"
    />
    <AppInput
      id="correoPersonaJuridica"
      v-model="form.correoPersonaJuridica"
      class="col-3"
      label="Correo Electrónico"
      :rules="{
        email,
      }"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject } from '../../composables'
import { useMantenedorStore } from '@/modules/global/composables'
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const { email, required } = useFormValidation()
const form = sujetosIntervinientesInject

const { regiones, comuna, mantenedor_getRegiones, mantenedor_getComunas } = useMantenedorStore()

const comunasOption = computed(() => {
  return comuna.value.filter(
    (c) => c.idPadre === form.regionPersonaJuridica
  )
})
</script>
