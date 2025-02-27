<template>
<LoaderSkeleton v-if="loading.page" />

<section
  v-else
  class="mb-6"
>
  <div class="">
    <AppFieldset
      legend="Especies Registradas"
      no-margin-bottom
    >
      <TablaEspeciesDinero
        v-model:isLoadingTable="loading.tablaEspecies"
        :data-especies-dinero="especiesData"
        es-ficha-causa
        :is-disabled="isFolioCerrado"
        :is-editando="editando"
        @tabla-especies:editar-especie="editarEspecie"
        @tabla-especies:eliminar-especie="eliminarEspecie"
      />
    </AppFieldset>
  </div>
  <div class="flex justify-content-center mt-3">
    <Button
      id="agregar-especie"
      class="btn-fileupload"
      :disabled="isFolioCerrado"
      :icon="!isCollapsed ? 'pi pi-plus' : 'pi pi-minus-circle'"
      icon-pos="right"
      :label="!isCollapsed ? 'Agregar Especie' : 'Cancelar'"
      :loading="loading.guardar"
      style="width: auto"
      type="button"
      @click="toggleFormularioEspecies"
    />
    <Button
      v-if="isCollapsed"
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
    :form-submitted="formSubmitted"
    :is-collapsed="isCollapsed"
    :is-editando="editando"
    :loading-button="loading.guardar"
    :seccion="seccion"
    :validation-scope="especiesDineroValidationScope"
    @adjuntar-documento="adjuntarDocumento"
    @agregar-especie="guardarEspecie"
    @cancelar-edicion="toggleFormularioEspecies"
    @eliminar-documento="eliminarDocumento"
  />
  <AppBtnNextTeleported
    v-if="$hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`]) || esNuevaAtencionFiscal"
    :disabled="isCollapsed"
    label="Relato Hecho"
    :loading="loading.stepRelato"
    @click="handleNextStep"
  />
</section>
</template>
<script setup>
import { defineEmits, onMounted, ref, computed, reactive, provide } from 'vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaEspeciesDinero from '@/modules/global/components/especies-dinero/TablaEspeciesDinero.vue'
import FormEspeciesDinero from '@/modules/global/components/forms/FormEspeciesDinero.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

// composables
import { appUtil, requestUtil } from '@/utils'
import { useProcedimientosBandejaStore } from '@/modules/flagrancia/composables/useProcedimientosBandejaStore'
import { useEspeciesDineroProvide } from '@/modules/global/composables/useEspeciesDinero'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useEspeciesDineroStore, useMantenedorStore, useDocumentoStore, usePamStore } from '@/modules/global/composables'
import { populateEspecie } from '@/modules/global/contracts'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
const { toastError, toastSuccess, toastWarning, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const { especiesFormData, especiesDineroValidationScope } = useEspeciesDineroProvide()
provide(especiesDineroValidationScope, especiesFormData)
const { esNuevaAtencionFiscal, estadoFolio } = useProcedimientosBandejaStore()

const { formSubmitted, isFormValid, resetFormData } = useFormValidation({
  formData: especiesFormData,
  validationScope: especiesDineroValidationScope
})

const {
  seccionesFUD,
  mantenedor_getCategoriasDocumento,
  mantenedor_getFamiliaEspecies,
  mantenedor_getTiposDelito,
  mantenedor_getAllTiposEspecie,
  mantenedor_getAmbitoEspecie
} = useMantenedorStore()

const {
  especies: especiesData,
  especiesDinero_SET_DINERO,
  especiesDinero_RESET_DINERO,
  especiesDinero_addEspecie,
  especiesDinero_updateEspecie,
  especiesDinero_deleteEspecie,
  especiesDinero_getEspecieByIdDenuncia,
  especiesDinero_getEspecieByIdEspecie
} = useEspeciesDineroStore()

const {
  fotosVideosEyD,
  documento_addDocumentoCDD,
  documento_getDocumentoBySeccionCDD,
  documento_asociarIdPropietarioDocumentoCDD,
  documento_deleteDocumentoCDD,
  documento_SET_DEFAULT_STATE
} = useDocumentoStore()

const { procesoPam } = usePamStore()
const { idCatalogo } = useIdentificacionDenunciaStore()

const emit = defineEmits(['next-step'])

const loading = reactive({
  tablaEspecies: false,
  stepRelato: false,
  page: true,
  guardar: false
})
const tablaDocumentos = reactive({ // TO DO PREGUNTAR sin uso
  isLoading: false,
  firstRecord: 0
})
const editando = ref(false)
const isCollapsed = ref(false)
const isFolioCerrado = computed(() => estadoFolio.value === 'Cerrado')
const bodyRequest = ref([])
const seccion = seccionesFUD.value.find((x) => x.codigo === '11') // MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 11: CATEGORIA VIDEO Y ESPECIES

onMounted(() => {
  getEspeciesDinero()
  getDocumentosEnSeccion()
})

async function getDataMantenedor () {
  await requestUtil({ action: mantenedor_getCategoriasDocumento })
  await requestUtil({ action: mantenedor_getTiposDelito })
  await requestUtil({ action: mantenedor_getFamiliaEspecies })
  await requestUtil({ action: mantenedor_getAllTiposEspecie })
  await requestUtil({ action: mantenedor_getAmbitoEspecie })
}
getDataMantenedor()

function getEspeciesDinero () {
  loading.tablaEspecies = true
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: procesoPam.value.idDenuncia },
    loader: (l) => {
      if (loading.page === true) loading.page = l
      loading.tablaEspecies = l
    }
  })
}

const esGenerico = (data) => {
  return !data.esVehiculo && !data.esDinero && !data.existeAnimalInvolucrado && !data.esDocumentoValor
}

function toggleFormularioEspecies () {
  documento_SET_DEFAULT_STATE()
  editando.value = false
  isCollapsed.value = !isCollapsed.value
  resetFormData()
  especiesDinero_RESET_DINERO()
  appUtil.scrollTo(0)
}

function guardarEspecie (payload) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const { idProcedimiento, idDenuncia } = procesoPam.value

  payload.esEspecieGenerico = esGenerico(payload)
  payload.idDenuncia = idDenuncia
  payload.idProcedimiento = idProcedimiento

  if (!editando.value) {
    requestUtil({
      action: especiesDinero_addEspecie,
      payload: payload,
      resolve: (r) => {
        getEspeciesDinero()
        toastSuccess('Especie Agregada')
        addDocumentosEspecie(r)
        toggleFormularioEspecies()
        isCollapsed.value = false
      },
      loader: (l) => (loading.guardar = l)
    })
  } else {
    requestUtil({
      action: especiesDinero_updateEspecie,
      payload,
      resolve: () => {
        getEspeciesDinero()
        toastWarning('Especie Editada')
        toggleFormularioEspecies()
      },
      loader: (l) => (loading.guardar = l)
    })
  }
}

function eliminarEspecie (data) {
  launchConfirmDialog({
    message: '¿Estás seguro(a) de eliminar la especie?',
    accept: () => deleteEspecie(data)
  })
}

function deleteEspecie (data) {
  requestUtil({
    action: especiesDinero_deleteEspecie,
    payload: data,
    loader: (l) => (loading.guardar = l),
    resolve: () => {
      toastSuccess('Especie Eliminada')
      getEspeciesDinero()
    },
    reject: (e) => {
      console.error(e)
      toastError('Hubo un problema al eliminar la especie')
    }
  })
}

function editarEspecie (data) {
  editando.value = true

  requestUtil({
    action: especiesDinero_getEspecieByIdEspecie,
    payload: { idEspecie: data.idEspecie },
    loader: (l) => (loading.guardar = l),
    resolve: (especie) => {
      isCollapsed.value = true
      setTimeout(() => {
        populateEspecie(especie, especiesFormData)
        especiesDinero_SET_DINERO(data.dinero)
      }, 100)
    },
    reject: (e) => {
      console.error(e)
      toastError('Hubo un problema al editar la especie')
    }
  })
}

// CDD
function eliminarDocumento (documento) {
  launchConfirmDialog({
    message: `¿Estás seguro de querer eliminar el documento ${documento.nombre}?`,
    accept: () => {
      requestUtil({
        action: documento_deleteDocumentoCDD,
        payload: { idDocumento: documento.id },
        resolve: () => {
          toastWarning('Documento Eliminado')
          getDocumentosEnSeccion()
        },
        loader: (l) => {
          tablaDocumentos.isLoading = l
        }
      })
    }
  })
}

function addDocumentosEspecie (idEspecie) {
  if (fotosVideosEyD.value.data) {
    asociarDocumentosAEspecie(fotosVideosEyD.value.data, idEspecie)
  }
  requestUtil({
    action: documento_asociarIdPropietarioDocumentoCDD,
    payload: { request: bodyRequest.value }
  })
}

function asociarDocumentosAEspecie (documentos, idDelito) {
  if (documentos) {
    documentos.forEach((d) => {
      const doc = {
        id: d.id,
        idPropietario: idDelito
      }
      bodyRequest.value.push(doc)
    })
  }
}

function adjuntarDocumento (documento) {
  requestUtil({
    action: documento_addDocumentoCDD,
    payload: documento,
    resolve: () => {
      // formData.value.reset() // arroja error TO DO PREGUNTAR
      toastSuccess('Documento Adjuntado')
      getDocumentosEnSeccion()
    }
  })
}

function getDocumentosEnSeccion () {
  requestUtil({
    action: documento_getDocumentoBySeccionCDD,
    payload: {
      size: 10,
      page: 0,
      idCategoriaDocumento: seccion.id,
      idCatalogo: idCatalogo.value,
      categoria: seccion.descripcion
    },
    loader: (l) => {
      tablaDocumentos.isLoading = l
    }
  })
}

// NEXT STEP
function handleNextStep () {
  loading.stepRelato = true
  setTimeout(() => {
    loading.stepRelato = false
    emit('next-step', 'FlagranciaNuevaAtencionRelatoHecho')
  }, 600)
}
</script>
