<template>
<section class="col-12 md:col-12">
  <AppDataTable
    id="tabla-ver-catalogo"
    v-bind="{ ...$attrs }"
    ref="dt"
    v-model:selection="documentosSeleccionados"
    class="editable-cells-table"
    edit-mode="cell"
    filter-display="menu"
    responsive-layout="scroll"
    @cell-edit-complete="onCellEditComplete"
    @row-select="handleDocumentoSeleccionado"
    @row-unselect="handleDocumentoSeleccionado"
  >
    <Column selection-mode="multiple" />
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
    <Column header="Ubicación Física">
      <template #body="{ data }">
        {{ data?.ubicacion || 'Sin Definir' }}
      </template>
    </Column>
    <Column header="Fecha agregación al CDD">
      <template #body="{ data }">
        {{ formatDate(data?.fechaAgregacion) }}
      </template>
    </Column>
    <Column header="Versiones">
      <template #body="{ data }">
        {{ data?.version }}
      </template>
    </Column>
    <Column
      class="capitalize p-0"
      field="eliminacion"
      header="Método de eliminación"
      :style="{
        width: '200px'
      }"
    >
      <template #editor="{ data }">
        <Dropdown
          id="eliminacion"
          v-model="data['eliminacion']"
          class="my-0 dropdown w-full"
          :disabled="habilitarCampo(data)"
          option-label="descripcion"
          option-value="codigo"
          :options="motivosEliminacion"
          placeholder="Seleccionar"
        />
      </template>
      <template #body="{ data }">
        <div
          class="dropdownDatatable flex flex-row md:flex-row justify-content-between p-2"
        >
          <span>{{
            !data?.eliminacion
              ? 'Por Definir (*)'
              : getNombreMotivoEliminacionById(data?.eliminacion)
          }}
          </span>
          <i
            class="pi pi-chevron-down"
            style="color: darkgrey; margin-bottom: 3px"
          />
        </div>
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
  <Message
    v-if="existeDocumentoFisico"
    class="m-1"
    severity="error"
  >
    <strong>Atención: </strong>Uno de los documentos seleccionado posee
    versiones en formato físico que serán eliminadas conjuntamente con la
    versión digital.
  </Message>
</section>
</template>

<script setup>
// COMPONENTS
import ModalVerDocumento from '../common/modal/ModalVerDocumento.vue'
import ModalDetalleDocumento from '../common/modal/ModalDetalleDocumento.vue'
import ModalHistorialVersiones from '../common/modal/ModalHistorialVersiones.vue'

// UTILS
import { ref, onMounted, computed, reactive } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'

// COMPOSABLES
import { useAppDialog } from '@/modules/common/composables'
import { useCreacionYGestionDeCDD, useMantenedorCDD } from '../../composables'
import { useMantenedorHelper } from '@/modules/global/composables'
const { launchDialog } = useAppDialog()
const { mantenedorCDD_getMotivosEliminacion, mantenedorCDD_getFormatoRecepcion, motivosEliminacion, formatoRecepcion } = useMantenedorCDD()
const { getCodigoMantenedorById } = useMantenedorHelper()
const { creacionYGestionDeCDD_getDocumentoById, creacionYGestionDeCDD_getHistorialVersionesDocumento } = useCreacionYGestionDeCDD()

// VALUES
const documentosSeleccionados = ref([])
const documentoSeleccionado = ref(null)
const existeDocumentoFisico = ref(false)
const base64 = ref('')
const mimeType = ref('')
const tablaDocumentos = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})

const existenDocumentosFisicos = computed(() => {
  const esDocumentoFisico = documentosSeleccionados.value?.find(
    (d) =>
      getCodigoMantenedorById(formatoRecepcion.value, d.formatoRecepcionId) ===
      '1'
  )
  return esDocumentoFisico
})

// LOGIC
onMounted(() => {
  requestUtil({ action: mantenedorCDD_getMotivosEliminacion })
  requestUtil({ action: mantenedorCDD_getFormatoRecepcion })
})

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function habilitarCampo (data) {
  documentoSeleccionado.value = data
  const noEstaSeleccionado = computed(() => {
    const row = documentosSeleccionados.value.find(
      (d) => d.id === documentoSeleccionado.value.id
    )
    return row
  })
  let estado = null
  if (noEstaSeleccionado.value) {
    estado = false
  } else {
    estado = true
  }
  return estado
}

function getNombreMotivoEliminacionById (codigo) {
  return motivosEliminacion?.value.find((motivo) => motivo.codigo === codigo)
    ?.descripcion
}

function onCellEditComplete (event) {
  const { data, newValue, field } = event
  data[field] = newValue
}

function handleDocumentoSeleccionado () {
  if (existenDocumentosFisicos.value) {
    existeDocumentoFisico.value = true
  } else existeDocumentoFisico.value = false
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
        visible: () => documentoSeleccionado.value.version !== 1,
        command: () => {
          verHistorialDeVersiones()
        }
      }
    ]
  }
])
</script>
