<template>
<section>
  <AppForm
    id="registro-parte"
    :form-submitted="formSubmitted"
    validation-scope="formIngresarParteDenuncia"
  >
    <AppFieldset
      class="p-fluid"
      legend="Ingresar Parte/Denuncia"
    >
      <AppInput
        id="numero-parte-denuncia"
        v-model="formData.numeroParteDenuncia"
        class="col-12 md:col-6 lg:col-3"
        label="Nº Parte/Denuncia"
        max-length="16"
        :rules="{
          required,
        }"
      />
      <AppCalendar
        id="fecha-hora-denuncia"
        v-model="formData.fechaOcurrencia"
        class="col-12 md:col-6 lg:col-3"
        label="Fecha y Hora denuncia"
        :rules="{
          required,
        }"
        show-time
      />
      <AppDropdown
        id="familiaDelito"
        v-model="formData.idFamiliaDelito"
        class="col-12 md:col-6 lg:col-3"
        label="Familia del Delito"
        option-label="descripcion"
        option-value="id"
        :options="familiasDelito"
        :retrieve-data-action="mantenedor_getFamiliasDelito"
        :rules="tipoUnidadPolicial ? { required } : undefined"
        show-clear
        @change="getTipoDelito"
      />
      <AppDropdown
        id="tipoDelito"
        v-model="formData.idTipoDelito"
        class="col-12 md:col-6 lg:col-3"
        label="Tipo de Delito"
        :loading="tipoDelitoLoading"
        option-label="descripcion"
        option-value="id"
        :options="tipoDelitoOptions"
        :rules="tipoUnidadPolicial ? { required } : undefined"
        show-clear
      />
      <TablaActasDocumentosAdjuntos class="w-full" />
      <div class="flex justify-content-center col-12">
        <Button
          v-if="editando"
          class="p-button-outlined p-button-warning mr-3"
          icon="pi pi-times-circle"
          icon-pos="right"
          label="Cancelar"
          style="width: auto"
          @click="cancelarEdicion"
        />
        <Button
          class="btn-form"
          icon="pi pi-plus"
          icon-pos="right"
          :label="editando ? 'Modificar Parte' : 'Guardar Parte/Denuncia'"
          style="width: auto"
          @click="registrarParteDenuncia"
        />
      </div>
    </AppFieldset>
  </AppForm>
  <TablaParteDenunciaRegistrado
    @tabla-parte-denuncia:modificar="setModoEdicion"
  />
</section>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'

import TablaParteDenunciaRegistrado from '@/modules/global/components/detalle-denuncia/TablaParteDenunciaRegistrado.vue'
import TablaActasDocumentosAdjuntos from '@/modules/global/components/detalle-denuncia/TablaActasDocumentosAdjuntos.vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import {
  useOficinaPartesStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

const { required } = useFormValidation()

const {
  familiasDelito,
  tiposDelito,
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getCodigoInstitucionesDenunciaById
} = useMantenedorStore()

const {
  oficinaPartes_agregarParte,
  oficinaPartes_EDITAR_PARTE_ADD_DOCUMENTOS,
  oficinaPartes_EDITAR_PARTE,
  oficinaPartes_LIMPIAR_DOCUMENTOS,
  registroParte
} = useOficinaPartesStore()

const tipoUnidadPolicial = ref(null)
const tipoDelitoLoading = ref(false)
const tipoDelitoOptions = ref([])

function getTipoDelito () {
  tipoDelitoLoading.value = true
  requestUtil({
    action: mantenedor_getTiposDelito,
    loader: (l) => {
      tipoDelitoLoading.value = l
    },
    resolve: () => {
      const tipoDelitos = tiposDelito.value?.filter(
        (td) => td.idPadre === formData.idFamiliaDelito
      )
      tipoDelitoOptions.value = tipoDelitos?.length
        ? tipoDelitos
        : [{ descripcion: 'Sin Tipo Delito', id: 'sin-tipo' }]
    }
  })
}

onMounted(() => {
  tipoUnidadPolicial.value = mantenedor_getCodigoInstitucionesDenunciaById(registroParte.value.unidadPolicialOrganismo) === '1' ||
      mantenedor_getCodigoInstitucionesDenunciaById(registroParte.value.unidadPolicialOrganismo) === '2'
})

function getFormDataInitial () {
  return {
    numeroParteDenuncia: '',
    fechaOcurrencia: '',
    idFamiliaDelito: '',
    idTipoDelito: ''
  }
}
const formData = reactive(getFormDataInitial())

const { formSubmitted, isFormValid } = useFormValidation({
  formData: formData,
  validationScope: 'formIngresarParteDenuncia'
})

const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()

function registrarParteDenuncia () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (!editando.value) {
    formData.fechaOcurrencia = dateTimeUtil.formatToBackendWithTime(
      formData.fechaOcurrencia
    )
    formData.numeroParteDenuncia = formData.numeroParteDenuncia.replace(
      /\s/g,
      ''
    )
    requestUtil({
      action: oficinaPartes_agregarParte,
      payload: formData,
      resolve: () => {
        toastSuccess('Parte Agregado')
        Object.assign(formData, getFormDataInitial())
        formSubmitted.value = false
      },
      reject: (err) => {
        console.log(err)
        toastError('Ha ocurrido un error.\n', err)
      }
    })
  } else {
    requestUtil({
      action: oficinaPartes_EDITAR_PARTE,
      payload: formData,
      resolve: () => {
        toastSuccess('Parte Modificado Existosamente')
        editando.value = false
        handleResetForm()
      },
      reject: (err) => {
        console.log(err)
        toastError('Ha ocurrido un error.\n', err)
      }
    })
  }
}

function handleResetForm () {
  console.log(formData)
  formData.idFamiliaDelito = formData.idFamiliaDelito.toString()
  formData.idTipoDelito = formData.idTipoDelito.toString()
  requestUtil({
    action: oficinaPartes_EDITAR_PARTE,
    payload: formData,
    resolve: () => {
      editando.value = false
    }
  })
  Object.assign(formData, getFormDataInitial())
  oficinaPartes_LIMPIAR_DOCUMENTOS()
  formSubmitted.value = false
}

const editando = ref(false)

function setModoEdicion (data) {
  oficinaPartes_EDITAR_PARTE_ADD_DOCUMENTOS(data)
  editando.value = true
  Object.assign(formData, data)
  console.log(formData)
}

function cancelarEdicion () {
  formData.idFamiliaDelito = formData.idFamiliaDelito.toString()
  formData.idTipoDelito = formData.idTipoDelito.toString()
  handleResetForm()
  formSubmitted.value = false
  editando.value = false
}
</script>
