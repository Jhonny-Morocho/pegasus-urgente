<template>
<div>
  <AppForm
    id="medios-transporte"
    :form-submitted="formSubmitted"
    validation-scope="formMedioTransporte"
  >
    <AppFieldset legend="Medios de Transporte Utilizados por el Imputado">
      <AppFieldset
        v-if="!readOnly || quiereVerMas"
        class="col-12 py-2"
        legend="Ruta del Medio de Transporte"
      >
        <div class="col-12 lg:col-4">
          <AppSelectButton
            id="ruta"
            v-model="formData.rutaMedioTransporte"
            class="col-12"
            :disabled="readOnly"
            option-label="name"
            option-value="name"
            :options="[
              { name: 'Llegada' },
              { name: 'Huida' },
              { name: 'Ambos' },
            ]"
            :rules="{ required }"
          />
          <AppDropdown
            id="tipo-medio"
            v-model="formData.tipoMedioTransporte"
            class="col-12"
            :disabled="readOnly"
            label="Seleccione Tipo de Transporte"
            option-label="descripcion"
            option-value="id"
            :options="tipoTransporte"
            :rules="{ required }"
            show-clear
            @change="resetVehiculo"
          />
        </div>
        <div class="col-12 lg:col-8">
          <AppTextarea
            id="detalle"
            v-model="formData.detalleMedioTransporte"
            class="col-12"
            :disabled="readOnly"
            label="Detalle Medio de Transporte"
            rows="5"
          />
        </div>
      </AppFieldset>
      <AppFieldset
        v-if="formData.tipoMedioTransporte === 'Vehículo'"
        class="col-12"
        legend="Datos Vehículo Asociado al Medio de Transporte Utilizado por los Imputados"
      >
        <AppDropdown
          id="tipo-vehiculo"
          v-model="
            formData.datoVehiculoUtilizadoImputado.datosVehiculo.tipoVehiculo
          "
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Seleccione Tipo de Vehículo"
          option-label="name"
          option-value="name"
          :options="tipoVehiculoOptions"
          show-clear
        />
        <AppInput
          id="patente"
          v-model="
            formData.datoVehiculoUtilizadoImputado.datosVehiculo.patente
          "
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Patente"
        />
        <AppInput
          id="marca"
          v-model="formData.datoVehiculoUtilizadoImputado.datosVehiculo.marca"
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Marca"
        />
        <AppInput
          id="modelo"
          v-model="
            formData.datoVehiculoUtilizadoImputado.datosVehiculo.modelo
          "
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Modelo"
        />
        <AppInput
          id="color"
          v-model="formData.datoVehiculoUtilizadoImputado.datosVehiculo.color"
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Color"
        />
        <div class="col-12 lg:col-9 grid pr-0">
          <AppInput
            id="vin"
            v-model="formData.datoVehiculoUtilizadoImputado.datosVehiculo.vin"
            class="col-12 md:col-6 lg:col-6 pr-0"
            :disabled="readOnly"
            label="VIN"
          />
          <AppInput
            id="numero-motor"
            v-model="
              formData.datoVehiculoUtilizadoImputado.datosVehiculo.numeroMotor
            "
            class="col-12 md:col-6 lg:col-6 pr-0"
            :disabled="readOnly"
            label="Número de Motor"
          />
        </div>
        <div class="col-12 md:col-6 lg:col-3">
          <AppFieldset legend="¿Tiene seguro? (*)">
            <AppSelectButton
              id="tiene-seguro"
              v-model="formData.datoVehiculoUtilizadoImputado.tieneSeguro"
              class="col-12"
              :disabled="readOnly"
              option-label="name"
              option-value="name"
              :options="[
                { name: 'Si' },
                { name: 'No' },
                { name: 'No Se Sabe' },
              ]"
              :rules="{ required }"
            />
          </AppFieldset>
        </div>
        <div class="col-12 md:col-6 lg:col-3">
          <AppFieldset legend="¿Encargado por Robo? (*)">
            <AppSelectButton
              id="encargo-por-robo"
              v-model="
                formData.datoVehiculoUtilizadoImputado.estaEncargadoPorRobo
              "
              class="col-12"
              :disabled="readOnly"
              option-label="name"
              option-value="name"
              :options="[
                { name: 'Si' },
                { name: 'No' },
                { name: 'No Se Sabe' },
              ]"
              :rules="{ required }"
            />
          </AppFieldset>
        </div>
        <div class="col-12 md:col-6 lg:col-3">
          <AppFieldset legend="¿Porta Placa Patente? (*)">
            <AppSelectButton
              id="porta-placa-patente"
              v-model="
                formData.datoVehiculoUtilizadoImputado.portaPlacaPatente
              "
              class="col-12"
              :disabled="readOnly"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false },
              ]"
              :rules="{ required }"
            />
          </AppFieldset>
        </div>
        <div class="col-12 md:col-6 lg:col-3">
          <AppFieldset legend="¿Fue Incautado? (*)">
            <AppSelectButton
              id="fue-incautado"
              v-model="formData.datoVehiculoUtilizadoImputado.incautado"
              class="col-12"
              :disabled="readOnly"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false },
              ]"
              :rules="{ required }"
            />
          </AppFieldset>
        </div>
        <AppInput
          id="numero-encargo"
          v-model="formData.datoVehiculoUtilizadoImputado.numeroEncargos"
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Número de Encargo"
        />
        <AppInput
          id="info-autopista"
          v-model="
            formData.datoVehiculoUtilizadoImputado.informacionAutopista
          "
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Información de Autopistas"
        />
        <AppInput
          id="info-peajes"
          v-model="formData.datoVehiculoUtilizadoImputado.informacionPeajes"
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Información de Peajes"
        />
        <AppInput
          id="observacion"
          v-model="formData.datoVehiculoUtilizadoImputado.observacion"
          class="col-12 md:col-6 lg:col-3"
          :disabled="readOnly"
          label="Observación"
        />
      </AppFieldset>
      <template #bottom>
        <div
          v-if="!readOnly"
          class="flex justify-content-center mb-4"
        >
          <Button
            v-if="!editando"
            class="btn-form"
            icon="pi pi-plus-circle"
            icon-pos="right"
            label="Agregar Medio de Transporte"
            style="width: auto"
            @click="agregarMedioTransporte"
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
                @click="cancelarEdicion"
              />
            </div>
            <div>
              <Button
                class="p-button-warning"
                icon="pi pi-pencil"
                label="Modificar Medio de Transporte"
                @click="agregarMedioTransporte"
              />
            </div>
          </div>
        </div>
        <AppDataTable
          id="tabla-medios-transporte"
          class="col-12"
          :value="mediosTransporte"
        >
          <Column
            v-if="false"
            header="idMedioTransporte"
          >
            <template #body="slotProps">
              {{ slotProps.data.idMedioTransporte }}
            </template>
          </Column>
          <Column header="Tipo Medio de Transporte">
            <template #body="{ data }">
              {{ mantenedor_getNombreTipoTransporteById(data.tipoMedioTransporte) }}
            </template>
          </Column>
          <Column header="Huida/Llegada/Ambos">
            <template #body="{ data }">
              {{ data.rutaMedioTransporte }}
            </template>
          </Column>
          <Column header="Detalle">
            <template #body="{ data }">
              {{ data.detalleMedioTransporte }}
            </template>
          </Column>
          <Column
            v-if="!editando"
            class="text-center"
            header="Acciones"
            style="width:0"
          >
            <template #body="{ data }">
              <Button
                v-if="!readOnly"
                aria-controls="overlay_menu"
                aria-haspopup="true"
                class="p-button-rounded p-button-outlined"
                icon="pi pi-ellipsis-v"
                type="button"
                @click="toggleAcciones($event, data)"
              />
              <Button
                v-if="readOnly"
                class="p-button-rounded p-button-outlined"
                icon="pi pi-search-plus"
                @click="verMas(data)"
              />
            </template>
          </Column>
        </AppDataTable>
        <Menu
          id="overlay_menu"
          ref="menuAcciones"
          :model="menuAccionesItems"
          :popup="true"
        />
      </template>
    </AppFieldset>
  </AppForm>
</div>
</template>

<script setup>
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { reactive, ref, defineProps } from 'vue'
import { useDelitoStore, useMantenedorStore } from '@/modules/global/composables/'

import { requestUtil } from '@/utils'

const { launchConfirmDialog } = useConfirmDialog()

const {
  mediosTransporte,
  delito_ADD_MEDIO_TRANSPORTE,
  delito_EDIT_MEDIO_TRANSPORTE,
  delito_DELETE_MEDIO_TRANSPORTE
} = useDelitoStore()

const { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } =
  useAppToast()

const {
  tipoTransporte, mantenedor_getTipoTransporte,
  mantenedor_getNombreTipoTransporteById
} = useMantenedorStore()

defineProps({
  readOnly: Boolean
})

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTipoTransporte })
}
getDataMantenedor()

const menuAccionesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () => rellenarParaEditarMedioTransporte(dataMedioTransporte)
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => eliminarMedioTransporte(dataMedioTransporte)
      }
    ]
  }
])

const menuAcciones = ref()

let dataMedioTransporte = null

function toggleAcciones (event, data) {
  menuAcciones.value.toggle(event)
  dataMedioTransporte = data
}

const editando = ref(false)
const quiereVerMas = ref(false)

const formData = reactive({
  idMedioTransporte: '',
  rutaMedioTransporte: null,
  tipoMedioTransporte: null,
  detalleMedioTransporte: '',
  datoVehiculoUtilizadoImputado: {
    tieneSeguro: null,
    estaEncargadoPorRobo: null,
    portaPlacaPatente: null,
    incautado: null,
    numeroEncargos: '',
    informacionAutopista: '',
    informacionPeajes: '',
    observacion: '',
    datosVehiculo: {
      idDetalleHechoDelictual: '',
      idDatosVehiculoUtilizadoImputado: '',
      idDatoVehiculo: '',
      tipoVehiculo: '',
      patente: '',
      marca: '',
      modelo: '',
      color: '',
      vin: '',
      numeroMotor: ''
    }
  }
})

const { formSubmitted, required, resetFormData, isFormValid } =
  useFormValidation({
    formData,
    validationScope: 'formMedioTransporte'
  })

function populateForm (data) {
  Object.assign(formData, data)
}

function createContract (data) {
  const { datoVehiculoUtilizadoImputado } = data
  return {
    idMedioTransporte: data.idMedioTransporte,
    rutaMedioTransporte: data.rutaMedioTransporte,
    tipoMedioTransporte: data.tipoMedioTransporte,
    detalleMedioTransporte: data.detalleMedioTransporte,
    datoVehiculoUtilizadoImputado: {
      tieneSeguro: datoVehiculoUtilizadoImputado.tieneSeguro,
      estaEncargadoPorRobo: datoVehiculoUtilizadoImputado.estaEncargadoPorRobo,
      portaPlacaPatente: datoVehiculoUtilizadoImputado.portaPlacaPatente,
      incautado: datoVehiculoUtilizadoImputado.incautado,
      numeroEncargos: datoVehiculoUtilizadoImputado.numeroEncargos,
      informacionAutopista: datoVehiculoUtilizadoImputado.informacionAutopista,
      informacionPeajes: datoVehiculoUtilizadoImputado.informacionPeajes,
      observacion: datoVehiculoUtilizadoImputado.observacion,
      datosVehiculo: { ...datoVehiculoUtilizadoImputado.datosVehiculo }
    }
  }
}

function agregarMedioTransporte () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  if (!editando.value) {
    console.log(createContract({ ...formData }))
    formData.idMedioTransporte = new Date().toISOString()
    delito_ADD_MEDIO_TRANSPORTE(createContract({ ...formData }))
    toastSuccess('Medio de Transporte Agregado con Éxito')
    cancelarEdicion()
  } else {
    console.log(formData)
    launchConfirmDialog({
      message: '¿Estás Seguro(a)?',
      accept: () => {
        delito_EDIT_MEDIO_TRANSPORTE({ ...formData })
        toastSuccess('Medio de Transporte Modificado con Éxito')
        cancelarEdicion()
      }
    })
  }
}

function rellenarParaEditarMedioTransporte (data) {
  populateForm(data)
  editando.value = true
}
function eliminarMedioTransporte (data) {
  launchConfirmDialog({
    message: '¿Estás Seguro(a)?',
    accept: () => {
      delito_DELETE_MEDIO_TRANSPORTE(data)
      toastWarning('Medio de Transporte Eliminado')
    }
  })
}

function verMas (data) {
  populateForm(data)
  quiereVerMas.value = true
}

function cancelarEdicion () {
  resetFormData()
  formSubmitted.value = false
  editando.value = false
}

function resetVehiculo () {
  formData.datoVehiculoUtilizadoImputado.datosVehiculo.tipoVehiculo = ''
  formData.datoVehiculoUtilizadoImputado.datosVehiculo.patente = ''
  formData.datoVehiculoUtilizadoImputado.datosVehiculo.marca = ''
  formData.datoVehiculoUtilizadoImputado.datosVehiculo.modelo = ''
  formData.datoVehiculoUtilizadoImputado.datosVehiculo.color = ''
  formData.datoVehiculoUtilizadoImputado.datosVehiculo.vin = ''
  formData.datoVehiculoUtilizadoImputado.datosVehiculo.numeroMotor = ''
  formData.datoVehiculoUtilizadoImputado.tieneSeguro = ''
  formData.datoVehiculoUtilizadoImputado.estaEncargadoPorRobo = ''
  formData.datoVehiculoUtilizadoImputado.portaPlacaPatente = null
  formData.datoVehiculoUtilizadoImputado.incautado = null
  formData.datoVehiculoUtilizadoImputado.numeroEncargos = ''
  formData.datoVehiculoUtilizadoImputado.informacionAutopista = ''
  formData.datoVehiculoUtilizadoImputado.informacionPeajes = ''
  formData.datoVehiculoUtilizadoImputado.observacion = ''
}

const tipoVehiculoOptions = [
  { name: 'Vehículo', value: 1 },
  { name: 'Vehículos Motorizados', value: 2 },
  { name: 'Autobus', value: 3 },
  { name: 'Motos', value: 4 },
  { name: 'Tractor', value: 5 },
  { name: 'Camión', value: 6 },
  { name: 'Accesorios Vehiculos', value: 7 },
  { name: 'Camioneta', value: 8 },
  { name: 'Rampla', value: 9 },
  { name: 'Tracción Animal', value: 10 },
  { name: 'Otros Vehículos', value: 11 },
  { name: 'Llaves de contactos', value: 12 },
  { name: 'Jockey', value: 13 }
]
</script>
