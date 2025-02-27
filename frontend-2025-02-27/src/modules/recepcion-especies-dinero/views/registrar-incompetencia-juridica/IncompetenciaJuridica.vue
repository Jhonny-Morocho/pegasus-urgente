<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-title="Salida Definitiva Especies: Incompetencia Jurídica"
/>
<section class="mt-6 mb-8">
  <div>
    <AppFieldset
      v-if="esModelo2"
      legend="Oficio de Traslado"
    >
      <MailHeader
        class="col-12 w-full"
        :data="mockDataSolicitud?.destinatario"
      />
    </AppFieldset>
    <AppFieldset
      v-else
      legend="Dato de Salida"
    >
      <ShowTwoColumnData 
        :data-col1="datosSalida.dataSalida1"
        :data-col2="datosSalida.dataSalida2"
      />
    </AppFieldset>
  </div>

  <AppFieldset :legend="labelTableEspecies">
    <TablaEspeciesDinero
      esModelo2
      readOnly
      :value="especies"
    />
  </AppFieldset>

  <AppFieldset 
    v-if="!esModelo2"
    legend="Oficio de Traslado"
  >
    <Editor
      id="editor-datos-remitente"
      v-model="textoOficioTraslado"
      class="col-12 w-full"
      editor-style="height: 256px"
    />
    <AppTextarea
      id="observaciones"
      v-model="observaciones"
      class="col-12"
      cols="150"
      label="observaciones"
      rows="5"
    />
    <AppFieldset legend="Especies Involucradas">
      <TablaEspeciesDinero
        esModelo2
        readOnly
        :value="especies"
      />
    </AppFieldset>
  </AppFieldset>

  <div>
    <div v-if="esModelo2">
      <SubirArchivo
        ref="subiroficio"
        class="col-4"
        :select-label="'Subir Orden de Entrega Firmado'"
        :is-loading="isLoading"
        :relacion-front="seccion?.id"
        :tipos-archivo="'image/*, Aplication/*'"
        @subir-archivo:adjuntar="adjuntarOrdenOficio"
      />
    </div>
    <div v-else>
      <Button
        class="p-button-outlined px-6"
        icon="pi pi-file"
        icon-pos="right"
        label="Vista Previa"
        @click="openVistaPrevia"
      />
    </div>
  </div>

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
import { onMounted, ref } from 'vue';
// components
import TablaEspeciesDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaEspeciesDinero.vue';
import ShowTwoColumnData from '../../components/global/ShowTwoColumnData.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import MailHeader from '@/modules/recepcion-especies-dinero/components/salida-destruccion/MailHeader.vue'
import SubirArchivo from '@/modules/global/components/documentos/SubirArchivo.vue';
import ModalOficioEntregaTraslado from '../../components/salida-destruccion/modals/ModalOficioEntregaTraslado.vue';
// composables
import { useItemsMenuSuperiorCadena } from '../../composables';
import { useAppDialog } from '@/modules/common/composables';
import { useRoute, useRouter } from 'vue-router';
// mockData borrar en integracion
import { especies } from '@/modules/recepcion-especies-dinero/data/mockEspecie.json'

const route = useRoute()
const router = useRouter()
const {itemsMenuSuperior} = useItemsMenuSuperiorCadena()
const { launchDialog } = useAppDialog()

const esModelo2 = ref(false)
const labelTableEspecies = ref('Especies')
const mockDataSolicitud = ref([])
const datosSalida = {
  dataSalida1: [
    { label: 'RUC: ', value: mockDataSolicitud.value?.ruc },
    { label: 'Fecha Solicitud: ', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Fecha Creación Causa: ', value: mockDataSolicitud.value?.fechaCreacion },
    { label: 'Nombre Causa: ', value: mockDataSolicitud.value?.nombreCausa }
  ],
  dataSalida2: [
    { label: 'Fiscalía Local: ', value: mockDataSolicitud.value?.fiscalia },
    { label: 'Fiscal Asignado: ', value: mockDataSolicitud.value?.fiscal },
    { label: 'Estado de la Causa: ', value: mockDataSolicitud.value?.estado },
    { label: 'Institución de envío: ', value: mockDataSolicitud.value?.institucion }
  ]
}

const textoOficioTraslado =`
  <p><strong>MAT: </strong>Entrega de NUES</p>
  <br/>
  <p><strong>De: </strong>María González</p>
  <p>Fiscal Jefe</p>
  <p>Fiscalía Local</p>
  <p>Fiscalía Regional Valparaíso</p>
  <br/>
  <p><strong>A: </strong>Fiscalia Militar</p>
  <p>Tercera Fiscalia Militar de Santiago</p>
  <br/>
  <p><strong>RUC: </strong>22.123.234-2</p>
  <br/>
  <p><strong>Oficio N°: </strong>N° 123</p>
  <br/>
  <p><strong>Fecha: </strong>23-09-2022</p>
`

console.log(especies)

onMounted(() => {
  checkRoute()
})

function checkRoute(){
  if(route.path.includes('registro')){
    esModelo2.value = true
    labelTableEspecies.value = 'Especies Involucradas'
  }
}

function adjuntarOrdenOficio(){
  // ...
}

function openVistaPrevia(){
  launchDialog({
    component: ModalOficioEntregaTraslado,
    header: 'Oficio de Entrega de Traslado',
    width: '80%'
  })
}

function handleBackStep(){
  router.push({ name: 'BandejaCustodio' })
}

function handleNextStep(){
  // ...
}
</script>