<template>
<PageHeader
  v-if="esModelo2"
  class="mb-6"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Salida Definitiva Especies: Entrega a Dueño"
/>
<section class="mb-8">
  <AppFieldset legend="Comprobante de Entrega">
    <p
      v-if="esModelo2"
      class="col-12 mb-4"
    >
      <strong>Número de Acta: </strong>
    </p>
    <ShowTwoColumnData 
      :dataCol1="dataComprobante.dataCol1"
      :dataCol2="dataComprobante.dataCol2"
    />
    <AppTextarea
      id="observaciones"
      v-model="observaciones"
      class="col-12"
      cols="150"
      label="Comentario"
      rows="5"
    />
  </AppFieldset>

  <AppFieldset legend="Especies Involucradas">
    <TablaEspeciesDinero
      esModelo2
      readOnly
      :value="especies"
    />
    <div 
      v-if="!esModelo2"
      class="w-full flex justify-content-between"
    >
      <Button
        class="p-button-outlined px-6"
        icon="pi pi-file"
        icon-pos="right"
        label="Vista Previa"
        @click="handleNextStep"
      />
      <Button
        class="p-button-outlined px-6"
        icon="pi pi-external"
        icon-pos="right"
        label="Firmar Comprobante"
        @click="handleFirmarComprobante"
      />
    </div>

    <SubirArchivo
      ref="subirImagen"
      v-if="esModelo2"
      class="col-4 mt-4"
      :select-label="'Subir Comprobante Firmado'"
      :is-loading="isLoading"
      :relacion-front="seccion?.id"
      :tipos-archivo="'image/*, Aplication/*'"
      @subir-archivo:adjuntar="adjuntarComprobanteFirmado"
    />
  </AppFieldset>

  <AppBtnRightTeleported>
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Registrar Salida"
      @click="handleRegistrarSalida"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'
import TablaEspeciesDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaEspeciesDinero.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import SubirArchivo from '@/modules/global/components/documentos/SubirArchivo.vue';
// mockData borrar en integracion
import { especies } from '@/modules/recepcion-especies-dinero/data/mockEspecie.json'
import { useRoute } from 'vue-router'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables';
import { useAppDialog } from '@/modules/common/composables';
import ModalFirmarComprobante from '@/modules/recepcion-especies-dinero/components/global/ModalFirmarComprobante.vue';

const {itemsMenuSuperior} = useItemsMenuSuperiorCadena()
const { launchDialog } = useAppDialog()
const route = useRoute()

const esModelo2 = ref(false)
const observaciones = ref('')
const mockDataSolicitud = ref([])
const dataComprobante = ref({
  dataCol1: [
    { label: 'Folio: ', value: mockDataSolicitud.value?.ruc },
    { label: 'Fecha/Hora de agendamiento: ', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Fiscalía: ', value: mockDataSolicitud.value?.fechaCreacion },
    { label: 'Custodio: ', value: mockDataSolicitud.value?.nombreCausa },
    { label: 'RUN Custodio: ', value: mockDataSolicitud.value?.nombreCausa }
  ],
  dataCol2: [
    { label: 'Destinatario: ', value: mockDataSolicitud.value?.fiscalia },
    { label: 'RUN Destinatario: ', value: mockDataSolicitud.value?.fiscal },
    { label: 'Teléfono: ', value: mockDataSolicitud.value?.estado }
  ]
})

onMounted(() => {
  checkRoute()
})

function checkRoute(){
  if(route.path.includes('entrega-dueno')){
    esModelo2.value = true
  }
}

function adjuntarComprobanteFirmado(){
  // ...
}

function handleFirmarComprobante(){
  launchDialog({
    component: ModalFirmarComprobante,
    header: 'Firmar Comprobante',
    width: '80%'
  })
}
</script>