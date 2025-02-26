<template>
<section>
  <PageHeader
    class="mb-8"
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`Nombre Causa: ${resumenCausa?.nombreCausa}`"
    :page-subtitle="`RUC ${ruc}`"
    page-title="Consultar a FR por Cierre de Investigación"
  />
  <AppForm
    id="consultar-cierre-form"
    class="mb-6"
    :form-submitted="formSubmitted"
    validation-scope="consultar-cierre-scope"
  >
    <AppFieldset legend="Relaciones">
      <TablaRelaciones
        v-model:first="tables.relaciones.firstRecord"
        class="col-12"
        fiscal-asignado
        :loading="tables.relaciones.isLoading"
        :rows="paginacionRelaciones?.tamanoPagina"
        :total-records="paginacionRelaciones?.elementosTotales"
        :value="relaciones"
        @page="getRelaciones"
      />
    </AppFieldset>
    <AppFieldset legend="Ingresar Texto para el Cierre">
      <div class="w-full py-3">
        <p><strong>Tipo de Cierre de Investigación: </strong>Acusación</p>
        <AppTextarea
          id="texto-consulta-cierre"
          v-model="formData.textoConsulta"
          class="col-12 p-fluid px-0 my-4"
          label="Texto de la consulta"
          :rows="6"
          :rules="{ required }"
        />
      </div>
    </AppFieldset>
    <AppFieldset legend="¿Desea agregar un documento a la solicitud?">
      <TablaDocumentos
        v-model:first="tables.documentos.firstRecord"
        v-model:selection="formData.documentosSeleccionados"
        class="col-12"
        consultar-cierre
        :loading="tables.documentos.isLoading"
        :rows="paginacionDocumentos?.tamanoPagina"
        selectable
        :total-records="paginacionDocumentos?.elementosTotales"
        :value="documentos"
        @descargar-documento="descargarDocumento"
        @imprimir-documento="imprimirDocumento"
        @page="getDocumentos"
        @ver-documento="verDocumento"
      />
      <div class="col-12 mt-4">
        <h4>¿Desea Adjuntar Carpeta Investigativa?</h4>
        <div class="col-12 md:col-4 grid mt-2">
          <AppSelectButton
            id="adjuntar-carpeta-radio"
            v-model="formData.adjuntaCarpeta"
            class="w-full"
            option-label="descripcion"
            option-value="value"
            :options="adjuntaCarpetaOptions"
          />
        </div>
      </div>
    </AppFieldset>
  </AppForm>
  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar Consulta"
    @click="openModalConfirmacion"
  />
</section>
</template>

<script setup>
import TablaRelaciones from '../components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaRelaciones.vue'
import { onMounted, reactive } from 'vue'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '../composables'
import { useDocumentoStore, useRelacionesStore } from '@/modules/global/composables'
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import router from '@/router'
import TablaDocumentos from '../components/TablaDocumentos.vue'
import { requestUtil } from '@/utils'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'

const { ruc, resumenCausa, dirigirInvestigacion_getResumenCausa } = useDirigirInvestigacionStore()
const { relaciones, relaciones_getRelacionesEnCausa, paginacion: paginacionRelaciones } = useRelacionesStore()
const { documentos, documento_getDocumentosEnCausa, paginacion: paginacionDocumentos } = useDocumentoStore()
const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const formData = reactive({
  textoConsulta: '',
  adjuntaCarpeta: false,
  documentosSeleccionados: []
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'consultar-cierre-scope'
})

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  documentos: {
    firstRecord: 0,
    isLoading: false
  }
})

const getRelaciones = async (pagination = undefined) => {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelacionesEnCausa,
    payload: { ruc: ruc.value, params }
  })
}
const getDocumentos = async (pagination = undefined) => {
  if (!pagination) {
    tables.documentos.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: documento_getDocumentosEnCausa,
    payload: { ruc: ruc.value, params }
  })
}

async function obtenerResumenCausa () {
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: {
      ruc: ruc.value
    }
  })
}

const descargarDocumento = (doc) => {
  console.log('Descargar Documento', doc)
}
const imprimirDocumento = (doc) => {
  console.log('Imprimir Documento', doc)
}
const verDocumento = (doc) => {
  console.log('Ver Documento', doc)
}

const adjuntaCarpetaOptions = [
  { value: true, descripcion: 'Si' },
  { value: false, descripcion: 'No' }
]

const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()

function openModalConfirmacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  launchConfirmDialog({
    header: 'Enviar Consulta ',
    message: `¿Está seguro de Enviar la Consulta a FR?`,
    accept: () => {
      setTimeout(() => {
        toastSuccess('¡La consulta ha sido enviada con éxito!')
        router.push({ name: 'BandejaDirigirInvestigacion' })
      }, 369)
    }
  })
}
const handleBackStep = () => {
  router.push({ name: 'BandejaDirigirInvestigacion' })
}

onMounted(async () => {
  getRelaciones()
  getDocumentos()
  obtenerResumenCausa()
})
</script>
