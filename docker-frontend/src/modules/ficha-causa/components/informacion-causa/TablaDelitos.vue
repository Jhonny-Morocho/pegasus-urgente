<template>
<AppDataTable
  v-bind="$attrs"
  id="tabla-delitos"
  class="w-full"
>
  <Column header="Familia Delito">
    <template #body="{ data: { delito } }">
      {{ delito?.familiaDelito || familiaDelito(delito?.idFamiliaDelito) }}
    </template>
  </Column>
  <Column header="Tipo Delito">
    <template #body="{ data: { delito } }">
      {{ delito?.tipoDelito || tipoDelito(delito?.idTipoDelito) }}
    </template>
  </Column>
  <Column header="¿Es VIF?">
    <template #body="{ data }">
      {{ data?.vif ? 'Si' : 'No' }}
    </template>
  </Column>
  <Column header="Dirección del Delito">
    <template

      #body="{ data: { direccionDelito } }"
    >
      <span v-if="direccionDelito">
        {{ `${direccionDelito?.calle} ${direccionDelito?.numero}`.trim() }}
      </span>
      <span v-else>
        Sin Información
      </span>
    </template>
  </Column>
  <Column header="Comuna">
    <template #body="{ data: { direccionDelito } }">
      <span v-if="direccionDelito">
        {{ comunaRegion(direccionDelito) }}
      </span>
      <span v-else>
        Sin Información
      </span>
    </template>
  </Column>
  <Column header="Fecha Delito">
    <template #body="{ data }">
      <span
        v-if="data.fechaHoraRango"
        v-tooltip="tooltipRangoFecha(data)"
      > {{ fechaDelito(data.fechaHoraDelitoInicio) }} (*) </span>
      <span v-else>
        {{ fechaDelito(data.fechaOcurrencia) }}
      </span>
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        v-model="selected"
        :menu-options="menuOptions"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { dateTimeUtil } from '@/utils'

const emit = defineEmits(['ver-delito', 'ver-ubicacion'])

const { mantenedor_getNombreFamiliaDelito, mantenedor_getNombreTipoDelito, mantenedor_getDescripcionRegionById, mantenedor_getDescripcionComunasById } = useMantenedorStore()

const selected = ref()

function familiaDelito (idFamiliaDelito) {
  return mantenedor_getNombreFamiliaDelito(idFamiliaDelito)
}

function tipoDelito (idTipoDelito) {
  return mantenedor_getNombreTipoDelito(idTipoDelito)
}

function comunaRegion (direccion) {
  const comuna = mantenedor_getDescripcionComunasById(direccion?.comuna)
  const region = mantenedor_getDescripcionRegionById(direccion?.region)

  return `${comuna}, ${region}`.trim()
}

function fechaDelito (fecha) {
  return dateTimeUtil.formatToFrontendWithTime(fecha)
}

function tooltipRangoFecha (data) {
  return `Inicio: ${fechaDelito(data.fechaHoraDelitoInicio)}
    Fin: ${fechaDelito(data.fechaHoraDelitoFin)}`
}

const menuOptions = ref([
  {
    label: 'Ver Delito',
    command: () => emit('ver-delito', selected.value)
  },
  {
    label: 'Ver Ubicación',
    command: () => emit('ver-ubicacion', selected.value)
  }
])
</script>
