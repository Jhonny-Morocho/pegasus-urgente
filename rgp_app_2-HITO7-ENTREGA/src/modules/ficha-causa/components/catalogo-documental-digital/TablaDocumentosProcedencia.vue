<template>
<AppDataTable
  id="tabla-documentos-procedencia"
  v-bind="$attrs"
>
  <Column header="Procedencia">
    <template #body="{ data }">
      {{ data?.procedencia|| 'N/A' }}
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
  <Column header="Formato Recepción">
    <template #body="{ data }">
      {{ data?.formatoRecepcion|| 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha de Agregación al CDD">
    <template #body="{ data }">
      {{ formatDate(data?.fechaAgregacion) }}
    </template>
  </Column>
  <Column header="Fecha de Última Actualización">
    <template #body="{ data }">
      {{ formatDate(data?.fechaModificacionArchivo) }}
    </template>
  </Column>
  <Column header="Versión">
    <template #body="{ data }">
      {{ data?.version }}
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
</template>

<script setup>
// COMPONENTS
import ModalDetalleDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalDetalleDocumento.vue'
import ModalVerDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalVerDocumento.vue'
import ModalHistorialVersiones from '@/modules/catalogo-documental-digital/components/common/modal/ModalHistorialVersiones.vue'

// UTILS
import { ref, reactive } from 'vue'
import AppMenuOptions from '@/modules/common/components/AppMenuOptions.vue'

// COMPOSABLES
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog } from '@/modules/common/composables'
import { useCreacionYGestionDeCDD } from '@/modules/catalogo-documental-digital/composables'
const { launchDialog } = useAppDialog()
const { creacionYGestionDeCDD_getDocumentoById } = useCreacionYGestionDeCDD()
const { creacionYGestionDeCDD_getHistorialVersionesDocumento } = useCreacionYGestionDeCDD()

// VALUES
const base64 = ref('')
const mimeType = ref('')
const documentoSeleccionado = ref(null)

// LOGIC
const tablaDocumentos = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
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

</script>
