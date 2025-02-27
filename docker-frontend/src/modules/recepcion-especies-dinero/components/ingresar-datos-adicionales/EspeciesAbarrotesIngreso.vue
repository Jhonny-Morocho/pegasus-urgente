<template>
<AppInput
  id="id-marca"
  v-model="formData.marca"
  class="col-4"
  label="Marca"
/>
<AppInput
  id="id-modelo"
  v-model="formData.modelo"
  class="col-4"
  label="Modelo"
/>
<AppInput
  id="id-numero-serie"
  v-model="formData.numeroDeSerie"
  class="col-4"
  label="Número de Serie"
/>
<AppInput
  id="id-imei"
  v-model="formData.imei"
  class="col-4"
  label="IMEI"
/>
<AppInput
  id="id-color"
  v-model="formData.color"
  class="col-4"
  label="Color"
/>
</template>

<script setup>
import { defineProps, watch, reactive, defineExpose } from 'vue'
import { propTypes } from '@/modules/common/types'

const formData = reactive(getFormDataInitial())
const props = defineProps({
  readOnly: Boolean,
  seleccionarData: propTypes.object
})
watch(
  () => props.seleccionarData,
  () => {
    const {
      esDigital, especiePeligrosa
      , idUnidadMedidaCuantitativa, descripcion, cantidad, tipo, especiePeligrosaClase, indicadorMedioUsadoCometerDelito, indicadorEvidencia, idFamilia
    } = props.seleccionarData
    formData.familiaEspecie = idFamilia
    formData.idTipoEspecie = tipo
    formData.cantidad = cantidad
    formData.unidadMedida = idUnidadMedidaCuantitativa
    formData.descripcion = descripcion
    formData.esEspeciePeligrosa = especiePeligrosa
    formData.esEspecieDigital = esDigital
    formData.clase = especiePeligrosaClase
    formData.medioParaCometerDelito = indicadorMedioUsadoCometerDelito
    formData.especieEvidencia = indicadorEvidencia
  }
)
function getFormDataInitial () {
  return {
    marca: '',
    modelo: '',
    numeroDeSerie: '',
    imei: '',
    color: ''
  }
}
defineExpose({ formData })

</script>
