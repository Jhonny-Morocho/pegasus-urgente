<template>
<div class="px-3 text-xl">
  <div class="grid">
    <div class="grid col-6 my-1">
      <span class="col-6"><strong>Fiscal / Turno: </strong></span>
      <span class="col-6">{{ procedimiento?.fiscalTurno.toUpperCase() }}</span>
    </div>
    <div class="grid col-6 my-1">
      <span class="col-6"><strong>Fecha / hora solicitud: </strong></span>
      <span class="col-6"> {{ dateTimeUtil.formatToFrontendWithTime(new Date()) }} </span>
    </div>
  </div>
  <div class="grid">
    <div class="grid col-6 my-1">
      <span class="col-6"><strong>Procedimiento: </strong> </span>
      <span class="col-6"> {{ "Folio" + " "+procedimiento?.folio }}</span>
    </div>
    <div class="grid col-6 my-1">
      <span class="col-6"><strong>Funcionario Responsable: </strong></span>
      <span class="col-6"> {{ procedimiento?.funcionarioResponsable.toUpperCase() }} </span>
    </div>
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
import { dateTimeUtil } from '@/utils'

const formData = reactive({
  comentario: '',
  fechaSolicitud: dateTimeUtil.formatToBackendWithTime(new Date())
})
const { formSubmitted } = useFormValidation({ formData, validationScope: 'formData' })

defineProps({
  procedimiento: propTypes.object
})

function retrieveData (retrieveCb) {
  const { comentario, fechaSolicitud } = formData
  retrieveCb?.({
    comentario,
    fechaSolicitud
  })
}

defineExpose({ retrieveData })
</script>
