<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-title="Devolución a Dueño o Donación"
/>
<section class="mt-6 mb-8">
  <AppFieldset legend="Solicitud de Salida de Especie">
    <ShowTwoColumnData 
      :dataCol1="dataSalida.col1"
      :dataCol2="dataSalida.col2"
    />
  </AppFieldset>

  <AppFieldset legend="Especies con instrucción de salida">
    <TablaEspeciesDinero
      class="w-full mb-4"
      readOnly
      esModelo2
      esModelo3
    />
  </AppFieldset>

  <AppFieldset legend="Causa">
    <div class="col-12 grid">
      <div class="col-4">
        <p><strong>RUC: </strong></p>
        <p><strong>Nombre Causa: </strong></p>
      </div>
      <div class="col-4">
        <p><strong>Estado de la Causa: </strong></p>
        <p><strong>Fiscal Asignado: </strong></p>
      </div>
      <div class="col-4">
        <p><strong>Fecha de creación causa: </strong></p>
        <p><strong>Nombre Fiscalía: </strong></p>
      </div>
      <p class="col-12"><strong>Delitos(s): </strong></p>
    </div>
  </AppFieldset>

  <AppFieldset legend="Agendamiento para devolución">
    <AppSelectButton
      id="agendamiento"
      v-model="agendaRetiro"
      class="col-3 p-fluid"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
    />
    <AppCalendar
      id="devolucion"
      v-model="fechaDevolucion"
      class="col-4 p-fluid"
      label="Fecha/Hora de Devolución"
      :min-date="new Date()"
      show-time
    />
    
    <div class="grid col-12">
      <div class="col-6">
        <p><strong>Agendamiento N°</strong>{{ agendamiento }}</p>
      </div>
      <div class="col-6">
        <Button
          class="p-button-outlined px-4 mt-6"
          icon="pi pi-send"
          icon-pos="right"
          label="Solicitar Re Destinación"
          @click="solicitarRedestinacion"
        />
      </div>
    </div>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Registrar Salida"
      @click="handleNextStep"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { ref } from 'vue';
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'
import TablaEspeciesDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaEspeciesDinero.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import ModalRedestinacion from './ModalRedestinacion.vue';
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import { useAppDialog } from '@/modules/common/composables';

const {itemsMenuSuperior} = useItemsMenuSuperiorCadena()
const { launchDialog } = useAppDialog()

const agendamiento = ref(null)
const agendaRetiro = ref()
const fechaDevolucion = ref()
const mockDataSolicitud = ref([])
const dataSalida = {
  col1: [
    { label: 'Fecha de Solicitud', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Tipo de Salida', value: mockDataSolicitud.value?.tipoSalida },
    { label: 'Destinatario: ', value: mockDataSolicitud.value?.destinatario },
    { label: 'RUN Destinatario: ', value: mockDataSolicitud.value?.runDestinatario }
  ],
  col2: [
    { label: 'Dirección: ', value: mockDataSolicitud.value?.direccion },
    { label: 'Correo: ', value: mockDataSolicitud.value?.correo },
    { label: 'Teléfono: ', value: mockDataSolicitud.value?.telefono },
    { label: 'Motivo de Salida: ', value: mockDataSolicitud.value?.motivoSalida }
  ]
}

function solicitarRedestinacion(){
  launchDialog({
    component: ModalRedestinacion,
    header: 'Solicitar Re Destinación',
    props: {
      data: {
        message: '¿Esta seguro de Solicitar Re Destinación?'
      }
    }
  })
}
</script>
<style scoped>
p{
  margin: 20px 0 20px 0;
}
</style>