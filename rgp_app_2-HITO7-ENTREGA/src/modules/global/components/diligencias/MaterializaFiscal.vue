<template>
<section class="grid col-12">
  <AppDropdown
    id="plantilla"
    v-model="formData.idPlantilla"
    class="col-4"
    disabled
    label="Plantilla"
    option-label="descripcion"
    option-value="id"
    :options="[]"
    @change="getEscritoPlantilla"
  />
  <AppEditor
    id="editor-instrucciones-especificas"
    v-model="formData.textoHito"
    class="col-12"
    :rules="{ required }"
  />
</section>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import { useFormValidation } from '@/modules/common/composables'
import { useInstruirDiligencia } from '../../composables'

const { formData } = useInstruirDiligencia()

const { required } = useFormValidation()

function getEscritoPlantilla () {
  // por hacer
}

</script>
