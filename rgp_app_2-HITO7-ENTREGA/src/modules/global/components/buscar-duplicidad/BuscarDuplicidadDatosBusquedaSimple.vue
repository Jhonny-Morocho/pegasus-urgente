<template>
<div class="grid">
  <AppInput
    id="nombre-victima"
    v-model="formData.nombreVictima"
    class="col-12 md:col-6 lg:col-4"
    label="Nombre Víctima"
    :rules="{
      alfabetico
    }"
  />
  <AppInput
    id="nombre-imputado"
    v-model="formData.nombreImputado"
    class="col-12 md:col-6 lg:col-4"
    label="Nombre Imputado"
    :rules="{
      alfabetico
    }"
  />
  <AppCalendar
    id="fecha-delito"
    v-model="formData.fechaDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Fecha Delito"
    :max-date="fechaDenuncia"
  />
  <AppDropdown
    id="familia-delito"
    v-model="formData.familiaDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Familia del Delito"
    option-label="descripcion"
    option-value="id"
    :options="familiasDelito"
    show-clear
  />
  <AppDropdown
    id="delito"
    v-model="formData.delito"
    class="col-12 md:col-6 lg:col-4"
    :disabled="!formData.familiaDelito || !formData?.familiaDelito?.length"
    label="Tipo de Delito"
    option-label="descripcion"
    option-value="id"
    :options="tipoDelitoOptions"
    :rules="formData.familiaDelito ? {required} : null"
    show-clear
  />
</div>
</template>

<script setup>
import { reactive, defineExpose, computed, watch } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { requestUtil } from '@/utils'
const { alfabetico, required } = useFormValidation()

const { familiasDelito, tiposDelito, mantenedor_getTiposDelito, mantenedor_getFamiliasDelito } = useMantenedorStore()

const formData = reactive(initialData())

function getTiposFamiliasDelito () {
  requestUtil({
    action: mantenedor_getFamiliasDelito
  })
}
getTiposFamiliasDelito()

function getTipoDelitoByFamilia () {
  requestUtil({
    action: mantenedor_getTiposDelito,
    payload: {
      idFamiliaDelito: formData?.familiaDelito
    }
  })
}

watch(() => formData.familiaDelito, () => { if (!formData.familiaDelito) formData.familiaDelito = '' })
watch(() => formData.delito, () => { if (!formData.delito) formData.delito = '' })

watch(
  () => formData.familiaDelito,
  () => {
    formData.delito = null
    getTipoDelitoByFamilia()
  }
)

const tipoDelitoOptions = computed(() => {
  const tipoDelitos = tiposDelito.value?.filter(
    (td) => td.idPadre === formData.familiaDelito
  )
  return tipoDelitos?.length
    ? tipoDelitos
    : [{ descripcion: 'Sin Tipo Delito', id: 'sin-tipo' }]
})

// eslint-disable-next-line no-unused-vars
const { identificacionDenuncia } = useIdentificacionDenunciaStore()

function initialData () {
  return {
    nombreVictima: '',
    nombreImputado: '',
    familiaDelito: '',
    delito: '',
    fechaDelito: ''
  }
}

function resetForm () {
  Object.assign(formData, initialData())
}

/** Validar que la fecha del delito no pueda ser mayor a la fecha de la denuncia */
const fechaDenuncia = new Date()

defineExpose({ formData, resetForm })
</script>
