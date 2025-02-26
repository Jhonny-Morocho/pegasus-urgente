<template>
<div class="col-12">
  <AppDataTable
    id="tabla-delitos"
    class="col-12"
    :loading="isLoadingTable"
    :value="dataDelitos"
    v-bind="{ ...$attrs }"
  >
    <Column header="Familia Delito">
      <template #body="{ data }">
        {{ !!data.delito.familiaDelito ? data.delito.familiaDelito : getNombreFamiliaDelitoById(data.delito.idFamiliaDelito, data.delito.idTipoDelito) }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{ data }">
        {{ !!data.delito.tipoDelito ? data.delito.tipoDelito : getNombreTipoDelitoById(data.delito.idTipoDelito) }}
      </template>
    </Column>
    <Column header="¿Es VIF?">
      <template #body="{ data }">
        {{ data.vif ? 'Si' : 'No' }}
      </template>
    </Column>
    <Column header="Dirección Delito">
      <template #body="{ data }">
        {{ direccionCompleta(data.direccionDelito) ?? 'Sin Dirección' }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ mantenedor_getDescripcionComunasById(data.direccionDelito?.comuna) }}
      </template>
    </Column>
    <Column header="Fecha Delito">
      <template #body="{ data }">
        <span
          v-if="data.fechaHoraRango"
          v-tooltip="tooltipRango(data)"
        > {{ fechaDelito(data.fechaHoraDelitoInicio) }} (*) </span>
        <span v-else>
          {{ fechaDelito(data.fechaOcurrencia) }}
        </span>
      </template>
    </Column>
    <Column
      v-if="!readOnly"
      class="text-center"
      header="Acciones"
      style="width: 0"
    >
      <template #body="{ data }">
        <Button
          aria-controls="overlay_menu"
          aria-haspopup="true"
          class="p-button-rounded p-button-outlined"
          icon="pi pi-ellipsis-v"
          type="button"
          @click="toggleAcciones($event, data)"
        />
      </template>
    </Column>
  </AppDataTable>
  <Menu
    id="overlay_menu"
    ref="menuDelitos"
    :model="esFichaCausa ? accionesDelitosFichaCausa : menuDelitosItems"
    :popup="true"
  />
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { dateTimeUtil } from '@/utils'
import { defineEmits, defineProps, ref } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'

const menuDelitos = ref()

let dataToEmit = null

const {
  mantenedor_getIdFamiliaDelitoByIdTipoDelito,
  mantenedor_getNombreFamiliaDelito,
  mantenedor_getNombreTipoDelito,
  mantenedor_getDescripcionComunasById,
  mantenedor_getComunas
} = useMantenedorStore()

mantenedor_getComunas()

function getNombreFamiliaDelitoById (idFamilia, idTipo) {
  if (idFamilia) {
    return mantenedor_getNombreFamiliaDelito(idFamilia)
  } else {
    return mantenedor_getNombreFamiliaDelito(mantenedor_getIdFamiliaDelitoByIdTipoDelito(idTipo))
  }
}

function getNombreTipoDelitoById (id) {
  return mantenedor_getNombreTipoDelito(id)
}

const emit = defineEmits(['tabla-delito:modificar', 'tabla-delito:eliminar', 'tabla-delito:ver-mas', 'tabla-delito:ver-mapa', 'tabla-delito:competencia-territorial'])

defineProps({
  dataDelitos: propTypes.array,
  isPreclasificador: Boolean,
  readOnly: Boolean,
  esFichaCausa: Boolean,
  isLoadingTable: Boolean
})

function direccionCompleta (data) {
  if (data) {
    return `${data?.calle} #${data?.numero}.`
  } else {
    return 'Sin dirección'
  }
}

function fechaDelito (fecha) {
  return dateTimeUtil.formatToFrontendWithTime(fecha)
}

function tooltipRango (data) {
  return `Inicio: ${fechaDelito(data.fechaHoraDelitoInicio)}
      Fin: ${fechaDelito(data.fechaHoraDelitoFin)}`
}

const menuDelitosItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-search-plus',
        label: 'Ver más',
        command: () => emitVerMas(dataToEmit)
      }
    ]
  }
])

const delitosSeleccionado = ref({})

function toggleAcciones (event, data) {
  delitosSeleccionado.value = data
  menuDelitos.value.toggle(event)
  dataToEmit = data
}

function emitVerMas (delito) {
  emit('tabla-delito:ver-mas', delito)
}
</script>
