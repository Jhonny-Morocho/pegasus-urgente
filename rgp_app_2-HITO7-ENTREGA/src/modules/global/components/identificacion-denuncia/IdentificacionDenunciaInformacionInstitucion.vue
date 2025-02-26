<template>
<section>
  <AppFieldset :legend="isRegistroParte ? 'Institución' : 'Institución Denunciante'">
    <AppDropdown
      id="unidadPolicial"
      v-model="formData.unidadPolicialOrganismo"
      class="col-12 md:col-6 lg:col-4"
      :disabled="soloLectura"
      label="Unidad Policial u Organismo"
      option-label="descripcion"
      option-value="id"
      :options="institucionesDenuncia"
      placeholder
      :rules="{
        required
      }"
      show-clear
      :validation-scope="validationScope"
      @change="resetForm"
    />
    <AppInput
      v-if="!escondeCamposInstitucion && isRegistroParte"
      id="nombreContactoInstitucion"
      v-model="formData.nombreContactoInstitucion"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || soloLectura"
      label="Nombre Contacto"
      :rules="{
        required
      }"
    />
    <AppDropdown
      v-if="escondeCamposInstitucion"
      id="prefecturaDependencia"
      v-model="formData.prefecturaDependencia"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || soloLectura"
      label="Prefectura/Dependencia U.P."
      option-label="descripcion"
      option-value="id"
      :options="prefecturas"
      placeholder
      :rules="{
        required
      }"
      show-clear
      :validation-scope="validationScope"
      @change="getComisariaOptions"
    />
    <AppDropdown
      v-if="escondeCamposInstitucion"
      id="comisaria"
      v-model="formData.comisaria"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || !formData.prefecturaDependencia || soloLectura"
      label="Comisaría"
      :loading="loader.comisaria"
      option-label="descripcion"
      option-value="id"
      :options="comisariasOptions ?? comisarias"
      :rules="{ required }"
      show-clear
      @change="getDestacamentoOptions"
    />
    <AppDropdown
      v-if="escondeCamposInstitucion"
      id="destacamento"
      v-model="formData.destacamento"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || !formData.comisaria || soloLectura"
      label="Destacamento"
      :loading="loader.destacamento"
      option-label="descripcion"
      option-value="id"
      :options="destacamentosOptions ?? destacamentos"
      :rules="{ required }"
      show-clear
    />
    <AppDropdown
      id="region"
      v-model="formData.region"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || escondeCamposInstitucion || soloLectura"
      label="Región"
      option-label="descripcion"
      option-value="id"
      :options="regiones"
      :retrieve-data-action="mantenedor_getRegiones"
      :rules="{ required }"
      show-clear
      @change="getComunaOptions"
    />

    <AppDropdown
      id="comuna"
      v-model="formData.comuna"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || escondeCamposInstitucion || soloLectura"
      label="Comuna"
      :loading="loader.comuna"
      option-label="descripcion"
      option-value="id"
      :options="comunasOptions ?? comuna"
      :retrieve-data-action="mantenedor_getComunas"
      :rules="{ required }"
      show-clear
    />

    <AppInput
      id="calle"
      v-model="formData.calle"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || escondeCamposInstitucion || soloLectura"
      label="Calle"
    />

    <AppInput
      id="numero"
      v-model="formData.numeroCalle"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || escondeCamposInstitucion || soloLectura"
      label="Número"
    />

    <AppInput
      id="poblacion"
      v-model="formData.poblacion"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || escondeCamposInstitucion || soloLectura"
      label="Población"
    />

    <AppInputMask
      id="telefonoContacto"
      v-model="formData.telefonoContacto"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || escondeCamposInstitucion || soloLectura"
      label="Teléfono de contacto"
      mask="+99 999999999"
    />

    <AppInput
      id="correoContacto"
      v-model="formData.correoElectronicoContacto"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo || escondeCamposInstitucion || soloLectura"
      label="Correo electrónico de contacto"
      :rules="{ email }"
    />
    <AppInput
      v-if="escondeCamposInstitucion && isRegistroParte"
      id="nombreDeQuienEntrega"
      v-model="formData.nombreDeQuienEntrega"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo"
      label="Nombre de quien entrega"
      :rules="{
        required,
        alfabetico
      }"
    />
    <RutInput
      v-if="escondeCamposInstitucion && isRegistroParte"
      id="rutDeQuienEntrega"
      v-model="formData.rutDeQuienEntrega"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo"
      label="RUT"
      :rules="{
        required,
        rutValid
      }"
    />
    <AppInput
      v-if="escondeCamposInstitucion && isRegistroParte"
      id="cargoQuienEntrega"
      v-model="formData.cargoQuienEntrega"
      class="col-12 md:col-6 lg:col-4"
      :disabled="!formData.unidadPolicialOrganismo"
      label="Cargo de quien entrega"
      :rules="{
        required
      }"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { defineProps, reactive, ref, watch, defineExpose, onMounted } from 'vue'

import { useFormValidation } from '@/modules/common/composables'

import { prefecturaDependencias } from '@/data/unidadPolicialPrefecturasDependencias.json'

import { propTypes } from '@/modules/common/types/prop.types'

import { useMantenedorStore } from '@/modules/global/composables'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'

import { requestUtil } from '@/utils'

const {
  prefecturas,
  mantenedor_getPrefecturas,
  regiones,
  mantenedor_getComisariasByIdPrefecturaCodigoInstitucion,
  mantenedor_getInstitucionesDenuncia,
  comisarias,
  mantenedor_getComisarias,
  destacamentos,
  mantenedor_getDestacamentos,
  institucionesDenuncia,
  mantenedor_getRegiones,
  mantenedor_getDestacamentosByIdComisaria,
  mantenedor_getCodigoInstitucionesDenunciaById,
  comuna,
  mantenedor_getComunas,
  mantenedor_getComunasByIdRegion,
  mantenedor_getIdRegionByCodigo
} = useMantenedorStore()

const { required, email, alfabetico, rutValid } = useFormValidation()

const escondeCamposInstitucion = ref(false)
const comunasOptions = ref(null)
const comisariasOptions = ref(null)
const destacamentosOptions = ref(null)
const loader = reactive({
  comisaria: false,
  destacamento: false,
  region: false,
  comuna: false
})

const formData = reactive({
  unidadPolicialOrganismo: '',
  prefecturaDependencia: '',
  comisaria: '',
  destacamento: '',
  region: '',
  comuna: '',
  calle: '',
  numeroCalle: '',
  poblacion: '',
  telefonoContacto: '',
  correoElectronicoContacto: '',
  idOrganismoColaboradorUnidadDireccion: '',
  rutDeQuienEntrega: '',
  nombreDeQuienEntrega: '',
  cargoQuienEntrega: '',
  nombreContactoInstitucion: ''
})

defineProps({
  validationScope: propTypes.string,
  soloLectura: Boolean,
  isRegistroParte: { type: Boolean, default: false }
})

onMounted(() => {
  requestUtil({ action: mantenedor_getInstitucionesDenuncia })
  requestUtil({ action: mantenedor_getPrefecturas })
  requestUtil({ action: mantenedor_getDestacamentos })
  requestUtil({ action: mantenedor_getComisarias })
  requestUtil({ action: mantenedor_getRegiones })
  requestUtil({ action: mantenedor_getComunas })
})

// Esconde campos (prefectura, comisaria y destacamento), si no es policia/PDI
watch(
  () => formData.unidadPolicialOrganismo,
  () => {
    if (
      mantenedor_getCodigoInstitucionesDenunciaById(formData.unidadPolicialOrganismo) === '1' ||
      mantenedor_getCodigoInstitucionesDenunciaById(formData.unidadPolicialOrganismo) === '2' ||
      mantenedor_getCodigoInstitucionesDenunciaById(formData.unidadPolicialOrganismo) === '10'
    ) {
      escondeCamposInstitucion.value = true
    } else {
      escondeCamposInstitucion.value = false
    }
  }
)

// cada vez que cambia el dropdown de prefecturaDependencia autocompleta los datos de direccionContacto
watch(
  () => formData.destacamento,
  () => {
    // no filtra si está vacio
    if (!formData.destacamento) {
      // limpia los campos de dirección
      formData.region = ''
      formData.comuna = ''
      formData.calle = ''
      formData.numeroCalle = ''
      formData.poblacion = ''
      formData.telefonoContacto = ''
      formData.correoElectronicoContacto = ''
      return
    }
    // rellena los demás campos
    Object.keys(prefecturaDependencias[0].direccionContacto).forEach((key) => {
      formData[key] = prefecturaDependencias[0].direccionContacto[key]
    })
    formData.region = mantenedor_getIdRegionByCodigo('1')
    formData.comuna = comuna.value.at(1).id
  }
)

function populateData (data) {
  Object.assign(formData, data)
}

async function resetForm () {
  formData.prefecturaDependencia = ''
  formData.destacamento = ''
  formData.comisaria = ''
  formData.region = ''
  formData.comuna = ''
  formData.calle = ''
  formData.numeroCalle = ''
  formData.poblacion = ''
  formData.telefonoContacto = ''
  formData.correoElectronicoContacto = ''
  formData.rutDeQuienEntrega = ''
  formData.nombreDeQuienEntrega = ''
  formData.cargoQuienEntrega = ''
  formData.nombreContactoInstitucion = ''
}

async function getComisariaOptions (_idPrefectura) {
  comisariasOptions.value = null
  formData.destacamento = ''
  formData.comisaria = ''
  if (formData.prefecturaDependencia) {
    loader.comisaria = true
    requestUtil({
      action: mantenedor_getComisariasByIdPrefecturaCodigoInstitucion,
      payload: {
        idPrefectura: formData.prefecturaDependencia,
        codigoInstitucion: mantenedor_getCodigoInstitucionesDenunciaById(formData.unidadPolicialOrganismo)
      },
      resolve: (res) => {
        comisariasOptions.value = res
        loader.comisaria = false
      }
    })
  }
}

async function getDestacamentoOptions (_idComisaria) {
  destacamentosOptions.value = null
  formData.destacamento = ''
  if (formData.comisaria) {
    loader.destacamento = true
    requestUtil({
      action: mantenedor_getDestacamentosByIdComisaria,
      payload: {
        idComisaria: formData.comisaria
      },
      resolve: (res) => {
        loader.destacamento = false
        destacamentosOptions.value = res
      }
    })
  }
}

async function getComunaOptions () {
  comunasOptions.value = null
  if (formData.region) {
    loader.comuna = true
    requestUtil({
      action: mantenedor_getComunasByIdRegion,
      payload: { idRegion: formData.region },
      resolve: (res) => {
        comunasOptions.value = res
        loader.comuna = false
      }
    })
  }
}

defineExpose({ formData, populateData })
</script>
