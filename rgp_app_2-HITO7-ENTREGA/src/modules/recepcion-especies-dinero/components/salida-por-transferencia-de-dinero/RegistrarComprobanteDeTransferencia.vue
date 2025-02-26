<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registrar Certificado de Transferencia"
  />
  <AppFieldset legend="Registrar comprobante de transferencia">
    <div class="col-12 grid my-3">
      <p class="col-12 md:col-6">
        <span class="font-bold">RUC: </span>{{ dataComprobanteDeTransfencia.ruc }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Fiscalía Regional Destino: </span>{{ dataComprobanteDeTransfencia.fiscaliaRegional }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">RUE: </span>{{ dataComprobanteDeTransfencia.rue }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Fiscalía Local Destino: </span>{{ dataComprobanteDeTransfencia.fiscaliaLocal }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Fiscalía Regional Origen: </span>{{ dataComprobanteDeTransfencia.cuentaOrigen }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Cuenta Destino: </span>{{ dataComprobanteDeTransfencia.cuentaOrigen }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Fiscalía Local Origen: </span>{{ dataComprobanteDeTransfencia.cuentaOrigen }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Monto: </span>{{ dataComprobanteDeTransfencia.cuentaOrigen }}
      </p>
      <p class="col-12 md:col-6">
        <span class="font-bold">Cuenta Origen: </span>{{ dataComprobanteDeTransfencia.cuentaOrigen }}
      </p>
    </div>

    <div class="col-12 p-fluid pl-0">
      <h3 class="my-3 ml-2">
        Ingresar datos del certificado de liquidación:
      </h3>
      <AppForm
        class="grid"
        :form-submitted="formSubmitted"
        validation-scope="form-registrar-comprobante-transferencia"
      >
        <AppCalendar
          id="fechaDeTransaccion"
          v-model="formData.fechaDeTransaccion"
          class="col-12 md:col-6 lg:col-4"
          date-format="dd-mm-yy"
          label="Fecha de transacción"
          month-navigator
          :rules="{ required }"
          year-navigator
          year-range="1921:2030"
        />
        <AppInput
          id="identificacionDeTransaccion"
          v-model="formData.identificacionDeTransaccion"
          class="col-12 md:col-6 lg:col-4 lg:mr-1"
          label="Identificación de transacción"
          :rules="{ required }"
        />
        <AppDropdown
          id="apoderadoUno"
          v-model="formData.apoderadoUno"
          class="col-12 md:col-6 lg:col-4"
          label="Apoderado 1"
          option-label="name"
          option-value="name"
          :options="[{ name: '1' }, { name: '2' }]"
          :rules="{ required }"
          show-clear
        />
        <AppCalendar
          id="fechaVencimiento"
          v-model="formData.fechaAutorizacionApoderadoUno"
          class="col-12 md:col-6 lg:col-4 lg:mr-1"
          date-format="dd-mm-yy"
          label="Fecha de autorizaciónn Apoderado 1"
          month-navigator
          :rules="{ required }"
          year-navigator
          year-range="1921:2030"
        />
        <AppDropdown
          id="apoderadoDos"
          v-model="formData.apoderadoDos"
          class="col-12 md:col-6 lg:col-4 mb-0"
          label="Apoderado 2"
          option-label="name"
          option-value="name"
          :options="[{ name: '1' }, { name: '2' }]"
          :rules="{ required }"
          show-clear
        />
        <AppCalendar
          id="fechaVencimiento"
          v-model="formData.fechaAutorizacionApoderadoDos"
          class="col-12 md:col-6 lg:col-4"
          date-format="dd-mm-yy"
          label="Fecha de autorizaciónn Apoderado 2"
          month-navigator
          :rules="{ required }"
          year-navigator
          year-range="1921:2030"
        />
      </AppForm>
      <div class="col-12 p-fluid">
        <h3 class="my-3">
          Cargar Comprobante de Transferencia:
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
    </div>
  </AppFieldset>
  <AppFooterBtns
    label="Registrar Certificado"
    @back-step="handleBackStep"
    @next-step="RegistrarComprobante()"
  />
</section>
</template>

<script setup>
import { reactive } from 'vue'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import { useItemsMenuSuperiorCadena, useRegistroSalida } from '@/modules/recepcion-especies-dinero/composables'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(exportar, actualizar)

const router = useRouter()

const formData = reactive({
  fechaDeTransaccion: '',
  identificacionDeTransaccion: '',
  apoderadoUno: '',
  fechaAutorizacionApoderadoUno: '',
  apoderadoDos: '',
  fechaAutorizacionApoderadoDos: ''
})

const {
  formSubmitted,
  required,
  isFormValid
} = useFormValidation({
  formData,
  validationScope: 'form-registrar-comprobante-transferencia'
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

const {
  registroSalida_registrarComprobanteTransferencia
} = useRegistroSalida()

const { toastError } = useAppToast()

const { launchConfirmDialog } = useConfirmDialog()

function RegistrarComprobante () {
  if (!isFormValid()) {
    toastError('Los campos no son correctos')
    return
  }
  console.log(formData)
  launchConfirmDialog({
    header: 'Registrar Comprobante',
    message: '¿Está seguro de Registrar comprobante de transferencia?',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Aceptar',
    accept: () => {
      const payload = {
        tareaId: 1,
        idSalidaTransferencia: '897423E6-9EAE-4E38-A4D7-4A03C0C370B3', // queda mock en espera de resolver de donde se saca este campo
        idTransaccion: formData.identificacionDeTransaccion,
        fechaTransaccion: formData.fechaDeTransaccion,
        apoderado1: formData.apoderadoUno,
        apoderado2: formData.apoderadoDos,
        fechaAutorizacionApoderado1: formData.fechaAutorizacionApoderadoUno,
        fechaAutorizacionApoderado2: formData.fechaAutorizacionApoderadoDos,
        idComprobanteTransferenciaFilenet: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      }
      requestUtil({
        action: registroSalida_registrarComprobanteTransferencia,
        payload
      })
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
