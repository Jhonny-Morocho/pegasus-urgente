<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registrar Certificado de Liquidación"
  />
  <AppFieldset
    class="col-12 p-fluid"
    legend="Registrar los datos del certificado de liquidación"
  >
    <div class="col-12 grid my-3">
      <p class="col-12 md:col-6">
        <span class="font-bold">RUC: </span>{{ dataComprobanteDeTransfencia.ruc }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Fiscalía Regional: </span>{{ dataComprobanteDeTransfencia.fiscaliaRegional }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">RUE: </span>{{ dataComprobanteDeTransfencia.rue }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Fiscalía Local: </span>{{ dataComprobanteDeTransfencia.fiscaliaLocal }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Cuenta Origen: </span>{{ dataComprobanteDeTransfencia.cuentaOrigen }}
      </p>
    </div>
    <h3 class="ml-2 my-2">
      Ingresar datos del certificado de liquidación
    </h3>
    <div class="col-12 grid">
      <AppCalendar
        id="fechaDeEmision"
        v-model="formData.fechaDeEmision"
        class="col-4"
        date-format="dd-mm-yy"
        label="Fecha de Emisión"
        month-navigator
        year-navigator
        year-range="1921:2030"
      />
      <AppInputNumber
        id="montoDeDeposito"
        v-model="formData.montoDeDeposito"
        class="col-12 md:col-4"
        label="Monto de Depósito"
        :min="0"
        mode="decimal"
        show-buttons
        :use-grouping="false"
      />
      <AppInput
        id="plazoDeEmision"
        v-model="formData.plazoDeEmision"
        class="col-12 md:col-4"
        label="Plazo de emisión"
      />
      <AppInputNumber
        id="montoAPagar"
        v-model="formData.montoAPagar"
        class="col-12 md:col-4"
        label="Monto a Pagar"
        :min="0"
        mode="decimal"
        show-buttons
        :use-grouping="false"
      />
      <AppDropdown
        id="apoderadoUno"
        v-model="formData.apoderadoUno"
        class="col-12 md:col-3 lg:col-4 mb-0"
        label="Apoderado 1"
        option-label="name"
        option-value="name"
        :options="[{ name: '1' }, { name: '2' }]"
        show-clear
      />
      <AppCalendar
        id="fechaVencimiento"
        v-model="formData.fechaAutorizacionApoderadoUno"
        class="col-12 md:col-3 lg:col-4"
        date-format="dd-mm-yy"
        label="Fecha de autorizaciónn Apoderado 1"
        month-navigator
        year-navigator
        year-range="1921:2030"
      />
      <AppDropdown
        id="apoderadoDos"
        v-model="formData.apoderadoDos"
        class="col-12 md:col-3 lg:col-4 mb-0"
        label="Apoderado 2"
        option-label="name"
        option-value="name"
        :options="[{ name: '1' }, { name: '2' }]"
        show-clear
      />
      <AppCalendar
        id="fechaVencimiento"
        v-model="formData.fechaAutorizacionApoderadoDos"
        class="col-12 md:col-3 lg:col-4"
        date-format="dd-mm-yy"
        label="Fecha de autorizaciónn Apoderado 2"
        month-navigator
        year-navigator
        year-range="1921:2030"
      />
    </div>
    <div class="col-12 p-fluid">
      <h3 class="my-3">
        Cargar Certificado
      </h3>
      <FileUpload
        id="seleccionar-archivo"
        accept="image/*,video/*,audio/*,application/*"
        choose-label="Seleccionar Archivo"
        class="btn-form px-7"
        :disabled="isEditando"
        :max-file-size="16000000"
        mode="basic"
        name="demo[]"
        @select="onSelect"
      />
    </div>
  </AppFieldset>
  <div class="col-12 p-fluid pl-0">
    <h3 class="my-3 ml-2">
      Método de Entrega:
    </h3>

    <AppDropdown
      id="metodoDeEntrega"
      v-model="formData.metodoDeEntrega"
      class="col-12 md:col-3 lg:col-4 mb-0"
      label="Metodo de Entrega"
      option-label="name"
      option-value="name"
      :options="[
        { name: 'Transferenciaelectrponica' },
        { name: 'Emisión de cheque' }
      ]"
      show-clear
    />
    <AppTextarea
      id="justificacion"
      v-model="formData.justificacion"
      class="col-12"
      cols="150"
      label="Justificación"
      rows="5"
    />
  </div>
  <AppFooterBtns
    label="Registrar Certificado"
    @back-step="handleBackStep"
    @next-step="openRegistrarCertificado()"
  />
</section>
</template>

<script setup>
import { reactive } from 'vue'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'

// composables
import { useItemsMenuSuperiorCadena } from '../../composables'
import { useConfirmDialog } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'

const { launchConfirmDialog } = useConfirmDialog()
const router = useRouter()
const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(exportar, actualizar)

const formData = reactive({
  fechaDeEmision: '',
  montoDeDeposito: null,
  plazoDeEmision: '',
  montoAPagar: null,
  apoderadoUno: '',
  fechaAutorizacionApoderadoUno: '',
  apoderadoDos: '',
  fechaAutorizacionApoderadoDos: '',
  metodoDeEntrega: '',
  justificacion: ''
})
function actualizar () {
  console.log('actualizar')
}
function exportar () {
  console.log('exportar')
}

function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
}
function openRegistrarCertificado () {
  launchConfirmDialog({
    header: 'Registrar Depósito',
    message: '¿Está seguro de Registrar certificado de liquidación?',
    acceptLabel: 'Salir',
    accept: () => {
      requestUtil({
        action: '',
        payload: {
          formData,
          dataComprobanteDeTransfencia
        }
      })
      router.push({ name: 'BandejaCustodio' })
    }
  })
}
const dataComprobanteDeTransfencia = {
  ruc: '20000001992-6',
  fiscaliaRegional: 'Fiscalia Regional',
  rue: 7712345 - 1,
  fiscaliaLocal: 'Fiscalía Local',
  cuentaOrigen: 9336768888
}
</script>
