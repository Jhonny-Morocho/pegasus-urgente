<template>
<div class="p-fluid">
  <AppFieldset legend="Lista de Documentos">
    <TablaDocumentos
      class="col-12"
      :dirige-investigacion="true"
      :value="documentos"
      @ver-documento="verDocumento"
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
      { name: 'No', value: false }
    ]"
  />

  <!-- Se Solicitan Antecedentes Especificos -->
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
      <TablaAntecedentesSolicitados :value="antecedentesSolicitados" />
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppToast, useDynamicDialog } from '@/modules/common/composables'
import { useDocumentoStore, useMantenedorStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore, useSolicitudAntecedentesStore } from '@/modules/dirigir-investigacion/composables'
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'
import TablaSolicitudAntecedentesEspecificos from '@/modules/dirigir-investigacion/components/TablaSolicitudAntecedentesEspecificos.vue'
import TablaAntecedentesSolicitados from '@/modules/dirigir-investigacion/components/TablaAntecedentesSolicitados.vue'
import TablaDocumentos from '@/modules/dirigir-investigacion/components/TablaDocumentos.vue'
import ModalRespuestaSolicitud from '@/modules/dirigir-investigacion/components/modals/solicitar-antecedentes-especificos/ModalRespuestaSolicitud.vue'
import Button from 'primevue/button'
import ModalCompletarSolicitudAntecedenteEspecifico from '@/modules/global/components/antecedentes-especificos/ModalCompletarSolicitudAntecedenteEspecifico.vue'

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()
const { toastSuccess } = useAppToast()

const { includeWord } = appUtil

const {
  documentos,
  documento_getDocumentosByIdDenuncia
} = useDocumentoStore()

const { antecedentesSolicitados } = useSolicitudAntecedentesStore()

const {
  ruc,
  idDenuncia,
  causa
} = useDirigirInvestigacionStore()

const {
  tiposAntecedentes,
  tiposOrigenAntecedentes,
  mantenedor_getTiposAntecedentes,
  mantenedor_getTiposOrigenAntecedentes,
  mantenedor_getTiposAmbitoAntecedentes,
  mantenedor_getDescripcionOrigenAntecedente
} = useMantenedorStore()

const seSolicitanAntecedentes = ref(null)

const idCausa = computed(() => causa.value?.data?.causa?.idCausa)

/** Obtener documentos asociados a un ruc */
async function getDocumentosEnCausa () {
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: {
      ruc: ruc.value,
      idDenuncia: idDenuncia.value
    }
  })
}

// eslint-disable-next-line no-unused-vars
function getAntecedentesSolicitados () {
  // NO EXISTE PERSISTENCIA DE ANTECEDENTES SOLICITADOS
  console.log('🚀 ~ file: Documentos.vue:137 ~ getAntecedentesSolicitados ~ getAntecedentesSolicitados')
}

// eslint-disable-next-line no-unused-vars
function solicitarAntecedenteEspecifico (antecedente) {
  // NO EXISTE PERSISTENCIA DE ANTECEDENTES SOLICITADOS
  console.log('🚀 ~ file: Documentos.vue:145 ~ solicitarAntecedenteEspecifico ~ antecedente', antecedente)
}

function verDocumento () {
  launchDialog({
    component: ModalVerDocumento,
    header: `Informe Alcoholemia`,
    width: '90%'
  })
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
    onClose: async ({ data }) => {
      if (data) {
        console.log('🚀 ~ file: Documentos.vue:174 ~ onClose: ~ data', data)
      }
    }
  })
}

// eslint-disable-next-line no-unused-vars
function verRespuestaSolicitud (antecedente) {
  const modal = launchDynamicDialog({
    component: ModalRespuestaSolicitud,
    header: 'Respuesta de la Solicitud',
    width: '70%',
    data: {
      ruc: ruc.value,
      antecedente: antecedente
    },
    templates: {
      footer: () => {
        return [
          h(Button, { label: 'Cerrar', onClick: () => modal.close(), class: 'p-button-text' })
        ]
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
    antecedentesFiltrados = antecedentesFiltrados.filter((antecedente) => antecedente.idOrigenAntecedente === filtroOrigen.value)

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
  getDocumentosEnCausa()
})
</script>
