<template>
<section class="mt-3">
  <PageHeader
    class="mb-8"
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`Nombre Causa: ${resumenCausa?.nombreCausa}`"
    :page-subtitle="`RUC ${ruc}`"
    page-title="Evaluar Resultado de Cierre"
  />
  <AppFieldset
    legend="Resumen Causa"
    toggleable
  >
    <ResumenCausa :causa="resumenCausa" />
  </AppFieldset>
  <AppFieldset
    legend="Relaciones"
    toggleable
  >
    <LoaderSkeleton
      v-if="tables.relaciones.isLoading"
      height="220px"
    />
    <TablaRelaciones
      v-else
      v-model:first="tables.relaciones.firstRecord"
      class="col-12"
      :loading="tables.relaciones.isLoading"
      read-only
      :rows="paginacionRelaciones?.tamanoPagina"
      :total-records="paginacionRelaciones?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>

  <AppFieldset
    class="w-full mb-6"
    legend="Resolución del Tribunal"
  >
    <div class="mb-4 col-12 grid">
      <div class="col-12 md:col-6">
        <p class="col-12 mb-4 p-0">
          <span style="font-weight: bold">Fiscalía:</span>
          {{ mockEvaluarResultado?.Id }}
        </p>
        <p class="col-12 mb-4 p-0">
          <span style="font-weight: bold">Fiscal Asignado:</span>
          {{ mockEvaluarResultado?.Tribunal }}
        </p>
        <p class="col-12 mb-4 p-0">
          <span style="font-weight: bold">Fecha de Respuesta:</span>
          {{ mockEvaluarResultado?.FechaRespuesta }}
        </p>
      </div>
      <div class="col-12 md:col-6">
        <p class="col-12 mb-4 p-0">
          <span style="font-weight: bold">Fecha/Hora Audiencia:</span>
          {{ mockEvaluarResultado?.FechaAudiencia }}
        </p>
        <p class="col-12 mb-4 p-0">
          <span style="font-weight: bold">RIT:</span>
          {{ mockEvaluarResultado?.Rit }}
        </p>
        <p class="col-12 mb-4 p-0">
          <span style="font-weight: bold">Número de resolución:</span>
          {{ mockEvaluarResultado?.NumeroResolución }}
        </p>
      </div>
    </div>
    <h3 class="col-12 font-normal">
      Texto de Resolución del PJUD
    </h3>
    <Editor
      id="editor-evaluar-resultado-cierre"
      v-model="mockEvaluarResultado.TextoResolucion"
      class="col-12 w-full"
      editor-style="height: 256px"
      readonly
    >
      <template #toolbar>
        <span class="p-0" />
      </template>
    </Editor>
  </AppFieldset>

  <AppBtnsSteps
    @back-step="$router.push({ name: 'BandejaDirigirInvestigacion' })"
  />
</section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import ResumenCausa from '@/modules/dirigir-investigacion/components/ResumenCausa.vue'

import { useRelacionesStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

const { ruc, resumenCausa } = useDirigirInvestigacionStore()
const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value || '20000001992-6' // por si acaso
})
const { relaciones, relaciones_getRelacionesEnCausa, paginacion: paginacionRelaciones } = useRelacionesStore()

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  }
})

const getRelaciones = async (pagination = undefined) => {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: relaciones_getRelacionesEnCausa,
    payload: { ruc: ruc.value, params },
    loader: (l) => (tables.relaciones.isLoading = l)
  })
}

const mockEvaluarResultado = ref({
  Id: 235335,
  Tribunal: 'Juzgado de Garantía de Casablanca',
  FechaRespuesta: '15-07-2022',
  FechaAudiencia: '22-07-2022 09:45',
  Rit: '5683-9735',
  NumeroResolución: '63457-2',
  TextoResolucion: `<strong>Santiago, 31 de marzo de 2020</strong>.
A lo principal y otro sí :

Como se pide, se fija Audiencia de Cierre de la Investigación para el día 15 de febrero de 2020, a las 10:50 horas, en este Tribunal      
ubicado en Juan Leiva Amor 147, Casablanca.

Cítese a todos los intervinientes a la referida audiencia. Notifíquese personalmente, facultándose realizar dicha notificación por el 
artículo 44, inciso 2° del Código de Procedimiento Penal, al imputado AUGUSTO FIORETTI JARA.
                
 Notifíquese a los intervinientes por correo electrónico.

 RUC: 2000001992-6

 RIT: 12345-6
                            
 Resolvió don GERMÁN GÓNZALEZ SILVA,
 Juez Titular del Juzgado de Garantía de Casablanca.`
})

onMounted(async () => {
  getRelaciones()
})
</script>
