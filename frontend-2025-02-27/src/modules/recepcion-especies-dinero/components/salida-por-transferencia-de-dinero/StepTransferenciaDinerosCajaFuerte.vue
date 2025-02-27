<template>
<section>
  <AppForm
    id="form-generar-acta-salida"
    class="grid mt-4"
    :form-submitted="formSubmitted"
    validation-scope="form-generar-acta-salida"
  >
    <AppFieldset
      class="col-12 mx-auto"
      legend="Solicitud de Salida por Transferencia"
    >
      <SolicitudDeSalida
        class="col-12"
        :data-solicitud-de-salida="mockDataSolicitudSalida"
        tipo-salida="cajaFuerte"
      />
      <AppInput
        id="runReceptor"
        v-model="formData.runReceptor"
        class="col-12 md:col-6 lg:col-4"
        label="RUN receptor"
        :rules="{ required }"
      />
      <AppInput
        id="nombreReceptor"
        v-model="formData.nombreReceptor"
        class="col-12 md:col-6 lg:col-4"
        label="Nombre Receptor"
        :rules="{ required }"
      />
    </AppFieldset>
    <AppFieldset
      class="col-12"
      legend="Causa"
    >
      <Causa :data-causa="causa" />
    </AppFieldset>
    <AppFieldset
      class="pt-2 col-12"
      legend="Dinero a Transferir"
    >
      <DataDineroATransferir
        class="col-12"
        :data="dinero"
      />
      <p class="text-xl col-12 mt-4">
        Detalle del Dinero:
      </p>
      <TablaDesgloseDinero
        :data="dinero"
      />
      <p class="col-12 mt-4">
        Total General: <span class="font-bold text-l">{{ dinero.monto }}</span>
      </p>
    </AppFieldset>
    <AppFieldset
      class="col-12"
      legend="Registro Salida Temporal"
    >
      <AppTextarea
        id="observaciones"
        v-model="observaciones"
        class="col-12"
        cols="100"
        label="Observaciones"
        rows="6"
      />
    </AppFieldset>
  </AppForm>
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-save"
    icon-pos="right"
    label="Generar Acta Salida Transferencia"
    @click="generarActa"
  />
</section>
</template>
<script setup>
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import SolicitudDeSalida from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/SolicitudDeSalida.vue'
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import TablaDesgloseDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaDesgloseDinero.vue'
import DataDineroATransferir from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/DataDineroATransferir.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { ref, defineEmits } from 'vue'

const formData = ref({
  runReceptor: '',
  nombreReceptor: '',
  observacionesSalida: ''
})

const { required, formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-generar-acta-salida'
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const emit = defineEmits(['next-step'])

const causa = {
  ruc: '1234987-01'
}

const dinero = {
  nue: 1234,
  rue: 1234,
  custodio: 1234,
  descripcion: 1234,
  tipoMoneda: 1234,
  monto: 1234,
  tipoDelito: 1234,
  desglose: [
    {
      denominacion: 2,
      tipo: 2,
      cantidadDinero: 4
    },
    {
      denominacion: 6,
      tipo: 1,
      cantidadDinero: 2
    }
  ]
}

const mockDataSolicitudSalida = {
  fechaSolicitud: '29-09-2022',
  destinatario: 'Jorge Rojas',
  fechaDeSalida: '16-07-2022',
  runDestinatario: '5.642.777-2',
  fiscaliaDeOrigen: 'Casablanca',
  fiscaliaDeDestino: 'Valparaíso',
  fiscalDeOrigen: 'Samuel Nuñez P.',
  fiscalDeDestino: 'Cristián Andrade',
  numeroDeConvenioDeOrigen: 10608347,
  numeroDeConvenioDeDestino: 100004555,
  codigoDeFiscaliaDeOrigen: 1701703,
  codigoDeFiscaliaDeDestino: 1701080,
  cuentaDeFiscaliaDeOrigen: 9005153,
  cuentaDeFiscaliaDeDestino: 9000003
}

function generarActa () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  emit('next-step', 'step-acta-salida-por-transferencia', formData.value)
}
</script>
