<template>
<PageHeader
  class="mb-5"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Registrar Certificado de depósito a plazo"
/>
<AppFieldset legend="Datos del depósito a plazo">
  <p class="col-12 md:col-6">
    <span class="font-bold">RUC: </span>{{}}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscalía Regional: </span>{{}}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">RUE: </span>{{}}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Código Fiscalía Regional: </span>{{}}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Nombre del cliente: </span>{{}}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fiscalía local: </span>{{}}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">RUT Ministerio: </span>{{}}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Código Fiscalía local: </span>{{}}
  </p>
  <h3 class="col-12 mt-6">
    Ingresar datos del depósito a plazo:
  </h3>
  <FormDatosDepositoPlazo
    ref="formDatosDepositoPlazoRef"
    class="col-12"
    @open-modal="openModalRegistroDeposito"
  />
  <div class="col-12">
    <h3 class="mb-3">
      Cargar Certificado
    </h3>
    <FileUpload
      id="seleccionar-archivo"
      accept="image/*,video/*,audio/*,application/*"
      choose-label="Seleccionar Archivo"
      class="btn-form"
      :disabled="isEditando"
      :max-file-size="16000000"
      mode="basic"
      name="demo[]"
      @select="onSelect"
    />
  </div>
</AppFieldset>
<AppFooterBtns
  label="Registrar Certificado"
  @back-step="handleBackStep"
  @next-step="getFormdata()"
/>
</template>

<script setup>
import { ref } from 'vue'
import { useConfirmDialog } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import { useItemsMenuSuperiorCadena } from '../../composables'
import FormDatosDepositoPlazo from '@/modules/recepcion-especies-dinero/components/registrar-certificado-deposito-plazo/FormDatosDepositoPlazo.vue'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const { launchConfirmDialog } = useConfirmDialog()
const router = useRouter()
function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

const formDatosDepositoPlazoRef = ref()

function getFormdata () {
  formDatosDepositoPlazoRef.value.openModalRegistroDeposito()
}

function openModalRegistroDeposito () {
  launchConfirmDialog({
    header: 'Registrar Certificado',
    message: '¿Está seguro de Registrar el Certificado del depósito a plazo?',
    acceptLabel: 'Salir',
    accept: () => {
      router.push({ name: 'BandejaCustodio' })
    }
  })
}
</script>
