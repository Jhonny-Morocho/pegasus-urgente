<template>
<AppForm
  id="registro-contacto-medios-transporte"
  :form-submitted="formSubmitted"
  validation-scope="formDelitoMedioTransporte"
>
  <AppFieldset legend="Medios de Transporte Utilizados por el Imputado">
    <AppFieldset
      class="col-12 md:col-6 lg:col-3 m-0 py-0"
      legend="Ruta del Medio de Transporte"
    >
      <div class="col-12">
        <AppSelectButton
          id="ruta"
          v-model="formData.ruta"
          option-label="name"
          option-value="name"
          :options="llegadaHuidaAmbosOptions"
          :rules="{
            required,
          }"
        />
      </div>
    </AppFieldset>

    <AppDropdown
      id="tipoMedioTransporteImputado"
      v-model="formData.tipoMedioTransporteImputado"
      class="col-12 md:col-6 lg:col-3 md:mt-6"
      label="Seleccione Tipo de Transporte"
      option-label="name"
      option-value="name"
      :options="tipoMedioTransporteImputadoOptions"
      :rules="{
        required,
      }"
      show-clear
    />

    <AppInput
      id="detalle"
      v-model="formData.detalle"
      class="col-12 md:col-6 lg:mt-6"
      label="Detalle Medio de Transporte"
      :rules="{
        required,
      }"
    />
    <AppFieldset
      v-if="formData.tipoMedioTransporteImputado == 'Vehículo'"
      class="col-12 py-0"
      legend="Datos Vehículo Asociado al Medio de Transporte Utilizado por los Imputados"
    >
      <AppDropdown
        id="tipoVehiculo"
        v-model="formData.tipoVehiculo"
        class="col-12 md:col-6 lg:col-3"
        label="Seleccione Tipo de Vehículo"
        option-label="name"
        option-value="name"
        :options="tipoVehiculoOptions"
        show-clear
      />
      <AppInput
        id="patente"
        v-model="formData.patente"
        class="col-12 md:col-6 lg:col-3"
        label="Patente"
      />
      <AppInput
        id="marca"
        v-model="formData.marca"
        class="col-12 md:col-6 lg:col-3"
        label="Marca"
      />
      <AppInput
        id="modelo"
        v-model="formData.modelo"
        class="col-12 md:col-6 lg:col-3"
        label="Modelo"
      />
      <AppInput
        id="color"
        v-model="formData.color"
        class="col-12 md:col-6 lg:col-3"
        label="Color"
      />
      <AppInput
        id="vin"
        v-model="formData.vin"
        class="col-12 md:col-6 lg:col-3"
        label="VIN"
      />
      <AppInput
        id="numeroMotor"
        v-model="formData.numeroMotor"
        class="col-12 md:col-6 lg:col-3 md:mr-1"
        label="Número de Motor"
        :rules="{ required }"
      />
      <div class="col-12 md:col-6 lg:col-3">
        <AppFieldset legend="¿Tiene seguro?">
          <SelectButton
            v-model="formData.tieneSeguro"
            class="col-12"
            option-label="name"
            option-value="name"
            :options="[
              { name: 'Si', value: 'Si' },
              { name: 'No', value: 'No' },
              { name: 'No se sabe', value: 'No se sabe' },
            ]"
            :rules="{
              required,
            }"
          />
        </AppFieldset>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <AppFieldset legend="¿Encargado por robo?">
          <SelectButton
            v-model="formData.estaEncargadoPorRobo"
            class="col-12"
            option-label="name"
            option-value="name"
            :options="[
              { name: 'Si', value: 'Si' },
              { name: 'No', value: 'No' },
              { name: 'No se sabe', value: 'No se sabe' },
            ]"
            :rules="{
              required,
            }"
          />
        </AppFieldset>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <AppFieldset legend="¿Porta las placas patentes?">
          <SelectButton
            v-model="formData.portaPlacaOption"
            class="col-12"
            option-label="name"
            option-value="name"
            :options="[
              { name: 'Si', value: 'Si' },
              { name: 'No', value: 'No' },
            ]"
            :rules="{
              required,
            }"
          />
        </AppFieldset>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <AppFieldset legend="¿Fue incautado?">
          <SelectButton
            v-model="formData.incautadoOption"
            class="col-12"
            option-label="name"
            option-value="name"
            :options="[
              { name: 'Si', value: 'Si' },
              { name: 'No', value: 'No' },
            ]"
            :rules="{
              required,
            }"
          />
        </AppFieldset>
      </div>

      <AppInput
        id="numeroEncargos"
        v-model="formData.numeroEncargos"
        class="col-12 md:col-6 lg:col-3"
        label="Número de Encargo"
      />
      <AppInput
        id="informacionAutopista"
        v-model="formData.informacionAutopista"
        class="col-12 md:col-6 lg:col-3"
        label="Información de Autopistas"
      />
      <AppInput
        id="informacionPeajes"
        v-model="formData.informacionPeajes"
        class="col-12 md:col-6 lg:col-3"
        label="Información de Peajes"
      />
      <AppInput
        id="observacion"
        v-model="formData.observacion"
        class="col-12 md:col-6 lg:col-3"
        label="Observación"
      />
    </AppFieldset>
    <template #bottom>
      <div class="flex justify-content-center mb-4">
        <Button
          v-if="!editando"
          class="btn-form"
          icon="pi pi-plus-circle"
          icon-pos="right"
          label="Agregar Medio de Transporte"
          style="width: auto"
          @click="handleAgregarMedioTransporte"
        />

        <div
          v-else
          class="flex"
        >
          <div class="mr-4">
            <Button
              class="p-button-outlined p-button-warning"
              icon="pi pi-times"
              label="Cancelar"
              @click="handleResetForm"
            />
          </div>
          <div>
            <Button
              class="p-button-warning"
              icon="pi pi-pencil"
              label="Editar Medio de Transporte"
              @click="handleAgregarMedioTransporte"
            />
          </div>
        </div>
      </div>
      <TablaMediosTransporte
        class="col-12"
        @medio-transporte:rellenar="handleRellenarMedioTransporte"
      />
    </template>
  </AppFieldset>
</AppForm>
</template>

<script setup>
import { reactive, ref } from 'vue'

import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useDelitoStore } from '@/modules/global/composables'

import {
  llegadaHuidaAmbosOptions,
  tipoMedioTransporteImputadoOptions,
  tipoVehiculoOptions
} from '@/data/delito.json'

const { delito_ADD_MEDIO_TRANSPORTE, delito_EDIT_MEDIO_TRANSPORTE } =
  useDelitoStore()
const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()

function getFormDataInitial () {
  return {
    idMedioTransporteImputado: '',
    ruta: '',
    tipoMedioTransporteImputado: '',
    detalle: '',
    tipoVehiculo: '',
    patente: '',
    marca: '',
    modelo: '',
    color: '',
    vin: '',
    numeroMotor: '',
    tieneSeguro: '',
    estaEncargadoPorRobo: '',
    portaPlacaOption: '',
    incautadoOption: '',
    numeroEncargos: '',
    informacionAutopista: '',
    informacionPeajes: '',
    observacion: ''
  }
}

const formData = reactive(getFormDataInitial())

const { isFormValid, formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'formDelitoMedioTransporte'
})

const editando = ref(false)

function crearContrato (formdata) {
  return {
    idDenuncia: null,
    medioTransporteImputado: 'string',
    ruta: formdata.ruta,
    tipoMedioTransporteImputado: formdata.tipoMedioTransporteImputado,
    detalleMedioTransporte: formdata.detalle,
    datoVehiculoUtilizadoImputado: {
      idMedioTransporteImputado: null,
      idDatosVehiculoUtilizadoImputado: null,
      datosVehiculo: {
        idDatosVehiculoUtilizadoImputado: null,
        idDatoVehiculo: null,
        tipoVehiculo: formdata.tipoVehiculo,
        patente: formdata.patente,
        marca: formdata.marca,
        modelo: formdata.modelo,
        color: formdata.color,
        vin: formdata.vin,
        numeroMotor: formdata.numeroMotor,
        tieneSeguro: formdata.tieneSeguro,
        estaEncargadoPorRobo: formdata.estaEncargadoPorRobo,
        informacionAutopista: formdata.informacionAutopista,
        informacionPeajes: formdata.informacionPeajes
      },
      numeroEncargos: formdata.numeroEncargos,
      observacion: formdata.observacion
    },
    portaPlacaOption: formData.portaPlacaOption,
    incautadoOption: formdata.incautadoOption
  }
}

function handleAgregarMedioTransporte () {
  const formularioProcesado = procesarFormulario()

  if (!formularioProcesado) {
    return
  }

  if (!editando.value) {
    const data = {
      idMedioTransporteImputado: new Date().toISOString(),
      ...crearContrato(formData)
    }
    delito_ADD_MEDIO_TRANSPORTE(data)
    toastSuccess(
      `El medio de transporte ${formData.tipoMedioTransporteImputado}, ha sido agregado con éxito`
    )
  } else {
    const data = {
      idMedioTransporteImputado: formData.idMedioTransporteImputado,
      ...crearContrato(formData)
    }
    delito_EDIT_MEDIO_TRANSPORTE(data)
    toastSuccess(
      `El medio de transporte ${formData.tipoMedioTransporteImputado}, ha sido modificado con éxito`
    )
  }

  // resetea el formulario
  handleResetForm()
}

// rellena los datos del medio de transporte a editar
function handleRellenarMedioTransporte ({ medioTransporte }) {
  const { datoVehiculoUtilizadoImputado } = medioTransporte
  const { datosVehiculo } = datoVehiculoUtilizadoImputado

  formData.idMedioTransporteImputado =
    medioTransporte.idMedioTransporteImputado
  formData.ruta = medioTransporte.ruta
  formData.tipoMedioTransporteImputado =
    medioTransporte.tipoMedioTransporteImputado
  formData.detalle = medioTransporte.detalleMedioTransporte
  formData.tipoVehiculo = datosVehiculo.tipoVehiculo
  formData.patente = datosVehiculo.patente
  formData.marca = datosVehiculo.marca
  formData.modelo = datosVehiculo.modelo
  formData.color = datosVehiculo.color
  formData.vin = datosVehiculo.vin
  formData.numeroMotor = datosVehiculo.numeroMotor
  formData.tieneSeguro = datosVehiculo.tieneSeguro
  formData.estaEncargadoPorRobo = datosVehiculo.estaEncargadoPorRobo
  formData.informacionAutopista = datosVehiculo.informacionAutopista
  formData.informacionPeajes = datosVehiculo.informacionPeajes
  formData.numeroEncargos = datoVehiculoUtilizadoImputado.numeroEncargos
  formData.observacion = datoVehiculoUtilizadoImputado.observacion
  formData.portaPlacaOption = medioTransporte.portaPlacaOption
  formData.incautadoOption = medioTransporte.incautadoOption
  editando.value = true
}

function handleResetForm () {
  Object.assign(formData, getFormDataInitial())
  editando.value = false
  formSubmitted.value = false
}

function procesarFormulario () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)

    return
  }

  return {
    ...formData
  }
}
</script>
