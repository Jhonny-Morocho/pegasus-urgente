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
    <span class="col-6"> Unidad Policial </span>
  </div>
</div>
<AppForm
  class="grid px-3 mt-3 text-xl"
  :form-submitted="formSubmitted"
  validation-scope="formData"
>
  <AppSelectButton
    id="tipoComunicacion"
    v-model="formData.aprobacion"
    option-label="descripcion"
    option-value="value"
    :options="[{descripcion: 'Aprobar', value: true},
               {descripcion: 'Rechazar', value: false}]"
  />
  <div class="col-12">
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
  comentario: '',
  aprobacion: ''
})
const { formSubmitted } = useFormValidation({ formData, validationScope: 'formData' })

defineProps({
  procedimiento: propTypes.object
})

function retrieveData (retrieveCb) {
  const { comentario, aprobacion } = formData
  retrieveCb?.({
    comentario, aprobacion
  })
}

defineExpose({ retrieveData })
</script>
