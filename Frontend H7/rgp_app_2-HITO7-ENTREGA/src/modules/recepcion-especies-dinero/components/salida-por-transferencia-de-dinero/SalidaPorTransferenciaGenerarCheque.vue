<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Salida por Transferencia: Generar Cheque"
  />
  <AppFieldset
    class="col-12 pr-2"
    legend="Generar Cheque"
  >
    <h3 class="my-3 col-12">
      Ingresar el número de serie y Fecha de Emisión:
    </h3>
    <AppForm
      class="grid col-12 lg:col-8 pr-0"
      :form-submitted="formSubmitted"
      validation-scope="form-generar-cheque"
    >
      <AppInput
        id="numeroDeSerie"
        v-model="formData.numeroDeSerie"
        class="col-12 md:col-6"
        label="Número de Serie"
        :rules="{ required }"
      />
      <AppCalendar
        id="fechaDeEmision"
        v-model="formData.fechaDeEmision"
        class="col-12 md:col-6"
        date-format="dd-mm-yy"
        label="Fecha de Emisión"
        month-navigator
        :rules="{ required }"
        year-navigator
        year-range="1921:2030"
      />
    </AppForm>
    <div class="col-12 md:col-6 lg:col-4 mx-auto">
      <Button
        class="btn-form w-full"
        icon="pi pi-sync"
        icon-pos="right"
        label="Emitir Cheque"
        @click="emitirCheque"
      />
    </div>
    <div
      v-if="seEmitioCheque"
      class="col-12 grid"
    >
      <h3
        class="my-3 col-12"
      >
        Cheque Emitido:
      </h3>
      <img
        alt="Cheque emitido"
        class="col-12"
        src=""
      >
      <div class="col-12 md:col-6 lg:col-4">
        <Button
          class="p-button-raised p-button-outlined w-full"
          icon="pi pi-print"
          icon-pos="right"
          label="Imprimir Cheque"
          @click="abrirModalImprimirCheque"
        />
      </div>
    </div>
  </AppFieldset>
  <AppFooterBtns
    label="Generar Cheque"
    @back-step="handleBackStep"
    @next-step="generarCheque()"
  />
</section>
</template>

<script setup>
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import ModalImprimirCheque from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/modals/ModalImprimirCheque.vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { ref } from 'vue'
// composables
import { useItemsMenuSuperiorCadena, useSalidaDinero } from '../../composables'
import { useRouter } from 'vue-router'

import { useAppDialog, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(exportar, actualizar)
const { launchConfirmDialog } = useConfirmDialog()
const router = useRouter()
const { launchDialog } = useAppDialog()
const { salidaDinero_generarCheque } = useSalidaDinero()

const formData = ref({
  numeroDeSerie: '',
  fechaDeEmision: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-generar-cheque'
})

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

function handleBackStep () {
  launchConfirmDialog({
    header: 'Emitir cheque',
    message: 'Se encuentra por salir de una emisión de Cheque inconclusa',
    acceptLabel: 'Salir',
    accept: () => {
      router.push({ name: 'BandejaCustodio' })
    }
  })
}

const seEmitioCheque = ref(false)

const { toastError } = useAppToast()

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

const datosCheque = {
  montoTotal: '125.000',
  montoTotalEnPalabras: 'Ciento veinte y cinco mil pesos',
  nombreDestinatario: 'Juan Pérez',
  cuentaFiscaliaOrigen: 900005153
}

function abrirModalImprimirCheque () {
  launchDialog({
    component: ModalImprimirCheque,
    header: 'Imprimir Cheque',
    props: {
      numeroDeSerie: formData.value.numeroDeSerie,
      fechaDeEmision: formatDate(formData.value.fechaDeEmision),
      datosCheque: datosCheque
    }
  })
}

function emitirCheque () {
  if (!isFormValid()) {
    toastError('Los campos no son correctos')
    return
  }
  console.log('Generando Cheque')
  seEmitioCheque.value = true
}

function generarCheque () {
  console.log('generar Cheque action')
  requestUtil({
    action: salidaDinero_generarCheque,
    payload: {
      tareaId: 1,
      nue: 123244534,
      numeroserie: formData.value.numeroDeSerie,
      fechaDeEmision: formatDate(formData.value.fechaDeEmision),
      monto: 2,
      receptor: 'string'
    }
  })
  launchConfirmDialog({
    message: `¿Está seguro de Registrar Emisión de Cheque?`,
    accept: () => {
      router.push({ name: 'BandejaCustodio' })
    }
  })
}
</script>
