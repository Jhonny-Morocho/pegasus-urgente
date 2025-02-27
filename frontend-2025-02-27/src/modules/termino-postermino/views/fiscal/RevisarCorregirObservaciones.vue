<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombre ?? 'No definido'}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Revisar y Corregir Observaciones"
/>
<section class="mt-4">
  <AppFieldset
    legend="Antecedentes de la Consulta Fiscal"
    :toggleable="true"
  >
    <div
      v-if="loaders.consultaTermino.isLoading"
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
      @click="$router.push({ name: 'TPTFJRACResumenCausa' })"
    />
  </div>
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
      v-model:first="loaders.relaciones.firstRecord"
      checked
      :data-relaciones="relaciones"
      :loading="loaders.relaciones.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>
  <AppFieldset legend="Respuesta del Fiscal Jefe">
    <div
      v-if="loaders.respuestaFJ.isLoading"
      class="col-12"
    >
      <LoaderSkeleton height="120px" />
    </div>
    <div
      v-else
      class="col-12"
    >
      <p><strong>Resultado de la Consulta: </strong>{{ mantenedor_getResultadoConsultaTerminoById(respuestaFJ.idResultadoConsulta) ?? 'No definido' }}</p>
      <p><strong>Observaciones: </strong>{{ respuestaFJ.observaciones ?? 'sin observaciones' }}</p>
    </div>
  </AppFieldset>
  <AppFieldset legend="Complemento a Observaciones">
    <AppForm
      id="complemento-observaciones"
      :form-submitted="formSubmitted"
      validation-scope="consultaForm"
    >
      <AppTextarea
        id="observaciones"
        v-model="formData.complementoObservaciones"
        class="col-12"
        cols="150"
        label="Observaciones"
        rows="5"
      />
      <div class="col-12 md:col-4 grid">
        <h4 class="mb-3">
          ¿Desea Solicitar Audiencia de Término?
        </h4>
        <AppSelectButton
          id="audiencia-termino"
          v-model="formData.solicitarAudienciaTermino"
          class="w-full p-fluid"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false }
          ]"
          :rules="{ required }"
        />
      </div>
    </AppForm>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      :disabled="loaderGuardarDecision"
      :icon="!loaderGuardarDecision ? 'pi pi-save' : 'pi pi-spin pi-spinner'"
      icon-pos="right"
      label="Guardar Decisión"
      @click="postComplementoFiscal"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AntecedentesConsultaFiscal from '../../components/AntecedentesConsultaFiscal.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue'
import { onMounted, reactive, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useFormValidation, useConfirmDialog } from '@/modules/common/composables'
import { useMantenedorStore, usePamStore, useRelacionesStore } from '@/modules/global/composables'
import { useMenuSuperior, useTermino } from '../../composables'
import { useRouter } from 'vue-router'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const router = useRouter()
const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' })
}

const { launchConfirmDialog } = useConfirmDialog()

const loaders = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  consultaTermino: {
    isLoading: true
  },
  respuestaFJ: {
    isLoading: true
  }
})

const formData = reactive({
  solicitarAudienciaTermino: null,
  complementoObservaciones: ''
})

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'consultaForm'
})

const { mantenedor_getResultadoConsultaTerminoById, mantenedor_getTiposTermino, mantenedor_getSubTiposTerminoByIdTermino, mantenedor_getResultadosConsulta } = useMantenedorStore()

const { resumenCausa, ruc, idDenuncia, consultaTermino, termino_getConsultaTermino, termino_getRespuestaFiscalJefe, termino_PamCompletarRevisarObservaciones, termino_postComplementoFiscal } = useTermino()

const { itemsMenuSuperior } = useMenuSuperior({ ruc })

/* === Relaciones === */

const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

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
    loader: (l) => (loaders.relaciones.isLoading = l)
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
      getRespuestaFJ(idConsulta)
      requestUtil({
        action: mantenedor_getSubTiposTerminoByIdTermino,
        payload: { id: res.idTipoTermino },
        loader: (l) => {
          loaders.consultaTermino.isLoading = l
        }
      })
    }
  })
}

/* === Respuesta Fiscal Jefe === */

const respuestaFJ = ref({})
async function getRespuestaFJ (idConsulta) {
  requestUtil({
    action: termino_getRespuestaFiscalJefe,
    payload: { idConsulta },
    reject: (e) => console.error(e),
    resolve: (res) => {
      respuestaFJ.value = res
    },
    loader: (l) => {
      loaders.respuestaFJ.isLoading = l
    }
  })
}

/* ******************** */
/*eslint-disable*/
const { procesoPam } = usePamStore()

const loaderGuardarDecision = ref(false)

async function postComplementoFiscal() {
  if (!isFormValid()) {
    return
  }
  launchConfirmDialog({
    message: `¿Estas seguro de guardar decisión?`,
    header: 'Revisar y Corregir Observaciones',
    accept: () => {
      console.log('respuestaFJ', respuestaFJ.value)
      const { idRespuesta } = respuestaFJ.value

      requestUtil({
        action: termino_postComplementoFiscal,
        payload: {
          idRespuesta,
          complemento: formData.complementoObservaciones,
          solicitaAudienciaTermino: formData.solicitarAudienciaTermino
        },
        resolve: () => {
          completarComplementoFiscalPam()
        },
        loader: (l) => {
          loaderGuardarDecision.value = l
        }
      })
    }
  })
}
async function completarComplementoFiscalPam() {
  requestUtil({
    action: termino_PamCompletarRevisarObservaciones,
    payload: {
      requiereAudiencia: formData.solicitarAudienciaTermino,
      taskId: procesoPam.value?.taskId
    },
    resolve: () => {
      setTimeout(() => router.push({ name: 'BandejaFiscal' }), 500)
    }
  })
}

onMounted(() => {
  getConsultaTermino()
  getRelaciones()
  requestUtil({ action: mantenedor_getTiposTermino })
  requestUtil({ action: mantenedor_getResultadosConsulta })
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
