<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombre}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Preparar Escrito de Término al Tribunal"
/>
<section class="mt-4">
  <AppFieldset legend="Relaciones">
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
      v-model:first="loaders.relaciones.firstRecord"
      class="mb-6"
      :loading="loaders.relaciones.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="filtroRelaciones"
      @page="getRelaciones"
    />
  </AppFieldset>

  <AppFieldset
    class="pb-3"
    legend="Directriz de Investigación de la Causa"
  >
    <div
      v-if="loaders.consultaTermino.isLoading"
      class="col-12"
    >
      <LoaderSkeleton height="110px" />
    </div>
    <div
      v-else
      class="flex justify-content-between"
    >
      <strong>Directriz de Investigación de la Causa:</strong>
      <p />
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
          <strong>Tipo de Término o Suspensión: </strong>{{
            mantenedor_getDescripcionTipoTerminoById(
              consultaTermino?.idTipoTermino
            )
          }}.
        </p>
        <p class="col-12">
          <strong>Subtipo de Término o Suspensión: </strong>{{
            mantenedor_getDescripcionTipoSubterminoById(
              consultaTermino?.idSubTipoTermino
            )
          }}.
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

  <AppFieldset legend="Especies/Dinero">
    <TablaEspeciesDinero
      v-model:first="loaders.especies.firstRecord"
      class="col-12"
      :loading="loaders.especies.isLoading"
      :rows="paginacionEspecies?.tamanoPagina"
      :total-records="paginacionEspecies?.elementosTotales"
      :value="especies"
      @page="getEspecies"
    />
    <div class="w-full flex flex-row-reverse">
      <Button
        class="p-button-outlined mb-3"
        icon="pi pi-external-link"
        icon-pos="right"
        label="Ver Denuncia"
        @click="handleVerDenuncia"
      />
    </div>
  </AppFieldset>
  <AppFieldset
    class="p-fluid"
    legend="Elegir destino (Desarrollo)"
  >
    <AppDropdown
      id="destino-causa"
      v-model="formData.destinoCausa"
      class="col-3"
      label="Destino"
      :loading="loaders.imputados"
      option-label="value"
      option-value="value"
      :options="[
        { value: 'sobreseimiento' },
        { value: 'suspendida' },
        { value: 'terminada' }
      ]"
      :rules="{ required }"
      show-clear
    />
  </AppFieldset>

  <AppFieldset legend="Elaborar Escrito">
    <AppForm
      class="col-12"
      :form-submitted="formSubmitted"
      validation-scope="preparar-escrito-form"
    >
      <ComunicarCierreEscrito
        v-model="formData"
        class="col-12"
        :fiscalia="fiscaliaLocal"
      />
    </AppForm>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      :disabled="formData.seDerivaEquipoJuridico === null"
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar Respuesta"
      :loading="loaders.consultaTermino.isLoading"
      @click="postSolicitudAudiencia"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import TablaEspeciesDinero from '../../components/tablas/TablaEspeciesDinero.vue'
import ComunicarCierreEscrito from '@/modules/termino-postermino/components/ComunicarCierreEscrito.vue'
import ModalVerDenuncia from '@/modules/termino-postermino/components/modals/ModalVerDenuncia.vue'
import { onMounted, ref, reactive, computed } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import { useRouter } from 'vue-router'
import {
  useFormValidation,
  useConfirmDialog,
  useAppToast,
  useAppDialog
} from '@/modules/common/composables'
import {
  useMenuSuperior,
  useTermino
} from '@/modules/termino-postermino/composables'
import {
  useAntecedentesCausaStore,
  useEspeciesDineroStore,
  useMantenedorStore,
  usePamStore,
  useRelacionesStore
} from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppDropdown from '@/modules/common/components/inputs/AppDropdown.vue'

const router = useRouter()

const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' })
}

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess } = useAppToast()
const {
  mantenedor_getTipoOrigenActividad,
  mantenedor_getSubTiposTerminoByIdTermino,
  tipoOrigen,
  mantenedor_getDescripcionTipoTerminoById,
  mantenedor_getDescripcionTipoSubterminoById
} = useMantenedorStore()

const formData = reactive({
  seDerivaEquipoJuridico: null,
  idTribunal: '',
  idPlantilla: null,
  textoFiscal: null,
  seRevisaEscrito: null,
  documentosSeleccionados: [],
  adjuntaCarpeta: false,
  instruccionFiscal: '',
  destinoCausa: ''
})
const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'preparar-escrito-form'
})

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

const {
  ruc,
  idDenuncia,
  resumenCausa,
  consultaTermino,
  termino_getComplementoFiscal,
  termino_getRespuestaFiscalJefe,
  termino_getConsultaTermino,
  termino_PamCompletarGestionarEnTribunales,
  termino_postEscritoSolicitud
} = useTermino()

const { itemsMenuSuperior } = useMenuSuperior({ ruc })

/* === RELACIONES === */
const { paginacion, relaciones, relaciones_getRelaciones } =
  useRelacionesStore()

const { procesoPam } = usePamStore()

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
    resolve: (res) => {
      console.log('Relaciones Obtenidas: ', res)
    }
  })
}

/* === ESPECIES === */

const { especies, especiesDinero_getEspecieByIdDenuncia, paginacionEspecies } =
  useEspeciesDineroStore()

async function getEspecies (pagination = undefined) {
  if (!pagination) {
    loaders.especies.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (loaders.especies.isLoading = l)
  })
}

/* === ANTECEDENTES CAUSA === */
const { fiscaliaLocal, antecedentesCausa_getAntecedentesCausa } =
  useAntecedentesCausaStore()

async function getAntecedentesCausa () {
  requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: { ruc: ruc.value },
    loader: (l) => (loaders.antecedentesCausa.isLoading = l),
    reject: (e) => console.error(e),
    resolve: (res) => {
      console.log('Causa res: ', res)
    }
  })
}

/* === Consulta Termino === */

async function getConsultaTermino () {
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

/* === COMPLEMENTO FISCAL === */

async function getRespuestaFiscalJefe (idConsulta) {
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

function handleVerDenuncia () {
  launchDialog({
    component: ModalVerDenuncia,
    header: 'Ver Denuncia',
    width: '70%'
  })
}

async function postSolicitudAudiencia () {
  if (!isFormValid()) {
    return
  }
  launchConfirmDialog({
    message: `¿Está seguro de Enviar la Solicitud?`,
    header: 'Solicitar Audiencia para Término o Suspensión',
    accept: () => {
      const { id: idTipoOrigen } = tipoOrigen.value.find(
        ({ descripcion }) => descripcion === 'CAUSA'
      )
      const {
        seDerivaEquipoJuridico,
        idPlantilla: plantillaId,
        instruccionFiscal,
        seRevisaEscrito,
        textoFiscal,
        idTribunal
      } = formData
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
          completarGestionarTerminoTribunalesPam()
        }
      })

      // #si eligio materializar equipo jurídico -> tarea pendiente bandeja tareas equipo jurídico
      // #si eligio no -> enviar escrito al tribunal
    }
  })
}

async function completarGestionarTerminoTribunalesPam () {
  requestUtil({
    action: termino_PamCompletarGestionarEnTribunales,
    payload: {
      taskId: procesoPam.value?.taskId,
      destinoCausa: formData.destinoCausa
    },
    resolve: () => {
      toastSuccess(
        formData.seDerivaEquipoJuridico
          ? `Materialización enviada a equipo juridico con éxito.`
          : `Escrito enviado a tribunales con éxito.`
      )
      setTimeout(() => router.push({ name: 'BandejaFiscal' }), 500)
    }
  })

  // #si eligio materializar equipo jurídico -> tarea pendiente bandeja tareas equipo jurídico
  // #si eligio no -> enviar escrito al tribunal
}

onMounted(async () => {
  requestUtil({ action: mantenedor_getTipoOrigenActividad })
  await getAntecedentesCausa()
  await getConsultaTermino()
  getRelaciones()
  getEspecies()
})
</script>
