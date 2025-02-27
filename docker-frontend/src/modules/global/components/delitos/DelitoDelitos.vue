<template>
<AppFieldset legend="Delitos">
  <AppDropdown
    id="familiaDelito"
    v-model="form.idFamiliaDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Seleccione Familia del Delito"
    option-label="descripcion"
    option-value="idFamiliaDelito"
    :options="familiaDelito"
    :rules="{
      required,
    }"
    show-clear
  />
  <AppDropdown
    id="tipoDelito"
    v-model="form.idTipoDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Seleccione Tipo de Delito"
    option-label="descripcion"
    option-value="idTipoDelito"
    :options="tipoDelitoOptions"
    :rules="{
      required,
    }"
    show-clear
  />

  <AppInput
    id="codigoDelitoCarabineros"
    v-model="form.codigoDelitoCarabineros"
    class="col-12 md:col-6 lg:col-4"
    label="Código de Delito de Carabineros"
    :rules="{
      required,
    }"
  />

  <AppInput
    id="descripcionDelito"
    v-model="form.descripcionDelito"
    class="col-12 md:col-6 lg:col-8 mb-0"
    label="Descripción del Delito"
    :rules="{
      required,
    }"
  />
</AppFieldset>
</template>
<script setup>
import { useFormValidation } from '@/modules/common/composables'

import { useDelitoInject } from '@/modules/global/composables/useDelito'

const { required } = useFormValidation()

const { delitoInject } = useDelitoInject()

const form = delitoInject.delitos

</script>
