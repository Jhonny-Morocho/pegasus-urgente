<template>
<div>
  <!-- Resumen de la Causa -->
  <AppFieldset
    class="w-full"
    legend="Resumen de la Causa"
  >
    <LoaderSkeleton
      v-if="isLoadingResumen"
      height="369px"
    />
    <DetalleResumenCausa
      v-else
      :resumen-causa="resumenCausa"
    />
  </AppFieldset>

  <!-- Alertas (sin servicio) -->
  <AppFieldset
    class="w-full"
    legend="Alertas y Notificaciones"
  >
    <div class="col-12">
      <p class="text-center text-2xl">
        SIN ALERTAS
      </p>
    </div>
  </AppFieldset>

  <!-- Causas Relacionadas -->
  <AppFieldset
    class="w-full"
    legend="Causas Relacionadas Guardadas"
  >
    <TablaCausasRelacionadasGuardadas
      v-model:first="firstRecord"
      :causas-relacionadas-guardadas="causasRelacionadasGuardadas"
      :loading="isLoadingTablaCausasRelacionadas"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      @causa-relacionada:eliminar-causa-relacionada="deleteCausaRelacionada"
      @page="getCausasRelacionadas"
    />
  </AppFieldset>

  <!-- Georreferenciacion GUardada (sin servicio) -->
  <AppFieldset
    class="w-full"
    legend="Georreferenciación Guardada"
  >
    <TablaGeorreferenciacionGuardadas
      :loading="isLoadingGeorreferenciaGuardada"
      :total-records="georreferenciacionGuardadas?.length"
      :value="georreferenciacionGuardadas"
      @georreferencia-guardada:eliminar-georreferencia="deleteGeorreferenciacion"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useCausasRelacionadasStore, useGeorreferenciaStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import DetalleResumenCausa from '@/modules/dirigir-investigacion/components/resumen-causa/DetalleResumenCausa.vue'
import TablaCausasRelacionadasGuardadas from '@/modules/dirigir-investigacion/components/resumen-causa/TablaCausasRelacionadasGuardadas.vue'
import TablaGeorreferenciacionGuardadas from '@/modules/dirigir-investigacion/components/resumen-causa/TablaGeorreferenciacionGuardadas.vue'
import { useConfirmDialog } from '@/modules/common/composables'

const { launchConfirmDialog } = useConfirmDialog()

const {
  ruc,
  causa,
  idDenuncia,
  resumenCausa,
  dirigirInvestigacion_getResumenCausa
} = useDirigirInvestigacionStore()

const {
  causasRelacionadas_getCausasRelacionadas,
  causasRelacionadas_eliminarCausasRelacionadas,
  causasRelacionadas,
  paginacion
} = useCausasRelacionadasStore()

const {
  georreferencia_getFiscaliaCompetenciaTerritorialByIdDenuncia
} = useGeorreferenciaStore()

// eslint-disable-next-line no-unused-vars
const alertasYNotificaciones = ref(null)
const georreferenciacionGuardadas = ref(null)
const isLoadingResumen = ref(false)
const isLoadingTablaCausasRelacionadas = ref(false)
const isLoadingGeorreferenciaGuardada = ref(false)
const idCausa = computed(() => {
  return causa?.value?.data?.causa?.idCausa
})

const causasRelacionadasGuardadas = computed(() => {
  let causas = []

  if (causasRelacionadas.value) {
    causas = causasRelacionadas.value.filter(c => c.ruc !== ruc.value)
  }

  return causas
})

async function getDataInicial () {
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: { ruc: ruc.value },
    loader: (l) => { isLoadingResumen.value = l }
  })
  getCausasRelacionadas()

  requestUtil({
    action: georreferencia_getFiscaliaCompetenciaTerritorialByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value
    },
    loader: (l) => { isLoadingGeorreferenciaGuardada.value = l },
    resolve: (_res) => {
      georreferenciacionGuardadas.value = _res
      console.log(_res)
    },
    reject: (_err) => { console.log(_err) }
  })
}

const firstRecord = ref(0)
async function getCausasRelacionadas (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  await requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      idCausa: idCausa.value,
      params
    },
    loader: (l) => { isLoadingTablaCausasRelacionadas.value = l }
  })
}

function deleteCausaRelacionada (causaEliminar) {
  console.log('🚀 ~ file: ResumenCausa.vue:124 ~ deleteCausaRelacionada ~ causaEliminar', causaEliminar)
  launchConfirmDialog({
    header: 'Eliminar Causa Relacionada',
    message: `¿Estás seguro(a) de eliminar la causa con RUC: N° ${causaEliminar?.ruc}`,
    accept: async () => {
      isLoadingTablaCausasRelacionadas.value = true
      // params payload { idCausaPadre, idsCausasHijas[] }
      await requestUtil({
        action: causasRelacionadas_eliminarCausasRelacionadas,
        payload: {
          idCausaPadre: idCausa.value,
          idsCausasHijas: [causaEliminar.causaId]
        },
        resolve: () => {
          getCausasRelacionadas()
        }
      })
    }
  })
}

async function deleteGeorreferenciacion (georreferencia) {
  console.log(georreferencia)
}

onMounted(() => {
  getDataInicial()
})
</script>
