<template>
<div v-if="isLoading">
  <LoaderSkeleton />
</div>
<div
  v-else
  class="p-fluid"
>
  <AppFieldset legend="Lista de Documentos">
    <TablaDocumentosFlujoPreclasificador
      class="col-12"
      :is-loading="tablaDocumentos.isLoading"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="documentos"
      @ver-documento="verDocumento"
    />
    <Button
      class="p-button-outlined mt-4 mb-2 ml-4"
      disabled
      icon="pi pi-book"
      icon-pos="right"
      :label="editando ? 'Modificar Documento' : 'Agregar Documento'"
      style="width: auto"
      @click="openModalAddDocumentos()"
    />
  </AppFieldset>
  <h4 class="ml-2">
    Se Solicitan Antecedentes Especificos
  </h4>
  <AppSelectButton
    id="seSolicitanAntecedentes"
    v-model="seSolicitanAntecedentes"
    class="col-12 md:col-4 lg:col-3"
    option-label="name"
    option-value="value"
    :options="[
      { name: 'Si', value: true },
      { name: 'No', value: false },
    ]"
  />
  <AppFieldset
    v-if="seSolicitanAntecedentes"
    legend="Solicitar Antecedentes Específicos"
  >
    <AppDropdown
      id="origen"
      v-model="filtroOrigen"
      class="col-12 md:col-4"
      label="Filtrar por Origen"
      option-label="descripcion"
      option-value="id"
      :options="tiposOrigenAntecedentes"
      show-clear
    />
    <div class="col-12 md:col-4 md:col-offset-4">
      <div
        class="p-inputgroup px-2"
        style="height: 36px; margin-top: 6px"
      >
        <InputText
          v-model="filtroTexto"
          placeholder="Buscar"
        />
        <Button
          class="btn-primary"
          icon="pi pi-search"
        />
      </div>
    </div>
    <TablaSolicitudAntecedentesEspecificos
      class="col-12"
      :value="antecedentesEspecificos"
      @solicitar-antecedente="openModalSolicitud"
    />

    <div class="col-12 mt-6">
      <TablaAntecedentesSolicitados :value="[]" />
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import {
  useAppDialog,
  useAppToast,
  useDynamicDialog
} from '@/modules/common/composables'
import { useDocumentoStore, useMantenedorStore } from '@/modules/global/composables'
import { useCausaAsignacionStore } from '@/modules/asignacion/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaDocumentosFlujoPreclasificador from '@/modules/global/components/documentos/TablaDocumentosFlujoPreclasificador.vue'
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'
import TablaSolicitudAntecedentesEspecificos from '@/modules/preclasificador/components/validar-calidad-antecedentes/documentos/TablaSolicitudAntecedentesEspecificos.vue'
import TablaAntecedentesSolicitados from '@/modules/preclasificador/components/validar-calidad-antecedentes/documentos/TablaAntecedentesSolicitados.vue'
import ModalCompletarSolicitudAntecedenteEspecifico from '@/modules/global/components/antecedentes-especificos/ModalCompletarSolicitudAntecedenteEspecifico.vue'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { toastSuccess } = useAppToast()

const { includeWord } = appUtil

const {
  documentos,
  paginacion,
  documento_getDocumentosByCatalogoCDD
} = useDocumentoStore()

const { idCatalogo } = useIdentificacionDenunciaStore()
const { idDenuncia, ruc, causaActual } = useCausaAsignacionStore()
const idCausa = computed(() => causaActual.value?.causa.idCausa)

const {
  tiposOrigenAntecedentes,
  tiposAntecedentes,
  mantenedor_getTiposAntecedentes,
  mantenedor_getTiposOrigenAntecedentes,
  mantenedor_getTiposAmbitoAntecedentes,
  mantenedor_getDescripcionOrigenAntecedente
} = useMantenedorStore()

const seSolicitanAntecedentes = ref(false)
const isLoading = ref(false)

const tablaDocumentos = reactive({
  isLoading: false,
  firstRecord: 0
})

function getDocumentos (pagination = undefined) {
  if (!idCatalogo.value) {
    console.log('Sin idCatalogo')
    return
  }

  if (!pagination) {
    tablaDocumentos.firstRecord = 0
  }

  requestUtil({
    action: documento_getDocumentosByCatalogoCDD,
    payload: {
      payload: { nombreCatalogo: ruc.value },
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    loader: (l) => {
      tablaDocumentos.isLoading = l
    }
  })
}

function verDocumento () {
  launchDialog({
    component: ModalVerDocumento,
    header: `Informe Alcoholemia`,
    width: '90%'
  })
}

function openModalAddDocumentos () {
  console.log('modal')
}

function openModalSolicitud (tipoSolicitud) {
  launchDynamicDialog({
    component: ModalCompletarSolicitudAntecedenteEspecifico,
    header: 'Completar Información de la Solicitud',
    width: '80%',
    data: {
      tipoSolicitudData: tipoSolicitud,
      idDenuncia: idDenuncia.value,
      idCausa: idCausa.value
    },
    onClose: ({ data }) => {
      if (data) {
        console.log('🚀 ~ file: Documentos.vue:132 ~ openModalSolicitud ~ data', data)
      }
    }
  })
}

const filtroOrigen = ref(null)
const filtroTexto = ref('')

// FILTROS
const antecedentesEspecificos = computed(() => {
  const antecedentes = tiposAntecedentes.value?.map((antecedente) => {
    return {
      idAntecedente: antecedente.id,
      idOrigenAntecedente: antecedente.idPadre,
      nombreAntecedente: antecedente.descripcion,
      nombreOrigen: mantenedor_getDescripcionOrigenAntecedente(antecedente.idPadre)
    }
  })

  let antecedentesFiltrados = antecedentes

  if (filtroTexto.value) {
    antecedentesFiltrados = antecedentesFiltrados.filter(
      (antecedente) =>
        includeWord(antecedente.nombreAntecedente, filtroTexto.value) ||
        includeWord(antecedente.nombreOrigen, filtroTexto.value)
    )
  }

  if (filtroOrigen.value) {
    antecedentesFiltrados = antecedentesFiltrados.filter(
      (antecedente) => antecedente.idOrigenAntecedente === filtroOrigen.value
    )

    const origen = mantenedor_getDescripcionOrigenAntecedente(filtroOrigen.value)

    toastSuccess(`Filtrado por ${origen}`)
  }

  return antecedentesFiltrados
})

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposAntecedentes })
  requestUtil({ action: mantenedor_getTiposOrigenAntecedentes })
  requestUtil({ action: mantenedor_getTiposAmbitoAntecedentes })
}

onMounted(() => {
  getDataMantenedor()
  getDocumentos()
})
</script>
