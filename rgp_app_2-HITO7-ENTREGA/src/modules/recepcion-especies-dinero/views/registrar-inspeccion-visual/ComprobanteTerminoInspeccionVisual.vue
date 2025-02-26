<template>
<AppFieldset legend="Comprobante de Inspección Visual">
  <Causa :data-causa="dataComprobanteTermino" />
  <p class="title col-12">
    Registros de Inspección:
  </p>
  <RegistrosInspeccion :registros-inspeccion="dataRegistrosInspeccion" />
  <p class="title col-12">
    Especies:
  </p>
  <EspeciesDinero :especies-dineros="dataEspeciesDinero" />
  <p class="title col-12">
    Asistentes:
  </p>
  <PersonasAsistenInspeccionVisual :personas-asisten="dataPersonasAsisten" />
</AppFieldset>
<div class="grid mb-4 px-3">
  <Button
    class="px-4 col-12 my-2 md:col-5 lg:col-3 p-button-outlined"
    :icon="'pi pi-sign-out'"
    icon-pos="right"
    :label="'Vista Previa'"
    @click="abrirModalComprobante"
  />
  <Button
    class="px-4 col-12 my-2 md:col-5 md:col-offset-2 lg:col-3 lg:col-offset-6 p-button-outlined"
    :icon="'pi pi-sign-out'"
    icon-pos="right"
    :label="'Firmar Comprobante'"
    @click="abrirModalFirmar"
  />
  <FileUpload
    accept="image/*"
    choose-label="Subir Comprobante Firmado"
    class="w-full my-4"
    :max-file-size="16000000"
    mode="basic"
    name="demo[]"
    url="./upload.php"
  />
</div>
<AppBtnNextTeleported
  class="mr-2"
  icon="pi pi-arrow-right"
  icon-pos="right"
  label="Registrar Inspección"
  @click="nextStep"
/>
</template>
<script setup>
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import RegistrosInspeccion from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/RegistrosInspeccion.vue'
import EspeciesDinero from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/EspeciesDinero.vue'
import PersonasAsistenInspeccionVisual from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/PersonasAsistenInspeccionVisual.vue'
import VistaPreviaComprobanteTerminoInspeccionVisual from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/modals/VistaPreviaComprobanteTerminoInspeccionVisual.vue'
import FirmarComprobante from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/modals/FirmarComprobante.vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useRouter } from 'vue-router'
// import html2pdf from 'html2pdf.js'
import { useAppDialog } from '@/modules/common/composables'
import { useStepComprobanteDeInspeccionVisual } from '@/modules/recepcion-especies-dinero/composables'

const router = useRouter()

function nextStep () {
  router.push('/custodia/custodio')
}

const {
  dataComprobanteTermino,
  dataRegistrosInspeccion,
  dataEspeciesDinero,
  dataPersonasAsisten
} = useStepComprobanteDeInspeccionVisual()

const { launchDialog } = useAppDialog()

function abrirModalComprobante () {
  const title = 'Comprobante de Inspección Visual N°CRSTR0066554'
  launchDialog({
    component: VistaPreviaComprobanteTerminoInspeccionVisual,
    width: '60%',
    header: title,
    showHeader: false,
    cancelLabel: 'Cerrar',
    props: {
      title,
      dataComprobanteTermino: dataComprobanteTermino.value,
      dataRegistrosInspeccion: dataRegistrosInspeccion.value,
      dataEspeciesDinero: dataEspeciesDinero.value,
      dataPersonasAsisten: dataPersonasAsisten.value
    }
  })
}

function abrirModalFirmar () {
  launchDialog({
    component: FirmarComprobante,
    width: '60%',
    header: 'Firmar Comprobante',
    confirmLabel: 'Firmar',
    cancelLabel: 'hideCancelLabel',
    confirmIcon: '',
    props: {
      data: {
        rutEntrega: '12.234.566-8',
        nombreEntrega: 'María González',
        rutRecibe: '12.345.678-9',
        nombreRecibe: 'Juan Pérez Pérez'
      }
    }
  })
}
</script>
<style lang="scss" scoped>
.title {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1.5em;
}
.btn {
  background-color: $primary-color;
}
.boton {
  background-color: #606e84 !important;
}
</style>
