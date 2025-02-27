<template>
<section class="grid col-12">
  <AppTextarea
    id="instrucciones-especificas"
    v-model="formData.instruccionFiscal"
    :auto-resize="true"
    class="col-12"
    label="Instrucciones Específicas"
    rows="6"
    :rules="{ required }"
  />
  <h4 class="col-12">
    ¿Desea Revisar Escrito?
  </h4>
  <AppSelectButton
    id="revisa-escrito"
    v-model="formData.seRevisaEscrito"
    class="col-12 md:col-4 lg:col-3"
    option-label="name"
    option-value="value"
    :options="[
      { name: 'Si', value: true },
      { name: 'No', value: false }
    ]"
    :rules="{ required }"
  />
</section>
</template>
<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { useInstruirDiligencia } from '../../composables'

const { formData } = useInstruirDiligencia()

const { required } = useFormValidation()

</script>
