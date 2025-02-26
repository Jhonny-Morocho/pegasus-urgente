<template>
<section>
  <AppForm
    id="form-identificacion-nue"
    :form-submitted="formSubmitted"
    validation-scope="formIdentificacionNue"
  >
    <Nue
      ref="campoNue"
      class="col-12 md:col-6 lg:col-4 mb-4"
      :label="'Ingrese NUE'"
      :loading="nueLoader"
      @buscar-nue="busquedaNue"
    />
  </AppForm>
  <AppFieldset
    class="w-full mb-0"
    :collapsed="!causa?.rolUnico"
    legend="Resultado búsqueda por NUE"
    no-margin-bottom
  >
    <FieldsetResultadoBusqueda
      :causa="causa"
      :delitos="delitos"
      :rues="rues"
    />
    <div
      v-if="datosIngresoTransferencia"
      class="my-4 ml-2"
    >
      <p class="my-3">
        Motivo de Transferencia: <strong>Incompetencia Tribunal</strong>
      </p>
      <p class="my-3">
        Fiscalía de Origen: <strong>Fiscalía de Valparaíso</strong>
      </p>
      <p class="my-3">
        Fecha de Transferencia: <strong>09-11-2022</strong>
      </p>
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
import { reactive, defineProps, defineEmits, defineExpose, ref } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import Nue from '@/modules/recepcion-especies-dinero/components/global/Nue.vue'
import FieldsetResultadoBusqueda from '@/modules/recepcion-especies-dinero/components/identificacion-nue/FieldsetResultadoBusqueda.vue'

defineProps({
  nueLoader: Boolean,
  datosIngresoTransferencia: Boolean,
  causa: propTypes.object,
  delitos: propTypes.object,
  rues: propTypes.array
})

const campoNue = ref()

const formData = reactive({ numeroDocumentoIdentificacion: '' })

const { isFormValid, formSubmitted } = useFormValidation({
  formData,
  validationScope: 'formIdentificacionNue'
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const emit = defineEmits(['busqueda-por-nue'])

function busquedaNue (nue) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  emit('busqueda-por-nue', nue)
}

function limpiarCampoBusqueda () {
  campoNue.value.limpiarCampo()
}

defineExpose({ limpiarCampoBusqueda })
</script>
<style scoped>
.buttonSearch {
  height: 2.5em;
  border-radius: 0 5px 5px 0px;
}
</style>
