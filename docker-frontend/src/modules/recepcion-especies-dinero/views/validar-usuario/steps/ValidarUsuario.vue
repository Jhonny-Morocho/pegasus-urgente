<template>
<section>
  <AppFieldset legend="Solicitud de Salida de Especie">
    <ShowTwoColumnData 
      :dataCol1="solicitudSalida.dataCol1"
      :dataCol2="solicitudSalida.dataCol2"
    />
  </AppFieldset>

  <AppFieldset legend="Especies con instrucción de salida">
    <TablaEspeciesDinero
      esModelo2
      esModelo3
      readOnly
      :value="especies"
    />
  </AppFieldset>

  <AppFieldset legend="Causa">
    <div class="col-12 grid">
      <div class="col-4">
        <p><strog>RUC: </strog></p>
        <p><strog>Nombre Causa: </strog></p>
      </div>
      <div class="col-4">
        <p><strog>Estado de la causa: </strog></p>
        <p><strog>Fiscal Asignado: </strog></p>
      </div>
      <div class="col-4">
        <p><strog>Fecha Creación Causa: </strog></p>
        <p><strog>Nombre Fiscalía: </strog></p>
      </div>
      <p><strog>Delitos(s): </strog></p>
    </div>
  </AppFieldset>

  <AppFieldset legend="Agendamiento para devolución">
    <div class="col-12 grid">
      <div class="col-4">
        <h4 class="col-12 mb-3 text-center">
          ¿Receptor llegó a cita?
        </h4>
        <AppSelectButton
          id="efectivo"
          v-model="formData.cumplio"
          class="col-12 p-fluid"
          option-label="descripcion"
          option-value="value"
          :options="[
            { descripcion: 'Si', value: true },
            { descripcion: 'No', value: false }
          ]"
        />
      </div>
      <div class="col-4">
        <h4 class="col-12 mb-3 text-center">
          ¿Validar Receptor?
        </h4>
        <AppSelectButton
          id="efectivo"
          v-model="formData.validacion"
          class="col-12 p-fluid"
          option-label="descripcion"
          option-value="value"
          :options="[
            { descripcion: 'Si', value: true },
            { descripcion: 'No', value: false }
          ]"
        />
      </div>
      <div class="col-4">
        <p><strong>Agendamiendo N°: </strong>1</p>
      </div>
    </div>
    <AppTextarea
      id="observaciones"
      v-model="formData.observaciones"
      class="col-12"
      cols="150"
      label="Comentario"
      rows="5"
    />
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Generar Comprobante de Salida"
      @click="handleNextStep"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { ref, reactive } from 'vue';
// components
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'
import TablaEspeciesDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaEspeciesDinero.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
// composables
import { useRouter } from 'vue-router';
// mockData borrar en integracion
import { especies } from '@/modules/recepcion-especies-dinero/data/mockEspecie.json'

const router = useRouter()

const mockDataSolicitud = ref([])
const solicitudSalida = ref({
  dataCol1: [
    { label: 'Fecha de solicitud: ', value: mockDataSolicitud.value?.fechaDestruccion },
    { label: 'Tipo de Salida: ', value: mockDataSolicitud.value?.fechaDestruccion },
    { label: 'Destinatario: ', value: mockDataSolicitud.value?.empresa },
    { label: 'RUN Destinatario: ', value: mockDataSolicitud.value?.fiscalia },
  ],
  dataCol2: [
    { label: 'Dirección: ', value: mockDataSolicitud.value?.custodio },
    { label: 'Correo: ', value: mockDataSolicitud.value?.runCustodio },
    { label: 'Teléfono: ', value: mockDataSolicitud.value?.ministroFe },
    { label: 'Fecha de agendamiento: ', value: mockDataSolicitud.value?.runMinistroFe },
  ],
})

const formData = reactive({
  cumplio: '',
  validacion: '',
  observaciones: ''
})

function handleNextStep(){
  router.push({ name: 'BandejaCustodio' })
}

function handleBackStep(){
  // ...
}
</script>