<template>
<AppDataTable
  id="tablaGenerarCuponDeposito"
  v-model:selection="especiesSeleccionadas"
  class="editable-cells-table"
  data-key="nue"
  edit-mode="cell"
  filter-display="menu"
  responsive-layout="scroll"
  @cell-edit-complete="onCellEditComplete"
>
  <!-- seleccion -->
  <Column
    v-if="selectable"
    header-style="width: 3rem"
    selection-mode="multiple"
  />
  <!-- index -->
  <Column
    v-if="index"
    field="correlativo"
    filter-field="correlativo"
    header="Correlativo"
  >
    <template #body>
      {{ key+1 }}
    </template>
  </Column>
  <!-- field con dropdown modelo3 -->
  <Column
    v-if="esModelo3"
    field="valorComercial"
    header="Valor Comercial"
  >
    <template #editor="{ data }">
      <Dropdown
        id="valorComercial"
        v-model="data['valorComercial']"
        class="my-0 dropdown w-full"
        option-label="descripcion"
        option-value="descripcion"
        :options="valorComercialOptions"
        placeholder="Seleccionar"
      />
    </template>
    <template #body="{ data }">
      <div class="dropdownDatatable flex flex-row md:flex-row justify-content-between p-2">
        <span>{{ data?.valorComercial ?? 'Por Definir (*)' }}</span>
        <i class="pi pi-chevron-down" />
      </div>
    </template>
  </Column>
  <!-- campos generales compartidos -->
  <Column
    field="nue"
    filter-field="nue"
    header="NUE"
  >
    <template #body="{data}">
      {{ data.nue }}
    </template>
  </Column>
  <Column
    field="rue"
    filter-field="rue"
    header="RUE"
  >
    <template #body="{data}">
      {{ data.rue }}
    </template>
  </Column>
  <Column
    field="ruc"
    filter-field="ruc"
    header="RUC"
  >
    <template #body="{data}">
      {{ data.ruc }}
    </template>
  </Column>
  <!-- campos modelo 1 usado en gestión dinero -->
  <div v-if="!esModelo2">
    <Column
      field="tipoDelito"
      filter-field="tipoDelito"
      header="Tipo Delito"
    >
      <template #body="{data}">
        {{ data.tipoDelito }}
      </template>
    </Column>
    <Column
      field="codigoFiscalia"
      filter-field="codigoFiscalia"
      header="Código Fiscalía"
    >
      <template #body="{data}">
        {{ data.codigoFiscalia }}
      </template>
    </Column>
    <Column
      field="numeroConvenio"
      filter-field="numeroConvenio"
      header="Número de Convenio"
    >
      <template #body="{data}">
        {{ data.numeroDeConvenio }}
      </template>
    </Column>
    <Column
      field="cuentaDeposito"
      filter-field="cuentaDeposito"
      header="Cuenta depósito"
    >
      <template #body="{data}">
        {{ data.cuentaDeposito }}
      </template>
    </Column>
    <Column
      field="monto"
      filter-field="monto"
      header="Monto"
    >
      <template #body="{data}">
        {{ data.monto }}
      </template>
    </Column>
    <Column
      field="fechaRecepcion"
      filter-field="fechaRecepcion"
      header="Fecha Recepción"
    >
      <template #body="{data}">
        {{ formatFecha(data.fechaRecepcion) }}
      </template>
    </Column>
    <Column
      field="fechaIngreso"
      filter-field="fechaIngreso"
      header="Fecha de Ingreso"
    >
      <template #body="{data}">
        {{ formatFecha(data.fechaIngreso) }}
      </template>
    </Column>
    <Column
      field="alertaVencimiento"
      filter-field="alertaVencimiento"
      header="Alerta Vencimiento"
    >
      <template #body="{data}">
        <div class="text-center">
          <i
            class="pi pi-exclamation-triangle"
            :style="alerta(data.alertaVencimiento)"
          />
        </div>
      </template>
    </Column>
  </div>
  <!-- campos modelo 2 -->
  <div v-if="esModelo2">
    <Column
      field="ley"
      filter-field="ley"
      header="Ley"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.ley }}
        </div>
      </template>
    </Column>
    <Column
      field="descripcion"
      filter-field="descripcion"
      header="Descripcion"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.descripcion }}
        </div>
      </template>
    </Column>
    <Column
      field="cantidad"
      filter-field="cantidad"
      header="Cantidad"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.cantidad }}
        </div>
      </template>
    </Column>
    <Column
      field="codigoFiscalia"
      filter-field="codigoFiscalia"
      header="Código Fiscalía"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.codigoFiscalia }}
        </div>
      </template>
    </Column>
    <Column
      v-if="!esModelo4"
      field="bodega"
      filter-field="bodega"
      header="Bodega"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.bodega }}
        </div>
      </template>
    </Column>
    <Column
      v-if="!esModelo4"
      field="sector"
      filter-field="sector"
      header="Sector"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.sector }}
        </div>
      </template>
    </Column>
    <Column
      v-if="!esModelo4"
      field="casillero"
      filter-field="casillero"
      header="Casillero"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.casillero }}
        </div>
      </template>
    </Column>
    <Column
      v-if="!esRegistroSalida && !esModelo4"
      field="fechaSolicitud"
      filter-field="fechaSolicitud"
      header="Fecha Solicitud"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.fechaSolicitud }}
        </div>
      </template>
    </Column>
    <Column
      v-if="!esRegistroSalida && !esModelo4"
      field="marca"
      filter-field="marca"
      header="Marca"
    >
      <template #body="{data}">
        <div class="text-center">
          {{ data?.marca }}
        </div>
      </template>
    </Column>
    <Column
      v-if="readOnly"
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="especiesSeleccionadas"
          :menu-options="opcionesBandeja"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </div>
</AppDataTable>
</template>
<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'
import ModalRevisarSolicitud from '@/modules/recepcion-especies-dinero/components/salida-destruccion/modals/ModalRevisarSolicitud.vue'
import { useGenerarCuponDeDeposito } from '../../composables'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useAppDialog } from '@/modules/common/composables'

defineProps({
  readOnly: Boolean,
  index: Boolean,
  selectable: {
    type: Boolean,
    default: true
  },
  // modelo usado en destrucción y subasta de especies
  esModelo2: {
    type: Boolean,
    default: false
  },
  // es como el modelo2 pero con el campo del dropdown
  esModelo3: {
    type: Boolean,
    default: false
  },
  // es como el modelo2 pero con menos campos e index
  esModelo4: {
    type: Boolean,
    default: false
  },
  esRegistroSalida: {
    type: Boolean,
    default: false
  }
})

const { launchDialog } = useAppDialog()
const { generarCuponDeDeposito_getDinerosCustodiaParaGenerarCupon } = useGenerarCuponDeDeposito()

const key = 0
const especiesSeleccionadas = ref()
// const dinerosSeleccionados = ref()
const mockDataSolicitud = ref([])
const valorComercialOptions = ref([
  { id: 1, descripcion: 'Si' },
  { id: 2, descripcion: 'No' },
  { id: 3, descripcion: 'Por definir' }
])

const opcionesBandeja = ref([
  {
    label: 'Revisar Solicitud',
    command: () => {
      launchDialog({
        component: ModalRevisarSolicitud,
        header: 'Revisar Solicitud',
        width: '80%',
        props: {
          data: {
            dataCol1: [
              { label: 'Fecha de Solicitud', value: mockDataSolicitud.value?.fechaSolicitud },
              { label: 'Tipo de salida', value: mockDataSolicitud.value?.fechaSolicitud },
              { label: 'Motivo de Salida', value: mockDataSolicitud.value?.fechaSolicitud },
              { label: 'Destinatario', value: mockDataSolicitud.value?.fechaSolicitud },
              { label: 'RUN Destinatario', value: mockDataSolicitud.value?.fechaSolicitud }
            ],
            dataCol2: [
              { label: 'Dirección', value: mockDataSolicitud.value?.fechaSolicitud },
              { label: 'Teléfono', value: mockDataSolicitud.value?.fechaSolicitud },
              { label: 'Correo', value: mockDataSolicitud.value?.fechaSolicitud }
            ]
          }
        }
      })
    }
  }
])

function dineroListado () {
  requestUtil({
    action: generarCuponDeDeposito_getDinerosCustodiaParaGenerarCupon,
    resolve: (res) => {
      console.log('res', res)
    }
  })
}
dineroListado()
function alerta (a) {
  let alerta = 'font-size: 2rem;'
  switch (a) {
    case 0:
      alerta += 'color:red'
      break
    case 1:
      alerta += 'color:yellow'
      break
    default:
      alerta += 'color:#00e917'
      break
  }
  return alerta
}

const emit = defineEmits(['update-selection'])

watch(
  () => especiesSeleccionadas.value,
  () => {
    emit('update-selection', especiesSeleccionadas.value)
  }
)
function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function onCellEditComplete (event) {
  const { data, newValue, field } = event
  data[field] = newValue
}
</script>
