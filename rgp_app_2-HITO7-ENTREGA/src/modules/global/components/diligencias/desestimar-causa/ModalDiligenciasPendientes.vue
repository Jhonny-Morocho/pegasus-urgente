<template>
<hr>
<section class="col-12">
  <div
    v-if="isAsignacion"
    class="grid ml-0"
  >
    <section class="col-12 flex align-items-center justify-content-start mb-4 pl-1">
      <div class="p-3">
        <i
          class="pi text-5xl mx-2 pi-exclamation-triangle text-yellow-500"
        />
      </div>
      <p class="p3 text-lg font-bold">
        Se Concluirá Asignación de Causa
      </p>
    </section>
    <ul class="col-6">
      <li><strong>RUC:</strong> {{ ruc }}</li>
      <li><strong>Número de Intervinientes:</strong> {{ nroIntervinientes }}</li>
    </ul>
    <ul class="col-6">
      <li><strong>Tipo de Término:</strong> {{ tipoTermino }}</li>
      <li><strong>Motivo Desistimiento</strong> {{ motivoDesistimiento }}</li>
    </ul>
  </div>

  <div
    v-else
    class="grid ml-0"
  >
    <section class="col-12 flex align-items-center justify-content-start mb-4 pl-1">
      <div class="p-3">
        <i
          class="pi text-5xl mx-2 pi-exclamation-triangle text-yellow-500"
        />
      </div>
      <p class="p3 text-lg font-bold">
        Se Concluirá Propuesta Desestimar Causa
      </p>
    </section>
  </div>

  <div
    v-if="actividades?.length && !isLoading"
    class="flex align-items-center justify-content-start mb-4"
  >
    <div class="p-3">
      <i
        class="pi text-5xl mx-2 pi-exclamation-triangle text-red-500"
      />
    </div>
    <p
      v-if="isAsignacion"
      class="p3 text-lg font-bold"
    >
      Existen Diligencias Pendientes, serán anuladas para poder Desestimar la Causa. ¿Está seguro de anular estas Diligencias?
    </p>
    <p
      v-else
      class="p3 text-lg font-bold"
    >
      Existen Diligencias Pendientes, podrían ser anuladas. ¿Está seguro de Enviar la Propuesta?
    </p>
  </div>
  <div
    v-if="!actividades?.length && !isLoading"
    class="flex align-items-center justify-content-start mb-4"
  >
    <div class="p-3">
      <i
        class="pi text-5xl mx-2 pi-check-square text-green-500"
      />
    </div>
    <p class="p3 text-lg font-bold">
      No existen Diligencias Pendientes
    </p>
  </div>

  <TablaDiligenciasInstruidas
    id="diligencias-instruidas"
    :loading="isLoading"
    :rows="paginacionActividades?.tamanoPagina"
    :total-records="paginacionActividades?.elementosTotales"
    :value="actividades"
    @page="getDiligencias"
    @ver-documento="openModalVerDocumento"
  />
</section>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useDynamicDialog } from '@/modules/common/composables'
import { useActividadStore, useMantenedorStore } from '@/modules/global/composables'
import TablaDiligenciasInstruidas from '@/modules/global/components/diligencias/TablaDiligenciasInstruidas.vue'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'

const props = defineProps({
  isAsignacion: Boolean,
  comentario: propTypes.string,
  motivoDesistimiento: propTypes.string,
  tipoTermino: propTypes.string,
  nroIntervinientes: propTypes.number,
  ruc: propTypes.string,
  idCausa: propTypes.string
})

const { launchDynamicDialog } = useDynamicDialog()

const {
  actividades,
  paginacionActividades,
  actividad_getActividades
} = useActividadStore()

const { mantenedor_getInstituciones } = useMantenedorStore()

const isLoading = ref(false)
const diligenciasInstruidasFirst = ref(0)

function getDiligencias (pagination = undefined) {
  if (!props.idCausa) return

  if (!pagination) {
    diligenciasInstruidasFirst.value = 0
  }

  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': props.idCausa,
        'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
        'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => { isLoading.value = l }
  })
}

function openModalVerDocumento (idDocumentoSolicitud) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: idDocumentoSolicitud
    }
  })
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getInstituciones })
}

onMounted(() => {
  getDataMantenedor()
  getDiligencias()
})

</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  padding-left: 2rem;
  padding-top: 0;
  margin-top: 0;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
li {
  font-size: 1.2rem;
}
</style>
