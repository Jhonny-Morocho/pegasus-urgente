<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Revisar Minuta y Agendamiento de Audiencia"
/>
<section class="my-6">
  <AppFieldset
    class="pb-3"
    legend="Agendamiento de la Audiencia"
    :toggleable="true"
  >
    <div class="col-12 md:col-6 pl-4">
      <p><strong>RUC: </strong>{{ resumenCausa?.ruc }}</p>
      <p><strong>Tribunal: </strong>{{ audienciaAgendada.tribunal }}</p>
      <p><strong>Tipo de Audiencia: </strong>{{ audienciaAgendada.tipoAudiencia }}</p>
    </div>
    <div class="col-12 md:col-6 pr-4">
      <p><strong>Número de la sala: </strong>{{ audienciaAgendada.sala }}</p>
      <p><strong>Fecha/Hora: </strong>{{ audienciaAgendada.fechaHora }}</p>
      <p><strong>Juez: </strong>{{ audienciaAgendada.juez }}</p>
    </div>
  </AppFieldset>
  <div class="flex flex-row-reverse">
    <Button
      class="p-button-outlined mb-3"
      icon="pi pi-external-link"
      icon-pos="right"
      label="Ver Historial de Audiencia"
      @click="openVerHistorial"
    />
  </div>
  <div>
    <h2>Minuta de Audiencia</h2>
    <AppFieldset
      class="pb-3 mt-5"
      legend="Resumen de la Causa"
      :toggleable="true"
    >
      <DetalleResumenCausa :resumen-causa="resumenCausa" />
    </AppFieldset>
  </div>

  <AppFieldset
    legend="Relaciones"
    :toggleable="true"
  >
    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
      <InputText
        id="filter-text"
        v-model="inputFiltro"
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
      alerta
      class="mb-4"
      :loading="tables.relaciones.isLoading"
      :total-records="paginacion?.elementosTotales"
      :value="filtroRelaciones"
      @page="getRelaciones"
      @relacion:ver-directriz="handleVerDirectriz"
    />
  </AppFieldset>

  <AppFieldset
    legend="Directriz de Investigacion de la Causa"
    :toggleable="true"
  >
    <p><strong>Directriz de Investigación de la Causa : </strong>Directriz...</p>
  </AppFieldset>

  <AppFieldset
    legend="Historial de la Causa"
    :toggleable="true"
  >
    <AppFilters class="w-full mb-6" />

    <TablaHistorialCausa
      read-only
      responsive-layout="stack"
      :value="historialCausa"
    />
  </AppFieldset>

  <AppFieldset
    legend="Anotaciones"
    :toggleable="true"
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

  <AppFieldset
    legend="Audiencias Programadas"
    :toggleable="true"
  >
    <TablaHistorialAudiencias :estado-audiencia="true" />
  </AppFieldset>

  <AppFieldset
    legend="Testigos para la Audiencia"
    :toggleable="true"
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
    <TablaTestigos
      v-model:first="tables.testigos.firstRecord"
      v-model:selection="formData.testigos"
      class="mb-6"
      :loading="tables.testigos.isLoading"
      :opciones-sujeto="opcionesSujeto"
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="testigos"
      @page="getTestigos"
    />
  </AppFieldset>

  <AppFieldset
    legend="Especies/Dinero"
    :toggleable="true"
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
      :loading="tables.testigos.isLoading"
      read-only
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="especies"
      @page="getEspecies"
    />
  </AppFieldset>

  <AppFieldset
    legend="Documento o Archivo"
    :toggleable="true"
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
    <TablaDocumentos
      v-model:first="tables.documentos.firstRecord"
      v-model:selection="formData.documentos"
      class="mb-6"
      :loading="tables.documentos.isLoading"
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="documentos"
      @page="getDocumentos"
    />
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      icon="pi pi-save"
      icon-pos="right"
      label="Actualizar Minuta"
      @click="handleDecision"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaHistorialCausa from '@/modules/dirigir-investigacion/components/TablaHistorialCausa.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import TablaTestigos from '@/modules/tramitar-audiencia/components/actualizar-minuta/TablaTestigos.vue'
import TablaEspecies from '@/modules/tramitar-audiencia/components/actualizar-minuta/TablaEspecies.vue'
import TablaDocumentos from '@/modules/tramitar-audiencia/components/actualizar-minuta/TablaDocumentos.vue'
import TablaAnotaciones from '@/modules/global/components/historial-causa/TablaAnotaciones.vue'
import TablaHistorialAudiencias from '@/modules/tramitar-audiencia/components/tables/TablaHistorialAudiencias.vue'
import DetalleResumenCausa from '@/modules/tramitar-audiencia/components/DetalleResumenCausa.vue'
import ModalVerDirectriz from '@/modules/dirigir-investigacion/components/modals/ModalVerDirectriz.vue'
import ModalVerHistorial from '@/modules/tramitar-audiencia/components/modals/ModalVerHistorial.vue'
import ModalAnotacionAtencionUsuario from '@/modules/tramitar-audiencia/components/modals/ModalAnotacionAtencionUsuario.vue'
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref, computed } from 'vue'
import { requestUtil, dateTimeUtil, appUtil } from '@/utils'
import { useAppDialog, useAppGlobalProperties, useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useTramitarAudiencia, useMenuSuperior } from '@/modules/tramitar-audiencia/composables'
import { useAnotacionCausaStore, useDocumentoStore, useEspeciesDineroStore, useHistorialCausaStore, useRelacionesStore, useSujetosIntervinientesStore } from '@/modules/global/composables'

const router = useRouter()
const { toastSuccess } = useAppToast()
const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()

const handleBackStep = () => {
  router.push({ name: 'TABandejaTramitarAudiencia' })
}

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
  historial: {
    filters: {
      'fecha-desde': undefined,
      'fecha-hasta': undefined
    }
  }
})

const formData = reactive({
  testigos: [],
  especies: [],
  documentos: []
})

const opcionesSujeto = ref([
  {
    label: 'Ver anotaciones para preparación de testigos',
    command: () => {
      launchDialog({
        component: ModalAnotacionAtencionUsuario,
        header: 'Anotaciones desde Atención de Usuarios',
        props: {
          anotaciones: {},
          sujeto: {}
        }
      })
    }
  }
])

const { $userName, $userRoles } = useAppGlobalProperties()

const { resumenCausa, ruc, idDenuncia, tramitarAudiencia_updateActualizarMinuta } = useTramitarAudiencia()

const { itemsMenuSuperior } = useMenuSuperior({ ruc })

function openVerHistorial () {
  launchDialog({
    component: ModalVerHistorial,
    header: 'Ver Historial Audiencias',
    width: '80%'
  })
}

// el store de historial causa no tiene acciones ni bakend :V
const { historialCausa } = useHistorialCausaStore()

async function getHistorialCausa () {
  // pass
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
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.relaciones.isLoading = l)
  })
}

// /* === Testigos === */

const { sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

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
      testigos.value = sujetos.data.map((sujeto) => ({ ...sujeto, identidadProtegida: true, envioReservado: false }))
      console.log(testigos)
      // Falta lógica para eliminar imputados
    }
  })
}

/* === Especies === */

const {
  especies,
  // paginacionEspecies,
  especiesDinero_getEspecieByIdDenuncia
} = useEspeciesDineroStore()

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

/* === Documentos === */

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
    payload: {
      ruc: ruc.value,
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (tables.documentos.isLoading = l),
    resolve: () => {
      // Lógica para eliminar imputados
    }
  })
}

// /* === Audiencia Agendada === */
const audienciaAgendada = ref({
  tribunal: 'Juzgado de Garantía de Casablanca',
  tipoAudiencia: 'Audiencia para Acusación',
  sala: 'Sala 3',
  fechaHora: '23-01-2019 11:30',
  juez: 'Germán González Silva'
})

// /* ******************** */

async function handleDecision () {
  launchConfirmDialog({
    header: 'Actualizar Minuta',
    message: '¿Está seguro de Actualizar Minuta?',
    accept: () => {
      requestUtil({
        action: tramitarAudiencia_updateActualizarMinuta,
        payload: formData,
        resolve: () => {
          toastSuccess('Exitoso, Minuta Actualizada')
          router.push({ name: 'TABandejaTramitarAudiencia' })
        }
      })
    }
  })
}

function handleVerDirectriz (relacion) {
  launchDialog({
    component: ModalVerDirectriz,
    header: 'Ver Directriz',
    props: { directriz: relacion.nombreDelito }
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
  getHistorialCausa()
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
