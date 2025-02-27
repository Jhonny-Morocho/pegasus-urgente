<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Revisar Respuesta PJUD por Solicitud de Audiencia"
/>
<section class="my-6">
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
      v-model="tables.relaciones.firstRecord"
      :loading="tables.relaciones.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>
  <AppFieldset
    :collapsed="hideWhileLoading"
    legend="Resolución de Tribunal"
  >
    <div>
      <p class="col-12">
        <strong>Tribunal: </strong>Juzgado de Garantía Casablanca
      </p>
      <p class="col-12">
        <strong>Fecha de Respuesta: </strong>13-12-2022
      </p>
    </div>
    <div class="col-12 texto p-6">
      <p>Santiago, 31 de marzo de 2020.</p>
      <p>A lo principal y otro sí:</p>
      <p>
        Como se pide, se fija Audiencia de Cierre de la Investigación para el día 15 de febrero de 2020,
        a las 10:50 horas, en este Tribunal ubicado en Juan Leiva Amor 147, Casablanca.
      </p>
      <p>Notifíquese a los intervinientes por correo electrónico.</p>
      <p>Por lo tanto,</p>
      <p>RUC: 2000001992-6</p>
      <p>RIT: 12345-6</p>
      <p>Resolvió don GERMÁN GÓNZALEZ SILVA, Juez Titular del Juzgado de Garantía de Casablanca.</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 mt-2">
      <Button
        class="p-button-outlined w-full"
        icon="pi pi-file"
        icon-pos="right"
        label="Ver Resolución"
        @click="openVerResolucion"
      />
    </div>
  </AppFieldset>
  <AppForm
    v-if="!hideWhileLoading"
    class="col-12 px-4 my-4"
    :form-submitted="formSubmitted"
    validation-scope="preparar-escrito-form"
  >
    <p><strong>¿Desea elaborar respuesta por Previo Resolver?</strong></p>
    <AppSelectButton
      id="respuesta-previo-resolver"
      v-model="formData.respuestaPrevioResolver"
      class="col-3 p-fluid"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
      :rules="{ required }"
    />
    <AppFieldset
      v-if="formData.respuestaPrevioResolver"
      class="mt-4"
      legend="Elaborar Respuesta por Previo Resolver"
    >
      <ComunicarCierreEscrito
        v-model="formData"
        class="col-12"
        :fiscalia="fiscaliaLocal"
      />
    </AppFieldset>
  </AppForm>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar Escrito"
      @click="enviarEscrito"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import ComunicarCierreEscrito from '@/modules/termino-postermino/components/ComunicarCierreEscrito.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import TablaRelaciones from '@/modules/tramitar-audiencia/components/tables/TablaRelaciones.vue'
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'
import { useAppDialog, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { /* appUtil, */ requestUtil } from '@/utils'
import { /* computed, */ onMounted, reactive, ref } from 'vue'
import { useTramitarAudiencia } from '../composables'
import { useRouter } from 'vue-router'
import { useRelacionesStore } from '@/modules/global/composables'

const router = useRouter()

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastWarning } = useAppToast()

const {
  ruc,
  resumenCausa,
  idDenuncia,
  tramitarAudiencia_respuestaPrevioResolver
} = useTramitarAudiencia()

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  }
})

const formData = reactive({
  respuestaPrevioResolver: null,
  derivaMaterializacionEquipoJuridico: null,
  nombreTribunal: '',
  idPlantilla: null,
  materializacionTextoFiscal: null,
  revisarEscrito: null,
  documentosSeleccionados: [],
  adjuntaCarpeta: false
})

const {
  formSubmitted,
  isFormValid,
  required
} = useFormValidation({ formData, validationScope: 'preparar-escrito-form' })

/* === RELACIONES === */

const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

const hideWhileLoading = ref(true)

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
    resolve: (r) => { hideWhileLoading.value = false },
    loader: (l) => (tables.relaciones.isLoading = l)
  })
}

/****************************/
function openVerResolucion () {
  launchDialog({
    component: ModalVerDocumento,
    header: 'Ver Resolución'
  })
}

function handleBackStep () { router.push({ name: 'TABandejaTramitarAudiencia' }) }

async function enviarEscrito () {
  if (!isFormValid()) {
    toastWarning('Hay campos que revisar')
    return
  }
  launchConfirmDialog({
    header: 'Enviar Escrito',
    message: '¿Está seguro de Enviar Escrito?',
    accept: () => {
      requestUtil({
        action: tramitarAudiencia_respuestaPrevioResolver,
        resolve: () => {
          toastSuccess('¡La consulta ha sido enviada con éxito!')
          setInterval(() => {
            router.push({ name: 'TABandejaTramitarAudiencia' })
          }, 400)
        }
      })
    }
  })
}

onMounted(() => {
  getRelaciones()
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.texto {
  border-radius: 8px;
  border: solid 1px #222;
  padding: 3rem;
}
</style>
