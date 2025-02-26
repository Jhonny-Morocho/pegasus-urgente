<template>
<AppFieldset
  class="pr-0 w-12"
  legend="Identificación Especie/Dinero"
>
  <AppForm
    id="formAddDataAdicional"
    class="grid col-12"
    :form-submitted="formSubmitted"
    validation-scope="formAddDataAdicional"
  >
    <AppDropdown
      id="familia-especie"
      v-model="formData.familiaEspecie"
      class="col-12 md:col-4 lg:col-3"
      :disabled="readOnly"
      label="Familia de la Especie"
      option-label="descripcion"
      option-value="id"
      :options="familiaEspecies"
      :rules="{ required }"
      show-clear
      @change="resetTipoEspecie"
    />
    <AppDropdown
      id="tipo-especie"
      v-model="formData.idTipoEspecie"
      class="col-12 md:col-4 lg:col-3"
      :disabled="readOnly"
      label="Tipo de Especie"
      option-label="descripcion"
      option-value="id"
      :options="listaTiposEspecie"
      :rules="{ required }"
      show-clear
    />
    <AppInputNumber
      id="cantidad"
      v-model="formData.cantidad"
      class="col-12 md:col-4 lg:col-3"
      label="Cantidad"
      :min="0"
      :step="1"
      :use-grouping="false"
    />
    <AppDropdown
      id="unidad-medida"
      v-model="formData.unidadMedida"
      class="col-12 md:col-4 lg:col-3"
      :disabled="readOnly"
      label="Unidad de Medida"
      option-label="descripcion"
      option-value="descripcion"
      :options="unidadMedidaEspecie"
      show-clear
    />
    <AppInput
      id="descripcion"
      v-model="formData.descripcion"
      class="col-12 md:col-8 lg:col-4"
      label="Descripción"
      :rules="{ required }"
    />
    <AppInput
      id="imputado-asociado"
      v-model="formData.imputadoAsociado"
      class="col-12 md:col-4"
      disabled
      label="Imputado Asociado"
    />
    <AppInput
      id="delito-asociado"
      v-model="formData.delitoAsociado"
      class="col-12 md:col-4"
      disabled
      label="Delito Asociado"
    />
    <div class="col-12" />
    <div class="grid col-12 md:col-4 p-3">
      <AppFieldset
        class="w-full"
        legend="¿Especie peligrosa?"
      >
        <AppSelectButton
          id="especie-peligrosa"
          v-model="formData.esEspeciePeligrosa"
          class="col-12"
          :disabled="readOnly"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false },
          ]"
        />
        <AppDropdown
          v-if="formData.esEspeciePeligrosa"
          id="clase"
          v-model="formData.clase"
          class="col-12"
          :disabled="readOnly"
          label="Clase"
          :loading="isLoading"
          option-label="descripcion"
          option-value="id"
          :options="clasesPeligro"
          :rules="{ required }"
          show-clear
        />
        <AppInputNumber
          v-if="formData.esEspeciePeligrosa"
          id="peso-bruto"
          v-model="formData.pesoBruto"
          class="col-12"
          label="Peso Bruto"
          :step="1"
          :use-grouping="false"
        />
      </AppFieldset>
    </div>
    <div class="grid col-12 md:col-8 pr-0">
      <div class="col-12 md:col-6">
        <AppFieldset
          class="w-12"
          legend="¿Ley de drogas/Ley de lavado de dinero?"
        >
          <AppSelectButton
            id="ley-drogas"
            v-model="formData.leyDeDrogas"
            class="w-12"
            disabled
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false },
            ]"
          />
        </AppFieldset>
      </div>
      <div class="col-12 md:col-6">
        <AppFieldset
          class="w-12"
          legend="¿Especie Evidencia?"
        >
          <AppSelectButton
            id="Especie-evidencia"
            v-model="formData.especieEvidencia"
            class="w-12"
            disabled
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false },
            ]"
          />
        </AppFieldset>
      </div>
      <div class="col-12 md:col-6">
        <AppFieldset
          class="w-12"
          legend="¿Especie Digital?"
        >
          <AppSelectButton
            id="especie-digital"
            v-model="formData.esEspecieDigital"
            class="w-12"
            disabled
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false },
            ]"
          />
        </AppFieldset>
      </div>
      <div class="col-12 md:col-6">
        <AppFieldset
          class="w-12"
          legend="¿Medio para cometer el Delito?"
        >
          <AppSelectButton
            id="medio-cometer-delito"
            v-model="formData.medioParaCometerDelito"
            class="w-12"
            disabled
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false },
            ]"
          />
        </AppFieldset>
      </div>
    </div>
  </AppForm>
</AppFieldset>
<AppFieldset
  v-show="seleccionarData"
  class="pr-0 w-12 p-fluid pr-3"
  legend="Características Especie/Dinero"
>
  <CaracteristicasEspecieDineroDocumento
    v-if="esDocumento"
    ref="caracteristicasDocumentoEspecieDinero"
    :familia-especie="familiaEspecie"
  />
  <EspeciesAbarrotesIngreso
    v-if="esAbarrotes"
    ref="abarrotesEspecieDinero"
    class="col-12 mt-3"
    :seleccionar-data="seleccionarData"
  />
  <div
    class="mt-2 col-12"
  >
    <p
      class="mb-4"
      style="font-size:1.2em"
    >
      <span class="font-bold">Pronunciamiento como Evidencia:</span>
      {{ seleccionarData?.pronunciamientoFiscal ?? 'Sin pronunciamiento' }}
    </p>
    <AppTextarea
      id="observaciones-pronunciamiento-evidencia"
      v-model="formData.observacionPronunciamiento"
      :auto-resize="true"
      class="col-12 p-0 pt-2"
      cols="100"
      label="Observaciones"
      rows="3"
    />
  </div>
</AppFieldset>
<div class="flex justify-content-center text-center w-full mt-3">
  <Button
    id="ingresar-datos"
    class="btn-form px-3 mb-6"
    :disabled="rue"
    icon="pi pi-save"
    icon-pos="right"
    label="Ingresar Datos"
    style="width: auto"
    type="button"
    @click="ingresarDatos"
  />
</div>
</template>
<script setup>
import {
  defineEmits,
  defineExpose,
  defineProps,
  watch,
  onMounted,
  reactive,
  ref,
  computed
} from 'vue'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import { propTypes } from '@/modules/common/types'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import CaracteristicasEspecieDineroDocumento from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/CaracteristicasEspecieDineroDocumento.vue'
import EspeciesAbarrotesIngreso from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/EspeciesAbarrotesIngreso.vue'
// VALUES

const caracteristicasDocumentoEspecieDinero = ref()
const abarrotesEspecieDinero = ref()

const formData = reactive(getFormDataInitial())
const { resetFormData, required, formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'formAddDataAdicional'
})

const {
  mantenedor_getTiposEspecies,
  mantenedor_getTipoDinero,
  mantenedor_getUnidadMedidaEspecie,
  familiaEspecies,
  mantenedor_getDenominacionDinero,
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getAllTiposEspecie,
  allTiposEspecie,
  clasesPeligro,
  mantenedor_getClasePeligroEspecie,
  unidadMedidaEspecie,
  mantenedor_getDescripcionClasesPeligroEspeciesById,
  mantenedor_getCodigoFamiliaEspecieById
} = useMantenedorStore()
// LOGIC
onMounted(() => {
  getDataMantenedor()
})

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getDenominacionDinero })
  requestUtil({ action: mantenedor_getTipoDinero })
  requestUtil({ action: mantenedor_getNombreFamiliaEspecie })
  requestUtil({ action: mantenedor_getDescripcionClasesPeligroEspeciesById })
  requestUtil({ action: mantenedor_getUnidadMedidaEspecie })
  requestUtil({ action: mantenedor_getAllTiposEspecie })
}

const props = defineProps({
  readOnly: Boolean,
  esDinero: Boolean,
  seleccionarData: propTypes.object
})

const esDocumento = ref(false)
const esAbarrotes = ref(false)

function rellenarForm () {
  const {
    esDigital,
    esPeligrosa,
    unidadMedidaCuantitativa,
    descripcion,
    cantidadEspecie,
    idTipoEspecie,
    esLeyDrogas,
    idClasePeligro,
    indicadorMedioUsadoCometerDelito,
    indicadorEvidencia,
    familiaEspecie,
    esDocumentoValor
  } = props.seleccionarData
  formData.familiaEspecie = familiaEspecie
  formData.idTipoEspecie = idTipoEspecie
  formData.cantidad = cantidadEspecie
  formData.unidadMedida = unidadMedidaCuantitativa
  formData.descripcion = descripcion
  formData.esEspeciePeligrosa = esPeligrosa
  formData.esEspecieDigital = !!esDigital
  formData.leyDeDrogas = esLeyDrogas
  formData.clase = idClasePeligro
  formData.medioParaCometerDelito = !!indicadorMedioUsadoCometerDelito
  formData.especieEvidencia = !!indicadorEvidencia
  esDocumento.value = !!esDocumentoValor
  esAbarrotes.value = mantenedor_getCodigoFamiliaEspecieById(familiaEspecie) === '1'
}
rellenarForm()

watch(
  () => props.seleccionarData,
  () => {
    rellenarForm()
  }
)

watch(
  () => formData.familiaEspecie,
  () => {
    requestUtil({
      action: mantenedor_getTiposEspecies,
      payload: { id: formData.familiaEspecie }
    })
  }
)

const listaTiposEspecie = computed(() => {
  return allTiposEspecie.value.filter((t) => t.idPadre === formData.familiaEspecie)
})

const isLoading = ref(false)

watch(
  () => formData.esEspeciePeligrosa,
  () => {
    formData.clase = null
    if (formData.esEspeciePeligrosa === true) {
      requestUtil({
        action: mantenedor_getClasePeligroEspecie,
        loader: (value) => {
          isLoading.value = value
        }
      })
    }
  }
)

function getFormDataInitial () {
  return {
    familiaEspecie: '',
    idTipoEspecie: '',
    cantidad: null,
    unidadMedida: '',
    descripcion: '',
    imputadoAsociado: '',
    delitoAsociado: '',
    esEspeciePeligrosa: false,
    clase: '',
    pesoBruto: null,
    especieEvidencia: '',
    leyDeDrogas: '',
    esEspecieDigital: false,
    medioParaCometerDelito: false,
    observacionPronunciamiento: ''
  }
}

const emit = defineEmits(['ingresar-datos'])

const { toastError } = useAppToast()

function ingresarDatos () {
  if (!isFormValid()) {
    toastError('Los campos no son correctos')
    return
  }
  emit('ingresar-datos', formData)
}

defineExpose({ formData, resetFormData })
</script>
