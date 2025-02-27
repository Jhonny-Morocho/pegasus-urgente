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
  >
    <Column
      v-if="!esRevision"
      selection-mode="multiple"
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
        {{ data?.ubicacion || 'Sin Definir' }}
      </template>
    </Column>
    <Column header="Fecha Agregación al CDD">
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
      v-if="esRevision"
      class="p-0"
      disabled
      field="aprobacion"
      header="Aprobar o Rechazar"
      style="max-width: 100px"
    >
      <template #editor="{ data }">
        <Dropdown
          id="eliminacion"
          v-model="data['aprobacion']"
          class="my-0 dropdown w-full"
          option-label="descripcion"
          option-value="id"
          :options="aprobacion"
          placeholder="Seleccionar"
          @change="isSelected(data['aprobacion'])"
        />
      </template>
      <template #body="{ data }">
        <div
          class="dropdownDatatable flex flex-row md:flex-row justify-content-between p-2"
        >
          <span>{{
            !data?.aprobacion
              ? 'Por Definir (*)'
              : getNombreInputById(data?.aprobacion)
          }}
          </span>
          <i
            class="pi pi-chevron-down"
            style="color: darkgrey; margin-bottom: 3px"
          />
        </div>
      </template>
    </Column>
    <Column header="Método de eliminación ">
      <template #body="{ data }">
        {{ getDescripcionMantenedorById(motivosEliminacion, data?.idMotivo) }}
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
import { ref, onMounted, defineEmits, defineProps, reactive } from 'vue'

// COMPOSABLES
import { requestUtil, dateTimeUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useCreacionYGestionDeCDD, useMantenedorCDD } from '../../composables'
import { useAppDialog } from '@/modules/common/composables'
import { useMantenedorHelper } from '@/modules/global/composables'
const { launchDialog } = useAppDialog()
const { mantenedorCDD_getMotivosEliminacion, motivosEliminacion } = useMantenedorCDD()
const { getDescripcionMantenedorById } = useMantenedorHelper()
const { creacionYGestionDeCDD_getDocumentoById, creacionYGestionDeCDD_getHistorialVersionesDocumento } = useCreacionYGestionDeCDD()

// VALUES
const emit = defineEmits(['documentos-editados'])
const disableField = ref(true)
const documentosSeleccionados = ref(null)
const documentoSeleccionado = ref(null)
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

const aprobacion = [
  { id: 1, descripcion: 'Aprobar' },
  { id: 2, descripcion: 'Rechazar' }
]

defineProps({
  esRevision: {
    type: Boolean,
    default: () => false
  },
  documentosSeleccionados: propTypes.object
})

// LOGIC
onMounted(() => {
  requestUtil({ action: mantenedorCDD_getMotivosEliminacion })
})
function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
function getNombreInputById (id) {
  return aprobacion.find((x) => x.id === id)?.descripcion
}

function isSelected (value) {
  if (value) {
    disableField.value = false
  }
}

function onCellEditComplete (event) {
  const { data, newValue, field, newData, index } = event
  data[field] = newValue
  const docu = newData
  emit('documentos-editados', docu, index)
}

function handleDocumentoSeleccionado () {
  let existeDocumentoFisico = null
  documentosSeleccionados.value.forEach((element) => {
    if (element.formatoRecepcionId === '44D4905D-EB19-4599-A844-83EA34159838') {
      existeDocumentoFisico = true
    }
    return existeDocumentoFisico
  })
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
