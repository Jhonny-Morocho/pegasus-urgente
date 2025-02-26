<template>
<div
  v-if="loading"
  class="col-12"
>
  <LoaderSkeleton />
</div>
<div
  v-else
  class="p-fluid"
>
  <AppFieldset legend="Fiscalía Local">
    <AppDropdown
      id="tipo-fiscalia"
      v-model="formData.tipoFiscalia"
      class="col-12 md:col-6 lg:col-3"
      label="Tipo Fiscalía"
      option-label="descripcion"
      option-value="id"
      :options="tiposFiscalia"
      :rules="{
        required
      }"
      show-clear
      @change="resetForm"
    />
    <AppDropdown
      id="region"
      v-model="formData.region"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.tipoFiscalia"
      label="Región"
      option-label="descripcion"
      option-value="id"
      :options="regiones"
      :rules="{
        required
      }"
      show-clear
      @change="cambiarNombresPorFiscalia(formData.region)"
    />
    <AppDropdown
      id="nombre-fiscalia"
      v-model="formData.nombreFiscalia"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.region"
      label="Nombre Fiscalía"
      :loading="loaderFiscalia"
      option-label="descripcion"
      option-value="id"
      :options="nombresFiscalia"
      :rules="{
        required
      }"
      show-clear
      @change="getIdFiscalia(formData.nombreFiscalia)"
    />
    <AppInput
      id="numero-fiscalia"
      v-model="formData.numeroFiscalia"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.region"
      label="Número Fiscalía"
      :rules="{
        required
      }"
      @change="getIdFiscaliaDropdown(formData.numeroFiscalia)"
    />
    <AppInput
      id="nombre-fiscal-turno"
      v-model="formData.nombreFiscalTurno"
      class="col-12 md:col-6 lg:col-3"
      disabled
      label="Nombre Usuario"
      :rules="{
        required
      }"
    />
    <AppDropdown
      id="comuna"
      v-model="formData.comuna"
      class="col-12 md:col-6 lg:col-3"
      disabled
      label="Comuna"
      option-label="descripcion"
      option-value="id"
      :options="comuna"
      :retrieve-data-action="mantenedor_getComunas"
      show-clear
    />
    <AppInput
      id="calle"
      v-model="formData.calle"
      class="col-12 md:col-6 lg:col-3"
      disabled
      label="Calle"
    />
    <AppInput
      id="numero"
      v-model="formData.numero"
      class="col-12 md:col-6 lg:col-3"
      disabled
      label="Número"
    />
    <AppInputMask
      id="telefono-contacto"
      v-model="formData.telefonoContacto"
      class="col-12 md:col-6 lg:col-3"
      disabled
      label="Teléfono Contacto"
      mask="99999999999"
      :rules="{ required }"
    />
    <AppInput
      id="correo-electronico"
      v-model="formData.correoElectronicoContacto"
      class="col-12 md:col-6 lg:col-3"
      disabled
      label="Correo Electrónico Contacto"
      :rules="{
        email
      }"
    />
  </AppFieldset>
</div>
<Dialog
  v-model:visible="loaderDireccion"
  modal
  :style="{ width: '35vw' }"
>
  <h3 class="mb-3 text-center">
    Cargando Dirección de la Físcalia
  </h3>
  <ProgressBar
    v-if="loaderDireccion"
    class="my-4"
    mode="indeterminate"
    style="height: 0.5em"
  />
</Dialog>
</template>
<script setup>
import { useFormValidation, useAppToast } from '@/modules/common/composables'
import { defineExpose, defineProps, reactive, ref } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'

import { useMantenedorStore } from '@/modules/global/composables'
import { useSessionStore } from '@/modules/session/composables'

import { requestUtil } from '@/utils'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

defineProps({
  loading: propTypes.boolean
})
const { required, email } = useFormValidation()
const { user } = useSessionStore()
const { toastError } = useAppToast()

const {
  identificacionDenuncia_getIdFiscaliaByIdFiscaliaMantenedor,
  identificacionDenuncia_getDireccionFiscalia
} = useIdentificacionDenunciaStore()

const {
  mantenedor_getFiscaliaBycodigoTipoYRegion,
  mantenedor_getNombreFiscalia,
  mantenedor_getCodigoFiscaliaById,
  mantenedor_getCodigoTiposFiscaliaById,
  mantenedor_getIdFiscaliaByCodigo,
  mantenedor_getCodigoRegionById,
  mantenedor_getTipoFiscalia,
  tiposFiscalia,
  nombresFiscalia,
  regiones,
  mantenedor_getRegiones,
  mantenedor_getComunas, comuna
} = useMantenedorStore()

const loaderFiscalia = ref(false)
const loaderDireccion = ref(false)

const getMantenedores = () => {
  requestUtil({ action: mantenedor_getTipoFiscalia })
  requestUtil({ action: mantenedor_getRegiones })
  requestUtil({ action: mantenedor_getNombreFiscalia })
}
getMantenedores()

const formData = reactive({
  tipoFiscalia: '',
  region: '',
  nombreFiscalia: '',
  numeroFiscalia: '',
  nombreFiscalTurno: '',
  comuna: '',
  calle: '',
  numero: '',
  telefonoContacto: '',
  correoElectronicoContacto: ''
})

function populateData (data) {
  console.log('populateData fiscalia', data)
  Object.assign(formData, data)
  getIdFiscalia(formData.nombreFiscalia)
}
defineExpose({ formData, populateData })

const nombresFiscaliaList = ref([])

function cambiarNombresPorFiscalia () {
  formData.nombreFiscalia = ''
  formData.numeroFiscalia = ''
  formData.comuna = ''
  formData.calle = ''
  formData.numero = ''
  nombresFiscaliaList.value = [{ descripcion: `Fiscalía de la Región ${formData.region}` }]
  const tipo = mantenedor_getCodigoTiposFiscaliaById(formData.tipoFiscalia)
  const region = mantenedor_getCodigoRegionById(formData.region)
  const payload = {
    tipoFiscalia: tipo,
    regionFiscalia: region
  }
  if (tipo && region) {
    requestUtil({
      action: mantenedor_getFiscaliaBycodigoTipoYRegion,
      payload: payload,
      loader: (l) => (loaderFiscalia.value = l)
    })
  }
}
function getIdFiscalia (id) {
  formData.comuna = ''
  formData.calle = ''
  formData.numero = ''
  formData.numeroFiscalia = mantenedor_getCodigoFiscaliaById(id)
  formData.nombreFiscalTurno = user.value.preferred_username
  formData.telefonoContacto = 6003330000000
  formData.correoElectronicoContacto = user.value.email
  if (formData.nombreFiscalia) {
    loaderDireccion.value = true
    requestUtil({
      action: identificacionDenuncia_getIdFiscaliaByIdFiscaliaMantenedor,
      payload: { idFiscaliaMantenedor: id },
      resolve: (r) => getDireccionFiscalia(r),
      reject: () => {
        toastError('Ocurrió un error inesperado')
        loaderDireccion.value = false
      }
    })
  }
}

function getDireccionFiscalia (id) {
  loaderDireccion.value = true
  requestUtil({
    action: identificacionDenuncia_getDireccionFiscalia,
    payload: { idFiscalia: id },
    resolve: (direccion) => rellenarCamposPorFiscalia(direccion),
    loader: (l) => { loaderDireccion.value = (l) },
    reject: () => {
      toastError('Ocurrió un error inesperado al cargar la dirección')
    }
  })
}

function rellenarCamposPorFiscalia (data) {
  const direccion = data?.direccion
  if (direccion) {
    formData.comuna = direccion.idComuna.toUpperCase() ?? ' '
    formData.calle = direccion.calle
    formData.numero = direccion.numero
  }
}

function getIdFiscaliaDropdown (numeroFiscalia) {
  if (!numeroFiscalia) return
  formData.nombreFiscalia = mantenedor_getIdFiscaliaByCodigo(numeroFiscalia)
  getIdFiscalia(formData.nombreFiscalia)
}

async function resetForm () {
  formData.region = ''
  formData.nombreFiscalia = ''
  formData.numeroFiscalia = ''
  formData.region = ''
  formData.comuna = ''
  formData.calle = ''
  formData.numero = ''
}

</script>
