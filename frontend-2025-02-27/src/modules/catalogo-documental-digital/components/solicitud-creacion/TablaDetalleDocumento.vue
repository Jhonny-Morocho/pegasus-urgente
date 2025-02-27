<template>
<section>
  <AppDataTable
    id="tabla-ver-catalogo"
    v-bind="$attrs"
    ref="dt"
    class="mt-5"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <template #body="{ data }">
      {{ data.descripcion_procedencia }}
    </template>
    <Column
      class="text-center"
      field="procedencia"
      header="Procedencia"
    >
      <template #body="{ data }">
        {{ data.descripcion_procedencia }}
      </template>
    </Column>
    <Column header="Nombre archivo">
      <template #body="{ data }">
        {{ data.nombre_archivo }}
      </template>
    </Column>
    <Column header="Clase documental">
      <template #body="{ data }">
        {{ data.descripcion_clase_documental }}
      </template>
    </Column>
    <Column header="Formato de Recepción">
      <template #body="{ data }">
        {{ data.descripcion_formato_recepcion }}
      </template>
    </Column>
    <Column header="Fecha agregación al CDD">
      <template #body="{ data }">
        {{ formatDate(data.fecha_registro) }}
      </template>
    </Column>
    <Column header="Fecha ultima actualización">
      <template #body="{ data }">
        {{ formatDate(data.fecha_registro) }}
      </template>
    </Column>
    <Column header="Versiones">
      <template #body="{ data }">
        {{ data.version_archivo }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <AppMenuOptions
          v-model="documentoSeleccionado"
          :menu-options="accionesVerCatalogo"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useAppDialog } from '@/modules/common/composables'
import ModalVerDocumento from '../common/modal/ModalVerDocumento.vue'
import ModalDetalleDocumento from '../common/modal/ModalDetalleDocumento.vue'
import ModalHistorialVersiones from '../common/modal/ModalHistorialVersiones.vue'

const { launchDialog } = useAppDialog()

const documentoSeleccionado = ref(null)

function formatDate (value) {
  if (value) {
    return dateTimeUtil.formatToFrontendWithTime(value)
  }
  return undefined
}

// debe existir una constante la cual obtenga la data del archivo que se encuentra en filenet (rest)
// Store del servicio
// Composable
// modal de la informacion del archivo

function openVerDocumento () {
  launchDialog({
    component: ModalVerDocumento,
    header: 'Documento',
    width: '60%',
    props: { data: documentoSeleccionado },
    cancelLabel: 'Cerrar'
  })
}

function openDetalleDocumento () {
  launchDialog({
    component: ModalDetalleDocumento,
    header: 'Ver Detalle del Documento',
    width: '60%',
    props: { data: documentoSeleccionado },
    cancelLabel: 'Cerrar'
  })
}

function openVerHistorial () {
  launchDialog({
    component: ModalHistorialVersiones,
    header: 'Ver Historial de Versiones',
    width: '70%',
    props: { data: documentoSeleccionado },
    cancelLabel: 'Cerrar'
  })
}

const accionesVerCatalogo = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Documento',
        command: () => {
          openVerDocumento()
        }
      },
      {
        label: 'Ver Detalle del Documento',
        command: () => {
          openDetalleDocumento()
        }
      },
      {
        label: 'Ver Historial de versiones',
        command: () => {
          openVerHistorial()
        }
      }
    ]
  }
])
</script>
