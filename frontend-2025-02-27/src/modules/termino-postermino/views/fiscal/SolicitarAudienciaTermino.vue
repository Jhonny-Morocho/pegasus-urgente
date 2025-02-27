<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombre}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Solicitar Audiencia para Termino o Suspensión"
/>
<section class="mt-4">
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
      v-model:first="relaciones.firstRecord"
      :loading="loaders.relaciones.isLoading"
      :total-records="paginacion?.elementosTotales"
      :value="filtroRelaciones"
      @page="getRelaciones"
      @relacion:ver-directriz="verDirectriz"
    />
  </AppFieldset>
  <AppFieldset legend="Directriz de Investigación de la Causa">
    <div class="col-12 pl-4">
      <p>
        <strong>Directriz de Investigación de la Causa: </strong>
        Aquí las directrices de la causa...
      </p>
    </div>
  </AppFieldset>
  <AppFieldset legend="Decisión de Término / Suspensión">
    <div
      v-if="loaders.consultaTermino.isLoading"
      class="col-12"
    >
      <LoaderSkeleton height="140px" />
    </div>
    <div
      v-else
      class="flex col-12"
    >
      <div class="col-6">
        <p class="col-12">
          <span style="font-weight: bold">Decisión de Témino o Suspensión:</span>
          {{ consultaTermino?.idTipoTermino ? 'Término' : 'No defindo' }}.
        </p>
        <p class="col-12">
          <strong>Tipo de Término o Suspensión: </strong>{{ mantenedor_getDescripcionTipoTerminoById(consultaTermino?.idTipoTermino) }}.
        </p>
        <p class="col-12">
          <strong>Subtipo de Término o Suspensión: </strong>{{ mantenedor_getDescripcionTipoSubterminoById(consultaTermino?.idSubTipoTermino) }}.
        </p>
      </div>
      <div class="col-6">
        <p class="col-12">
          <strong style="font-weight: bold">Complemento para Decisión de término/suspensión:</strong>
          <br>
          <br>
          {{ complementoFiscal }}.
        </p>
        <p class="col-12" />
      </div>
    </div>
  </AppFieldset>

  <AppFieldset legend="Elaborar Escrito">
    <AppForm
      id="solicitar-audiencia-form"
      class="w-full"
      :form-submitted="formSubmitted"
      validation-scope="solicitar-audiencia-form"
    >
      <ComunicarCierreEscrito
        v-model="formData"
        class="col-12"
        :fiscalia="fiscaliaLocal"
      />
    </AppForm>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    class="btn-primary px-5"
    :disabled="formData.seDerivaEquipoJuridico === null"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar Solicitud"
    :loading="loaders.consultaTermino.isLoading"
    @click="postSolicitudAudiencia"
  />
</section>
</template>

<script setup>
/*eslint-disable*/
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import ComunicarCierreEscrito from '@/modules/termino-postermino/components/ComunicarCierreEscrito.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ModalVer from '@/modules/termino-postermino/components/modals/ModalMostrarData.vue'
import { onMounted, ref, computed, reactive } from 'vue'
import { requestUtil, appUtil } from '@/utils'
import { useRouter } from 'vue-router'
import { useConfirmDialog, useAppDialog, useFormValidation, useAppToast } from '@/modules/common/composables'
import { useMenuSuperior, useTermino } from '@/modules/termino-postermino/composables'
import { useAntecedentesCausaStore, useRelacionesStore, useMantenedorStore, usePamStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const router = useRouter()

const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' })
}

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess } = useAppToast()
const { mantenedor_getTipoOrigenActividad, mantenedor_getSubTiposTerminoByIdTermino, tipoOrigen, mantenedor_getDescripcionTipoTerminoById, mantenedor_getDescripcionTipoSubterminoById } = useMantenedorStore()

const formData = reactive({
  seDerivaEquipoJuridico: null,
  nombreTribunal: '',
  idPlantilla: null,
  textoFiscal: null,
  seRevisaEscrito: null,
  documentosSeleccionados: [],
  adjuntaCarpeta: false,
  instruccionFiscal: ''
})

const { formSubmitted, isFormValid } = useFormValidation({ formData, validationScope: 'solicitar-audiencia-form' })

const { ruc, idDenuncia, termino_getComplementoFiscal, termino_getRespuestaFiscalJefe, resumenCausa, termino_getConsultaTermino, termino_PamCompletarGestionarAudienciaSuspencionTermino, termino_postEscritoSolicitud, consultaTermino } =
  useTermino()

const { itemsMenuSuperior } = useMenuSuperior({ ruc })

const loaders = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  especies: {
    firstRecord: 0,
    isLoading: false
  },
  consultaTermino: {
    isLoading: true
  },
  antecedentesCausa: {
    isLoading: false
  }
})

/* === Directriz === */

const directricesRelacion = ref([])

function verDirectriz() {
  launchDialog({
    component: ModalVer,
    props: {
      data: {
        message: directricesRelacion
      }
    },
    header: 'Ver Directriz',
    cancelLabel: 'Cerrar'
  })
}

async function getDirectrices() {
  // requestUtil({
  //   action: dirigirInvestigacion_getObtenerDirectrizInvestigacion,
  //   payload: {
  //     ruc: ruc.value
  //   },
  //   resolve: (data) => {
  //     directrizCausa.value = [
  //       {
  //         directriz: data?.directrizCausa
  //       }
  //     ]
  //     directricesRelacion.value = data?.directrizRelacion
  //   }
  // })
}

/* === Relaciones === */

const inputFiltro = ref('')
const { includeWord } = appUtil

const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

async function getRelaciones(pagination = undefined) {
  if (!pagination) {
    loaders.relaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (loaders.relaciones.isLoading = l),
    resolve: (d) => console.log(d)
  })
}

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

/* === Antecedentes Causa === */

const { fiscaliaLocal, antecedentesCausa_getAntecedentesCausa } = useAntecedentesCausaStore()

async function getAntecedentesCausa() {
  requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: { ruc: ruc.value },
    loader: (l) => (loaders.antecedentesCausa.isLoading = l),
    reject: (e) => console.error(e)
  })
}

/* === Consulta Termino === */

async function getConsultaTermino() {
  const { idCausa } = resumenCausa.value
  requestUtil({
    action: termino_getConsultaTermino,
    payload: {
      idCausa
    },
    reject: (e) => console.error(e),
    resolve: (res) => {
      const { idConsulta } = res
      getRespuestaFiscalJefe(idConsulta)
      requestUtil({
        action: mantenedor_getSubTiposTerminoByIdTermino,
        payload: { id: res.idTipoTermino }
      })
    }
  })
}

/****************************/

/* === RESPUESTA FISCAL JEFE === */

async function getRespuestaFiscalJefe(idConsulta) {
  requestUtil({
    action: termino_getRespuestaFiscalJefe,
    payload: {
      idConsulta
    },
    reject: (e) => console.error(e),
    resolve: (res) => {
      console.log('Respuesta fiscal jefe: ', res)
      const { idRespuesta } = res
      getComplementoFiscal(idRespuesta)
    }
  })
}

/* **************** */

/* === COMPLEMENTO FISCAL === */

const complementoFiscal = ref('')
const getComplementoFiscal = (idRespuesta) => {
  requestUtil({
    action: termino_getComplementoFiscal,
    payload: { idRespuesta },
    resolve: (res) => {
      complementoFiscal.value = res.complemento
    },
    loader: (l) => {
      loaders.consultaTermino.isLoading = l
    }
  })
}

/****************************/

async function postSolicitudAudiencia() {
  if (!isFormValid()) {
    return
  }
  launchConfirmDialog({
    message: `¿Está seguro de Enviar la Solicitud?`,
    header: 'Solicitar Audiencia para Término o Suspensión',
    accept: () => {
      const { id: idTipoOrigen } = tipoOrigen.value.find(({ descripcion }) => descripcion === 'CAUSA')
      const { seDerivaEquipoJuridico, idPlantilla: plantillaId, idTribunal, instruccionFiscal, seRevisaEscrito, textoFiscal } = formData
      console.log({ idTipoOrigen })
      requestUtil({
        action: termino_postEscritoSolicitud,
        payload: {
          idOrigenActividad: resumenCausa.value.idCausa,
          idTipoOrigenActividad: idTipoOrigen,
          idTipoActividad: 'DD1443C3-C525-4FE4-8172-1287D26B963C',
          idSubtipoActividad: '9BB8194A-EC3C-40DF-8C68-47FA7FB18B3C',
          idUnidadOrigen: idTribunal,
          idFiscalia: '0a5f2032-9c4f-4ebb-b87f-5b2eb5684e1a',
          idsRelacionDelito: [],
          seDerivaEquipoJuridico,
          nombreFiscal: 'Thomas',
          plantillaId,
          instruccionFiscal,
          idsDocumentos: [],
          seRevisaEscrito,
          textoEscrito: textoFiscal
        },
        resolve: () => {
          completarSolicitarAudienciaTerminoPam()
        }
      })

      // #si eligio materializar equipo jurídico -> tarea pendiente bandeja tareas equipo jurídico
      // #si eligio no -> enviar escrito al tribunal
    }
  })
}

const { procesoPam } = usePamStore()

async function completarSolicitarAudienciaTerminoPam() {
  requestUtil({
    action: termino_PamCompletarGestionarAudienciaSuspencionTermino,
    payload: { taskId: procesoPam.value?.taskId },
    resolve: () => {
      toastSuccess(`Escrito enviado a tribunales con éxito.`)
      setTimeout(() => router.push({ name: 'BandejaFiscal' }), 500)
    }
  })

  // #si eligio materializar equipo jurídico -> tarea pendiente bandeja tareas equipo jurídico
  // #si eligio no -> enviar escrito al tribunal
}

onMounted(async () => {
  await getAntecedentesCausa()
  await getConsultaTermino()
  requestUtil({ action: mantenedor_getTipoOrigenActividad })
  getRelaciones()
  getDirectrices()
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
