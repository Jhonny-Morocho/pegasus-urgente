<template>
<section class="grid col-12">
  <template v-if="!isSugerida">
    <AppDropdown
      id="tipo-diligencia"
      v-model="formData.tipoDiligencia"
      class="col-4"
      label="Tipo Diligencia"
      option-label="descripcion"
      :options="tiposDiligenciaOptions"
      :payload="payloadTipoDiligencia"
      :retrieve-data-action="mantenedor_getActividadHijo"
      :rules="{ required }"
      show-clear
      @change="setAmbitoTipoDiligencia"
    />
    <AppDropdown
      v-if="formData.tipoDiligencia?.isParent"
      id="subtipo-diligencia"
      v-model="formData.subtipoDiligencia"
      class="col-4"
      label="Subtipo Diligencia"
      option-label="descripcion"
      :options="subtiposDiligenciaOptions"
      :payload="payloadSubtipoDiligencia"
      :retrieve-data-action="mantenedor_getActividadHijo"
      :rules="{ required }"
      show-clear
      @change="setAmbitoSubtipoDiligencia"
    />
  </template>
  <AppInput
    v-if="atributos.hasQuienRetira"
    id="quien-retira-cadaver"
    v-model="formData.quienRetiraCadaver"
    class="col-4"
    label="Quien retira"
    :rules="{ required }"
  />
  <AppInput
    v-if="atributos.hasLugarHallazgo"
    id="lugar-hallazgo-cadaver"
    v-model="formData.lugarHallazgoCadaver"
    class="col-4"
    label="Lugar de Hallazgo"
    :rules="{ required }"
  />
  <AppDropdown
    v-if="atributos.hasTipoPericia"
    id="tipo-pericia"
    v-model="formData.idInformePericial"
    class="col-4"
    label="Tipo de Pericia"
    option-label="descripcion"
    option-value="id"
    :options="tiposPericia"
    :retrieve-data-action="mantenedor_getTiposPericia"
    :rules="{ required }"
  />
  <AppDropdown
    v-if="atributos.hasTipoAutopsia"
    id="tipo-autopsia"
    v-model="formData.idTipoElementoAutopsia"
    class="col-4"
    label="Tipo de Autopsia"
    option-label="descripcion"
    option-value="id"
    :options="tiposAutopsia"
    :retrieve-data-action="mantenedor_getTiposAutopsia"
    :rules="{ required }"
  />
  <AppCalendar
    v-if="atributos.hasFechaHoraExamen"
    id="fecha-examen"
    v-model="formData.fechaHoraExamen"
    class="col-4"
    label="Fecha y Hora"
    show-time
  />
  <AppDropdown
    v-if="atributos.hasTipoExamen"
    id="tipo-examen"
    v-model="formData.idTipoExamen"
    class="col-4"
    label="Tipo Exámen"
    option-label="descripcion"
    option-value="id"
    :options="tiposExamenMedico"
    :payload="{}"
    :retrieve-data-action="mantenedor_getTiposExamenMedico"
    :rules="{ required }"
  />
  <AppDropdown
    v-if="atributos.hasTipoPrueba"
    id="tipo-prueba"
    v-model="formData.idTipoPrueba"
    class="col-4"
    label="Tipo Prueba"
    option-label="descripcion"
    option-value="id"
    :options="tiposPruebaMedica"
    :retrieve-data-action="mantenedor_getTiposPruebaMedica"
    :rules="{ required }"
  />
  <AppDropdown
    id="justificacion-diligencia"
    v-model="formData.idJustificacion"
    class="col-4"
    label="Justificacion de la Diligencia"
    option-label="descripcion"
    option-value="id"
    :options="justificaciones"
    :retrieve-data-action="mantenedor_getJustificaciones"
    :rules="{ required }"
  />
  <AppInput
    id="observacion-diligencia"
    v-model="formData.observacion"
    :class="observacionClass"
    label="Observación de la Diligencia"
  />
  <AppDropdown
    id="ambito-diligencia"
    v-model="formData.codigoAtributo"
    class="col-4"
    disabled
    label="Ámbito"
    :loading="isLoading.ambito"
    option-label="descripcion"
    option-value="codigo"
    :options="ambitoOptions"
  />
</section>
</template>
<script setup>
import { defineProps, defineEmits, computed, reactive, inject, onMounted } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { useInstruirDiligencia, useMantenedorStore } from '../../composables'

const dialogRefParent = inject('dialogRef')

// ESTO ES LO QUE VIENE DEL INJECT DEL MODALINSTRUIRDILIGENCIAS (DYNAMICDIALOG)
const parentRef = reactive({
  idSubtipoActividad: dialogRefParent.value?.data?.idSubtipoActividad,
  idSubSubtipoActividad: dialogRefParent.value?.data?.idSubSubtipoActividad
})

const props = defineProps({
  isSugerida: Boolean,
  idProceso: propTypes.string
})

const {
  tipoActividadByCodigo,
  actividadesSubtipo: tiposDiligenciaOptions,
  actividadesSubSubtipo: subtiposDiligenciaOptions,
  justificaciones,
  tiposAutopsia,
  tiposExamenMedico,
  tiposPruebaMedica,
  tiposPericia,
  mantenedor_getActividadHijo,
  mantenedor_getJustificaciones,
  mantenedor_getTiposAutopsia,
  mantenedor_getTiposExamenMedico,
  mantenedor_getTiposPruebaMedica,
  mantenedor_getTiposPericia
} = useMantenedorStore()

const {
  formData,
  atributos,
  resetAtributosAmbito,
  resetAtributosList,
  setAmbitoDiligencia
} = useInstruirDiligencia()

const emit = defineEmits(['update:modelValue', 'getDataTablaAmbito'])

const { required } = useFormValidation()

const idActividad = computed(() => tipoActividadByCodigo.value?.id)

const observacionClass = computed(() => {
  if (props.isSugerida) {
    return 'col-8'
  }

  if (props.isSugerida && atributos.hasLugarHallazgo) {
    return 'col-12'
  }

  if (props.isSugerida && atributos.hasTipoAutopsia) {
    return 'col-4'
  }

  if (atributos.hasLugarHallazgo) {
    return 'col-4'
  }

  if (atributos.hasTipoAutopsia) {
    return 'col-8'
  }

  return 'col-12'
})

const payloadTipoDiligencia = computed(() => {
  return {
    idCausaProceso: props?.idProceso,
    idActividad: idActividad.value
  }
})

const payloadSubtipoDiligencia = computed(() => {
  return {
    idCausaProceso: props?.idProceso,
    idActividad: formData.tipoDiligencia?.id,
    subsubtipo: true
  }
})

const isLoading = reactive({
  ambito: false
})

function setAmbitoTipoDiligencia () {
  formData.subtipoDiligencia = null
  resetAtributosAmbito()
  resetAtributosList()

  if (!formData.tipoDiligencia) return

  if (!formData.tipoDiligencia?.isParent) {
    setAmbitos(formData.tipoDiligencia?.id)
  }
}

function setAmbitoSubtipoDiligencia () {
  resetAtributosAmbito()
  resetAtributosList()

  setAmbitos(formData.subtipoDiligencia?.id)
}

function setAmbitos (idActividad) {
  setAmbitoDiligencia({
    idActividad: idActividad,
    loader: (l) => { isLoading.ambito = l },
    resolve: () => {
      emit('getDataTablaAmbito')
    }
  })
}

const ambitoOptions = [
  { codigo: '5', descripcion: 'Relación' },
  { codigo: '14', descripcion: 'Sujetos' },
  { codigo: '15', descripcion: 'Causa' },
  { codigo: '0', descripcion: 'Interna' }
]

onMounted(() => {
  if (props.isSugerida) {
    formData.tipoDiligencia = {
      id: parentRef.idSubtipoActividad
    }

    if (!parentRef.idSubSubtipoActividad) {
      setAmbitoTipoDiligencia()
      return
    }

    formData.subtipoDiligencia = {
      id: parentRef.idSubSubtipoActividad
    }

    setAmbitoSubtipoDiligencia()
  }
})
</script>
