<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombre ?? 'No definido'} `"
  :page-subtitle="`RUC: ${resumenCausa.ruc}`"
  page-title="Revisar Consulta de Término o Suspensión"
/>
<section class="mt-4">
  <AppFieldset legend="Antecedentes de la Consulta Fiscal">
    <div
      v-if="loaderConsultaTermino"
      class="col-12"
    >
      <LoaderSkeleton height="250px" />
    </div>
    <AntecedentesConsultaFiscal
      v-else
      :consulta-termino="consultaTermino"
    />
  </AppFieldset>
  <div class="flex flex-row-reverse">
    <Button
      class="p-button-outlined mb-3"
      icon="pi pi-external-link"
      icon-pos="right"
      label="Ver Toda la Causa"
      @click="openResumenCausa"
    />
  </div>

  <AppFieldset legend="Relaciones">
    <div v-if="relaciones.isLoading">
      <LoaderSkeleton />
    </div>
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
      checked
      :loading="tablaRelaciones.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="filtroRelaciones"
      @page="getRelaciones"
    />
  </AppFieldset>

  <AppFieldset legend="Respuesta del Fiscal Jefe">
    <AppForm
      class="w-full"
      :form-submitted="formSubmitted"
      validation-scope="consultaForm"
    >
      <AppDropdown
        id="respuesta-fiscal-jefe"
        v-model="formData.idResultadoConsulta"
        class="col-4 p-fluid"
        label="Resultado de la consulta"
        :loading="!resultadosConsultaTermino.length"
        option-label="descripcion"
        option-value="id"
        :options="resultadosConsultaTermino"
        :rules="{ required }"
      />
      <AppTextarea
        id="observaciones"
        v-model="formData.observaciones"
        class="col-12"
        cols="150"
        label="Observaciones"
        rows="5"
        :rules="{
          required: formData.respuestaFJ === 2 ? true : false
        }"
      />
    </AppForm>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      :disabled="loaderConsultaTermino"
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar Respuesta"
      @click="enviarRespuesta"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AntecedentesConsultaFiscal from '@/modules/termino-postermino/components/AntecedentesConsultaFiscal.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { onMounted, ref, reactive, computed } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import { useRouter } from 'vue-router'
import { useFormValidation, useConfirmDialog, useAppToast /* useAppGlobalProperties */ } from '@/modules/common/composables'
import { useMenuSuperior, useTermino } from '../../composables'
import { useMantenedorStore, usePamStore, useRelacionesStore } from '@/modules/global/composables'
// import { useSessionStore } from '@/modules/session/composables'

const router = useRouter()
const { toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const tablaRelaciones = reactive({
  isLoading: false,
  isEditando: false,
  firstRecord: 0
})

const handleBackStep = () => {
  router.push({ name: 'BandejaFiscalJefe' })
}

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

// const { roles } = useSessionStore()

const { resultadosConsultaTermino, mantenedor_getTiposTermino, mantenedor_getSubTiposTerminoByIdTermino, mantenedor_getResultadosConsulta } = useMantenedorStore()
const { ruc, idDenuncia, resumenCausa, termino_getConsultaTermino, termino_PamCompletarRevisarConsulta, termino_postRespuestaFiscalJefe } = useTermino()

const { itemsMenuSuperior } = useMenuSuperior({ ruc })

const formData = reactive({
  idResultadoConsulta: '',
  observaciones: ''
})

const { formSubmitted, isFormValid, required } = useFormValidation({ formData, validationScope: 'consultaForm' })

const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    tablaRelaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tablaRelaciones.isLoading = l)
  })
}

const consultaTermino = ref()
const loaderConsultaTermino = ref(true)

async function getConsultaTermino () {
  const { idCausa } = resumenCausa.value
  requestUtil({
    action: termino_getConsultaTermino,
    payload: {
      idCausa
    },
    reject: (e) => console.error(e),
    resolve: (res) => {
      consultaTermino.value = res
      requestUtil({
        action: mantenedor_getSubTiposTerminoByIdTermino,
        payload: { id: res.idTipoTermino },
        loader: (l) => {
          loaderConsultaTermino.value = l
        }
      })
    }
  })
}

const { procesoPam } = usePamStore()

async function enviarRespuesta () {
  if (!isFormValid()) {
    return
  }
  console.log(formData)
  launchConfirmDialog({
    header: 'Consulta de Término o Suspensión',
    message: '¿Está seguro de enviar la Respuesta?',
    acceptLabel: 'Aceptar',
    accept: () =>
      requestUtil({
        action: termino_postRespuestaFiscalJefe,
        payload: {
          idConsulta: consultaTermino.value.idConsulta,
          idResultadoConsulta: formData.idResultadoConsulta,
          observaciones: formData.observaciones
        },
        resolve: () => {
          completarRespuestaFiscalJefePam()
        }
      })
  })
}

async function completarRespuestaFiscalJefePam () {
  requestUtil({
    action: termino_PamCompletarRevisarConsulta,
    payload: {
      resultadoRevisionConsulta: formData.idResultadoConsulta,
      causaAprobadaConObs: true,
      solicitudAprobada: true,
      requiereConstancia: true,
      consulta: formData.observaciones,
      taskId: procesoPam.value?.taskId
    },
    resolve: () => {
      setTimeout(() => {
        toastSuccess(`Respuesta enviada con éxito`)
        router.push({ name: 'BandejaFiscalJefe' })
      }, 300)
    }
  })
}

function openResumenCausa () {
  const routeData = router.resolve({ name: 'TPTFJRACResumenCausa' })
  window.open(routeData.href, '_blank')
}

// const { $userFiscaliaActual } = useAppGlobalProperties()
// const { fiscalia } = $userFiscaliaActual.value
// const fiscalJF = roles.value.find((r) => r.includes(`${fiscalia}_atendedor_juridico_IYA`))

onMounted(async () => {
  getConsultaTermino()
  getRelaciones()
  requestUtil({ action: mantenedor_getTiposTermino })
  requestUtil({ action: mantenedor_getResultadosConsulta })
})
</script>
