<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa ?? 'Causa sin nombre'}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Evaluar Resolución del Tribunal"
/>
<section class="mt-6">
  <AppFieldset
    legend="Resumen de la Causa"
  >
    <div
      v-if="hideWhileLoading"
      class="w-full"
    >
      <LoaderSkeleton />
    </div>
    <DetalleResumenCausa
      v-else
      :resumen-causa="resumenCausa"
    />
  </AppFieldset>
  <AppFieldset legend="Relaciones">
    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
      <InputText
        id="filter-text"
        class="p-inputtext-sm"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary p-button-sm"
        icon="pi pi-search"
      />
    </div>
    <TablaRelaciones
      v-model:first="tables.relaciones.firstRecord"
      :data-relaciones="relaciones"
      :loading="tables.relaciones.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>
  <AppFieldset
    legend="Resolución de Tribunal"
  >
    <div class="col-12 md:col-6">
      <p><strong>Id solicitud: </strong>{{ resolucionTribunal?.ruc }}</p>
      <p><strong>Tribunal: </strong>{{ resolucionTribunal?.tribunal }}</p>
      <p><strong>Fecha de Respuesta: </strong>{{ resolucionTribunal?.fechaRespuesta }}</p>
    </div>
    <div class="col-12 md:col-6">
      <p><strong>Fecha/Hora Audiencia: </strong>{{ resolucionTribunal?.fechaAudiencia || 'N/A' }}</p>
      <p><strong>RIT: </strong>{{ resolucionTribunal?.rit || 'N/A' }}</p>
      <p><strong>Número de resolución: </strong>{{ resolucionTribunal?.numResolucion || 'N/A' }}</p>
    </div>
    <div class="col-12 texto p-6">
      {{ resolucionTribunal?.textoPjud }}
    </div>
    <div class="col-12 md:col-6 lg:col-4 mt-2">
      <Button
        class="p-button-outlined w-full"
        icon="pi pi-file"
        icon-pos="right"
        label="Ver Resolución"
        @click="openVerResolucion"
      />
    </div>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaRelaciones from '@/modules/tramitar-audiencia/components/tables/TablaRelaciones.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'
import { requestUtil } from '@/utils'
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { useRelacionesStore } from '@/modules/global/composables'
import { useTramitarAudiencia, useMenuSuperior } from '@/modules/tramitar-audiencia/composables'
import { useAppDialog } from '@/modules/common/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import DetalleResumenCausa from '@/modules/tramitar-audiencia/components/DetalleResumenCausa.vue'

const router = useRouter()

const handleBackStep = () => {
  router.push({ name: 'TABandejaTramitarAudiencia' })
}

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  }
})

const { launchDialog } = useAppDialog()

const { resumenCausa, ruc, idDenuncia, tramitarAudiencia_getAntecedentesCausa } = useTramitarAudiencia()

const { itemsMenuSuperior } = useMenuSuperior({ ruc })

// /* === Relaciones === */

const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

const hideWhileLoading = ref(true)

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.relaciones.isLoading = l)
  })
}

// /* === Resolucion Tribunal === */

const resolucionTribunal = ref({})

async function getResolucionTribunal () {
  const resolucionFromBack = {
    id: '2353252',
    fechaRespuesta: '15-07-2022',
    fechaAudiencia: `22-07-2022 09:45`,
    rit: '5683-9735',
    numResolucion: '564754',
    tribunal: 'Juzgado de Garantía de Casablanca',
    textoPjud: 'Texto pjud de muestra...'
  }

  resolucionTribunal.value = resolucionFromBack
}

// /* ******************** */

function openVerResolucion () {
  launchDialog({
    component: ModalVerDocumento,
    header: 'Ver Resolución'
  })
}

onMounted(async () => {
  await getResolucionTribunal()
  await getRelaciones()
  requestUtil({
    action: tramitarAudiencia_getAntecedentesCausa,
    resolve: (r) => { hideWhileLoading.value = false }
  })
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.link {
  color: #2c6ddf;
  cursor: pointer;
}
.texto {
  border-radius: 8px;
  border: solid 1px #222;
}
</style>
