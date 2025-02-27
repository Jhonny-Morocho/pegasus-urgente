<template>
<div class="col-12">
  <AppFieldset legend="Identificación de la Persona Jurídica">
    <div class="grid col-12">
      <RutInput
        id="rutPersonaJuridica"
        v-model="form.rutPersonaJuridica"
        class="col-12 md:col-4"
        label="RUT"
      />
      <AppInput
        id="razonSocial"
        v-model="form.razonSocial"
        class="col-12 md:col-8"
        label="Razón social"
      />
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { useSujetosIntervinientesInject } from '@/modules/global/composables'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const form = sujetosIntervinientesInject

</script>
