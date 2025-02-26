<template>
<section>
  <div class="p-fluid">
    <AppFieldset legend="Fiscalía Local">
      <AppDropdown
        id="tipo-fiscalia"
        v-model="formData.tipoFiscalia"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Tipo Fiscalía"
        option-label="descripcion"
        option-value="id"
        :options="tiposFiscalia"
        show-clear
      />
      <AppDropdown
        id="region"
        v-model="formData.region"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Región"
        option-label="descripcion"
        option-value="id"
        :options="regiones"
        show-clear
        @change="cambiarNombresPorFiscalia(formData.region)"
      />
      <AppDropdown
        id="nombre-fiscalia"
        v-model="formData.nombreFiscalia"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Nombre Fiscalía"
        option-label="descripcion"
        option-value="id"
        :options="nombresFiscalia"
        show-clear
        @change="rellenarCamposPorFiscalia(formData.nombreFiscalia)"
      />
      <AppInput
        id="numero-fiscalia"
        v-model="formData.numeroFiscalia"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Número Fiscalía"
      />
      <AppInput
        id="nombre-fiscal-turno"
        v-model="formData.nombreFiscalTurno"
        class="col-12 md:col-6 lg:col-3"
        disabled
        label="Nombre Fiscal Turno"
      />
      <AppDropdown
        id="comuna"
        v-model="formData.comuna"
        class="col-12 md:col-6 lg:col-3"
        disabled
        label="Comuna"
        option-label="nombre"
        option-value="nombre"
        :options="[{ nombre: 'COMUNA' }]"
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
        max-length="6"
        :rules="{
          numeric
        }"
      />
      <AppInputMask
        id="telefono-contacto"
        v-model="formData.telefonoContacto"
        class="col-12 md:col-6 lg:col-3"
        disabled
        label="Teléfono Contacto"
        mask="99999999999"
      />
      <AppInput
        id="correo-electronico"
        v-model="formData.correoElectronicoContacto"
        class="col-12 md:col-6 lg:col-3"
        disabled
        label="Correo Electrónico Contacto"
      />
    </AppFieldset>
  </div>
</section>
</template>
<script setup>
import { defineExpose, reactive, ref, defineProps } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { useSessionStore } from '@/modules/session/composables'
import { requestUtil } from '@/utils'
import { useFormValidation } from '@/modules/common/composables'
const { numeric } = useFormValidation()
const { user } = useSessionStore()

const { mantenedor_getFiscaliaBycodigoTipoYRegion, mantenedor_getCodigoTiposFiscaliaById, mantenedor_getCodigoRegionById, tiposFiscalia, nombresFiscalia, regiones } = useMantenedorStore()

defineProps({
  soloLectura: Boolean
})

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
}
defineExpose({ formData, populateData })

const nombresFiscaliaList = ref([])
function cambiarNombresPorFiscalia () {
  nombresFiscaliaList.value = [{ descripcion: `Fiscalía de la Región ${formData.region}` }]
  const tipo = mantenedor_getCodigoTiposFiscaliaById(formData.tipoFiscalia)
  const region = mantenedor_getCodigoRegionById(formData.region)
  const payload = {
    tipoFiscalia: tipo,
    regionFiscalia: region
  }
  requestUtil({
    action: mantenedor_getFiscaliaBycodigoTipoYRegion,
    payload: payload
  })
}

function rellenarCamposPorFiscalia (data) {
  if (data) {
    formData.numeroFiscalia = '901'
    formData.nombreFiscalTurno = user.value.preferred_username
    formData.comuna = 'COMUNA'
    formData.calle = 'Catedral'
    formData.numero = '1421'
    formData.telefonoContacto = 6003330000000
    formData.correoElectronicoContacto = user.value.email
  }
}
</script>
