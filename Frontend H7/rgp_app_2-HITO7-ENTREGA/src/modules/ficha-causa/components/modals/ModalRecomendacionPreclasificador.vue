<template>
<section class="grid">
  <div class="col-6 mb-2">
    <div class="flex flex-column px-1">
      <p class="mb-1">
        <strong>RUC: </strong>{{ data?.ruc }}
      </p>
      <p class="my-1">
        <strong>Institución que recibe la denuncia: </strong>{{ data?.institucion }}
      </p>
      <p class="my-1">
        <strong>Fiscalía: </strong>{{ data?.fiscalia }}
      </p>
      <p class="mt-1">
        <strong>Medio de recepción: </strong>{{ data?.medioRecepcion }}
      </p>
    </div>
  </div>
  <div class="col-6 mb-2">
    <div class="flex flex-column px-1">
      <p class="mb-1">
        <strong>Fecha / Hora Ingreso: </strong>{{ data?.fechaHoraIngreso }}
      </p>
      <p class="my-1">
        <strong>Atendedor Jurídico: </strong>{{ data?.atendedorJuridico }}
      </p>
      <p class="my-1">
        <strong>Especie / Dinero: </strong>{{ cantidad?.especies || 'NO PRESENTA' }}
      </p>
      <p class="mt-1">
        <strong>Documentos: </strong>{{ cantidad?.documentos || 'NO PRESENTA' }}
      </p>
    </div>
  </div>
  <AppForm
    id="recomendacion-preclasificador"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="recomendacion-preclasificador"
  >
    <AppTextarea
      id="recomendacion"
      v-model="formData.recomendacion"
      :auto-resize="true"
      label="Recomendación a Preclasificación"
      rows="4"
      :rules="{ required }"
    />
  </AppForm>
</section>
</template>

<script setup>
import { defineProps, defineExpose, reactive } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useFichaCausaData } from '../../composables'

defineProps({
  data: propTypes.object
})

const { cantidad } = useFichaCausaData()

const { toastError, TOAST_MESSAGES } = useAppToast()

const formData = reactive({
  recomendacion: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'recomendacion-preclasificador'
})

function retrieveData (retrieve) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  retrieve?.(formData)
}

defineExpose({ retrieveData })
</script>

<style lang="scss" scoped>
p {
  padding-bottom: 8px;
}
:deep(.p-inputtextarea) {
  width: 100%;
}
</style>
