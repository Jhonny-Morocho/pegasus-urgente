<!-- eslint-disable vue/no-template-shadow -->
<template>
<section>
  <AppFieldset
    class="p-fluid pb-6"
    v-bind="$attrs"
  >
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
          {{ data?.procedencia }}
        </template>
      </Column>
      <Column header="Nombre archivo">
        <template #body="{ data }">
          {{ data?.nombre }}
        </template>
      </Column>
      <Column header="Clase documental">
        <template #body="{ data }">
          {{ data?.claseDocumental }}
        </template>
      </Column>
      <Column
        v-if="!esBodegaTemporal"
        header="Formato de Recepción"
      >
        <template #body="{ data }">
          {{ data?.formatoRecepcion }}
        </template>
      </Column>
      <Column header="Fecha agregación al CDD">
        <template #body="{ data }">
          {{ formatDate(data?.fechaAgregacion) || 'N/A' }}
        </template>
      </Column>
      <Column header="Fecha ultima actualización">
        <template #body="{ data }">
          {{ formatDate(data?.fechaModificacionArchivo) || 'N/A' }}
        </template>
      </Column>
      <Column header="Versiones">
        <template #body="{ data }">
          {{ data?.version }}
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
  </AppFieldset>
</section>
</template>

<script setup>
import ModalVerDocumento from '../common/modal/ModalVerDocumento.vue'
import ModalDetalleDocumento from '../common/modal/ModalDetalleDocumento.vue'
import ModalHistorialVersiones from '@/modules/catalogo-documental-digital/components/common/modal/ModalHistorialVersiones.vue'
import { ref, defineProps, reactive } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { useCreacionYGestionDeCDD } from '../../composables'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useDialog } from 'primevue/usedialog'

defineProps({
  data: propTypes.Object,
  esAnalisis: propTypes.Object,
  esBodegaTemporal: propTypes.boolean
})

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
const { launchDialog } = useAppDialog()

const {
  creacionYGestionDeCDD_getDocumentoById,
  creacionYGestionDeCDD_getHistorialVersionesDocumento
} = useCreacionYGestionDeCDD()

const documentoSeleccionado = ref(null)
const base64 = ref('')
const mimeType = ref('')
const dialog = useDialog()

const tablaVersiones = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})

function openVerDocumento () {
  requestUtil({
    action: creacionYGestionDeCDD_getDocumentoById,
    payload: { id: documentoSeleccionado.value.idFilenet },
    resolve: (data) => {
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

function openDetalleDocumento () {
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

const accionesVerCatalogo = ref([
  {
    label: '',
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
        visible: () => documentoSeleccionado.value.version !== 1,
        command: () => {
          verHistorialDeVersiones()
        }
      }
    ]
  }
])
</script>
