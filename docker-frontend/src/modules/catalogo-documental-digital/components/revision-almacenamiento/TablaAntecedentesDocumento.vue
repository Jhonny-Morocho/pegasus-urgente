<template>
<section>
  <AppFieldset
    class="p-fluid"
    legend="Antecedentes del Documento Físico a Recuperar"
  >
    <AppDataTable
      id="tabla-antecedentes-documento"
      v-bind="$attrs"
      ref="dt"
      class="mt-5"
      filter-display="menu"
      responsive-layout="scroll"
    >
      <Column header="Procedencia">
        <template #body="{ data }">
          {{ data?.procedencia }}
        </template>
      </Column>
      <Column header="Nombre Archivo">
        <template #body="{ data }">
          {{ data?.nombre }}
        </template>
      </Column>
      <Column header="Clase Documental">
        <template #body="{ data }">
          {{ data?.claseDocumental }}
        </template>
      </Column>
      <Column header="Ubicación Física">
        <template #body="{ data }">
          {{ data?.ubicacionFisica ?? 'No Disponible' }}
        </template>
      </Column>
      <Column header="Plazo de Entrega">
        <template #body="{}">
          {{
            antecedentesSolicitud?.solicitud.plazoDias
              ? antecedentesSolicitud?.solicitud.plazoDias
              : solicitud?.solicitud?.plazoDias
          }}
        </template>
      </Column>

      <Column
        v-if="esRegistroSalida"
        header="Codigo de Barras"
      >
        <template #body="{ data }">
          {{ data?.codigoBarras ?? 'No Disponible' }}
        </template>
      </Column>
      <Column header="Versión">
        <template #body="{ data }">
          {{ `Versión ${data?.version}` }}
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
import { ref, defineProps, reactive } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import ModalVerDocumento from '../common/modal/ModalVerDocumento.vue'
import ModalDetalleDocumento from '../common/modal/ModalDetalleDocumento.vue'
import ModalHistorialVersiones from '../common/modal/ModalHistorialVersiones.vue'
import { requestUtil } from '@/utils'
import {
  useCreacionYGestionDeCDD,
  useSolicitudesEncargadoBodega,
  useSolicitudesFiscalCDD
} from '../../composables'
import { useDialog } from 'primevue/usedialog'
defineProps({
  readOnly: Boolean,
  esAnalizar: Boolean,
  esRevision: Boolean,
  esRegistroSalida: Boolean
})
const { antecedentesSolicitud } = useSolicitudesEncargadoBodega()
const { solicitud } = useSolicitudesFiscalCDD()
const {
  creacionYGestionDeCDD_getDocumentoById,
  creacionYGestionDeCDD_getHistorialVersionesDocumento
} = useCreacionYGestionDeCDD()
const dialog = useDialog()
const { launchDialog } = useAppDialog()

const base64 = ref('')
const mimeType = ref('')
const documentoSeleccionado = ref(null)
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
        visible: () => documentoSeleccionado.value.version !== 1,
        command: () => {
          verHistorialDeVersiones()
        }
      }
    ]
  }
])
</script>
