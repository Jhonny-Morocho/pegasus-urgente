<template>
<section>
  <div>
    <div class="col-12">
      <AppFilters
        v-model="tablaVersiones.filters"
        :no-date-filters="true"
        @filter="busquedaVersionesPorFiltro"
      />
    </div>
    <TabPanel>
      <div v-if="loading">
        <LoaderSkeleton />
      </div>
      <AppDataTable
        v-else
        :loading="loading"
        :rows="paginacionVersiones?.tamanoPagina"
        style="width: 100%"
        :total-records="paginacionVersiones?.elementosTotales"
        :value="versionesDocumento"
        @page="busquedaVersionesPorFiltro"
      >
        <Column
          class="text-center"
          field="id"
          header="ID"
        >
          <template #body="{ data }">
            {{ data.id }}
          </template>
        </Column>
        <Column header="Nombre archivo">
          <template #body="{ data }">
            {{ data.nombre }}
          </template>
        </Column>
        <Column header="Fecha Creación">
          <template #body="{ data }">
            {{ formatDate(data.fechaCreacion) }}
          </template>
        </Column>
        <Column header="Fecha agregación al CDD">
          <template #body="{ data }">
            {{ formatDate(data.fechaAgregacion) }}
          </template>
        </Column>
        <Column header="Fecha ultima actualización">
          <template #body="{ data }">
            {{ formatDate(data.fechaModificacion) }}
          </template>
        </Column>
        <Column header="Vigencia Documental">
          <template #body="{ data }">
            <span v-if="data.esDocumentoActual === 1">Si</span>
            <span v-else>No</span>
          </template>
        </Column>
        <Column header="Versiones">
          <template #body="{ data }">
            {{ `Version ${data.version}` }}
          </template>
        </Column>
        <Column header="Acciones">
          <template #body="slotProps">
            <AppMenuOptions
              v-model="versionSeleccionada"
              :menu-options="accionesSolicitud"
              :slot-props="slotProps"
            />
          </template>
        </Column>
      </AppDataTable>
    </TabPanel>
  </div>
</section>
</template>

<script setup>
import { ref, defineProps, reactive } from 'vue'
import { propTypes } from '@/modules/common/types'
import ModalVerDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalVerDocumento.vue'
import ModalDetalleDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalDetalleDocumento.vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useCreacionYGestionDeCDD } from '@/modules/catalogo-documental-digital/composables'
import { useDialog } from 'primevue/usedialog'
import AppFilters from '@/modules/common/components/AppFilters.vue'

const props = defineProps({
  historialDeVersiones: propTypes.array,
  documentoSeleccionado: propTypes.object
})
const versionSeleccionada = ref()
const base64 = ref('')
const mimeType = ref('')
const { creacionYGestionDeCDD_getDocumentoById, creacionYGestionDeCDD_getHistorialVersionesDocumento, versionesDocumento, paginacionVersiones } = useCreacionYGestionDeCDD()

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

function busquedaVersionesPorFiltro (pagination = undefined) {
  if (!pagination) {
    tablaVersiones.firstRecord = 0
  }
  requestUtil({
    action: creacionYGestionDeCDD_getHistorialVersionesDocumento,
    payload: {
      id: props.documentoSeleccionado.idFilenet,
      params: {
        search: tablaVersiones.filters.buscador?.trim().length ? tablaVersiones.filters.buscador : undefined,
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    resolve: (data) => {}
  })
}

function openVerDocumento () {
  requestUtil({
    action: creacionYGestionDeCDD_getDocumentoById,
    payload: { id: versionSeleccionada.value.idFilenet },
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
  console.log('version select', versionSeleccionada.value)
  dialog.open(ModalDetalleDocumento, {
    props: {
      header: `Ver Detalle del Documento`,
      style: {
        width: '60%'
      }
    },
    data: {
      data: versionSeleccionada.value
    },
    onClose: async ({ data }) => {
      console.log(data)
    }
  })
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

const accionesSolicitud = ref([
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
      }
    ]
  }
])
</script>
