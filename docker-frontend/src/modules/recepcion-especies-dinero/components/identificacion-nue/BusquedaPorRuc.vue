<template>
<section>
  <AppForm
    id="form-identificacion-nue"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="formIdentificacionNue"
  >
    <Nue
      ref="campoNue"
      class="col-12 md:col-6 lg:col-4 mb-4"
      :label="'Ingrese RUC'"
      :loading="rucLoader"
      @buscar-nue="busquedaRue"
    />
  </AppForm>
  <AppFieldset
    class="w-full mb-0"
    :collapsed="!causa?.causa?.rolUnico"
    legend="Resultado búsqueda por RUC"
    no-margin-bottom
  >
    <FieldsetResultadoBusqueda
      :causa="causa"
      :delitos="delitos"
    >
      <AppFieldset
        class="w-full mt-4"
        :collapsed="!dataEspecies"
        legend="NUEs de la Causa"
        no-margin-bottom
      >
        <NuesCausa
          ref="nuesCausa"
          :data-especies="dataEspecies"
          @seleccionar-nue="habilitarStep2"
        />
        <AppFieldset
          class="w-full mt-4"
          :collapsed="!especieAgregada"
          legend="Agregar NUE"
          no-margin-bottom
          toggleable
        >
          <FormularioAgregarNue
            ref="formularioAgregarNue"
            class="col-12"
            :especie-agregada="especieAgregada"
            @agregar-especie-nue="agergarEspecieNue"
          />
        </AppFieldset>
      </AppFieldset>
    </FieldsetResultadoBusqueda>
  </AppFieldset>
</section>
</template>
<script setup>
import { reactive, defineEmits, defineProps, ref, defineExpose } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import Nue from '@/modules/recepcion-especies-dinero/components/global/Nue.vue'
import FieldsetResultadoBusqueda from '@/modules/recepcion-especies-dinero/components/identificacion-nue/FieldsetResultadoBusqueda.vue'
import NuesCausa from '@/modules/recepcion-especies-dinero/components/identificacion-nue/NuesCausa.vue'
import FormularioAgregarNue from '@/modules/recepcion-especies-dinero/components/identificacion-nue/FormularioAgregarNue.vue'

const campoNue = ref()
const formularioAgregarNue = ref()

defineProps({
  rucLoader: Boolean,
  especieAgregada: Boolean,
  causa: propTypes.object,
  delitos: propTypes.object,
  dataEspecies: propTypes.array
})

const formData = reactive(getFormDataInitial())
const { isFormValid, formSubmitted } = useFormValidation({
  formData,
  validationScope: 'formIdentificacionNue'
})

function getFormDataInitial () {
  return {
    numeroDocumentoIdentificacion: ''
  }
}

const { toastError, TOAST_MESSAGES } = useAppToast()

const emit = defineEmits([
  'agregar-especie-nue',
  'busqueda-por-ruc',
  'seleccionar-nue'
])

const nuesCausa = ref()

function busquedaRue (ruc) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  emit('busqueda-por-ruc', ruc)
}

function habilitarStep2 (data) {
  emit('seleccionar-nue', data)
}

function agergarEspecieNue (data) {
  emit('agregar-especie-nue', data)
}

function reset () {
  formularioAgregarNue.value.resetForm()
}

function limpiarCampoBusqueda () {
  campoNue.value.limpiarCampo()
}

defineExpose({ reset, limpiarCampoBusqueda })
</script>
<style scoped>
.buttonSearch {
  height: 2.5em;
  border-radius: 0 5px 5px 0px;
}
</style>
