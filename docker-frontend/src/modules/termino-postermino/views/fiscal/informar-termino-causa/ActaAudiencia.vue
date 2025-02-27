<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Resolución de Tribunal / Acta de Audiencia"
/>
<section class="mt-8">
  <AppFieldset legend="Resolución de Tribunal / Acta de Audiencia">
    <div class="px-3 col-12 grid">
      <div class="col-6 flex flex-column">
        <p class="mb-4">
          <strong>Término o Suspensión:</strong> {{ decisionCausa?.decision }}.
        </p>
        <p class="mb-4">
          <strong>Tipo de Término o Suspensión:</strong> {{ decisionCausa?.tipo }}.
        </p>
        <p class="mb-4">
          <strong>Subtipo de Término o Suspensión:</strong> {{ decisionCausa?.subTipo || 'Sin Subtipo' }}.
        </p>
      </div>
    </div>
    <div class="col-12">
      <AppFieldset
        legend="Datos Generales"
        :toggleable="true"
      >
        <div class="col-12 grid">
          <div class="col-6 flex flex-column">
            <p class="mb-4">
              <strong>RUC:</strong> {{ ruc }}
            </p>
            <p class="mb-4">
              <strong>RIT:</strong> {{ resumenCausa?.rit }}
            </p>
          </div>
          <div class="col-6 flex flex-column">
            <p class="mb-4">
              <strong>Nombre Causa:</strong> {{ resumenCausa?.nombreCausa }}
            </p>
            <p class="mb-4">
              <strong>Fiscal Asignado:</strong> {{ resumenCausa?.nombreFiscalAsignado }}
            </p>
          </div>
        </div>
      </AppFieldset>
    </div>
    <div class="col-12">
      <AppFieldset
        legend="Antecedentes de la Audiencia"
        :toggleable="true"
      >
        <div class="col-12 grid">
          <div class="col-6 flex flex-column">
            <p class="mb-4">
              <strong>Tipo Audiencia:</strong> {{ antecedentesAudiencia?.tipo }}
            </p>
            <p class="mb-4">
              <strong>Juez:</strong> {{ antecedentesAudiencia?.juez }}
            </p>
            <p class="mb-4">
              <strong>Defensor:</strong> {{ antecedentesAudiencia?.defensor }}
            </p>
            <p class="mb-4">
              <strong>Fiscal Audiencia:</strong> {{ antecedentesAudiencia?.fiscal }}
            </p>
            <p class="mb-4">
              <strong>Fecha de Término:</strong> {{ decisionCausa?.fecha }}
            </p>
          </div>
          <div class="col-6 flex flex-column">
            <p class="mb-4">
              <strong>Fecha Audiencia:</strong> {{ antecedentesAudiencia?.fecha }}
            </p>
            <p class="mb-4">
              <strong>Tribunal:</strong> {{ antecedentesAudiencia?.tribunal }}
            </p>

            <p class="mb-4">
              <strong>Sala:</strong> {{ antecedentesAudiencia?.sala }}
            </p>
            <p class="mb-4">
              <strong>Bloque Agendado:</strong> {{ antecedentesAudiencia?.bloque }}
            </p>
          </div>
        </div>
      </AppFieldset>
    </div>
    <div class="col-12">
      <AppFieldset
        legend="Relaciones"
        :toggleable="true"
      >
        <TablaRelaciones
          v-model:first="tables.relaciones.firstRecord"
          :loading="tables.relaciones.isLoading"
          read-only
          :total-records="paginacion?.elementosTotales"
          :value="relaciones"
          @page="getRelaciones"
        />
      </AppFieldset>
    </div>
    <div class="col-12">
      <AppFieldset
        legend="Medidas Cautelares Vigentes"
        :toggleable="true"
      >
        <TablaMedidasCautelares :value="antecedentesAudiencia?.medidasCautelares" />
      </AppFieldset>
    </div>
    <div class="col-12">
      <AppFieldset
        legend="Apercibimiento"
        :toggleable="true"
      >
        <TablaApercibimiento :value="antecedentesAudiencia?.apercibimiento" />
      </AppFieldset>
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
/* eslint-disable */
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import TablaMedidasCautelares from '@/modules/termino-postermino/components/tablas/TablaMedidasCautelares.vue'
import TablaApercibimiento from '@/modules/termino-postermino/components/tablas/TablaApercibimiento.vue'
// import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { onMounted, reactive, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useMenuSuperior, useTermino } from '@/modules/termino-postermino/composables'
import { useRelacionesStore } from '@/modules/global/composables'

const { ruc, idDenuncia, resumenCausa, termino_getAntecedentesAudiencia, termino_getDecisionCausa } = useTermino()

const { itemsMenuSuperior } = useMenuSuperior(ruc)
const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  }
})

const antecedentesAudiencia = ref({})
const decisionCausa = ref({})

async function getAntecedentesAudiencia() {
  requestUtil({
    action: termino_getAntecedentesAudiencia,
    reject: (e) => console.error(e),
    resolve: (res) => {
      antecedentesAudiencia.value = res
    }
  })
}
async function getDecisionCausa() {
  requestUtil({
    action: termino_getDecisionCausa,
    reject: (e) => console.error(e),
    resolve: (res) => {
      decisionCausa.value = res
    }
  })
}

async function getRelaciones(pagination = undefined) {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }
  console.log({ ruc })

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.relaciones.isLoading = l),
    resolve: (res) => {
      console.log('Relaciones Obtenidas: ', res.data)
    }
  })
}

onMounted(async () => {
  getRelaciones()
  getDecisionCausa()
  getAntecedentesAudiencia()
})
</script>
<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
</style>
