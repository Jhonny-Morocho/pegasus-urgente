<template>
<AppFieldset
  class="col-12"
  legend="Datos Funcionario Publico"
>
  <div class="col-12 md:col-6 lg:col-3 text-center">
    <h4 class="mb-2">
      ¿Es Funcionario Público?
    </h4>
    <AppSelectButton
      id="esFuncionarioPublico"
      v-model="form.esFuncionarioPublico"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
      @change="resetCampos"
    />
  </div>
  <AppInput
    v-if="form.esFuncionarioPublico"
    id="cargoFuncionarioPublicoDelDenunciante"
    v-model="form.cargoFuncionarioPublico"
    class="col-12 md:col-6 lg:col-4 mt-auto"
    label="Cargo del Funcionario Público"
    :rules="{ required }"
  />
  <AppInput
    v-if="form.esFuncionarioPublico"
    id="institucionAdscritoDenunciante"
    v-model="form.institucionFuncionarioPublico"
    class="col-12 md:col-6 lg:col-5 mt-auto"
    label="Institución pública a la que está adscrito"
    :rules="{ required }"
  />
</AppFieldset>
</template>

<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'

const { required } = useFormValidation()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const form = sujetosIntervinientesInject

function resetCampos () {
  if (!form.esFuncionarioPublico) {
    form.institucionFuncionarioPublico = null
    form.cargoFuncionarioPublico = null
  }
}
</script>
