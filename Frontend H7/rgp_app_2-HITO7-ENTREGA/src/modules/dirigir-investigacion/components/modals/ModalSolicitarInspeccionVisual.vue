<template>
<hr>
<section class="p-3 mt-3 grid">
  <div class="col-12 md:col-6 mb-6">
    <ul>
      <li>
        <strong>ID de Solicitud:</strong> {{ form.idSolicitud }}
      </li>
      <li>
        <strong>Motivo Especie:</strong> {{ especie?.motivo }}
      </li>
      <li>
        <strong>Clase Especie:</strong> {{ especie?.claseEspecie }}
      </li>
    </ul>
  </div>
  <div class="col-12 md:col-6">
    <ul>
      <li>
        <strong>Lugar de Custodia:</strong> {{ especie?.lugarCustodia }}
      </li>
      <li>
        <strong>Familia Especie:</strong> {{ especie?.familiaEspecie }}
      </li>
      <li>
        <strong>Identificación del Custodio:</strong> {{ especie?.identificacionCustodio }}
      </li>
    </ul>
  </div>
  <div class="col-12 mb-0">
    <AppForm
      id="formulario-inspeccion-visual"
      class="grid"
      :form-submitted="formSubmitted"
      validation-scope="formulario-inspeccion-visual"
    >
      <AppCalendar
        id="fechahora-inspeccion"
        v-model="form.fechaHoraInspeccion"
        class="col-12 md:col-4"
        label="Fecha y Hora Inspección Visual"
        :rules="{ required }"
      />
      <AppInput
        id="inspector-solicitante"
        v-model="form.inspectorSolicitante"
        class="col-12 md:col-4"
        label="Inspector que Solicita"
        :rules="{ required }"
      />
      <AppInput
        id="plazo-respuesta"
        v-model="form.plazo"
        class="col-12 md:col-4"
        label="Plazo Esperado para la Respuesta"
        :rules="{ required }"
      />
      <AppTextarea
        id="motivo-inspeccion"
        v-model="form.motivoInspeccion"
        class="col-12 mb-0"
        cols="45"
        label="Motivo Inspección"
        rows="6"
        :rules="{ required }"
      />
    </AppForm>
  </div>
</section>
</template>
<script setup>
import { defineProps, defineExpose, reactive } from 'vue'
import { propTypes } from '@/modules/common/types'
import { appUtil } from '@/utils'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

const props = defineProps({
  especie: propTypes.object
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const form = reactive({
  idSolicitud: appUtil.cadenaAleatoria(8),
  claseEspecie: props.especie?.claseEspecie,
  lugarCustodia: props.especie?.lugarCustodia,
  familiaEspecie: props.especie?.familiaEspecie,
  identificacionCustodio: props.especie?.identificacionCustodio,
  inspectorSolicitante: null,
  fechaHoraInspeccion: null,
  motivoInspeccion: '',
  plazo: null
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData: form,
  validationScope: 'formulario-inspeccion-visual'
})

function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  retrieveCb?.(form)
}

defineExpose({ retrieveData })
</script>
<style lang="scss" scoped>
ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}
li {
    font-size: 1.2rem;
}
</style>
