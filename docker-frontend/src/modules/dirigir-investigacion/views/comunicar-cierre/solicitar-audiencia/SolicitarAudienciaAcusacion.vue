<template>
<section class="mt-3">
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
      :rows="paginacionRelaciones?.tamanoPagina"
      :total-records="paginacionRelaciones?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    >
      <template #URAVIT>
        <Column header="Derivado a URAVIT">
          <template #body>
            No
          </template>
        </Column>
      </template>
    </TablaRelaciones>
  </AppFieldset>
  <AppFieldset legend="Testigos">
    <TablaSujetos
      v-model:selection="formData.testigosSeleccionados"
      :edad="false"
      :value="sujetosIntervinientes"
      @page="getSujetos"
    />
  </AppFieldset>
  <AppFieldset legend="Especies / Dinero">
    <TablaEspecies :value="especies" />
  </AppFieldset>
  <AppBtnNextTeleported
    label="Preparar Escrito"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
/* eslint-disable */
import { reactive, onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useAppDialog, useFormValidation } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ResumenCausa from '@/modules/dirigir-investigacion/components/ResumenCausa.vue'

import { useEspeciesDineroStore, useMantenedorStore, useRelacionesStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaSujetos from '@/modules/dirigir-investigacion/components/comunicar-cierre/TablaTestigosComunicarCierre.vue'
import TablaEspecies from '@/modules/dirigir-investigacion/components/comunicar-cierre/TablaEspeciesComunicarCierre.vue'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import { useRouter } from 'vue-router'

const { launchDialog } = useAppDialog()
const { plantillasDiligencia, mantenedor_getPlantillasDiligencia } = useMantenedorStore()

const { ruc, resumenCausa } = useDirigirInvestigacionStore()
const { relaciones, relaciones_getRelacionesEnCausa, paginacion: paginacionRelaciones } = useRelacionesStore()
const { sujetosIntervinientes, sujetosIntervinientes_getSujetosEnCausa, paginacion: paginacionSujetos } = useSujetosIntervinientesStore()
const { especies, especiesDinero_getEspeciesEnCausa, paginacion: paginacionEspecies } = useEspeciesDineroStore()

const router = useRouter()
const prueba = ref(true)

const formData = reactive({
  testigosSeleccionados: []
})

const { formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'comunicar-cierre-escrito-form'
})

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  sujetos: {
    firstRecord: 0,
    isLoading: false
  },
  especies: {
    firstRecord: 0,
    isLoading: false
  }
})

const handleNextStep = () => {
  router.push({ name: 'DICCSolicitudAudienciaPrepararEscrito' })
}

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

const getEspecies = async (pagination = undefined) => {
  if (!pagination) {
    tables.especies.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: especiesDinero_getEspeciesEnCausa,
    payload: { ruc: ruc.value, params }
  })
}
const getSujetos = async (pagination = undefined) => {
  if (!pagination) {
    tables.sujetos.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosEnCausa,
    payload: { idGlobal: ruc.value, params }
  })
}

const derivaMaterializacionEquipoJuridicoOptions = [
  { value: true, descripcion: 'Si' },
  { value: false, descripcion: 'No' }
]

onMounted(async () => {
  getRelaciones()
  getSujetos()
  getEspecies()
  requestUtil({ action: mantenedor_getPlantillasDiligencia })
})
</script>
