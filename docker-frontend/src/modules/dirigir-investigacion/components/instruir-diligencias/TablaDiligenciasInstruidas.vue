<template>
<AppDataTable
  id="diligencias-instruidas"
  breakpoint="960px"
  class="col-12"
  responsive-layout="stack"
  v-bind="$attrs"
>
  <Column header="Fecha de Instrucción">
    <template #body="{ data }">
      {{ formatoFecha(data.fechaInstruccion) }}
    </template>
  </Column>
  <Column header="Tipo de Diligencia">
    <template #body="{ data }">
      {{ tipoDiligencia(data.tipoDiligencia) || data.tipoDiligencia }}
    </template>
  </Column>
  <Column header="Subtipo Diligencia">
    <template #body="{ data }">
      {{ subtipoDiligencia(data.subtipoDiligencia) || data.subtipoDiligencia }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data.estado }}
    </template>
  </Column>
  <Column header="Institución Ejecutora">
    <template #body="{ data }">
      {{ nombreInstitucion(data.institucionEjecutora) || data.institucionEjecutora }}
    </template>
  </Column>
  <Column header="Diligencias / Instrucción">
    <template #body="{ data }">
      {{ data.diligenciaInstruccion }}
    </template>
  </Column>
  <Column header="Plazo">
    <template #body="{ data }">
      {{ getPlazoLabel(data?.plazo) }}
    </template>
  </Column>
  <Column header="Documento">
    <template #body="{ data }">
      <Button
        v-if="data.documento"
        class="p-button-rounded p-button-outlined"
        icon="pi pi-file"
        type="button"
        @click="showDocument(data.documentoUrl)"
      />
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        :menu-options="menuDiligencia"
        :slot-props="slotProps"
        :value="diligenciaSeleccionada"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { dateTimeUtil } from '@/utils'
import { defineEmits, ref } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import AppMenuOptions from '@/modules/common/components/AppMenuOptions.vue'

const {
  mantenedor_getNombreTipoDiligencia,
  mantenedor_getNombreInstitucion,
  mantenedor_getNombreSubtipoDiligencia
} = useMantenedorStore()

const emit = defineEmits(['ver-documento', 'pedir-cuenta'])

function showDocument (docUrl) {
  emit('ver-documento', docUrl)
}

function pedirCuenta () {
  emit('pedir-cuenta', diligenciaSeleccionada.value)
}

const diligenciaSeleccionada = ref()

const menuDiligencia = ref([
  {
    label: 'Pedir Cuenta',
    command: () => pedirCuenta(),
    disabled: () => true
  }
])

function tipoDiligencia (idSubtipo) {
  if (idSubtipo) {
    return mantenedor_getNombreTipoDiligencia(idSubtipo)
  }
  return 'Sin Tipo'
}

function subtipoDiligencia (idSubSubtipo) {
  if (idSubSubtipo !== '0' && idSubSubtipo) {
    return mantenedor_getNombreSubtipoDiligencia(idSubSubtipo)
  }
  return 'Sin Subtipo'
}

function nombreInstitucion (idInstitucionEjecutora) {
  if (idInstitucionEjecutora) {
    return mantenedor_getNombreInstitucion(idInstitucionEjecutora)
  }
  return 'Sin Institución'
}

function formatoFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontendWithTime(fecha)
  }
}

function getPlazoLabel (value) {
  return typeof (value) === 'number' ? `${value} Días` : value
}
</script>
