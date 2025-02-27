<template>
<AppForm
  :form-submitted="formSubmitted"
  validation-scope="preparar-escrito-form"
>
  <AppFieldset
    class="col-12"
    legend="Factibilidad de la entrega"
    toggleable
  >
    <AppDropdown
      id="factibilidad"
      v-model="formData.factibilidad"
      class="col-12 md:col-6 lg:col-4"
      label="Seleccionar si es factible la entrega"
      option-label="descripcion"
      option-value="id"
      :options="[
        { descripcion: 'Factible', id: 'factible' },
        { descripcion: 'Entrega fuera de plazo legal', id: 'entrega-fuera-de-plazo-legal' },
        { descripcion: 'Cheque Caducado', id: 'cheque-caducado' }
      ]"
      :rules="{ required }"
      show-clear
    />
  </AppFieldset>
  <AppFieldset
    class="w-full"
    :collapsed="showAgendamiento"
    legend="Agendamiento para devolución"
  >
    <div class="col-12 md:col-6 lg:col-4">
      <p class="ml-2 font-bold">
        ¿Agenda Retiro?
      </p>
      <AppSelectButton
        id="agendaRetiro"
        v-model="formData.agendaRetiro"
        class="col-12 p-fluid"
        option-label="descripcion"
        option-value="id"
        :options="[
          { descripcion: 'Si', id: 'Si' },
          { descripcion: 'No', id: 'No' }
        ]"
        :rules="{ required }"
      />
    </div>
    <AppDropdown
      id="modoEntrega"
      v-model="formData.modoEntrega"
      class="col-12 md:col-6 lg:col-4 my-auto"
      label="Modo de entrega"
      option-label="descripcion"
      option-value="id"
      :options="[
        { descripcion: 'Efectivo', id: 'efectivo' },
        { descripcion: 'Depósito bancario', id: 'deposito-bancario' }
      ]"
      :rules="{ required }"
      show-clear
    />
    <AppCalendar
      v-if="formData.modoEntrega === 'efectivo'"
      id="fechaHoraDevolucion"
      v-model="formData.fechaHoraDevolucion"
      class="col-12 md:col-6 lg:col-4 my-auto"
      date-format="dd-mm-yy"
      label="Fecha/Hora de Devolucion"
      month-navigator
      year-navigator
      year-range="1921:2030"
    />
    <p class="col-12 lg:col-8 pl-3">
      <span class="font-bold">Agendamiento N°: </span>0
    </p>
    <div class="col-12 md:col-6 lg:col-4">
      <Button
        class="btn-form w-full"
        icon="pi pi-send"
        icon-pos="right"
        label="Solicitar Re Destinación"
        @click="emitirCheque"
      />
    </div>
  </AppFieldset>
  <AppFieldset
    v-if="!showDeposito"
    class="w-full"
    :collapsed="showDeposito"
    legend="Depósito bancario"
  >
    <p class="col-12">
      <span class="font-bold">Entidad Bancaria: </span>Banco Estado
    </p>
    <AppDropdown
      id="tipoCuentaBancaria"
      v-model="formData.tipoCuentaBancaria"
      class="col-12 md:col-6 lg:col-4"
      label="Tipo de cuenta Bancaria"
      option-label="descripcion"
      option-value="id"
      :options="[
        { descripcion: 'TipoA', id: 'a' },
        { descripcion: 'TipoB', id: 'b' }
      ]"
      :rules="{ required }"
      show-clear
    />
    <AppInput
      id="numeroCuentaBancaria"
      v-model="formData.numeroCuentaBancaria"
      class="col-12 md:col-6 lg:col-4"
      label="Número de cuenta Bancaria"
      :rules="{ required }"
    />
    <AppInput
      id="nombreDuenoCuenta"
      v-model="formData.nombreDuenoCuenta"
      class="col-12 md:col-6 lg:col-4"
      label="Nombre de dueño de cuenta"
      :rules="{ required }"
    />
    <AppInput
      id="runDuenoCuenta"
      v-model="formData.runDuenoCuenta"
      class="col-12 md:col-6 lg:col-4"
      label="RUN Dueño de cuenta"
      :rules="{ required }"
    />
    <AppInput
      id="correo"
      v-model="formData.correo"
      class="col-12 md:col-6 lg:col-4"
      label="Correo"
      :rules="{ required }"
    />
  </AppFieldset>
</AppForm>
<AppBtnNextTeleported
  class="mr-2"
  icon="pi pi-angle-double-right"
  icon-pos="right"
  label="Validar Entrega"
  @click="validarEntrega"
/>
</template>
<script setup>
import { defineProps, ref, defineEmits, watch } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const formData = ref({})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'preparar-escrito-form'
})

defineProps({
  data: propTypes.object
})

const showAgendamiento = ref(true)

watch(
  () => formData.value.factibilidad,
  () => {
    if (formData.value.factibilidad === 'factible') {
      showAgendamiento.value = false
    } else {
      showAgendamiento.value = true
    }
  }
)

const showDeposito = ref(true)

watch(
  () => formData.value.modoEntrega,
  () => {
    if (formData.value.modoEntrega === 'deposito-bancario') {
      showDeposito.value = false
    } else {
      showDeposito.value = true
    }
  }
)

const emit = defineEmits(['validar-entrega'])

const { toastError, TOAST_MESSAGES } = useAppToast()

function validarEntrega () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  emit('validar-entrega', formData.value)
}
</script>
