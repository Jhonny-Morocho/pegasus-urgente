<template>
<section>
  <AppFieldset
    class="pb-3 mt-4 custom"
    legend="Resumen de la Causa"
  >
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Fecha creación: </strong>{{ resumenCausa?.fechaHoraCreacion }}</p>
      <p><strong>Fecha asignación: </strong>{{ resumenCausa?.fechaHoraAsignacion }}</p>
      <p><strong>Estado de la causa: </strong>{{ resumenCausa?.nombreCausa }}</p>
      <p><strong>Etapa de la causa: </strong>{{ resumenCausa?.nombreCausa }}</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Cantidad de sujetos: </strong>{{ tables.sujetos.isLoading ? 'Cargando...' : sujetosIntervinientes.length }}</p>
      <p><strong>Cantidad de delitos: </strong>{{ tables.delitos.isLoading ? 'Cargando...' : delitos.length }}</p>
      <p><strong>Cantidad de relaciones: </strong>{{ tables.relaciones.isLoading ? 'Cargando...' : relaciones.length }}</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Cantidad de diligencias: </strong>0</p>
      <p><strong>Cantidad de especies: </strong>{{ tables.especies.isLoading ? 'Cargando...' : especies.length }}</p>
      <p><strong>Alertas </strong>Tramitación</p>
    </div>
  </AppFieldset>
  <AppFieldset
    class="pb-3 mt-4"
    legend="Información de la Denuncia"
  >
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Tipo Denuncia: </strong>Física</p>
      <p><strong>N° Parte/Denuncia: </strong>2652652155</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Organismo colaborador: </strong>Carabineros de Chile</p>
      <p><strong>Unidad Policial: </strong>5ta. Comisaría de Casablanca</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Funcionario a cargo: </strong>Mario Salgado F.</p>
      <p><strong>Cargo Funcionario: </strong>Cabo 2do.</p>
    </div>
  </AppFieldset>
  <AppFieldsetCustom
    class="pb-3 mt-4"
    label="Información del Denunciante"
    :panel="paneles.infoDenunciante"
  >
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>N° Documento: </strong>19.099.384-1</p>
      <p><strong>Nombre Completo: </strong>Franco Antonio Gallegos Muñoz</p>
      <p><strong>Tipo persona: </strong>Natural</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Nacionalidad: </strong>Chilena</p>
      <p><strong>Fecha de Nacimiento: </strong>29-11-1995</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Edad: </strong>34</p>
      <p><strong>Género: </strong>Masculino</p>
    </div>
  </AppFieldsetCustom>
  <AppFieldsetCustom
    label="Sujetos/Intervinientes"
    :panel="paneles.sujetos"
  >
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
    <TablaSujetos
      v-model:first="tables.sujetos.firstRecord"
      :loading="tables.sujetos.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="sujetosIntervinientes"
      @page="getSujetos"
    />
  </AppFieldsetCustom>
  <AppFieldsetCustom
    class="mt-5"
    label="Delitos"
    :panel="paneles.delitos"
  >
    <TablaDelitos
      :data-delitos="delitos"
      :loading="tables.delitos.isLoading"
      :paginacion="pagDelitos"
      read-only
      @page="getDelitos"
    />
  </AppFieldsetCustom>
  <AppFieldsetCustom
    label="Relaciones"
    :panel="paneles.relaciones"
  >
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
      class="mb-6"
      :data-relaciones="relaciones"
      :loading="tables.relaciones.isLoading"
      read-only
      :total-records="pagRelaciones?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldsetCustom>
  <AppFieldsetCustom
    class="mt-5 pb-0"
    label="Relato del Hecho"
    :panel="paneles.relato"
  >
    <LoaderSkeleton
      v-if="tables.relato.isLoading"
      height="300px"
    />
    <EditorRelato
      v-else
      class="mb-0 pb-0"
      :is-loading-plantilla="tables.relato.isLoading"
      read-only
      :relato="propRelato"
    />
  </AppFieldsetCustom>
  <AppFieldsetCustom
    label="Especies/Dinero"
    :panel="paneles.especies"
  >
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
    <TablaEspecies
      v-model:first="tables.especies.firstRecord"
      class="mb-6"
      :loading="tables.especies.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="especies"
      @page="getEspecies"
    />
  </AppFieldsetCustom>
</section>
</template>

<script setup>
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import TablaSujetos from '@/modules/tramitar-audiencia/components/tables/TablaSujetos.vue'
import TablaEspecies from '@/modules/tramitar-audiencia/components/actualizar-minuta/TablaEspecies.vue'
import EditorRelato from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import AppFieldsetCustom from '@/modules/common/components/AppFieldsetCustom.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { requestUtil } from '@/utils'
import { computed, onMounted, reactive } from 'vue-demi'
import { useDelitoStore, useEspeciesDineroStore, useMantenedorStore, useRelacionesStore, useRelatoStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { usePanelesStore, useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  anotaciones: {
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
  },
  documentos: {
    firstRecord: 0,
    isLoading: false
  },
  relato: {
    firstRecord: 0,
    isLoading: false
  },
  delitos: {
    firstRecord: 0,
    isLoading: false
  }
})

const { resumenCausa, idDenuncia } = useTramitarAudiencia()

// /* === Relaciones === */

const { paginacion: pagRelaciones, relaciones, relaciones_getRelaciones } = useRelacionesStore()

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

// /* === Sujetos === */

/*eslint-disable*/
const { sujetosIntervinientes, sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()
const { mantenedor_getNombreTipoSujeto } = useMantenedorStore()
async function getSujetos(pagination = undefined) {
  if (!pagination) {
    tables.sujetos.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.sujetos.isLoading = l),
    resolve: (sujetos) => {
      getDenunciante()
    }
  })
}

const getDenunciante = () => {
  // const denunciante = sujetosIntervinientes.find(sujeto=> )
}

// /* === Especies === */

const { especies, especiesDinero_getEspecieByIdDenuncia } = useEspeciesDineroStore()

async function getEspecies(pagination = undefined) {
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
    loader: (l) => (tables.especies.isLoading = l),
    resolve: () => {
      // Lógica para eliminar imputados
    }
  })
}

// /* === Relato === */

const { relato, relato_getRelatoByIdDenuncia } = useRelatoStore()

const propRelato = computed(() => {
  return {
    relato: relato.value?.relato
  }
})

function getRelato() {
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => (tables.relato.isLoading = l)
  })
}

// /* === Delitos === */

const { paginacion: pagDelitos, delitos, delito_getDelitoByIdDenuncia } = useDelitoStore()

function getDelitos(pagination = undefined) {
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (tables.delitos.isLoading = l)
  })
}

/* === Modal de Paneles === */

const { paneles } = usePanelesStore()

onMounted(async () => {
  getRelaciones()
  getSujetos()
  getEspecies()
  getRelato()
  getDelitos()
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.p-fieldset {
  position: relative;
}
.star_icon {
  position: absolute;
  top: -7px;
  right: 11px;
  cursor: pointer;
}
</style>
