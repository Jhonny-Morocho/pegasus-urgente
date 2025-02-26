<template>
<section class="col-12 px-0">
  <AppFieldset legend="Dinero">
    <AppForm
      v-if="!props.readOnly"
      id="dineros"
      class="grid col-12"
      :form-submitted="formSubmitted"
      validation-scope="formDineros"
    >
      <AppDropdown
        id="tipo-moneda"
        v-model="formData.tipoMoneda"
        class="col-12 md:col-6"
        :disabled="dineros.find(d => d.tipoMoneda)"
        label="Divisa"
        option-label="descripcion"
        option-value="id"
        :options="tipoMoneda"
        :retrieve-data-action="mantenedor_geTipoMoneda"
        :rules="{
          required,
        }"
        show-clear
      />
      <AppInputNumber
        id="monto"
        v-model="monto"
        class="col-12 md:col-6"
        disabled
        label="Monto"
      />
      {{ montosumado }}
      <AppFieldset
        class="col-12 my-3"
        legend="Desglose de Dinero"
      >
        <AppDropdown
          id="denominacion"
          v-model="formData.denominacion"
          class="col-12 md:col-3"
          label="Denominación"
          option-label="descripcion"
          option-value="id"
          :options="denominacionDinero"
          :retrieve-data-action="mantenedor_getDenominacionDinero"
          :rules="{
            required,
          }"
          show-clear
        />
        <AppDropdown
          id="tipo-dinero"
          v-model="formData.tipo"
          class="col-12 md:col-3"
          label="Tipo de dinero"
          option-label="descripcion"
          option-value="id"
          :options="tipoDinero"
          :retrieve-data-action="mantenedor_getTipoDinero"
          :rules="{
            required,
          }"
          show-clear
        />
        <AppInputNumber
          id="cantidad-dinero"
          v-model="formData.cantidadDinero"
          class="col-12 md:col-3"
          label="Cantidad"
          :min="0"
          :rules="{ required, maxLength: maxLength(10) }"
          show-buttons
          :step="1"
          :use-grouping="false"
        />
        <AppInputNumber
          id="total"
          v-model="formData.total"
          class="col-12 md:col-3"
          disabled
          label="Total"
          :min="0"
        />
        <div class="flex justify-content-center mt-2 mb-4 col-12">
          <Button
            v-if="!editando"
            class="btn-form"
            icon="pi pi-plus-circle"
            icon-pos="right"
            label="Agregar Dinero"
            style="width: auto"
            @click="agregarDinero"
          />
          <div v-else>
            <Button
              class="p-button-outlined p-button-warning mx-1"
              icon="pi pi-times"
              label="Cancelar"
              style="width: auto"
              @click="cancelarEdicion"
            />
            <Button
              class="p-button-warning mx-1"
              icon="pi pi-pencil"
              label="Modificar Dinero"
              style="width: auto"
              @click="agregarDinero"
            />
          </div>
        </div>
        <AppDataTable
          id="tabla-dineros"
          class="col-12"
          :loading="loadingTablaDinero"
          :value="dineros"
        >
          <Column header="Tipo Moneda">
            <template #body="{ data }">
              {{ tipoMonedaNombre(data.tipoMoneda) }}
            </template>
          </Column>
          <Column header="Monto">
            <template #body="{ data }">
              {{ data.monto }}
            </template>
          </Column>
          <Column header="Denominación">
            <template #body="{ data }">
              {{ denominacionNombre(data.denominacion) }}
            </template>
          </Column>
          <Column header="Tipo">
            <template #body="{ data }">
              {{ tipoDineroNombre(data.tipo) }}
            </template>
          </Column>
          <Column header="Desglose Cantidad">
            <template #body="{ data }">
              {{ data.cantidadDinero }}
            </template>
          </Column>
          <Column header="Total">
            <template #body="{ data }">
              {{ data.total }}
            </template>
          </Column>
          <Column
            v-if="!props.readOnly && !editando"
            class="text-center"
            header="Acciones"
            style="width: 0"
          >
            <template #body="{ data }">
              <Button
                aria-controls="overlay_menu"
                aria-haspopup="true"
                class="p-button-rounded p-button-outlined"
                icon="pi pi-ellipsis-v"
                type="button"
                @click="toggleAcciones($event, data)"
              />
            </template>
          </Column>
        </AppDataTable>
      </AppFieldset>
    </AppForm>
    <Menu
      id="overlay_menu"
      ref="menuAcciones"
      :model="menuAccionesItems"
      :popup="true"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { reactive, defineProps, defineExpose, ref, watch, computed } from 'vue'
import { useEspeciesDineroStore, useMantenedorStore } from '../../composables'
import { propTypes } from '@/modules/common/types/prop.types'

// jsons
// import isoMoneda from '@/data/isoMoneda.json'

const { toastError, toastSuccess, toastWarning, TOAST_MESSAGES } =
  useAppToast()

const { launchConfirmDialog } = useConfirmDialog()

const loadingTablaDinero = ref(false)

const menuAccionesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () => handleEditarDinero(dataDinero)
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => handleEliminarDinero(dataDinero)
      }
    ]
  }
])

const menuAcciones = ref()

let dataDinero = null

function toggleAcciones (event, data) {
  menuAcciones.value.toggle(event)
  dataDinero = data
}

const {
  tipoMoneda,
  denominacionDinero,
  tipoDinero,
  mantenedor_geTipoMoneda, // EN ALGUN MOMENTO SE LE VA A CAMBIAR EL NOMBRE? (getTipoMoneda)
  mantenedor_getNombreMoneda,
  mantenedor_getNombreDenominacionDinero,
  mantenedor_getNombreTipoDinero,
  mantenedor_getDenominacionDinero,
  mantenedor_getTipoDinero
} = useMantenedorStore()

const {
  dineros,
  especiesDinero_ADD_DINERO,
  especiesDinero_DELETE_DINERO,
  especiesDinero_EDIT_DINERO
} = useEspeciesDineroStore()

const props = defineProps({
  readOnly: Boolean,
  familiaEspecie: propTypes.string
})

const formData = reactive({
  tipoMoneda: null,
  denominacion: null,
  tipo: null,
  cantidadDinero: null,
  total: null
})

const monto = computed(() => dineros.value.find(d => d.monto)?.monto ?? null)

function seleccionarDivisa () {
  formData.tipoMoneda = dineros.value.find(d => d.tipoMoneda)?.tipoMoneda
  formData.total = null
}
seleccionarDivisa()

function montoCalculado () {
  let t = 0
  dineros.value.forEach((d) => {
    t += d.cantidadDinero * +denominacionNombre(d.denominacion)
  })
  t += formData.cantidadDinero * +denominacionNombre(formData.denominacion)
  return t
}

watch(
  () => formData.denominacion,
  () => {
    formData.total = formData.denominacion ? (formData.cantidadDinero * +denominacionNombre(formData.denominacion)) : 0
  }
)
watch(
  () => formData.cantidadDinero,
  () => {
    formData.total = formData.cantidadDinero ? (formData.cantidadDinero * +denominacionNombre(formData.denominacion)) : 0
  }
)

const { resetFormData, isFormValid, formSubmitted, required, maxLength } =
  useFormValidation({
    formData,
    validationScope: 'formDineros'
  })

const editando = ref(false)

function populateForm (data) {
  Object.assign(formData, data)
}

function agregarDinero () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  if (!editando.value) {
    formData.monto = montoCalculado()
    especiesDinero_ADD_DINERO({
      ...formData,
      idDinero: new Date().toISOString(),
      loader: (l) => (loadingTablaDinero.value = l)
    })
    cancelarEdicion()
    toastSuccess('Dinero agregado')
    seleccionarDivisa()
  } else {
    launchConfirmDialog({
      message: '¿Estás seguro(a) de modificar el Dinero?',
      accept: () => {
        formData.monto = montoCalculado()
        especiesDinero_EDIT_DINERO({ ...formData })
        cancelarEdicion()
        toastWarning('Dinero Modificado')
      },
      loader: (l) => (loadingTablaDinero.value = l)
    })
  }
}

function handleEliminarDinero (data) {
  launchConfirmDialog({
    message: '¿Estás seguro de eliminar el dinero?',
    accept: () => {
      especiesDinero_DELETE_DINERO(data)
      toastWarning('Dinero Eliminado con Éxito')
    }
  })
}

function handleEditarDinero (data) {
  editando.value = true
  populateForm(data)
}

function cancelarEdicion () {
  resetFormData()
  formSubmitted.value = false
  editando.value = false
}

function tipoMonedaNombre (idTipoMoneda) {
  if (idTipoMoneda) {
    return mantenedor_getNombreMoneda(idTipoMoneda)
  }
  return 'Sin Tipo'
}

function denominacionNombre (idDenominacion) {
  if (idDenominacion) {
    return mantenedor_getNombreDenominacionDinero(idDenominacion)
  }
  return 'Sin Denominación'
}

function tipoDineroNombre (idTipoDinero) {
  if (idTipoDinero) {
    return mantenedor_getNombreTipoDinero(idTipoDinero)
  }
  return 'Sin Tipo'
}

// const iso = computed(() => {
//   const isoMonedaRef = ref('CLP')

//   // Obtener el valor por key
//   const keyValue = Object.keys(isoMoneda).find((key) => parseInt(key) === formData.tipoMoneda)
//   if (keyValue) isoMonedaRef.value = isoMoneda[keyValue]

//   return isoMonedaRef.value
// })

defineExpose({ resetFormData })
</script>
