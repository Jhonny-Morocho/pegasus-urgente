<template>
<section class="grid p-fluid w-full">
  <div class="flex justify-content-end w-full col-12">
    <AppFilters
      v-model="tablaDocumentos.filters"
      class="col-12"
      :no-date-filters="true"
      @filter="getDocumentosfiltrados"
    />
  </div>
  <AppDataTable
    id="tablaListadoDocumentos"
    v-bind="{ ...$attrs }"
    v-model:filters="filters"
    :loading="isLoadingTable"
    style="width: 100%"
    :value="documentos"
  >
    <Column
      v-if="$attrs['origen-tabla'] !== 'agregar'"
      header-style="width: 3em"
      selection-mode="single"
    />

    <Column
      class="text-center"
      field="procedencia"
      header="Procedencia"
    >
      <template #body="{ data }">
        {{ data?.procedencia }}
      </template>
    </Column>
    <Column
      field="nombreArchivo"
      header="Nombre archivo"
    >
      <template #body="{ data }">
        {{ data?.nombre }}
      </template>
    </Column>
    <Column
      field="claseDocumental"
      header="Clase documental"
    >
      <template #body="{ data }">
        {{ data?.claseDocumental }}
      </template>
    </Column>
    <Column
      field="formatoRecepcion"
      header="Formato de Recepción"
    >
      <template #body="{ data }">
        {{ data?.formatoRecepcion }}
      </template>
    </Column>
    <Column
      field="fechaAgregacion"
      header="Fecha agregación al CDD"
    >
      <template #body="{ data }">
        {{ formatDate(data?.fechaAgregacion) }}
      </template>
    </Column>
    <Column
      field="fechaUltActualizacion"
      header="Fecha ultima actualización"
    >
      <template #body="{ data }">
        {{ formatDate(data?.fechaModificacionArchivo) }}
      </template>
    </Column>
    <Column
      field="version"
      header="Versión"
    >
      <template #body="{ data }">
        {{ `Version ${data?.version}` }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <AppMenuOptions
          v-model="documentoSeleccionado"
          :menu-options="accionesDocumento"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
// COMPONENTS
import ModalDetalleDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalDetalleDocumento.vue'
import ModalVerDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalVerDocumento.vue'
import ModalHistorialVersiones from '@/modules/catalogo-documental-digital/components/common/modal/ModalHistorialVersiones.vue'

// UTILS
import { reactive, ref, defineEmits } from 'vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'

// COMPOSABLES
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog } from '@/modules/common/composables'
import { useCreacionYGestionDeCDD } from '@/modules/catalogo-documental-digital/composables'

const { launchDialog } = useAppDialog()
const { creacionYGestionDeCDD_getDocumentoById } = useCreacionYGestionDeCDD()
const { documentos, creacionYGestionDeCDD_getHistorialVersionesDocumento } = useCreacionYGestionDeCDD()

// VALUES
const base64 = ref('')
const mimeType = ref('')
const isLoadingTable = ref(false)
const documentoSeleccionado = ref(null)
const emit = defineEmits(['filtrar-documentos'])

const tablaDocumentos = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})

const accionesDocumento = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Documento',
        command: () => {
          verDocumento()
        }
      },
      {
        label: 'Ver Detalle del Documento',
        command: () => {
          verDetalleDocumento()
        }
      },
      {
        label: 'Ver Historial de versiones',
        visible: () => documentoSeleccionado.value.version !== 1,
        command: () => {
          verHistorialDeVersiones()
        }
      }
    ]
  }
])

// LOGIC

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
function getDocumentosfiltrados () {
  emit('filtrar-documentos', tablaDocumentos)
}

function verDocumento () {
  console.log(documentoSeleccionado.value)
  requestUtil({
    action: creacionYGestionDeCDD_getDocumentoById,
    payload: { id: documentoSeleccionado.value.idFilenet },
    resolve: (data) => {
      console.log(data)
      mimeType.value = data.mimeType
      base64.value = data.documento
      console.log(base64.value)
      launchDialog({
        component: ModalVerDocumento,
        header: 'Documento',
        width: '48%',
        height: '800px',
        props: {
          dataDocumento: {
            archivo: base64.value,
            mimeType: mimeType.value
          }
        },
        cancelLabel: 'Cerrar'
      })
    }
  })
}

function verDetalleDocumento () {
  console.log(documentoSeleccionado.value)
  launchDialog({
    component: ModalDetalleDocumento,
    header: 'Ver Detalle del Documento',
    width: '60%',
    props: { data: documentoSeleccionado.value },
    cancelLabel: 'Cerrar'
  })
}

function verHistorialDeVersiones (pagination = undefined) {
  requestUtil({
    action: creacionYGestionDeCDD_getHistorialVersionesDocumento,
    payload: {
      id: documentoSeleccionado.value.idFilenet,
      params: {
        search: tablaDocumentos.filters.buscador?.trim().length
          ? tablaDocumentos.filters.buscador
          : undefined,
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    resolve: () => {
      launchDialog({
        component: ModalHistorialVersiones,
        header: 'Ver Historial de Versiones',
        width: '70%',
        props: {
          documentoSeleccionado: documentoSeleccionado.value
        },
        cancelLabel: 'Cerrar'
      })
    }
  })
}
</script>
