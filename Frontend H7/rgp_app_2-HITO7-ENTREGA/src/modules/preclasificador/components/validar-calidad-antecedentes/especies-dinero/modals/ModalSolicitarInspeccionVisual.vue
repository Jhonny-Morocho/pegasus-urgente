<template>
<AppForm
  id="formSolicitarInspeccionVisual"
  class="grid"
  :form-submitted="formSubmitted"
  validation-scope="formSolicitarInspeccionVisual"
>
  <div class="col-6">
    <h4 class="mb-4">
      RUC: {{ rucCausa }}
    </h4>
    <h4 class="mb-4">
      Especie: {{ tipoEspecie(props.especie.idTipoEspecie) }}
    </h4>
    <h4 class="mb-4">
      Identificación de Custodio: {{ }}
    </h4>
    <AppTextarea
      id="observacion"
      v-model="formData.observacion"
      :auto-resize="true"

      cols="45"
      label="Observación de la Diligencia"
      rows="7"
      :rules="{ required }"
    />
  </div>
  <div class="col-6">
    <h4 class="mb-4">
      RUE: {{ props.especie.rue }}
    </h4>
    <h4 class="mb-4">
      Cantidad: {{ props.especie.cantidadEspecie }}
    </h4>
    <h4 class="mb-4">
      Inspector que Solicita: {{ }}
    </h4>

    <AppCalendar
      id="fechaYHoraInspeccionVisual"
      v-model="formData.fechaYHoraInspeccionVisual"
      class="p-fluid col-10 pl-0"
      label="Fecha y Hora Solicitud Inspección Visual"
      :rules="{ required }"
      show-time
    />
  </div>
</AppForm>
</template>

<script setup>

import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useStepValidarCalidadAntecedentesStore } from '@/modules/preclasificador/composables'
import { reactive, defineProps, defineExpose } from 'vue'
const {

  mantenedor_getNombreTipoEspecie

} = useMantenedorStore()
const { toastError, MSG_ERRORS } = useAppToast()
const { causa } = useStepValidarCalidadAntecedentesStore()
const rucCausa = causa.value.antecedentes.ruc
const props = defineProps({
  especie: {
    type: Object,
    default: () => null
  }
})

function tipoEspecie (idTipoEspecie) {
  if (idTipoEspecie) {
    return mantenedor_getNombreTipoEspecie(idTipoEspecie)
  }
  return 'Sin Tipo'
}
function initialData () {
  return {
    ruc: rucCausa,
    idTipoEspecie: props.especie.idTipoEspecie,
    identificacionDeCustodio: '',
    observacion: '',
    rue: props.especie.rue,
    cantidadEspecie: props.especie.cantidadEspecie,
    inspectoQueSolicita: '',
    fechaYHoraInspeccionVisual: ''

  }
}
const formData = reactive(initialData())
const { isFormValid, formSubmitted, required } = useFormValidation({
  formData: formData,
  validationScope: 'formSolicitarInspeccionVisual'
})

function retrieveData (retrieveCb) {
  console.log('isFormValid', isFormValid())
  if (!isFormValid()) {
    toastError(MSG_ERRORS.formInvalid)
  }
  const data = { ...formData }
  retrieveCb?.(data)
}
defineExpose({ retrieveData })
</script>
