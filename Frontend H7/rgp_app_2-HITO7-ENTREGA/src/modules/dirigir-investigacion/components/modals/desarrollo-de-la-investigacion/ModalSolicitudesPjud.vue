<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Solicitudes al PJUD"
    no-margin-bottom
  >
    <AppDataTable
      class="col-12"
      :loading="solicitudes.isLoading"
      :rows="solicitudes.paginacion?.tamanoPagina"
      :total-records="solicitudes.paginacion?.elementosTotales"
      :value="solicitudes.data"
      @page="getSolicitudes"
    >
      <Column header="Solicitud">
        <template #body="{ data }">
          {{ parseSolicitudPJUD(data) }}
        </template>
      </Column>
      <Column header="Fecha">
        <template #body="{ data }">
          {{ data?.fechaActividad }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>

<script setup>
import { defineProps, reactive, onMounted } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useActividadStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

const props = defineProps({
  ruc: propTypes.string,
  idCausa: propTypes.string
})

const solicitudes = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const { actividad_getActividades } = useActividadStore()

function getActividades ({ actividad, pagination, codigoTipoActividad }) {
  if (!pagination) {
    actividad.first = 0
  }

  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': props?.idCausa,
        'cod-tipo-actividad': codigoTipoActividad,
        page: pagination?.page || 0,
        size: pagination?.rows || 5,
        'cod-estados': '1,7,3,8' // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA (Dejar el que corresponda cuando el endpoint funcione como corresponde, hint: isEjecutadas)
      }
    },
    loader: (l) => { actividad.isLoading = l },
    resolve: ({ data, paginacion }) => {
      actividad.data = data
      actividad.paginacion = paginacion
    }
  })
}

function getSolicitudes (pagination = undefined) {
  getActividades({
    pagination,
    actividad: solicitudes,
    codigoTipoActividad: '24'
  })
}

function parseSolicitudPJUD (_solicitud) {
  let solicitud = ''
  if (_solicitud?.nombreSubTipoActividad) {
    solicitud = _solicitud.nombreSubTipoActividad
  }
  if (_solicitud?.nombreSubSubTipoActividad) {
    solicitud += ' - ' + _solicitud.nombreSubSubTipoActividad
  }

  return solicitud
}

onMounted(() => {
  getSolicitudes()
})
</script>
