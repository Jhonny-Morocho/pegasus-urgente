<template>
<div class="">
  <AppFieldset
    class="py-0"
    legend="Información del Parte/Denuncia"
  >
    <div class="col-12 flex justify-content-between flex-wrap pt-5 pb-0">
      <div class="pb-5 pr-4 lg:pl-4">
        <h3 class="mb-3">
          Institución de Origen:
        </h3>
        <p>{{ parte.dataParteDenuncia?.tipoInterviniente }}</p>
      </div>
      <div class="pb-5 pr-4 md:pl-4">
        <h3 class="mb-3">
          N° de Parte/Denuncia:
        </h3>
        <p>{{ parte.dataParteDenuncia?.detalles[0].numeroParteDenuncia }}</p>
      </div>
      <div class="pb-5 pr-4 lg:pl-4">
        <h3 class="mb-3">
          Fecha Recepción:
        </h3>
        <p>{{ dateTimeUtil.formatToFrontendWithTime(parte.dataParteDenuncia.fechaRecepcionDenuncia) }} </p>
      </div>
      <div class="pb-5 pr-4 lg:pl-4">
        <h3 class="mb-3">
          Delito:
        </h3>
        <p>{{ tipoDelito(parte?.dataParteDenuncia.detalles[0].idTipoDelito) }}</p>
      </div>
      <div class="pb-5 pr-4 lg:pl-4">
        <h3 class="mb-3">
          Fecha Solicitud:
        </h3>
        <p>{{ dateTimeUtil.formatToFrontendWithTime() }} </p>
      </div>
    </div>
  </AppFieldset>

  <div class="grid pt-4">
    <div class="col-12 lg:col-6 lg:pr-4">
      <AppFieldset
        legend="Documentos a Solicitar"
      >
        <AppDataTable
          id="dataTableProcedimientos"
          class="mt-5 mb-5 col-12 w-full"
          :loading="loading.docSolicitar"
          :total-records="documentosFaltantes.length"
          :value="documentosFaltantes"
        >
          <Column
            v-if="false"
            class="text-center"
            header="Seleccionar"
            style="width: 94px"
          >
            <template #body="{ data }">
              <input
                :id="data.idDocumento"
                v-model="docsSeleccionados"
                class="p-checkbox"
                type="checkbox"
                :value="data.idDocumento"
              >
            </template>
          </Column>
          <Column header="Nombre Documento">
            <template #body="slotProps">
              {{ getNombreDocumento(slotProps.data.nombreDocumento) }}
            </template>
          </Column>
          <Column header="Tipo Documento">
            <template #body="slotProps">
              {{ mantenedor_getDescripciontiposDocumentosAdjuntosById(slotProps.data?.tipoDocumento) }}
            </template>
          </Column>
        </AppDataTable>
      </AppFieldset>
    </div>
    <div class="col-12 lg:col-6">
      <AppFieldset
        legend="Documentos Solicitados"
      >
        <AppDataTable
          id="dataTableProcedimientos"
          class="mt-5 mb-5 col-12"
          :total-records="documentosSolicitados.length"
          :value="documentosSolicitados"
        >
          <Column header="Tipo Documento">
            <template #body="slotProps">
              {{ slotProps.data.tipoDocumento }}
            </template>
          </Column>
          <Column header="Nombre Documento">
            <template #body="slotProps">
              {{ slotProps.data.nombreDocumento }}
            </template>
          </Column>
          <Column header="Estado">
            <template #body="slotProps">
              <div v-if="slotProps.data.esDocumentoSolicitado">
                Solicitado
              </div>
            </template>
          </Column>
          <Column
            class="text-center"
            header="Acciones"
            style="width: 80px"
          >
            <template #body="slotProps">
              <Button
                aria-controls="overlay_menu"
                aria-haspopup="true"
                class="p-button-rounded p-button-outlined btn-primary-outline"
                icon="pi pi-ellipsis-v"
                type="button"
                @click="toggleAcciones($event, slotProps.data)"
              />
            </template>
          </Column>
        </AppDataTable>
      </AppFieldset>
    </div>
  </div>

  <AppBtnNextTeleported
    :disabled="docsSeleccionados.length === 0"
    label="Plantilla"
    :loading="loading.stepPlantilla"
    @click="aStepPlantilla"
  />
  <Menu
    id="overlay_menu"
    ref="menuAccionesDocumentosSolicitados"
    :model="accionesDocumentosSolicitados"
    :popup="true"
  />
</div>
</template>
<script setup>
import { ref, defineEmits, computed, onMounted, reactive } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

import { dateTimeUtil, requestUtil } from '@/utils'
import { useMantenedorStore, useOficinaPartesStore } from '@/modules/global/composables'
import { useAppToast } from '@/modules/common/composables'

const {
  mantenedor_getNombreTipoDelito, mantenedor_getTiposDelito,
  mantenedor_getDescripciontiposDocumentosAdjuntosById,
  mantenedor_getTiposDocumentosAdjuntos,
  tiposDocumentosAdjuntos,
  mantenedor_getNombresTipoDocumento
} = useMantenedorStore()

const { parteSeleccionado, oficinaPartes_SET_IDS_SOLICITUD_DOCUMENTOS } = useOficinaPartesStore()

const { toastWarning } = useAppToast()
const emit = defineEmits(['next-step'])

const parte = parteSeleccionado.value

const documentosFaltantes = computed(() => parte.dataParteDenuncia.detalles[0].documentos?.filter((d) => d.esDocumentoFaltante === true))
const documentosSolicitados = computed(() => parte.dataParteDenuncia.detalles[0].documentos?.filter((d) => d.esDocumentoSolicitado === true))

const menuAccionesDocumentosSolicitados = ref(null)
const dataParteSelecionado = ref('')
const loading = reactive({
  docSolicitar: false,
  stepPlantilla: false
})
const docsSeleccionados = ref([])
const nombresDocumentos = ref([])

function getDocsIds () {
  documentosFaltantes.value.forEach(d => {
    docsSeleccionados.value.push(d.idDocumento)
  })
}
getDocsIds()

onMounted(() => {
  getMantenedor()
  if (documentosFaltantes.value)loading.docSolicitar = true
})

function getMantenedor () {
  requestUtil({
    action: mantenedor_getTiposDocumentosAdjuntos,
    resolve: () => getNombreTiposDocumentos()
  })
  requestUtil({ action: mantenedor_getTiposDelito })
}

function getNombreTiposDocumentos () {
  tiposDocumentosAdjuntos.value.forEach((td) => requestUtil({
    action: mantenedor_getNombresTipoDocumento,
    payload: { idTipoDocumento: td.id },
    resolve: (r) => nombresDocumentos.value.push(...r)
  }))
}

function getNombreDocumento (id) {
  if (nombresDocumentos.value.length > 0)setTimeout(() => { loading.docSolicitar = false }, 1000)
  return nombresDocumentos.value.find((documento) => documento.id === id)?.descripcion
}

function aStepPlantilla () {
  oficinaPartes_SET_IDS_SOLICITUD_DOCUMENTOS(docsSeleccionados.value)
  loading.stepPlantilla = true
  setTimeout(() => {
    loading.stepPlantilla = false
    emit('next-step', 'plantilla-documentos-solicitar')
  }, 600)
}

function tipoDelito (idTipoDelito) {
  if (idTipoDelito) {
    return mantenedor_getNombreTipoDelito(idTipoDelito)
  }
  return 'Sin Delito'
}

function toggleAcciones (event, data) {
  dataParteSelecionado.value = data
  menuAccionesDocumentosSolicitados.value.toggle(event)
}

const accionesDocumentosSolicitados = ref([
  {
    label: 'Pide Cuenta',
    items: [
      {
        label: 'Pide Cuenta',
        command: () => {
          toastWarning('Cuenta Solicitada')
        }
      }
    ]
  }
])
</script>
