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
    <Column
      class="text-center"
      field="procedencia"
      header="Procedencia"
    >
      <template #body="{ data }">
        {{ getProcedencia(data.procedenciaId) }}
      </template>
    </Column>
    <Column header="Nombre archivo">
      <template #body="{ data }">
        {{ data.nombre }}
      </template>
    </Column>
    <Column header="Clase documental">
      <template #body="{ data }">
        {{ data.claseDocumental }}
      </template>
    </Column>
    <Column header="Formato de Recepción">
      <template #body="{ data }">
        {{ getFormato(data.formatoRecepcionId) }}
      </template>
    </Column>
    <Column header="Fecha agregación al CDD">
      <template #body="{ data }">
        {{ formatDate(data.fechaAgregacion) }}
      </template>
    </Column>
    <Column header="Fecha ultima actualización">
      <template #body="{ data }">
        {{ formatDate(data.fechaModificacionArchivo) }}
      </template>
    </Column>
    <Column header="Versión">
      <template #body="{ data }">
        {{ `Version ${data.version}` }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <AppMenuOptions
          v-model="documentoSeleccionado"
          class="acciones"
          :menu-options="accionesVerCatalogo"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog } from '@/modules/common/composables'
import ModalDetalleDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalDetalleDocumento.vue'
import ModalHistorialVersiones from '@/modules/catalogo-documental-digital/components/common/modal/ModalHistorialVersiones.vue'
import {
  useCreacionYGestionDeCDD,
  useMantenedorCDD
} from '@/modules/catalogo-documental-digital/composables'
import ModalVerDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalVerDocumento.vue'
import { useDialog } from 'primevue/usedialog'

const { launchDialog } = useAppDialog()
const dialog = useDialog()
const { creacionYGestionDeCDD_getDocumentoById } = useCreacionYGestionDeCDD()

const documentoSeleccionado = ref(null)
const { creacionYGestionDeCDD_getHistorialVersionesDocumento } =
  useCreacionYGestionDeCDD()
const { procedencia, formatoRecepcion } = useMantenedorCDD()

function formatDate (value) {
  if (value) {
    return dateTimeUtil.formatToFrontendWithTime(value)
  }
  return undefined
}

const tablaVersiones = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})

const accionesVerCatalogo = ref([
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
        command: () => {
          verHistorialDeVersiones()
        }
      }
    ]
  }
])

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
        search: tablaVersiones.filters.buscador?.trim().length
          ? tablaVersiones.filters.buscador
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

function verDocumento () {
  const base64 = ref('')
  const mimeType = ref('')

  console.log(documentoSeleccionado.value)

  requestUtil({
    action: creacionYGestionDeCDD_getDocumentoById,
    payload: { id: documentoSeleccionado.value.idFilenet },
    resolve: (data) => {
      console.log(data)
      mimeType.value = data.mimeType
      base64.value = data.documento
      dialog.open(ModalVerDocumento, {
        props: {
          header: `Documento`,
          style: {
            width: '65%'
          }
        },
        data: {
          dataDocumento: {
            archivo: base64.value,
            mimeType: mimeType.value
          }
        },
        onClose: async ({ data }) => {
          console.log(data)
        }
      })
    }
  })
}

function getProcedencia (id) {
  const Procedencia = procedencia.value.find((x) => x.id === id)
  return Procedencia.descripcion
}
function getFormato (id) {
  const Formato = formatoRecepcion.value.find((x) => x.id === id)
  return Formato.descripcion
}
</script>
<style scoped>
.p-menu .p-component .p-menu-overlay .p-ripple-disabled {
  z-index: 999999 !important;
}
</style>
