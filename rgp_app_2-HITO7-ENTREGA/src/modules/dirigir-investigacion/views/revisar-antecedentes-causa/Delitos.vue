<template>
<AppFieldset legend="Lista de Delitos">
  <TablaDelitos
    v-model:first="delitosPag.firstRecord"
    :data-delitos="delitos"
    is-dirigir-investigacion
    :loading="delitosPag.isLoadingTable"
    :read-only="isCollapsed"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    @page="getDelitos"
    @tabla-delito:competencia-territorial="openModalCompetenciaTerritorial"
    @tabla-delito:eliminar="eliminarDelito"
    @tabla-delito:modificar="setModoEdicion"
    @tabla-delito:ver-mapa="openModalVerMapa"
    @tabla-delito:ver-mas="setModoLectura"
  />
</AppFieldset>

<FormDelitos
  :editando="isEditando"
  :form-submitted="formSubmitted"
  :is-collapsed="isCollapsed"
  :loading-button="delitosPag"
  :read-only="modoLectura"
  :validation-scope="delitoValidationScope"
  @cancelar-edicion="toggleFormularioDelito"
  @emit-adjuntar="adjuntarDocumento"
  @emit-agregar="handleSubmitForm"
  @emit-boton-agregar="toggleFormularioDelito"
  @emit-eliminar="eliminarDocumento"
  @emit-reset="resetFormData"
/>
</template>

<script setup>
import { onMounted, provide, reactive, ref } from 'vue'
import { useAppDialog, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore, useDelitoStore, useDelitoProvide, useGeorreferenciaStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { generateDelitoContract, populateDelito } from '@/modules/global/contracts'
import { useDirigirInvestigacionStore } from '../../composables'
// import ModalCompetenciaTerritorial from '@/modules/preclasificador/components/modals/ModalCompetenciaTerritorial.vue'
import ModalCompetenciaTerritorial from '@/modules/global/components/competencia-territorial/ModalCompetenciaTerritorial.vue'
import ModalVerMapa from '@/modules/dirigir-investigacion/components/modals/ModalVerMapa.vue'
import FormDelitos from '@/modules/global/components/forms/FormDelitos.vue'

const { delitoValidationScope, formData } = useDelitoProvide()

provide(delitoValidationScope, formData)

const { georreferencia_SET_FISCALIAS_COMPETENTES } = useGeorreferenciaStore()

const { formSubmitted, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: delitoValidationScope
})

const { toastSuccess, toastWarning, toastError, MSG_ERRORS } = useAppToast()

const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()

const {
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getComunas
} = useMantenedorStore()

const { idDenuncia } = useDirigirInvestigacionStore()

const {
  delitos,
  paginacion,
  mediosTransporte,
  delito_addDelito,
  delito_updateDelito,
  delito_deleteDelito,
  delito_getDelitoByIdDenuncia,
  delito_RESET_MEDIOSTRANSPORTE,
  delito_SET_MEDIOSTRANSPORTE,
  delito_getDelitoByIdDetalleHechoDelictual
} = useDelitoStore()

const isCollapsed = ref(false)
const isEditando = ref(false)
const modoLectura = ref(false)

const delitosPag = reactive({
  isLoadingTable: false,
  firstRecord: 0
})

function getTiposFamiliasDelito () {
  requestUtil({ action: mantenedor_getFamiliasDelito })
  requestUtil({ action: mantenedor_getTiposDelito })
  requestUtil({ action: mantenedor_getComunas })
}

const firstRecord = ref(0)

async function getDelitos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  await requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (delitosPag.isLoadingTable = l)
  })
}

onMounted(async () => {
  getTiposFamiliasDelito()
  getDelitos()
})

function toggleFormularioDelito () {
  isCollapsed.value = !isCollapsed.value
  cancelarEdicion()
}

function adjuntarDocumento (documento) {
  console.log('adjuntar doc: ', documento)
}

function eliminarDocumento (documento) {
  console.log('eliminar doc: ', documento)
}

async function setModoLectura (delito) {
  console.log('Delito MODO LECTURA: ', delito)
  requestUtil({
    action: delito_getDelitoByIdDetalleHechoDelictual,
    payload: {
      idDetalleHechoDelictual: delito.idDetalleHechoDelictual
    },
    resolve: (response) => {
      isCollapsed.value = true
      modoLectura.value = true
      populateDelito(response, formData)
      delito_SET_MEDIOSTRANSPORTE(response.mediosTransportes || [])
    },
    reject: (e) => console.log(e)
  })
}

async function setModoEdicion (delito) {
  requestUtil({
    action: delito_getDelitoByIdDetalleHechoDelictual,
    payload: {
      idDetalleHechoDelictual: delito.idDetalleHechoDelictual
    },
    resolve: (response) => {
      isCollapsed.value = true
      isEditando.value = true
      populateDelito(response, formData)
      delito_SET_MEDIOSTRANSPORTE(response.mediosTransportes || [])
    },
    reject: (e) => console.log(e)
  })
}

function cancelarEdicion () {
  isEditando.value = false
  modoLectura.value = false
  resetFormData()
  delito_RESET_MEDIOSTRANSPORTE()
}

async function agregarDelito () {
  const payload = generateDelitoContract({
    ...formData,
    idDenuncia: idDenuncia.value,
    mediosTransporte: mediosTransporte.value
  })

  await requestUtil({
    action: delito_addDelito,
    payload: payload,
    resolve: async (_r) => {
      toastSuccess('Delito agregado correctamente')
      cancelarEdicion()
      isCollapsed.value = false
      await getDelitos()
    },
    loader: (l) => (delitosPag.isLoadingTable = l),
    reject: (r) => {
      console.log('error: ', r)
      toastError('Ocurrió un error inesperado')
    }
  })
}

function modificarDelito () {
  const delito = generateDelitoContract({
    ...formData,
    idDenuncia: idDenuncia.value,
    mediosTransporte: mediosTransporte.value
  })

  launchConfirmDialog({
    message: '¿Estás seguro de modificar el Delito?',
    accept: async () => {
      requestUtil({
        action: delito_updateDelito,
        payload: delito,
        resolve: async () => {
          toastSuccess('Delito modificado correctamente')
          toggleFormularioDelito()
          getDelitos()
        },
        loader: (l) => (delitosPag.isLoadingTable = l),
        reject: (r) => {
          console.log('error: ', r)
          toastError('Ocurrió un error inesperado')
        }
      })
    }
  })
}

async function handleSubmitForm () {
  if (!isFormValid()) {
    toastError(MSG_ERRORS.formInvalid)
    return
  }

  if (!isEditando.value) {
    agregarDelito()
  } else {
    modificarDelito()
  }
}

async function eliminarDelito (delito) {
  launchConfirmDialog({
    message: '¿Estás seguro de eliminar el Delito?',
    accept: async () => {
      requestUtil({
        action: delito_deleteDelito,
        payload: {
          idDetalleHechoDelictual: delito.idDetalleHechoDelictual
        },
        resolve: async () => {
          toastWarning('Delito Eliminado')
          getDelitos()
        },
        loader: (l) => (delitosPag.isLoadingTable = l),
        reject: (r) => {
          console.log('error: ', r)
          toastError('Ocurrió un error inesperado')
        }
      })
    }
  })
}

function openModalCompetenciaTerritorial (delito) {
  launchDialog({
    component: ModalCompetenciaTerritorial,
    header: 'Consultar Competencia Territorial',
    width: '80%',
    confirmLabel: 'Guardar Georreferenciación',
    props: {
      idDenuncia: idDenuncia.value
    },
    accept: (data) => {
      if (data.length) {
        georreferencia_SET_FISCALIAS_COMPETENTES(data)
        toastSuccess('Se guardó la competencia territorial')
      }
    }
  })
}

function openModalVerMapa (_delito) {
  console.log(_delito)
  launchDialog({
    component: ModalVerMapa,
    header: 'Ver Mapa ',
    width: '70%',
    cancelIcon: '',
    cancelLabel: 'Cerrar',
    props: {
      coords: { ..._delito?.direccionDelito }
    }
  })
}
</script>
