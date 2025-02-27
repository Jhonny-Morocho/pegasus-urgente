<template>
<div class="col-12">
  <AppDataTable
    id="tabla-delitos"
    class="col-12"
    :loading="isLoadingTable"
    v-bind="{ ...$attrs }"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="dataDelitos"
  >
    <Column header="Familia Delito">
      <template
        v-if="isPreclasificador"
        #body="{ data }"
      >
        {{ getNombreFamiliaDelitoById(data?.idFamiliaDelito) || data?.familiaDelito }}
      </template>
      <template
        v-else
        #body="{ data }"
      >
        {{ !!data.delito.familiaDelito ? data.delito.familiaDelito : getNombreFamiliaDelitoById(data.delito.idFamiliaDelito, data.delito.idTipoDelito) }}
      </template>
    </Column>
    <Column header="Delito">
      <template
        v-if="isPreclasificador"
        #body="{ data }"
      >
        {{ data.delitoDenunciado || 'SIN TIPO DELITO' }}
      </template>
      <template
        v-else
        #body="{ data }"
      >
        {{ getNombreTipoDelitoById(data.delito.idTipoDelito) || 'SIN TIPO DELITO' }}
      </template>
    </Column>
    <Column header="¿Es VIF?">
      <template
        v-if="isPreclasificador"
        #body="{ data }"
      >
        {{ data.esVif || data.vif ? 'Si' : 'No' }}
      </template>
      <template
        v-else
        #body="{ data }"
      >
        {{ data.vif ? 'Si' : 'No' }}
      </template>
    </Column>
    <Column header="Dirección Delito">
      <template
        v-if="isPreclasificador"
        #body="{ data }"
      >
        {{ data.direccionDelito.calle ?data.direccionDelito.calle + data.direccionDelito.numero :data.direccionDelito }}
      </template>
      <template
        v-else
        #body="{ data }"
      >
        {{ direccionCompleta(data.direccionDelito) ?? 'Sin información' }}
      </template>
    </Column>
    <Column header="Comuna">
      <template
        v-if="isPreclasificador"
        #body="{ data }"
      >
        {{ data.comuna }}
      </template>
      <template
        v-else-if="isDirigirInvestigacion"
        #body="{ data }"
      >
        {{ data?.direccionDelito?.comunaNombre }}
      </template>
      <template
        v-else
        #body="{ data }"
      >
        {{ mantenedor_getDescripcionComunasById(data.direccionDelito?.comuna) ?? data.direccionDelito?.comuna ?? 'Sin información' }}
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
import { useAppDialog, useAppGlobalProperties } from '@/modules/common/composables'
import { useDelitoStore, useMantenedorStore } from '@/modules/global/composables'
import ModalVerDelito from '@/modules/global/components/ficha-causa/modals/ModalVerDelito.vue'
import ModalVerUbicacion from '@/modules/global/components/ficha-causa/modals/ModalVerUbicacion.vue'

const { launchDialog } = useAppDialog()
const menuDelitos = ref()

let dataToEmit = null
const { paginacion } = useDelitoStore()

const { mantenedor_getIdFamiliaDelitoByIdTipoDelito, mantenedor_getNombreFamiliaDelito, mantenedor_getNombreTipoDelito, mantenedor_getDescripcionComunasById } = useMantenedorStore()

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

const { $hasOrigin } = useAppGlobalProperties()

const emit = defineEmits(['tabla-delito:modificar', 'tabla-delito:eliminar', 'tabla-delito:ver-mas', 'tabla-delito:ver-mapa', 'tabla-delito:competencia-territorial'])

const props = defineProps({
  dataDelitos: propTypes.array,
  isPreclasificador: Boolean,
  readOnly: Boolean,
  esFichaCausa: Boolean,
  isLoadingTable: Boolean,
  isDisabled: { type: Boolean, default: false },
  isDirigirInvestigacion: Boolean
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
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () => emitModificarDelito(dataToEmit),
        disabled: props.isDisabled
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => emitEliminarDelito(dataToEmit),
        disabled: props.isDisabled
      },
      {
        icon: 'pi pi-fw pi-search-plus',
        label: 'Ver más',
        command: () => emitVerMas(dataToEmit),
        visible: () => $hasOrigin('preclasificador') || $hasOrigin('asignacion') || $hasOrigin('dirigir-investigacion')
      },
      {
        icon: 'pi pi-fw pi-map-marker',
        label: 'Ver Mapa',
        command: () => emit('tabla-delito:ver-mapa', dataToEmit),
        visible: () => $hasOrigin('dirigir-investigacion')
      },
      {
        icon: 'pi pi-fw pi-map',
        label: 'Competencia Territorial',
        command: () => emit('tabla-delito:competencia-territorial', dataToEmit),
        visible: () => $hasOrigin('dirigir-investigacion')
      }
    ]
  }
])
const accionesDelitosFichaCausa = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Delito',
        command: () => openModalVerDelito(delitosSeleccionado)
      },
      {
        label: 'Ver Dirección',
        command: () => openModalVerUbicacion(delitosSeleccionado)
      }
    ]
  }
])

function openModalVerUbicacion (delito) {
  launchDialog({
    component: ModalVerUbicacion,
    header: 'Ver Ubicación',
    props: { delito: delito.value },
    accept: () => {
      console.log('accept')
    },
    reject: () => {
      console.log('reject')
    },
    width: '80%'
  })
}

function openModalVerDelito (delito) {
  launchDialog({
    component: ModalVerDelito,
    header: 'Ver Delito',
    props: { delito: delito.value },
    accept: () => {
      console.log('accept')
    },
    reject: () => {
      console.log('reject')
    },
    width: '67%'
  })
}

const delitosSeleccionado = ref({})

function toggleAcciones (event, data) {
  delitosSeleccionado.value = data
  menuDelitos.value.toggle(event)
  dataToEmit = data
}

function emitModificarDelito (delito) {
  emit('tabla-delito:modificar', delito)
}

function emitEliminarDelito (delito) {
  emit('tabla-delito:eliminar', delito)
}

function emitVerMas (delito) {
  emit('tabla-delito:ver-mas', delito)
}

</script>
