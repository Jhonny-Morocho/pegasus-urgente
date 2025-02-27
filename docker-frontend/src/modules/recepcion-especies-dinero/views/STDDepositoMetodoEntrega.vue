<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-title="Salida Transferencia Dineros en Depósito: Método de Entrega"
/>
<AppFieldset
  class="mt-6"
  legend="Acta de Salida por Transferencia"
>
  <ActaDeSalidaPorTransferencia
    :data-acta-de-salida-por-transferencia="dataActaDeSalida"
  />
</AppFieldset>
<AppFieldset
  legend="Decidir Método de Entrega"
>
  <AppForm
    :form-submitted="formSubmitted"
    validation-scope="metodo-entrega"
  >
    <AppDropdown
      id="metodoEntrega"
      v-model="formData.metodoEntrega"
      class="col-12 md:col-6 lg:col-4"
      label="Método de entrega"
      option-label="descripcion"
      option-value="id"
      :options="listaMetodosEntrega"
      :rules="{ required }"
      show-clear
    />
    <AppTextarea
      id="justififcacion"
      v-model="formData.justificacion"
      class="col-12"
      cols="135"
      label="Justififcación"
      rows="5"
    />
  </AppForm>
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-arrow-right"
    icon-pos="right"
    label="Registrar Método de Entrega"
    @click="handleNextStep"
  />
</AppFieldset>
<div class="wrapper-routes">
  <RouterView @next-step="handleNextStep" />
</div>
<AppBtnsSteps
  :button-back-disabled="$route.path === `/custodia`"
  @back-step="handleBackStep"
/>
</template>

<script setup>
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useItemsMenuSuperiorCadena, useSalidaDinero } from '@/modules/recepcion-especies-dinero/composables'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ActaDeSalidaPorTransferencia from '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/ActaDeSalidaPorTransferencia.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

const router = useRouter()

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

const formData = ref({
  metodoEntrega: '',
  justificacion: ''
})

const {
  formSubmitted,
  required,
  isFormValid
} = useFormValidation({
  formData,
  validationScope: 'metodo-entrega'
})

function handleBackStep () {
  router.push('/custodia/custodio')
}

const { toastError } = useAppToast()

const {
  salidaDinero_registrarMetodoEntrega
} = useSalidaDinero()

function handleNextStep () {
  if (!isFormValid()) {
    toastError('Los campos no son correctos')
    return
  }
  requestUtil({
    action: salidaDinero_registrarMetodoEntrega,
    payload: {
      tareaId: 1,
      idSalidaTransferencia: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      metodoEntrega: formData.value.metodoEntrega,
      justificacion: formData.value.justificacion
    },
    resolve: (r) => {
      console.log('registrarMetodoEntrega', r)
      router.push('/custodia/custodio')
    }
  })
}

// MOCK
const dataActaDeSalida = {
  nue: 1939406,
  ruc: 2200938215 - 8,
  nombreCausa: 'Hurto simple 4 A 40 UTM a Gustavo',
  fechaHoraDeSalida: '15-07-22 11:00',
  fiscaliaDeOrigen: 'Casablanca',
  tipoDeMoneda: 'Peso Chileno',
  fiscalDeOrigen: 'Samuel Nuñez P.',
  monto: 'CLP $2.500.000',
  fiscaliaDeDestino: 'Valparaíso',
  interes: 'CLP $25.000',
  fiscalDeDestino: 'Cristián Andrade',
  responsableDeUAFDeOrigen: 'María González',
  custodioDeDestino: 'Camilo Zapata',
  runResponsableUAF: '18.652.258-1',
  runCustodioDeDestino: '12.345.567-9'
}

const listaMetodosEntrega = [
  {
    id: 'asdf-qwer-cxvb-tryu',
    descripcion: 'Transferencia electrónica'
  },
  {
    id: 'yuio-xcvb-fghj-asdf',
    descripcion: 'Emisión de cheque'
  }
]
</script>
