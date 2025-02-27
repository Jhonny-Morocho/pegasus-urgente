<template>
<div class="w-full">
  <AppDataTable
    id="tabla-causas-relacionadas-guardadas"
    v-bind="$attrs"
    class=""
    responsive-layout="scroll"
    :value="causasRelacionadasGuardadas"
  >
    <Column
      header="RUC"
    >
      <template #body="{ data }">
        <p class="w-max">
          {{ data?.ruc || '--' }}
        </p>
      </template>
    </Column>
    <Column header="Victima">
      <template #body="{ data }">
        {{ getNombreCompletoInterviniente(getIntervinienteByTipo(data?.intervinientes, 'VICTIMA')) }}
      </template>
    </Column>
    <Column header="Imputado">
      <template #body="{ data }">
        {{ getNombreCompletoInterviniente(getIntervinienteByTipo(data?.intervinientes, 'IMPUTADO')) }}
      </template>
    </Column>
    <Column header="Estado">
      <template #body="{ data }">
        {{ data?.estado }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{ data }">
        {{ data?.detalleDelitos ? data?.detalleDelitos[0]?.nombreDelito : '--' }}
      </template>
    </Column>
    <Column header="Fecha Delito">
      <template #body="{ data }">
        {{ formatDate(data?.fecha) }}
      </template>
    </Column>
    <Column header="Alerta">
      <template #body="{ data }">
        <span
          v-for="(alerta, idx) in data?.alertas"
          :key="idx"
          v-tooltip="alerta?.descripcion"
          class="mr-2 icon-alert"
        >
          {{ alerta?.nombre }}
        </span>
      </template>
    </Column>
    <Column
      v-if="!readOnly"
      header="Acciones"
    >
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined p-button-danger"
          :disabled="esCausaPrincipal(data)"
          icon="pi pi-trash"
          @click="eliminarCausaRelacionadaGuardada(data)"
        />
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils/dateTime.util.js'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

const emit = defineEmits(['causa-relacionada:eliminarCausaRelacionada'])

const {
  causa
} = useDirigirInvestigacionStore()
const idCausa = computed(() => {
  return causa?.value?.data?.causa?.idCausa
})

defineProps({
  causasRelacionadasGuardadas: propTypes.array,
  readOnly: Boolean
})

function esCausaPrincipal (_data) {
  return idCausa.value === _data?.causaId
}

function eliminarCausaRelacionadaGuardada (causa) {
  emit('causa-relacionada:eliminarCausaRelacionada', causa)
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}

function getIntervinienteByTipo (intervinientes, tipo) {
  const interviniente = intervinientes.find((el) => {
    if (el?.esVictima && el?.descripcionTipo === 'DENUNCIANTE') {
      return el
    } else {
      return el?.descripcionTipo === tipo
    }
  })

  return interviniente
}

function getNombreCompletoInterviniente (interviniente) {
  let nombreCompleto = '--'
  if (interviniente?.nombres) {
    nombreCompleto = interviniente.nombres + ' '
  }
  if (interviniente?.apellidoPaterno) {
    nombreCompleto += interviniente.apellidoPaterno + ' '
  }
  if (interviniente?.apellidoMaterno) {
    nombreCompleto += interviniente.apellidoMaterno
  }
  return nombreCompleto
}
</script>
