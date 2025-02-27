<template>
<section>
  <AppFieldset legend="Lista de Especies/Dinero">
    <TablaEspeciesFlujoPreclasificador
      is-asignacion
      :loading="isLoading.especies || isLoading.especie"
      :value="especies"
    >
      <template #acciones>
        <Column
          v-if="!isCollapsed"
          header="Acciones"
        >
          <template #body="slotProps">
            <AppMenuOptions
              v-model="especieSeleccionada"
              :menu-options="menuTablaEspecie"
              :slot-props="slotProps"
            />
          </template>
        </Column>
      </template>
    </TablaEspeciesFlujoPreclasificador>
  </AppFieldset>
  <div class="flex justify-content-center">
    <Button
      id="agregar-especie"
      class="btn-fileupload"
      :icon="!isCollapsed ? 'pi pi-plus' : 'pi pi-minus-circle'"
      icon-pos="right"
      :label="!isCollapsed ? 'Agregar Especie' : 'Cancelar'"
      :loading="isLoading.agregarEspecie || isLoading.especies"
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
    class="max-w-full"
    :form-submitted="formSubmitted"
    :is-collapsed="isCollapsed"
    :is-editando="editando"
    :loading-button="isLoading.especie || isLoading.especies"
    :seccion="seccion"
    :validation-scope="especiesDineroValidationScope"
    @adjuntar-documento="adjuntarDocumento"
    @agregar-especie="handleSubmitForm"
    @cancelar-edicion="toggleFormularioEspecies"
    @eliminar-documento="eliminarDocumento"
  />
</section>
</template>

<script setup>
import { onMounted, onUnmounted, provide, reactive, ref } from 'vue'
import { useMantenedorStore, useEspeciesDineroStore, useDocumentoStore } from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

import { requestUtil, appUtil } from '@/utils'
import { useAppDialog, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useEspeciesDineroProvide } from '@/modules/global/composables/useEspeciesDinero'
import { populateEspecie } from '@/modules/global/contracts'
import { useCausaAsignacionStore, useFlujoPamAsignacion } from '@/modules/asignacion/composables'
import ModalProponerDestinoEspecie from '@/modules/preclasificador/components/modals/ModalProponerDestinoEspecie.vue'
import TablaEspeciesFlujoPreclasificador from '@/modules/global/components/especies-dinero/TablaEspeciesFlujoPreclasificador.vue'
import FormEspeciesDinero from '@/modules/global/components/forms/FormEspeciesDinero.vue'

const { toastError, toastSuccess, toastWarning, TOAST_MESSAGES } = useAppToast()

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()

const { idDenuncia } = useCausaAsignacionStore()
const { flujoAsignacion } = useFlujoPamAsignacion()

const {
  seccionesFUD,
  mantenedor_getCategoriasDocumento,
  mantenedor_getAllTiposEspecie, mantenedor_getFamiliaEspecies
} = useMantenedorStore()

const {
  dineros,
  especies,
  especiesDinero_updateEspecie,
  especiesDinero_getEspecieByIdDenuncia,
  especiesDinero_RESET_DINERO,
  especiesDinero_addEspecie,
  especiesDinero_getEspecieByIdEspecie,
  // especiesDinero_proponerDestinoEspecieEnCausa,
  especiesDinero_SET_DEFAULT_STATE
} = useEspeciesDineroStore()

const {
  fotosVideosEyD,
  documento_addDocumentoCDD,
  documento_getDocumentoBySeccionCDD,
  documento_asociarIdPropietarioDocumentoCDD,
  documento_deleteDocumentoCDD,
  documento_SET_DEFAULT_STATE
} = useDocumentoStore()

const { especiesDineroValidationScope, especiesFormData: formData } = useEspeciesDineroProvide()

provide(especiesDineroValidationScope, formData)

const { formSubmitted, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: especiesDineroValidationScope
})
const { idCatalogo } = useIdentificacionDenunciaStore()

const isCollapsed = ref(false)
const editando = ref(false)
const especieSeleccionada = ref()
const bodyRequest = ref([])
const seccion = seccionesFUD.value.find((x) => x.codigo === '11') // MANTENEDOR CATEGORIA DOCUMENTO. CODIGO 11: CATEGORIA VIDEO Y ESPECIES

const isLoading = reactive({
  mantenedor: false,
  especies: false,
  especie: false,
  agregarEspecie: false
})
const tablaDocumentos = reactive({
  isLoading: false,
  firstRecord: 0
})

async function getEspeciesDinero () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => {
      isLoading.especies = l
    }
  })
}

function toggleFormularioEspecies () {
  documento_SET_DEFAULT_STATE()
  isCollapsed.value = !isCollapsed.value
  cancelarEdicion()
}

function agregarEspecie (payload) {
  requestUtil({
    action: especiesDinero_addEspecie,
    payload: payload,
    resolve: (r) => {
      toastSuccess('Especie Agregada')
      flujoAsignacion.requiereCambiarTipificacion = true
      flujoAsignacion.revisaEspecies = true
      toggleFormularioEspecies()
      getEspeciesDinero()
      addDocumentosEspecie(r)
    },
    loader: (l) => {
      isLoading.agregarEspecie = l
    }
  })
}

function modificarEspecie (payload) {
  requestUtil({
    action: especiesDinero_updateEspecie,
    payload: payload,
    resolve: (r) => {
      toastWarning('Especie Editada')
      flujoAsignacion.requiereCambiarTipificacion = true
      flujoAsignacion.revisaEspecies = true
      toggleFormularioEspecies()
      getEspeciesDinero()
    },
    loader: (l) => {
      isLoading.agregarEspecie = l
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

  if (!editando.value) {
    agregarEspecie(payload)
  } else {
    modificarEspecie(payload)
  }
}

function getEspecie (idEspecie) {
  requestUtil({
    action: especiesDinero_getEspecieByIdEspecie,
    payload: { idEspecie: idEspecie },
    loader: (l) => {
      isLoading.especie = l
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

function setModoLectura (especie) {
  formData.isReadOnly = true
  getEspecie(especie?.idEspecie)
}

function setModoEdicion (especie) {
  editando.value = true
  getEspecie(especie?.idEspecie)
}

function cancelarEdicion () {
  editando.value = false
  formData.isReadOnly = false
  resetFormData()
  especiesDinero_RESET_DINERO()
  appUtil.scrollTo(0)
}

function openModalSolicitarInspeccionVisual (especie) {
  console.log('🚀 ~ file: EspeciesDinero.vue ~ line 155 ~ openModalSolicitarInspeccionVisual ~ especie', especie)
}

function openModalProponerDestinoEspecie (especie) {
  launchDialog({
    component: ModalProponerDestinoEspecie,
    header: 'Proponer Destino de la Especie',
    width: '65%',
    props: { especie },
    confirmLabel: 'Definir Destino',
    accept: (res) => {
      proponerDestinoEspecie(especie, res)
    }
  })
}

async function proponerDestinoEspecie (especie, proposito) {
  const payload = {
    idEspecie: especie?.idEspecie,
    destino: proposito?.destinoEspecie,
    motivo: proposito?.motivo
  }
  console.log('proponerDestinoEspecie: ', payload)
}

function enviarAPeritaje (especie) {
  console.log('enviar a peritaje: ', especie)
}

function solicitarFijarFoto (especie) {
  console.log('solicitar fijar foto: ', especie)
}

const esGenerico = (data) => {
  return !data.esVehiculo && !data.esDinero && !data.existeAnimalInvolucrado && !data.esDocumentoValor
}

async function getDataMantenedor () {
  await requestUtil({
    action: mantenedor_getAllTiposEspecie,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  await requestUtil({
    action: mantenedor_getFamiliaEspecies,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  await requestUtil({ action: mantenedor_getCategoriasDocumento })
}

onMounted(() => {
  getDataMantenedor()
  getEspeciesDinero()
  getDocumentosEnSeccion()
})

// CDD
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

onUnmounted(() => {
  especiesDinero_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
})

const menuTablaEspecie = ref([
  {
    label: 'Ver Más',
    command: () => setModoLectura(especieSeleccionada.value)
  },
  {
    label: 'Modificar',
    command: () => setModoEdicion(especieSeleccionada.value)
  },
  {
    label: 'Solicitar Inspección Visual',
    command: () => openModalSolicitarInspeccionVisual(especieSeleccionada.value),
    disabled: () => true
  },
  {
    label: 'Proponer Destino de la Especie',
    command: () => openModalProponerDestinoEspecie(especieSeleccionada.value),
    disabled: () => true
  },
  {
    label: 'Enviar a Peritaje',
    command: () => enviarAPeritaje(especieSeleccionada.value),
    disabled: () => true
  },
  {
    label: 'Solicitar Fijar Fotográficamente',
    command: () => solicitarFijarFoto(especieSeleccionada.value),
    disabled: () => true
  }
])
</script>
