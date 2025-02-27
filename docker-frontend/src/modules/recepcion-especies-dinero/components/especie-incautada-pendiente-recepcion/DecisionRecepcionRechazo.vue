<template>
<section>
  <AppForm
    id="form-especies-incautadas-pendientes"
    class="grid"
    :form-submitted="formSubmitted"
    validation-scope="formEspeciesIncautadasPendientes"
  >
    <div class="grid col-12 md:col-6 lg:col-4">
      <AppDropdown
        id="deicisionSeleccionada"
        v-model="formData.decisionSeleccionada"
        class="col-12"
        label="Seleccione Decisión"
        option-label="descripcion"
        option-value="id"
        :options="decisiones"
        show-clear
      />
      <AppDropdown
        v-if="formData.decisionSeleccionada === 2"
        id="tipoObservacion"
        v-model="formData.tipoObservacion"
        class="col-12"
        label="Tipo de observación"
        option-label="descripcion"
        option-value="id"
        :options="tiposObservacion"
        :rules="{ required }"
        show-clear
      />
      <AppDropdown
        v-if="formData.decisionSeleccionada === 3"
        id="motivo-rechazo"
        v-model="formData.motivoDeRechazo"
        class="col-12"
        label="Motivo de Rechazo"
        option-label="descripcion"
        option-value="id"
        :options="motivosRechazo"
        :rules="{ required }"
        show-clear
      />
    </div>
    <div
      v-if="esDinero"
      class="grid col-12 md:col-6 lg:col-4 lg:col-offset-4"
    >
      <div
        class="col-12 mb-3"
      >
        <Button
          :disabled="loaderRectificar"
          :icon="loaderRectificar ? 'pi pi-spinner pi-spin' : ''"
          icon-pos="right"
          label="Rectificar Monto"
          style="background-color:#606e84;height:35px"
          @click="handleModalRectificarMonto"
        />
      </div>
      <AppInput
        v-if="formData.montoFinalRectificado != 0"
        id="montoFinalRectificado"
        v-model="formData.montoFinalRectificado"
        class="col-12"
        disabled
        label="Monto Rectificado"
      />
    </div>
    <AppTextarea
      v-if="
        formData.decisionSeleccionada !== '' &&
          formData.decisionSeleccionada !== 1
      "
      id="observacion-aceptar"
      v-model="formData.observaciones"
      auto-resize
      class="col-12"
      cols="85"
      label="Observaciones"
      rows="4"
    />
    <AppBtnNextTeleported
      :disabled="
        formData.decisionSeleccionada === '' ||
          (formData.decisionSeleccionada === 2 &&
            formData.tipoObservacion === '') ||
          (formData.decisionSeleccionada === 3 &&
            formData.motivoDeRechazo === '') ||
          (formData.decisionSeleccionada !== 1 && formData.observaciones === '')
      "
      label="Generar Comprobante"
      @click="generarComprobante"
    />
  </AppForm>
</section>
</template>
<script setup>
import { reactive, defineProps, defineEmits, computed } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { useEspecieIncautadaPendienteRecepcionStore } from '../../composables'

const props = defineProps({
  esDinero: Boolean,
  motivosRechazo: propTypes.array,
  tiposObservacion: propTypes.array,
  decisiones: propTypes.array,
  arrayEspeciesDinero: propTypes.array,
  loaderRectificar: Boolean
})

const emit = defineEmits(['next-step', 'rectificar-monto'])

const {
  mantenedor_getNombreDenominacionDinero
} = useMantenedorStore()

function generarComprobante () {
  emit('next-step', formData)
}

function handleModalRectificarMonto () {
  emit('rectificar-monto', props.arrayEspeciesDinero.find(d => d))
}

function denominacionNombre (idDenominacion) {
  if (idDenominacion) {
    return mantenedor_getNombreDenominacionDinero(idDenominacion)
  }
  return 'Sin Denominación'
}

const {
  especiesIncautadas
} = useEspecieIncautadaPendienteRecepcionStore()

function getFormDataInitial () {
  return {
    decisionSeleccionada: '',
    tipoObservacion: '',
    motivoDeRechazo: '',
    montoFinalRectificado: montoRectificado,
    observaciones: ''
  }
}

const montoRectificado = computed(() => {
  const arrayFiltrado = especiesIncautadas.value.dinero?.filter(d => d.tipoMoneda)
  let t = 0
  arrayFiltrado?.forEach((e) => {
    t += denominacionNombre(e.denominacion) * e.cantidadDinero
  })
  return t
})

const formData = reactive(getFormDataInitial())

const { formSubmitted, required } = useFormValidation({
  formData: { formData },
  validationScope: 'formEspeciesIncautadasPendientes'
})
</script>
