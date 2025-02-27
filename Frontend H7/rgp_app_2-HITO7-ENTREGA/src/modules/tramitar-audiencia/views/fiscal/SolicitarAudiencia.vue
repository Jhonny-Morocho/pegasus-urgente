<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${resumenCausa.ruc}`"
  page-title="Solicitar Audienci"
/>
<section class="mt-6">
  <AppSteps
    class="mb-4"
    :model="stepsSolicitarAudiencia"
  />
  <ResumenCausa :colapse="true" />

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
      v-model:selection="formData.relacionesSeleccionadas"
      class="mb-6"
      :loading="relaciones.isLoading"
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="filtroRelaciones"
      @page="getRelaciones"
    />
  </AppFieldset>
  <AppFieldset legend="Lista de Especies Dinero">
    <TablaEspecies
      v-model:first="tables.especies.firstRecord"
      :loading="tables.especies.isLoading"
      :rows="paginacionEspecies?.tamanoPagina"
      selectable
      :total-records="paginacionEspecies?.elementosTotales"
      :value="especies"
      @page="getEspecies"
    />
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar Respuesta"
      @click="handleDecision"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import ResumenCausa from '@/modules/termino-postermino/views/revisar-antecedentes-causa/ResumenCausa.vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import TablaRelaciones from '@/modules/global/components/relaciones/TablaRelaciones.vue'
import TablaEspecies from '@/modules/dirigir-investigacion/components/TablaEspecies.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import { appUtil, requestUtil } from '@/utils'
import { computed, onMounted, reactive, ref } from 'vue'
import { useMenuSuperior, useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { useRelacionesStore, useEspeciesDineroStore } from '@/modules/global/composables'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleBackStep = () => {
  router.push({ name: '' })
}

const { resumenCausa, ruc, idDenuncia } = useTramitarAudiencia()
const { itemsMenuSuperior } = useMenuSuperior({ ruc })

const stepsSolicitarAudiencia = ref([
  {
    label: 'Resumen/ Relaciones / Especie',
    to: ''
  },
  {
    label: '¿Desea agregar medidas cautelares?',
    to: ''
    // visible: canContinue.value
  },
  {
    label: 'Elaboración del Escrito',
    to: ''
    // visible: canContinue.value
  }
])

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  especies: {
    firstRecord: 0,
    isLoading: false
  }
})

const formData = reactive({
  relacionesSeleccionadas: []
})

/* === Relaciones === */

const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

const inputFiltro = ref('')
const { includeWord } = appUtil

const filtroRelaciones = computed(() => {
  const relations = relaciones.value
  if (inputFiltro.value) {
    return relations?.filter(
      (relations) =>
        includeWord(relations.nombreCompletoVictima, inputFiltro.value) ||
        includeWord(relations.nombreCompletoImputado, inputFiltro.value) ||
        includeWord(relations.delito, inputFiltro.value) ||
        includeWord(relations.estado, inputFiltro.value) ||
        includeWord(relations.etapa, inputFiltro.value)
    )
  }
  return relations
})

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
    payload: { idDenuncia: idDenuncia, params },
    loader: (l) => (tables.relaciones.isLoading = l)
  })
}

/* === ESPECIES === */

const { especies, especiesDinero_getEspecieByIdDenuncia, paginacionEspecies } = useEspeciesDineroStore()

async function getEspecies (pagination = undefined) {
  if (!pagination) {
    tables.especies.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.especies.isLoading = l)
  })
}

async function handleDecision () {
  // avanzar al step 2
}

onMounted(() => {
  getRelaciones()
  getEspecies()
})
</script>
