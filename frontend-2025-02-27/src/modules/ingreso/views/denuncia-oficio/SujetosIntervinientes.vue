<template>
<AppFieldset legend="Sujetos Intervinientes Registrados">
  <div
    v-if="loading.tablaSujetos"
    class="col-12"
  >
    <LoaderSkeleton />
  </div>
  <div
    v-else
    class="col-12"
  >
    <TablaSujetos
      v-model:first="sujetos.firstRecord"
      :is-editando="isEditando"
      :list-value="sujetosIntervinientes"
      :loading="loading.tablaSujetos"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      @eliminar-sujeto="eliminarSujeto"
      @page="getSujetos"
      @set-sujeto-editar="setModoEdicion"
    />
  </div>
  <FormSujetosIntervinientes
    class="col-12"
    :form-submitted="formSubmitted"
    :is-collapsed="isCollapsed"
    :is-editando="isEditando"
    :loading-button="loading.addButton"
    :reset-form-data="resetFormData"
    :validation-scope="sujetosIntervinientesValidationScope"
    @agregar-interviniente="agregarInterviniente"
    @cancelar-edicion="cancelarEdicion"
    @change-tipo-sujeto="changeTipoSujeto"
    @handle-submit-form="handleSubmitForm"
    @reset-form-data="resetFormData"
  />
</AppFieldset>
<AppBtnNextTeleported
  :disabled="!isCollapsed"
  label="Delitos"
  :loading="loading.stepDelitos"
  @click="nextStep"
/>
</template>

<script setup>
import { ref, defineEmits, provide, reactive, onMounted } from 'vue'

// components
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaSujetos from '@/modules/global/components/sujetos-intervinientes/tablas/TablaSujetos.vue'
import FormSujetosIntervinientes from '@/modules/global/components/forms/FormSujetosIntervinientes.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import {
  useMantenedorStore,
  usePamStore,
  useSujetosIntervinientesStore,
  useDocumentoStore
} from '@/modules/global/composables'

// form
import { useSujetosIntervinientesProvide } from '@/modules/global/composables/useSujetosIntervinientes'

// utils
import { appUtil, requestUtil } from '@/utils'
import {
  generateSujetoContract,
  populateInterviniente
} from '@/modules/global/contracts'

const { mantenedor_getTiposDocumento, mantenedor_getTiposSujetos } =
  useMantenedorStore()
const {
  sujetosIntervinientes,
  paginacion,
  flags,
  sujetosIntervinientes_getSujetosByIdGlobal,
  sujetosIntervinientes_addSujeto,
  sujetosIntervinientes_addDireccion,
  sujetosIntervinientes_updateSujeto,
  sujetosIntervinientes_deleteSujeto
} = useSujetosIntervinientesStore()

const { launchConfirmDialog } = useConfirmDialog()

const { documento_SET_DEFAULT_STATE, documento_addDocumento, documentos } =
  useDocumentoStore()
const { procesoPam } = usePamStore()
const isCollapsed = ref(true)
const isEditando = ref(false)

const loading = reactive({
  tablaSujetos: false,
  stepDelitos: false,
  addButton: false
})

onMounted(() => {
  mantenedor_getTiposDocumento()
  mantenedor_getTiposSujetos()
  getSujetos()
})

function eliminarSujeto (sujeto) {
  launchConfirmDialog({
    message: `¿Estás seguro(a) de eliminar a ${sujeto.nombres} ${sujeto.apellidoPaterno} ${sujeto.apellidoMaterno}`,
    accept: async () => {
      requestUtil({
        action: sujetosIntervinientes_deleteSujeto,
        payload: {
          idRelacionSujeto: sujeto.idRelacionSujeto
        },
        resolve: async () => {
          toastSuccess(
            `Se eliminó el interviniente ${sujeto.nombres} ${sujeto.apellidoPaterno} ${sujeto.apellidoMaterno}`
          )
          getSujetos()
        }
      })
    }
  })
}

async function getSujetos (pagination = undefined) {
  const { idDenuncia } = procesoPam.value
  if (!pagination) {
    sujetos.firstRecord = 0
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (l) => (loading.tablaSujetos = l)
  })
}

const { formData, datosComplementarios, sujetosIntervinientesValidationScope } =
  useSujetosIntervinientesProvide()

provide(sujetosIntervinientesValidationScope, formData)

const { isFormValid, formSubmitted, resetFormData, resetByKeys } =
  useFormValidation({
    formData,
    validationScope: sujetosIntervinientesValidationScope
  })

const { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } =
  useAppToast()

function changeTipoSujeto () {
  resetByKeys(Object.keys(datosComplementarios))
}

function setModoEdicion (sujeto) {
  if (!sujeto) return
  isCollapsed.value = false
  isEditando.value = true
  populateInterviniente(sujeto, formData)
}

function cancelarEdicion () {
  resetFormData()
  isEditando.value = false
  isCollapsed.value = true
}

const sujetos = reactive({
  isLoading: false,
  firstRecord: 0
})

function agregarSujeto (payload) {
  requestUtil({
    action: sujetosIntervinientes_addSujeto,
    payload: payload,
    resolve: (v) => {
      addDocumentosPersona(v)
      documento_SET_DEFAULT_STATE('interviniente')
      toastSuccess('Agregado con éxito!')
      setTimeout(() => getSujetos(), 1000)
      if (formData.direccion) {
        addDireccionSrcel(v)
      } else {
        cancelarEdicion()
      }

      appUtil.scrollTo(0)
    },
    loader: (l) => (loading.addButton = l),
    reject: (e) => {
      if (e.status === 400) {
        const mensaje = e.data.mensaje

        toastError(mensaje)
      } else {
        toastError('Ha ocurrido un problema')
      }
    }
  })
}
function editarSujeto (payload) {
  requestUtil({
    action: sujetosIntervinientes_updateSujeto,
    payload: payload,
    resolve: () => {
      toastWarning('Interviniente Modificado')
      documento_SET_DEFAULT_STATE('interviniente')
      cancelarEdicion()
      getSujetos()
      appUtil.scrollTo(0)
    },
    loader: (l) => (loading.addButton = l),
    reject: (e) => {
      console.error('error editando: ', e)
      toastError('Ha ocurrido un problema')
    }
  })
}

const handleSubmitForm = () => {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  const { idCausa, idDenuncia } = procesoPam.value
  formData.idCausa = idCausa
  formData.idDenuncia = idDenuncia
  const payload = generateSujetoContract(formData)

  !isEditando.value ? agregarSujeto(payload) : editarSujeto(payload)
}

function addDireccionSrcel (id) {
  const payload = {
    sujetoId: id,
    payload: {
      tipo: 'tipo',
      calle: formData.direccion,
      numero: 'numero',
      poblacion: 'poblacion',
      sectorDir: 'sector',
      comuna: 'comuna',
      region: 'region',
      interseccion: 'interseccion',
      cuadrante: 'cuadrante',
      observacionDir: 'observacionDir',
      lat: 0,
      lng: 0
    }
  }
  requestUtil({
    action: sujetosIntervinientes_addDireccion,
    payload: payload,
    resolve: () => {
      cancelarEdicion()
    },
    reject: (r) => console.error('error en addDireccionSrcel: ', r)
  })
}

function addDocumentosPersona (id) {
  documentos.value.forEach((doc) => {
    doc.idDenuncia = procesoPam.value.idDenuncia
    doc.idSujeto = id
    requestUtil({
      action: documento_addDocumento,
      payload: doc
    })
  })
}

const emit = defineEmits(['next-step'])

function nextStep () {
  if (flags.value.existeDenunciante) {
    loading.stepDelitos = true
    setTimeout(() => {
      loading.stepDelitos = false
      emit('next-step', '/ingreso/denuncia-oficio/nueva-denuncia/delitos')
    }, 600)
  } else {
    toastError('Debes ingresar al menos un denunciante para poder continuar')
  }
}

function agregarInterviniente () {
  isEditando.value = false
  isCollapsed.value = !isCollapsed.value
  setTimeout(() => {
    appUtil.scrollTo(260)
  }, 100)
}
</script>

<style scoped>
.buttonWarning {
  color: #d7761a;
}
.posicionBotonGuardar {
  margin-left: 25vw;
}
</style>
