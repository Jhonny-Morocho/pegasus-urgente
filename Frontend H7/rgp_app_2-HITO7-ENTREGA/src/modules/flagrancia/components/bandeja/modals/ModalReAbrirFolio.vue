<template>
<div class="px-3 text-xl">
  <div class="grid my-1">
    <span class="col-6"><strong>Fiscal / Turno: </strong></span>
    <span class="col-6">{{ procedimiento?.fiscalTurno.toUpperCase() }}</span>
  </div>
  <div class="grid my-1">
    <span class="col-6"><strong>Procedimiento: </strong> </span>
    <span class="col-6"> {{ "Folio" + " "+procedimiento?.folio }}</span>
  </div>
  <div class="grid my-1">
    <span class="col-6"><strong>Funcionario Responsable: </strong></span>
    <span class="col-6"> {{ procedimiento?.funcionarioResponsable.toUpperCase() }} </span>
  </div>
  <div class="grid my-1">
    <span class="col-6"><strong>Unidad Policial: </strong></span>
    <span class="col-6"> {{ procedimiento?.unidadPolicial }} </span>
  </div>
</div>
<AppForm
  class="grid px-3 text-xl"
  :form-submitted="formSubmitted"
  validation-scope="formData"
>
  <div class="col-12 my-1">
    <span><strong>Comentario: </strong></span>
  </div>
  <AppTextarea
    id="comentarioAcd"
    v-model="formData.comentario"
    class="col-12"
    label="Ingrese un comentario"
    rows="5"
  />
</AppForm>
</template>

<script setup>
import { defineProps, defineExpose, reactive } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { useFormValidation } from '@/modules/common/composables'

const formData = reactive({
  comentario: ''
})
const { formSubmitted } = useFormValidation({ formData, validationScope: 'formData' })

defineProps({
  procedimiento: propTypes.object
})

function retrieveData (retrieveCb) {
  const { comentario } = formData
  retrieveCb?.({
    comentario
  })
}

defineExpose({ retrieveData })
</script>
