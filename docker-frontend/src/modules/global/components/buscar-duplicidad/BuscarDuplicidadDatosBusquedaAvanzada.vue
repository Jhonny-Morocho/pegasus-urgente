<template>
<div>
  <AppFieldset
    class="pb-0"
    :collapsed="true"
    legend="Búsqueda Avanzada"
    :toggleable="true"
  >
    <!-- Documento Denunciante -->
    <AppDropdown
      id="tipoDocumentoDenunciante"
      v-model="formData.tipoDocumentoDenunciante"
      class="col-12 md:col-6 lg:col-3"
      label="Tipo Documento Denunciante"
      option-label="descripcion"
      option-value="id"
      :options="tiposDocumento"
      show-clear
      @change="resetNumeroDocumento('D')"
    />
    <RutInput
      v-if="
        mantenedor_getCodigoTipoDocumentoIdentidad(
          formData.tipoDocumentoDenunciante
        ) === '1'
      "
      id="numero-documento-denunciante"
      v-model="formData.numeroDocumentoDenunciante"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.tipoDocumentoDenunciante"
      label="N° Documento Denunciante"
    />
    <AppInput
      v-else
      id="numero-documento-denunciante"
      v-model="formData.numeroDocumentoDenunciante"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.tipoDocumentoDenunciante"
      label="N° Documento Denunciante"
    />
    <AppInput
      id="nombre-denunciante"
      v-model="formData.nombreDenunciante"
      class="col-12 md:col-6 lg:col-3"
      label="Nombre Denunciante"
      :rules="{ alfabetico }"
    />
    <div class="col-0 lg:col-3" />

    <!-- Documento Victima -->
    <AppDropdown
      id="tipoDocumentoVictima"
      v-model="formData.tipoDocumentoVictima"
      class="col-12 md:col-6 lg:col-3"
      label="Tipo Documento Víctima"
      option-label="descripcion"
      option-value="id"
      :options="tiposDocumento"
      show-clear
      @change="resetNumeroDocumento('V')"
    />
    <RutInput
      v-if="
        mantenedor_getCodigoTipoDocumentoIdentidad(
          formData.tipoDocumentoVictima
        ) === '1'
      "
      id="numero-documento-victima"
      v-model="formData.numeroDocumentoVictima"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.tipoDocumentoVictima"
      label="N° Documento Víctima"
    />
    <AppInput
      v-else
      id="numero-documento-victima"
      v-model="formData.numeroDocumentoVictima"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.tipoDocumentoVictima"
      label="N° Documento Víctima"
    />

    <!-- Documento Imputado -->
    <AppDropdown
      id="tipoDocumentoImputado"
      v-model="formData.tipoDocumentoImputado"
      class="col-12 md:col-6 lg:col-3"
      label="Tipo Documento Imputado"
      option-label="descripcion"
      option-value="id"
      :options="tiposDocumento"
      show-clear
      @change="resetNumeroDocumento('I')"
    />
    <RutInput
      v-if="
        mantenedor_getCodigoTipoDocumentoIdentidad(
          formData.tipoDocumentoImputado
        ) === '1'
      "
      id="numero-documento-imputado"
      v-model="formData.numeroDocumentoImputado"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.tipoDocumentoImputado"
      label="N° Documento Imputado"
    />
    <AppInput
      v-else
      id="numero-documento-imputado"
      v-model="formData.numeroDocumentoImputado"
      class="col-12 md:col-6 lg:col-3"
      :disabled="!formData.tipoDocumentoImputado"
      label="N° Documento Imputado"
    />

    <!-- Fechas -->
    <AppCalendar
      id="fecha-denuncia-desde"
      v-model="formData.fechaHoraDenunciaDesde"
      class="col-12 md:col-6 lg:col-3"
      label="Fecha Desde"
      @clear-click="resetFecha('desde')"
    />
    <AppCalendar
      id="fecha-denuncia-hasta"
      v-model="formData.fechaHoraDenunciaHasta"
      class="col-12 md:col-6 lg:col-3"
      label="Fecha Hasta"
      @clear-click="resetFecha('hasta')"
    />

    <!-- Denuncia -->
    <AppInput
      id="numero-denuncia"
      v-model="formData.numeroDenuncia"
      class="col-12 md:col-6 lg:col-3"
      label="N° de Denuncia"
    />
    <AppDropdown
      id="unidad-policial"
      v-model="formData.unidadPolicial"
      class="col-12 md:col-6 lg:col-3"
      label="Unidad Policial"
      option-label="descripcion"
      option-value="id"
      :options="unidadPolicial"
      :retrieve-data-action="mantenedor_getUnidadPolicial"
      show-clear
    />
    <div class="col-12 md:col-6">
      <AppInputDireccion
        ref="refDireccion"
        @set-place="setPlace"
      />
    </div>
    <AppInput
      id="palabras-clave"
      v-model="formData.palabrasClave"
      class="col-12 lg:col-6"
      label="Palabras Clave del Relato del Hecho"
    />
  </AppFieldset>
</div>
</template>
<script setup>
import RutInput from '@/modules/common/components/inputs/RutInput.vue'
import AppInputDireccion from '@/modules/common/components/inputs/AppInputDireccion.vue'
import { reactive, defineExpose, ref, onMounted, watch } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables/'

const { alfabetico } = useFormValidation()

const {
  mantenedor_getTiposDocumento,
  tiposDocumento, mantenedor_getUnidadPolicial, unidadPolicial,
  mantenedor_getCodigoTipoDocumentoIdentidad
} = useMantenedorStore()

onMounted(() => {
  mantenedor_getTiposDocumento()
})

function initialData () {
  return {
    tipoDocumentoDenunciante: '',
    numeroDocumentoDenunciante: '',
    nombreDenunciante: '',
    tipoDocumentoVictima: '',
    numeroDocumentoVictima: '',
    tipoDocumentoImputado: '',
    numeroDocumentoImputado: '',
    fechaHoraDenunciaDesde: '',
    fechaHoraDenunciaHasta: '',
    numeroDenuncia: '',
    unidadPolicial: '',
    lugarDelito: '',
    palabrasClave: '',
    region: '',
    comuna: '',
    calle: '',
    numero: '',
    latitud: '',
    longitud: ''
  }
}

const formData = reactive(initialData())

const refDireccion = ref('')

function resetForm () {
  Object.assign(formData, initialData())
  refDireccion.value.resetModel()
}

const setPlace = (values) => {
  console.log(values)
  formData.region = values.region
  formData.comuna = values.comuna
  formData.calle = values.calle
  formData.numero = values.numero
  formData.latitud = values.lat
  formData.longitud = values.lng
  direccionGoogle.value = values.string
}

const resetNumeroDocumento = (sujeto) => {
  switch (sujeto) {
    case 'D':
      formData.numeroDocumentoDenunciante = ''
      if (!formData.tipoDocumentoDenunciante) formData.tipoDocumentoDenunciante = ''
      break
    case 'V':
      formData.numeroDocumentoVictima = ''
      if (!formData.tipoDocumentoVictima) formData.tipoDocumentoVictima = ''
      break
    case 'I':
      formData.numeroDocumentoImputado = ''
      if (!formData.tipoDocumentoImputado) formData.tipoDocumentoImputado = ''
      break
    default:
      break
  }
}
const resetFecha = (tipo) => {
  switch (tipo) {
    case 'desde':
      if (!formData.fechaHoraDenunciaDesde) formData.fechaHoraDenunciaDesde = ''
      break
    case 'hasta':
      if (!formData.fechaHoraDenunciaHasta) formData.fechaHoraDenunciaHasta = ''
      break
    default:
      break
  }
}

watch(() => formData.unidadPolicial, () => { if (!formData.unidadPolicial) formData.unidadPolicial = '' })

const direccionGoogle = ref('')

defineExpose({ formData, resetForm, direccionGoogle })
</script>
