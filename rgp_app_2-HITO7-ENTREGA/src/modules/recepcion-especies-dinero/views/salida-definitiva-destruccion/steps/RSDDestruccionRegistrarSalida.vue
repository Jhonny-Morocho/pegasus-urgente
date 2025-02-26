<template>
<PageHeader
  v-if="modeloVista2"
  class="mb-6"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Registrar Salida Definitiva Especie por Destrucción"
/>
<section class="mb-8">
  <AppFieldset legend="Acta de salida definitiva por destrucción">
    <h4 v-if="modeloVista2">Código para identificación única del comprobante: {{ actaDeSalida?.codigo }}</h4>
    <ShowTwoColumnData
      :data-col1="IActaDeSalida.dataCol1"
      :data-col2="IActaDeSalida.dataCol2"
    />
  </AppFieldset>
  <AppFieldset legend="Especies Involucradas">
    <TablaGenerarCuponDeDeposito 
      class="w-full mb-4"
      :selectable="false"
      :es-destruccion="true"
      :es-registro-salida="true"
    />
    <Button
      v-if="!modeloVista2"
      class="p-button-outlined px-8"
      icon="pi pi-file"
      icon-pos="right"
      label="Vista Previa"
      @click="openVistaPrevia"
    />
  </AppFieldset>

  <FormSubirImagen 
    v-if="modeloVista2"
  />

  <AppBtnsSteps 
    v-if="modeloVista2"
    @back-step="handleBackStep" 
  />

  <AppBtnRightTeleported>
    <Button
      v-if="!modeloVista2"
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Orden de Servicio"
      @click="handleNextStep"
    />
    <Button
      v-if="modeloVista2"
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
/* eslint-disable */ 
import { onMounted, ref } from 'vue';
// components
import TablaGenerarCuponDeDeposito from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/TablaGenerarCuponDeDeposito.vue';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue';
import FormSubirImagen from '@/modules/recepcion-especies-dinero/components/salida-destruccion/FormSubirImagen.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import ModalActaSalidaDestruccion from '@/modules/recepcion-especies-dinero/components/salida-destruccion/modals/ModalActaSalidaDestruccion.vue';
// composables
import { useAppDialog, useConfirmDialog } from '@/modules/common/composables';
import { useRoute, useRouter } from 'vue-router';
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables';

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const itemsMenuSuperior = useItemsMenuSuperiorCadena()
const route = useRoute()
const router = useRouter()
const modeloVista2 = ref(false)
const documentoSubido = ref()
const actaDeSalida = ref([])
const IActaDeSalida = ref({
  dataCol1: [
    { label: 'Fecha de traslado: ', value: actaDeSalida.value?.fechaDestruccion },
    { label: 'Fecha de destrucción: ', value: actaDeSalida.value?.fechaDestruccion },
    { label: 'Empresa de destrucción: ', value: actaDeSalida.value?.empresa },
    { label: 'Fiscalía Regional: ', value: actaDeSalida.value?.fiscalia },
  ],
  dataCol2: [
    { label: 'Custodio de Ejecutor: ', value: actaDeSalida.value?.custodio },
    { label: 'RUN Custodio Ejecutor: ', value: actaDeSalida.value?.runCustodio },
    { label: 'Ministro de fe: ', value: actaDeSalida.value?.ministroFe },
    { label: 'RUN Ministro de fe: ', value: actaDeSalida.value?.runMinistroFe },
  ],
})

onMounted(() => {
  init()
})

function init(){
  if(route.path.includes('registro-salida-definitiva-especie-por-destruccion')){
    modeloVista2.value = true
  }
  console.log(modeloVista2.value)
}

function openVistaPrevia() {
  console.log('open')
  launchDialog({
    component: ModalActaSalidaDestruccion,
    header: 'Acta de salida definitiva por destrucción',
    cancelLabel: 'Cerrar',
    width: '60%',
    props: { data: IActaDeSalida.value }
  })
}

function handleNextStep () {
  if(modeloVista2.value){
    launchConfirmDialog({
      header: '¿Está seguro de Registrar Salida Definitiva?',
      accept: () => {
        // request util...
      }
    })
  }else {
    router.push({ name: 'RSDDestruccionOrdenDeServicio' })
  }
}

function handleBackStep(){
  // devolver a bandeja
}
</script>