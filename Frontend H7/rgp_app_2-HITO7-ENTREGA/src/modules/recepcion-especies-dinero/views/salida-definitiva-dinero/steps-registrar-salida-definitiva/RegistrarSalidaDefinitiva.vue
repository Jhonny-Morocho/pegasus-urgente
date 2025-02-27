<template>
<AppFieldset legend="Datos Receptor">
  <DatosReceptor
    ref="refDatosReceptor"
    :data="mockDatosReceptor"
    :form-submitted="formSubmitted"
    :validation-scope="validationScope"
  />
</AppFieldset>
<AppFieldset
  v-if="mockDatosReceptor.modoEntrega === 'Cheque' || mockDatosReceptor.modoEntrega === 'Efectivo' "
  legend="Validar Receptor"
>
  <ValidarReceptor
    ref="refValidarReceptor"
    :form-submitted="formSubmitted"
    :validation-scope="validationScope"
  />
</AppFieldset>
<AppBtnNextTeleported
  class="ml-8"
  :label="llegoCita ? 'Generar Comprobante de Entrega' : 'Confirmar Inasistencia'"
  @click="handleNextStep"
/>
</template>
<script setup>
import { defineEmits, computed, ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import DatosReceptor from '@/modules/recepcion-especies-dinero/components/salida-definitiva-dinero/DatosReceptor.vue'
import ValidarReceptor from '@/modules/recepcion-especies-dinero/components/salida-definitiva-dinero/ValidarReceptor.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useRegistrarsalidaDefinitivaForm } from '@/modules/recepcion-especies-dinero/composables'

const emit = defineEmits(['next-step'])

const { toastError, TOAST_MESSAGES } = useAppToast()

const { formData } = useRegistrarsalidaDefinitivaForm()

const validationScope = 'elaborarAudiencia'

const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope
})

const refDatosReceptor = ref()

const refValidarReceptor = ref()

function handleNextStep () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const payload = {
    observaciones: refDatosReceptor.value.observaciones,
    agendaRetiro: refValidarReceptor.value.agendaRetiro,
    observacionesValidar: refValidarReceptor.value.observacionesValidar
  }
  console.log('formData', payload)
  emit('next-step', 'generar-comprobante-entrega')
}

const llegoCita = computed(() => true)

const mockDatosReceptor = {
  monto: 'CLP $2.500.000',
  interes: 'CLP $25.000',
  montoTotal: 'CLP $2.525.000',
  modoEntrega: 'Cheque',
  entidadBancaria: 'Banco Estado',
  numeroCuenta: '12345678',
  tipoCuenta: 'Cuenta Vista',
  duenoCuenta: 'Juan Pérez',
  runDueno: '12.345.678-9',
  telefono: '+56977665544',
  correo: 'jperez@gmail.com'
}
</script>
