<template>
<section>
  <AppDataTable
    id="tabla-solicitud-creacion"
    v-bind="{ ...$attrs }"
    ref="dt"
    v-model:filters="filters"
    class="mt-5"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column
      field="fecha_registro"
      header="Fecha de Solicitud/Creación"
    >
      <template #body="{ data }">
        {{ formatDate(data.fecha_registro) }}
      </template>
    </Column>
    <Column
      field="nombre_solicitante"
      header="Solicitante"
    >
      <template #body="{ data }">
        {{ data.nombre_solicitante }}
      </template>
    </Column>
    <Column
      field="nombre_catalogo"
      header="Nombre de Catalogo"
    >
      <template #body="{ data }">
        {{ data.nombre_catalogo }}
      </template>
    </Column>
    <Column
      field="nombre_tipo_catalogo"
      header="Tipo de Catalago"
    >
      <template #body="{ data }">
        {{ data.nombre_tipo_catalogo }}
      </template>
    </Column>
    <Column
      field="nombre_nivel_acceso"
      header="Nivel de Acceso"
    >
      <template #body="{ data }">
        {{ data.nombre_nivel_acceso }}
      </template>
    </Column>
    <Column
      field="descripcion_disponibilidad"
      header="Disponibilidad"
    >
      <template #body="{ data }">
        {{ data.descripcion_disponibilidad }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <AppMenuOptions
          v-model="solicitudSeleccionada"
          :menu-options="accionesSolicitud"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { useAppDialog } from '@/modules/common/composables'
import ModalVerCatalogo from '@/modules/catalogo-documental-digital/components/solicitud-creacion/modal/ModalVerCatalogo'
import ModalVerSolicitud from '@/modules/catalogo-documental-digital/components/common/modal/ModalVerSolicitud.vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'
import { useDialog } from 'primevue/usedialog'
const dialog = useDialog()
const { launchDialog } = useAppDialog()
// VALUES
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  fecha_registro: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
  },
  nombre_solicitante: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  },
  nombre_catalogo: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  },
  nombre_tipo_catalogo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  nombre_nivel_acceso: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  },
  descripcion_disponibilidad: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  }
  // version: { value: null, matchMode: FilterMatchMode.EQUALS }
})

defineProps({
  solicitudesBandeja: propTypes.array
})

const solicitudSeleccionada = ref(null)

function formatDate (value) {
  if (value) {
    return dateTimeUtil.formatToFrontend(value)
  }
  return undefined
}

function openVerCatalogo () {
  console.log(solicitudSeleccionada.value)
  dialog.open(ModalVerCatalogo, {
    props: {
      header: 'Ver Catálogo',
      style: {
        width: '70%'
      },
      modal: true
    },
    data: { dataSolicitud: solicitudSeleccionada.value },
    onClose: async ({ data }) => {
      console.log(data)
    }
  })
}

function openVerCreacion () {
  launchDialog({
    component: ModalVerSolicitud,
    header: 'Ver Creación',
    width: '60%',
    props: { data: solicitudSeleccionada },
    cancelLabel: 'Cerrar'
  })
}

const accionesSolicitud = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Creación',
        command: () => {
          openVerCreacion()
        }
      },
      {
        label: 'Ver Catálogo',
        command: () => {
          openVerCatalogo()
        }
      }
    ]
  }
])
</script>
