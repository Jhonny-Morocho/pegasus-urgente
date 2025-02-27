<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Actualizar Minuta"
/>
<section class="mt-6 mb-4">
  <AppFieldset
    class="pb-3"
    legend="Audiencia programada"
    :toggleable="true"
  >
    <div class="col-12 md:col-6 pl-4">
      <p><strong>Tribunal: </strong>Juzgado de Grantía Casablanca</p>
      <p><strong>Tipo de Audiencia: </strong>{{ tipoAudiencia?.descripcion }}</p>
      <p><strong>Número de la sala: </strong>{{ minuta?.numeroSala }}</p>
      <p><strong>Fecha/Hora: </strong>{{ minuta?.fechaAudiencia }}</p>
    </div>
    <div class="col-12 md:col-6 pr-4">
      <p><strong>Fiscal Litigador: </strong>{{ fiscalLitigador }}</p>
      <p><strong>Estado: </strong>{{ estadoCausa }}</p>
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
    legend="Relaciones"
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
    <TablaRelaciones
      v-model:first="tables.relaciones.firstRecord"
      class="mb-6"
      deriva-uravit
      :loading="tables.relaciones.isLoading"
      :total-records="paginacion?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
      @relacion:verDirectriz="handleVerDirectriz"
    />
  </AppFieldset>
  <AppFieldset
    legend="Directriz de Investigacion de la Causa"
    :toggleable="true"
  >
    <p><strong>Directriz de Investigación de la Causa : </strong>{{ minuta?.directriz?.descripcionDirectriz }}</p>
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
    <div class="mt-4 col-12 grid">
      <div class="md:col-10 sm:col-12 m-0">
        <AppInput
          id="input-anotacion"
          v-model="textoAnotacion"
          class="w-full p-fluid"
          label="Anotación"
        />
      </div>
      <div class="md:col-2 sm:col-12 m-0">
        <Button
          class="btn-form w-full"
          :disabled="!textoAnotacion"
          icon="pi pi-save"
          icon-pos="right"
          label="Agregar Anotación"
          @click="agregarAnotacion"
        />
      </div>
    </div>
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
      read-only
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="testigosEnAudiencia"
      @page="getTestigos"
    />
  </AppFieldset>
  <AppFieldset
    legend="Especies/Dinero"
    :toggleable="true"
  >
    <TablaEspecies
      v-model:first="tables.especies.firstRecord"
      v-model:selection="formData.especies"
      class="mb-6"
      :loading="tables.especies.isLoading"
      read-only
      selectable
      :total-records="paginacionEspecies?.elementosTotales"
      :value="especiesEnAudiencia"
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
      @click="actualizarMinuta"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
// components
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import TablaAnotaciones from '@/modules/global/components/historial-causa/TablaAnotaciones.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import TablaTestigos from '@/modules/tramitar-audiencia/components/actualizar-minuta/TablaTestigos.vue'
import TablaEspecies from '@/modules/tramitar-audiencia/components/tables/TablaEspecies.vue'
import TablaDocumentos from '@/modules/tramitar-audiencia/components/actualizar-minuta/TablaDocumentos.vue'
import ModalVerHistorial from '@/modules/tramitar-audiencia/components/modals/ModalVerHistorial.vue'
import ModalVerDirectriz from '@/modules/dirigir-investigacion/components/modals/ModalVerDirectriz.vue'
// composables
import { useAnotacionCausaStore, useDocumentoStore, useEspeciesDineroStore, useMantenedorStore, useRelacionesStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useTramitarAudiencia, useMenuSuperior } from '@/modules/tramitar-audiencia/composables'
import { useRouter } from 'vue-router'
import { useAppDialog, useAppGlobalProperties, useAppToast, useConfirmDialog } from '@/modules/common/composables'
// utils
import { requestUtil, dateTimeUtil } from '@/utils'

const router = useRouter()
const { toastSuccess, toastError } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()

const { tipoAudiencia, mantenedor_getTipoAudienciaById, mantenedor_getFiscalById, mantenedor_getEstadoCausaById } = useMantenedorStore()

const { $userName, $userRoles } = useAppGlobalProperties()

const {
  resumenCausa,
  ruc,
  idDenuncia,
  minuta,
  tramitarAudiencia_postMinuta
} = useTramitarAudiencia()

const { itemsMenuSuperior } = useMenuSuperior({ ruc })

const formData = reactive({
  testigos: null,
  especies: null,
  documentos: null
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
  }
})

const fiscalLitigador = ref()
const estadoCausa = ref()

onMounted(async () => {
  console.log('MINUTA', minuta.value)
  getDataMantenedores()
  getAnotaciones()
  getRelacionesEnAudiencia()
  getTestigos()
  getEspeciesEnAudiencia()
  getDocumentos()
})

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
// /* === Relaciones === */

const {
  paginacion,
  relaciones,
  relaciones_getByIdRelacionDelito
} = useRelacionesStore()

// buscamos las relaciones dentro de la causa por idDenuncia
// luego filtramos aquellas que se llevaron a Audiencia por el idRelacionDelito
function getRelacionesEnAudiencia () {
  minuta.value.minutaRelaciones.forEach((r) => {
    console.log('relacion', r)
    requestUtil({
      action: relaciones_getByIdRelacionDelito,
      payload: { idRelacionDelito: r.idRelacion },

      loader: (l) => { tables.relaciones.isLoading = l }
    })
  })
}
// /* === Testigos === */

const { sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

const testigos = ref([])
const testigosEnAudiencia = ref([])

function getTestigos (pagination = undefined) {
  if (!pagination) {
    tables.testigos.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: minuta.value.idDenuncia, params },
    loader: (l) => (tables.testigos.isLoading = l),
    resolve: (sujetos) => {
      testigos.value = sujetos.data.map((sujeto) => ({ ...sujeto, identidadProtegida: true, envioReservado: false }))
      // Lógica para eliminar imputados
      testigosEnAudiencia.value = testigos.value.filter((x) => x.tipoSujeto !== '06D276D1-4F17-4F10-AD53-80F54D67F7B2') // sea diferente a imputado
    }
  })
}

// /* === Especies === */

const {
  // especies,
  paginacionEspecies,
  especiesDinero_getEspecieByIdEspecie
} = useEspeciesDineroStore()

const especiesEnAudiencia = ref([])
function getEspeciesEnAudiencia () {
  minuta.value.minutaEspecie.forEach((e) => {
    requestUtil({
      action: especiesDinero_getEspecieByIdEspecie,
      payload: { idEspecie: e.idEspecie },
      resolve: (res) => {
        especiesEnAudiencia.value.push(res)
      }
    })
  })
  console.log(especiesEnAudiencia.value)
}
// /* === Documentos === */

const { documentos, documento_getDocumentosByIdDenuncia } = useDocumentoStore()

function getDocumentos (pagination = undefined) {
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

// /* === Events === */

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

function actualizarMinuta () {
  const bodyRequest = {
    idSolicitud: minuta.value.idSolicitud,
    idTarea: `${minuta.value.idTarea}`,
    minutaEspecies: formData?.especies || minuta.value.minutaEspecies,
    minutatestigos: formData?.testigos || minuta.value.minutatestigos,
    minutaDocumentos: formData?.documentos || minuta.value.minutaDocumentos
  }

  launchConfirmDialog({
    message: `¿Está seguro de Actualizar la Minuta?`,
    header: 'Aceptar',
    accept: () => {
      // #registrar fecha y hora por back, vuelve a la bandeja llega solicitud al PJUD
      requestUtil({
        action: tramitarAudiencia_postMinuta,
        payload: bodyRequest,
        resolve: () => {
          toastSuccess('Evaluación enviada')
          router.push({ name: 'TABandejaTramitarAudiencia' })
        },
        reject: () => { toastError('Error al enviar la solicitud de actualización') }
      })
    }
  })
}

function verHistorialDeAudiencias () {
  launchDialog({
    component: ModalVerHistorial,
    header: 'Ver Historial de Audiencias',
    props: { idCausa: minuta.value.idCausa }
  })
}

async function getDataMantenedores () {
  await requestUtil({
    action: mantenedor_getTipoAudienciaById,
    payload: { id: minuta.value.idTipoAudiencia }
  })

  await requestUtil({
    actionn: mantenedor_getFiscalById,
    payload: { idFiscal: minuta.value.idFiscalLitigador },
    resolve: (data) => { fiscalLitigador.value = data }
  })

  await requestUtil({
    actionn: mantenedor_getEstadoCausaById,
    payload: minuta.value.id_estado,
    resolve: (data) => { estadoCausa.value = data }
  })

  console.log('fiscal', fiscalLitigador.value)
}

function handleBackStep () {
  router.push({ name: 'TABandejaTramitarAudiencia' })
}
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
