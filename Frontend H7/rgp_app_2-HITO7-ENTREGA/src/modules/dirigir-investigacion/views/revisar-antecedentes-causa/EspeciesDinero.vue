<template>
<section v-if="isLoading">
  <LoaderSkeleton height="30vh" />
</section>
<section v-else>
  <AppFieldset legend="Lista de Especies Dinero">
    <AppFilters
      v-model="especieDinero.filters"
      class="w-full mb-3"
      no-date-filters
      @filter="getEspeciesDinero"
    />
    <TablaEspecies
      v-model:first="especieDinero.firstRecord"
      :loading="loadingTablaEspecies"
      :read-only="true"
      :rows="10"
      :total-records="paginacionEspecies?.elementosTotales"
      :value="especies"
      @definir-destino="openModalDestino"
      @page="getEspeciesDinero"
      @solicitar-inspeccion="openModalInspeccion"
      @ver-mas="setModoLectura"
    />
  </AppFieldset>
  <div class="flex justify-content-center">
    <Button
      id="agregar-especie"
      class="btn-fileupload"
      :icon="!isCollapsed ? 'pi pi-plus' : 'pi pi-minus-circle'"
      icon-pos="right"
      :label="!isCollapsed ? 'Agregar Especie' : 'Cancelar'"
      :loading="loadingTablaEspecies"
      style="width: auto"
      type="button"
      @click="toggleFormularioEspecies"
    />
    <Button
      v-if="isCollapsed && !formData.isReadOnly"
      id="limpiarFormEspecie"
      class="p-button-outlined p-button-warning ml-3"
      icon="pi pi-times"
      icon-pos="right"
      label="Limpiar"
      style="width: auto"
      type="button"
      @click="resetFormData"
    />
  </div>
  <FormEspeciesDinero
    class="max-w-full mb-6"
    :form-submitted="formSubmitted"
    :is-collapsed="isCollapsed"
    :is-editando="isEditando"
    :loading-button="loadingTablaEspecies"
    :validation-scope="especiesDineroValidationScope"
    @agregar-especie="handleSubmitForm"
    @cancelar-edicion="toggleFormularioEspecies"
    @eliminar-documento="eliminarDocumento"
  />
</section>
</template>

<script setup>
import { onMounted, provide, reactive, ref } from 'vue'
import { requestUtil, appUtil } from '@/utils'
import { populateEspecie } from '@/modules/global/contracts'
import { useEspeciesDineroProvide } from '@/modules/global/composables/useEspeciesDinero'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useAppDialog, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useDocumentoStore, useEspeciesDineroStore, useMantenedorStore } from '@/modules/global/composables'
import ModalSolicitarInspeccionVisual from '@/modules/dirigir-investigacion/components/modals/ModalSolicitarInspeccionVisual.vue'
import ModalProponerDestinoEspecie from '@/modules/dirigir-investigacion/components/modals/ModalProponerDestinoEspecie.vue'
import FormEspeciesDinero from '@/modules/global/components/forms/FormEspeciesDinero.vue'
import TablaEspecies from '@/modules/dirigir-investigacion/components/TablaEspecies.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'

const { launchDialog } = useAppDialog()
const { TOAST_MESSAGES, toastError, toastSuccess } = useAppToast()

const isCollapsed = ref(false)
const isEditando = ref(false)
const isLoading = ref(false)
const loadingTablaEspecies = ref(false)

const { ruc, idDenuncia } = useDirigirInvestigacionStore()

const especieDinero = reactive({
  isLoading: false,
  filters: {
    buscador: null
  },
  firstRecord: 0
})

const { especiesFormData: formData, especiesDineroValidationScope } = useEspeciesDineroProvide()
provide(especiesDineroValidationScope, formData)

const { formSubmitted, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: especiesDineroValidationScope
})

const { launchConfirmDialog } = useConfirmDialog()

const {
  especies,
  paginacionEspecies,
  dineros,
  especiesDinero_getEspecieByIdDenuncia,
  especiesDinero_updateEspecie,
  especiesDinero_addEspecie,
  especieDinero_bff_solicitarInspecccionVisual,
  especieDinero_bff_definirDestinoEspecies,
  especiesDinero_RESET_DINERO,
  especiesDinero_getEspecieByIdEspecie
} = useEspeciesDineroStore()

const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getTiposDelito,
  mantenedor_getAllTiposEspecie,
  mantenedor_getAmbitoEspecie
} = useMantenedorStore()

const { documento_DELETE_DOCUMENTO, documento_SET_DEFAULT_STATE } = useDocumentoStore()

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposDelito })
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getAllTiposEspecie })
  requestUtil({ action: mantenedor_getAmbitoEspecie })
}
getDataMantenedor()

onMounted(async () => {
  getEspeciesDinero()
})

async function getEspeciesDinero () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => {
      loadingTablaEspecies.value = l
    }
  })
}

function toggleFormularioEspecies () {
  isEditando.value = false
  documento_SET_DEFAULT_STATE()
  isCollapsed.value = !isCollapsed.value
  resetFormData()
  especiesDinero_RESET_DINERO()
  appUtil.scrollTo(0)
}

function modificarEspecie (payload) {
  requestUtil({
    action: especiesDinero_updateEspecie,
    payload: payload,
    resolve: (r) => {
      toggleFormularioEspecies()
      getEspeciesDinero()
    },
    loader: (l) => {
      loadingTablaEspecies.value = l
    }
  })
}

function agregarEspecie (payload) {
  requestUtil({
    action: especiesDinero_addEspecie,
    payload: payload,
    resolve: () => {
      toastSuccess('Especie Agregada')
      toggleFormularioEspecies()
      getEspeciesDinero()
    },
    loader: (l) => {
      loadingTablaEspecies.value = l
    }
  })
}

function handleSubmitForm (payload) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  payload.idDenuncia = idDenuncia.value
  payload.esDinero = !!dineros.value.length
  payload.esEspecieGenerico = esGenerico(payload)

  if (!isEditando.value) {
    agregarEspecie(payload)
  } else {
    modificarEspecie(payload)
  }
}

const esGenerico = (data) => {
  return !data.esVehiculo && !data.esDinero && !data.existeAnimalInvolucrado && !data.esDocumentoValor
}

function setModoLectura (especie) {
  formData.isReadOnly = true
  getEspecie(especie?.idEspecie)
}

function getEspecie (idEspecie) {
  requestUtil({
    action: especiesDinero_getEspecieByIdEspecie,
    payload: { idEspecie: idEspecie },
    loader: (l) => {
      loadingTablaEspecies.value = l
    },
    resolve: (data) => {
      isCollapsed.value = true
      populateEspecie(data, formData)
    },
    reject: (err) => {
      console.log('err', err)
    }
  })
}

function eliminarDocumento (documento) {
  const nombreDocumento = documento.nombreArchivo
  launchConfirmDialog({
    message: `¿Estás seguro de querer eliminar el documento ${nombreDocumento}?`,
    accept: () => documento_DELETE_DOCUMENTO(documento.idArchivo)
  })
}

function openModalDestino () {
  launchDialog({
    component: ModalProponerDestinoEspecie,
    header: 'Definir Destino de Especies y Dinero',
    width: '95%',
    confirmLabel: 'Enviar a Custodio',
    confirmIcon: 'pi pi-send',
    confirmIconPos: 'right',
    cancelIconPos: 'right',
    props: {
      especies: especies.value
    },
    accept: async (data) => {
      definirDestinoEspecies(data)
    }
  })
}

function openModalInspeccion (especie) {
  launchDialog({
    component: ModalSolicitarInspeccionVisual,
    width: '70%',
    header: 'Solicitar Inspección Visual',
    confirmLabel: 'Solicitar',
    confirmIcon: 'pi pi-send',
    props: {
      especie: especie
    },
    accept: async (data) => {
      solicitarInspeccionVisual(data)
    }
  })
}

async function solicitarInspeccionVisual (solicitud) {
  requestUtil({
    action: especieDinero_bff_solicitarInspecccionVisual,
    payload: {
      solicitud: solicitud,
      ruc: ruc.value
    },
    resolve: () => {
      toastSuccess('Solicitud Enviada con Éxito!')
    }
  })
}

async function definirDestinoEspecies (destinos) {
  requestUtil({
    action: especieDinero_bff_definirDestinoEspecies,
    payload: {
      destinos: destinos,
      ruc: ruc.value
    },
    resolve: () => {
      toastSuccess('Destinos Definidos con Éxito!')
    }
  })
}

</script>
