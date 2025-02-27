<template>
<section>
  <div class="col-12 grid m-0 justify-content-end">
    <Button
      class="p-button-outlined p-button-info px-3 py-3"
      icon="pi pi-plus"
      icon-pos="left"
      label="Agregar Paneles"
      @click="launchPanelesModal"
    />
  </div>
  <AppFieldset
    class="pb-3 mt-4"
    legend="Información audiencia"
    :toggleable="true"
  >
    <div class="col-12 md:col-4 pl-4">
      <p><strong>Fecha/Hora: </strong>23-01-2019 11:30</p>
      <p><strong>Tribunal: </strong>Juzgado de Grantía Casablanca</p>
      <p><strong>Tipo de Audiencia: </strong>Audiencia para Acusación</p>
    </div>
    <div class="col-12 md:col-4 pr-4">
      <p><strong>Sala: </strong>Sala 3</p>
      <p><strong>Fiscal Litigador: </strong> Samuel Núñez</p>
      <p><strong>Juez: </strong> Rodrigo Pérez</p>
    </div>
    <div class="col-12 md:col-4 pr-4">
      <p><strong>Estado: </strong>Programada</p>
      <Button
        class="p-button-outlined p-button-info px-5 py-3"
        icon="pi pi-external-link"
        icon-pos="right"
        label="Ver Historial de Audiencias"
        @click="verHistorialDeAudiencias"
      />
    </div>
  </AppFieldset>
  <AppFieldset
    class="pb-3 mt-4"
    legend="Resumen de la Causa"
    :toggleable="true"
  >
    <DetalleResumenCausa :resumen-causa="resumenCausa" />
  </AppFieldset>
  <AppFieldset legend="Directriz de Investigacion de la Causa">
    <p><strong>Directriz de Investigación de la Causa : </strong>Directriz...</p>
  </AppFieldset>
  <AppFieldset legend="Anotaciones">
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
    <TablaAnotaciones
      class="w-full"
      :loading="tables.anotaciones.isLoading"
      :read-only="false"
      :rows="paginacionAnotaciones?.tamanoPagina"
      :total-records="paginacionAnotaciones?.elementosTotales"
      :value="anotaciones"
      @page="getAnotaciones"
      @ver-anotacion="handleVerAnotacion"
    />
    <section class="mt-4 col-12 grid">
      <div class="col-9 m-0">
        <AppInput
          id="input-anotacion"
          v-model="textoAnotacion"
          class="w-full p-fluid"
          label="Anotación"
        />
      </div>
      <div class="col-3 m-0">
        <Button
          class="btn-form"
          :disabled="!textoAnotacion"
          icon="pi pi-save"
          icon-pos="right"
          label="Agregar Anotación"
          @click="agregarAnotacion"
        />
      </div>
    </section>
  </AppFieldset>
  <AppFieldset legend="Testigos para la Audiencia">
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
    <TablaTestigos
      v-model:first="tables.testigos.firstRecord"
      v-model:selection="formData.testigos"
      class="mb-6"
      :loading="tables.testigos.isLoading"
      read-only
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="testigos"
      @page="getTestigos"
    />
  </AppFieldset>
  <AppFieldset legend="Especies/Dinero para la audiencia">
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
      v-model:selection="formData.especies"
      class="mb-6"
      :loading="tables.especies.isLoading"
      read-only
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="especies"
      @page="getEspecies"
    />
  </AppFieldset>
  <AppFieldset legend="Documentos o Archivos para la audiencia">
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
    <TablaDocumentos
      v-model:first="tables.documentos.firstRecord"
      v-model:selection="formData.documentos"
      class="mb-6"
      :loading="tables.documentos.isLoading"
      read-only
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="documentos"
      @page="getDocumentos"
    />
  </AppFieldset>
  <AppFieldset
    legend="Audiencias Programadas"
    :toggleable="true"
  >
    <TablaHistorialAudiencias :estado-audiencia="true" />
  </AppFieldset>
  <AppFieldsetCustom
    v-if="paneles.relato.display"
    class="mt-5 pb-0"
    :panel="paneles.relato"
    :tooltip="true"
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
    v-if="paneles.infoDenunciante.display"
    class="pb-3 mt-4"
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
    v-if="paneles.relaciones.display"
    legend="Relaciones"
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
      checked
      class="mb-6"
      :data-relaciones="relaciones"
      :loading="tables.relaciones.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldsetCustom>
  <AppFieldsetCustom
    v-if="paneles.sujetos.display"
    legend="Sujetos/Intervinientes"
    :panel="paneles.sujetos"
    :tooltip="true"
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
    v-if="paneles.delitos.display"
    class="mt-5"
    legend="Delitos"
    :panel="paneles.delitos"
    :tooltip="true"
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
    v-if="paneles.especies.display"
    legend="Especies/Dinero"
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
      v-model:selection="formData.especies"
      class="mb-6"
      :loading="tables.especies.isLoading"
      read-only
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="especies"
      @page="getEspecies"
    />
  </AppFieldsetCustom>
</section>
</template>

<script setup>
import DetalleResumenCausa from '@/modules/termino-postermino/components/DetalleResumenCausa.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import TablaAnotaciones from '@/modules/global/components/historial-causa/TablaAnotaciones.vue'
import TablaTestigos from '@/modules/tramitar-audiencia/components/actualizar-minuta/TablaTestigos.vue'
import TablaSujetos from '@/modules/tramitar-audiencia/components/tables/TablaSujetos.vue'
import TablaEspecies from '@/modules/tramitar-audiencia/components/tables/TablaEspecies.vue'
import TablaDocumentos from '@/modules/tramitar-audiencia/components/actualizar-minuta/TablaDocumentos.vue'
import TablaHistorialAudiencias from '../../../components/tables/TablaHistorialAudiencias.vue'
import EditorRelato from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppFieldsetCustom from '@/modules/common/components/AppFieldsetCustom.vue'
import ModalPanelesVue from '@/modules/tramitar-audiencia/components/modals/ModalPaneles.vue'
import ModalVerDirectriz from '@/modules/dirigir-investigacion/components/modals/ModalVerDirectriz.vue'
import ModalVerHistorial from '@/modules/tramitar-audiencia/components/modals/ModalVerHistorial.vue'
import { useAnotacionCausaStore, useDelitoStore, useDocumentoStore, useEspeciesDineroStore, useRelacionesStore, useRelatoStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useAppDialog, useAppGlobalProperties, useAppToast } from '@/modules/common/composables'
import { usePanelesStore, useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import { computed, onMounted, reactive, ref } from 'vue-demi'

const { resumenCausa, idDenuncia } = useTramitarAudiencia()
const { $userName, $userRoles } = useAppGlobalProperties()
const { toastSuccess } = useAppToast()
const { launchDialog } = useAppDialog()

const formData = reactive({
  testigos: [],
  especies: [],
  documentos: []
})

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  anotaciones: {
    firstRecord: 0,
    isLoading: false
  },
  testigos: {
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
  sujetos: {
    firstRecord: 0,
    isLoading: false
  },
  delitos: {
    firstRecord: 0,
    isLoading: false
  },
  relato: {
    isLoading: false
  }
})

// /* === Relaciones === */

const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

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

// /* === Delitos === */

const { paginacion: pagDelitos, delitos, delito_getDelitoByIdDenuncia } = useDelitoStore()

function getDelitos (pagination = undefined) {
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

// /* === Anotaciones === */

const { paginacion: paginacionAnotaciones, anotaciones, anotacionCausa_getAnotacionesByIdDenuncia, anotacionCausa_crearAnotacion } = useAnotacionCausaStore()

const textoAnotacion = ref('')

async function getAnotaciones (pagination = undefined) {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: anotacionCausa_getAnotacionesByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.anotaciones.isLoading = l)
  })
}

function agregarAnotacion () {
  const rolUsuario = $userRoles.value.find((el) => el.includes('jefe')) ? 'Fiscal Jefe' : 'Fiscal'

  requestUtil({
    action: anotacionCausa_crearAnotacion,
    payload: {
      anotacion: {
        denunciaId: idDenuncia.value,
        anotacion: textoAnotacion.value,
        autor: $userName.value,
        rol: rolUsuario,
        etapa: 'Asignación',
        fechaCreacion: dateTimeUtil.formatToBackendWithTime(new Date())
      }
    },
    resolve: () => {
      toastSuccess('Anotación agregada')
      textoAnotacion.value = ''
      getAnotaciones()
    }
  })
}

// /* === Testigos === */

const { sujetosIntervinientes, sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

const testigos = ref([])

async function getTestigos (pagination = undefined) {
  if (!pagination) {
    tables.testigos.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.testigos.isLoading = l),
    resolve: (sujetos) => {
      console.log({ sujetos })
      testigos.value = sujetos.data.map((sujeto) => ({ ...sujeto, identidadProtegida: true, envioReservado: false }))
      console.log(testigos)
      // Lógica para eliminar imputados
    }
  })
}

// /* === Especies === */

const { especies, especiesDinero_getEspecieByIdDenuncia } = useEspeciesDineroStore()

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
    loader: (l) => (tables.especies.isLoading = l),
    resolve: () => {
      // Lógica para eliminar imputados
    }
  })
}

// /* === Documentos === */

const { documentos, documento_getDocumentosByIdDenuncia } = useDocumentoStore()

async function getDocumentos (pagination = undefined) {
  if (!pagination) {
    tables.documentos.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.documentos.isLoading = l),
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

function getRelato () {
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => (tables.relato.isLoading = l)
  })
}

/* === Modal de Paneles === */

const { paneles } = usePanelesStore()

const launchPanelesModal = () => {
  launchDialog({
    component: ModalPanelesVue,
    header: 'Agregar Paneles',
    width: '310px'
  })
}

// /* === Events === */
function verHistorialDeAudiencias () {
  launchDialog({
    component: ModalVerHistorial,
    header: 'Ver Historial de Audiencias'
  })
}

function handleVerAnotacion (anotacion) {
  launchDialog({
    component: ModalVerDirectriz,
    header: 'Ver Anotación',
    props: { directriz: anotacion.anotacion }
  })
}

onMounted(async () => {
  getAnotaciones()
  getRelaciones()
  getTestigos()
  getEspecies()
  getDocumentos()
  getRelato()
  getDelitos()
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
