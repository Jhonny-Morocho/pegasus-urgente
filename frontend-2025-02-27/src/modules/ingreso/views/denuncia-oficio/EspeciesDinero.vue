<template>
<div v-if="loading.page">
  <LoaderSkeleton />
</div>
<section v-else>
  <div>
    <AppFieldset
      legend="Especies Registradas"
      no-margin-bottom
    >
      <TablaEspeciesDinero
        :data-especies-dinero="especiesData"
        :es-ficha-causa="true"
        :is-editando="editando"
        :loading="loading.tabla"
        @tabla-especies:editar-especie="editarEspecie"
        @tabla-especies:eliminar-especie="eliminarEspecie"
      />
    </AppFieldset>
  </div>
  <div class="flex justify-content-center mt-3">
    <Button
      id="agregar-especie"
      class="btn-fileupload"
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
    :disabled="isCollapsed"
    label="Relato Hecho"
    :loading="loading.stepRelatos"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { defineEmits, onMounted, ref, provide, reactive } from 'vue'

import FormEspeciesDinero from '@/modules/global/components/forms/FormEspeciesDinero.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaEspeciesDinero from '@/modules/global/components/especies-dinero/TablaEspeciesDinero.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

// composables
import { appUtil, requestUtil } from '@/utils'
import { useEspeciesDineroProvide } from '@/modules/global/composables/useEspeciesDinero'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useEspeciesDineroStore, useMantenedorStore, useDocumentoStore, usePamStore } from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { populateEspecie } from '@/modules/global/contracts'

const { toastError, toastSuccess, toastWarning, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { especiesFormData, especiesDineroValidationScope } = useEspeciesDineroProvide()
provide(especiesDineroValidationScope, especiesFormData)

const { formSubmitted, isFormValid, resetFormData } = useFormValidation({
  formData: especiesFormData,
  validationScope: especiesDineroValidationScope
})

const {
  seccionesFUD,
  mantenedor_getFamiliaEspecies,
  mantenedor_getAllTiposEspecie,
  mantenedor_getTiposDelito,
  mantenedor_getAmbitoEspecie,
  mantenedor_getCategoriasDocumento
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
  tabla: false,
  page: true,
  stepRelatos: false,
  guardar: false
})
const isCollapsed = ref(false)
const editando = ref(false)
const seccion = seccionesFUD.value.find((x) => x.codigo === '11') // MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 11: CATEGORIA VIDEO Y ESPECIES

// const especiesDineroObservacion = ref()
// const especiesDineroGeolocalizacion = ref()

onMounted(() => {
  getEspeciesDinero()
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
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: procesoPam.value.idDenuncia },
    loader: (l) => {
      if (loading.page === true) loading.page = l
      loading.tabla = l
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

  payload.esEspecieGenerico = esGenerico(payload)
  payload.idDenuncia = procesoPam.value.idDenuncia

  if (!editando.value) {
    requestUtil({
      action: especiesDinero_addEspecie,
      payload: payload,
      resolve: (r) => {
        toastSuccess('Especie Agregada')
        toggleFormularioEspecies()
        getEspeciesDinero()
        addDocumentosEspecie(r)
      },
      loader: (l) => (loading.guardar = l)
    })
  } else {
    requestUtil({
      action: especiesDinero_updateEspecie,
      payload: payload,
      resolve: (r) => {
        console.log(r)
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

function addDocumentosEspecie (idEspecie) {
  if (fotosVideosEyD.value.data) {
    asociarDocumentosAEspecie(fotosVideosEyD.value.data, idEspecie)
  }
  requestUtil({
    action: documento_asociarIdPropietarioDocumentoCDD,
    payload: { request: bodyRequest.value }
  })
}

// function adjuntarDocumento (documento) {
//   documento.idDenuncia = procesoPam.value.idDenuncia
//   if (documento.idEspecie) {
//     console.log(documento)
//     requestUtil({
//       action: documento_addDocumento,
//       payload: documento,
//       resolve: () => {
//         if (formData.esVehiculo) {
//           especiesDineroGeolocalizacion.value.resetFormData()
//         } else {
//           especiesDineroObservacion.value.resetFormData()
//         }
//         toastSuccess('Documento Adjuntado')
//       }
//     })
//   } else {
//     documento_ADD_DOCUMENTO(documento)
//     if (formData.esVehiculo) {
//       especiesDineroGeolocalizacion.value.resetFormData()
//     } else {
//       especiesDineroObservacion.value.resetFormData()
//     }
//     toastSuccess('Documento Adjuntado')
//   }
// }

const bodyRequest = ref([])
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
      toastSuccess('Documento Adjuntado')
      getDocumentosEnSeccion()
    }
  })
}

const tablaDocumentos = reactive({
  isLoading: false,
  firstRecord: 0
})

function getDocumentosEnSeccion (pagination = undefined) {
  if (!idCatalogo.value) {
    console.log('Sin idCatalogo')
    return
  }

  if (!pagination) {
    tablaDocumentos.firstRecord = 0
  }

  const catalogoId = idCatalogo.value.replace('{', '').replace('}', '')

  requestUtil({
    action: documento_getDocumentoBySeccionCDD,
    payload: {
      size: 10,
      page: 0,
      idCategoriaDocumento: seccion.id,
      idCatalogo: catalogoId,
      categoria: seccion.descripcion
    },
    loader: (l) => {
      tablaDocumentos.isLoading = l
    }
  })
}

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

function handleNextStep () {
  loading.stepRelatos = true
  setTimeout(() => {
    loading.stepRelatos = false
    emit('next-step', '/ingreso/denuncia-oficio/nueva-denuncia/relato')
  }, 600)
}
</script>
