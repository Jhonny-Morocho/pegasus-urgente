<template>
<AppFieldset
  class="p-fluid col-12"
  legend="Historial de solicitud de NUE'S"
>
  <div class="ml-auto col-12">
    <AppFilters
      v-model="historialFilters.filters"
      class="mb-5 w-full input-group"
      @filter="getData"
    />
  </div>
  <AppDataTable
    id="dataTableHistorialSolicitudNues"
    v-bind="$attrs"
    ref="dt"
    class="col-12"
  >
    <Column header="Cantidad de NUE asignadas">
      <template #body="{ data }">
        {{ data.cantidadSolicitada }}
      </template>
    </Column>
    <Column header="Número Inicial de NUE asignada">
      <template #body="{ data }">
        {{ data.RangoNUEInicio }}
      </template>
    </Column>
    <Column header="Número Final de NUE asignada">
      <template #body="{ data }">
        {{ data.RangoNUEFinal }}
      </template>
    </Column>
    <Column header="NUE disponibles">
      <template #body="{ data }">
        {{ data.cantidadDisponibles }}
      </template>
    </Column>
    <Column header="Usuario solicitante">
      <template #body="{ data }">
        {{ data.IDFuncionario }}
      </template>
    </Column>
    <Column header="Fecha de solicitud">
      <template #body="{ data }">
        {{ formatDate(data.fechaCreacion) }}
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
      style="width: 0"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="nuesSeleccionados"
          :menu-options="opcionesHistorial"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useSolicitudAsignacionNue } from '../../composables'
import AppFilters from '@/modules/common/components/AppFilters.vue'

const historialFilters = reactive({
  filters: {
    buscador: null
  },
  firstRecord: 0,
  isLoading: false
})

const emit = defineEmits(['page'])

function getData () {
  emit('page')
}

const {
  solicitudAsignacionNue_getDescargaZipNues,
  solicitudAsignacionNue_getListadoSolicitudNuesQR
} = useSolicitudAsignacionNue()

const nuesSeleccionados = ref()

const opcionesHistorial = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-save',
        label: 'Descargar NUE',
        command: () =>
          // console.log('Descargar')
          descargaZipNue(nuesSeleccionados.value)
      }
    ]
  }
])

async function descargaZipNue (data) {
  console.log('data nues', data)
  await requestUtil({
    action: solicitudAsignacionNue_getListadoSolicitudNuesQR,
    payload: {
      idNueAsignada: data.IDNUEAsignada,
      idOrganismo: data.IDOrganismo
    },
    resolve: (res) => {
      descargar(res.nue)
      getData()
      console.log('rws data QR', res)
    }
  })
}
async function descargar (res) {
  console.log('rws QR', res)
  await requestUtil({
    action: solicitudAsignacionNue_getDescargaZipNues,
    payload: {
      idNueAsignada: res.IDNUEAsignada,
      idOrganismo: res.IDOrganismo
    }
  })
  console.log('modal descarga', res.IDNUEAsignada)
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>
