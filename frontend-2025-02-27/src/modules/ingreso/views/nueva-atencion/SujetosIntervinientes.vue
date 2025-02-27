<template>
<div
  v-if="loading.page"
  class="col-12"
>
  <LoaderSkeleton />
</div>
<div v-else>
  <AppFieldset legend="Sujetos Intervinientes Registrados">
    <div class="col-12">
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
</div>
</template>

<script setup>
// COMPONENTS
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaSujetos from '@/modules/global/components/sujetos-intervinientes/tablas/TablaSujetos.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import FormSujetosIntervinientes from '@/modules/global/components/forms/FormSujetosIntervinientes.vue'

// UTILS
import { ref, defineEmits, provide, reactive, onMounted, computed } from 'vue'

// COMPOSABLES
import { appUtil, requestUtil } from '@/utils'
import { useIdentificacionDenunciaStore } from '../../composables'
import { generateSujetoContract, populateInterviniente } from '@/modules/global/contracts'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesProvide } from '@/modules/global/composables/useSujetosIntervinientes'
import { useSujetosIntervinientesStore, useDocumentoStore, useMantenedorStore, usePamStore } from '@/modules/global/composables'

const { procesoPam } = usePamStore()
const { launchConfirmDialog } = useConfirmDialog()
const { mantenedor_getCodigoTipoDocumentoIdentidad } = useMantenedorStore()
const { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } = useAppToast()
const { identificacionDenuncia, identificacionDenuncia_getByIdDenuncia } = useIdentificacionDenunciaStore()
const { formData, datosComplementarios, sujetosIntervinientesValidationScope } = useSujetosIntervinientesProvide()
const {
  sujetosIntervinientes, paginacion, sujetosIntervinientes_getSujetosByIdGlobal, sujetosIntervinientes_addSujeto,
  sujetosIntervinientes_deleteSujeto, sujetosIntervinientes_addDireccion, sujetosIntervinientes_updateSujeto, flags
} = useSujetosIntervinientesStore()
const { pautasVif, declaraciones, hospitalizacion, ordenesDetencion, formulariosRiesgo, fotoHuellaFirma, documento_asociarIdPropietarioDocumentoCDD, documento_SET_DEFAULT_STATE } = useDocumentoStore()

// VALUES
const bodyRequest = ref([])
const isCollapsed = ref(true)
const isEditando = ref(false)

const codigoTipoDocumento = computed(() => mantenedor_getCodigoTipoDocumentoIdentidad(formData.tipoDocumentoIdentificacion))

const emit = defineEmits(['next-step'])

const loading = reactive({
  tablaSujetos: false,
  stepDelitos: false,
  addButton: false,
  page: true
})
const sujetos = reactive({
  firstRecord: 0
})

const { isFormValid, formSubmitted, resetFormData, resetByKeys } =
  useFormValidation({
    formData,
    validationScope: sujetosIntervinientesValidationScope
  })

provide(sujetosIntervinientesValidationScope, formData)

// LOGIC
onMounted(async () => {
  getIdentificacionDenuncia()
  console.log('idDenuncia', procesoPam.value.idDenuncia)

  console.log('identificacion denuncia', identificacionDenuncia.value)
})

async function getIdentificacionDenuncia () {
  await requestUtil({
    action: identificacionDenuncia_getByIdDenuncia,
    payload: { idDenuncia: procesoPam.value.idDenuncia }
  })
}

async function getSujetos (pagination = undefined) {
  if (!pagination) {
    sujetos.firstRecord = 0
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: procesoPam?.value.idDenuncia,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (l) => {
      if (loading.page === true) loading.page = l
      loading.tablaSujetos = l
    }
  })
}

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

function addDocumentosPersona (id) {
  console.log(id)

  if (pautasVif.value.data) {
    asociarDocumentosASujeto(pautasVif.value.data, id)
  }
  if (declaraciones.value.data) {
    asociarDocumentosASujeto(declaraciones.value.data, id)
  }
  if (hospitalizacion.value.data) {
    asociarDocumentosASujeto(hospitalizacion.value.data, id)
  }
  if (ordenesDetencion.value.data) {
    asociarDocumentosASujeto(ordenesDetencion.value.data, id)
  }
  if (formulariosRiesgo.value.data) {
    asociarDocumentosASujeto(formulariosRiesgo.value.data, id)
  }
  if (fotoHuellaFirma.value) {
    asociarDocumentosASujeto(fotoHuellaFirma.value.data, id)
  }

  requestUtil({
    action: documento_asociarIdPropietarioDocumentoCDD,
    payload: { request: bodyRequest.value }
  })
}

function agregarSujeto (payload) {
  requestUtil({
    action: sujetosIntervinientes_addSujeto,
    payload: payload,
    resolve: (v) => {
      addDocumentosPersona(v)
      documento_SET_DEFAULT_STATE('interviniente')
      toastSuccess('Interviniente agregado con éxito!')
      getSujetos()
      if (formData.direccion) {
        addDireccionSrcel(v.idPersona)
      } else {
        cancelarEdicion()
      }

      appUtil.scrollTo(0)
    },
    loader: (l) => (loading.addButton = l),
    reject: (e) => {
      if (e.status === 400) {
        const isEmail = e.data.mensaje.includes('Email')
        const mensaje = isEmail
          ? e.data.mensaje
          : 'Los campos validados son requeridos'

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
      documento_SET_DEFAULT_STATE()
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

  // Set procesoPam to Payload
  formData.idProcedimiento = procesoPam.value?.idProcedimiento
  formData.idDenuncia = procesoPam.value?.idDenuncia
  formData.idCausa = procesoPam.value?.idCausa
  formData.idRelacionClase = procesoPam.value?.idDenuncia

  const payload = generateSujetoContract({
    ...formData,
    codigoTipoDocumentoIdentificacion: codigoTipoDocumento.value
  })
  payload.clase = 'denuncia'

  !isEditando.value ? agregarSujeto(payload) : editarSujeto(payload)
}

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
    // POR HACER toast correcto
    reject: (r) => console.error('error en addDireccionSrcel: ', r)
  })
}

function nextStep () {
  if (flags.value.existeDenunciante) {
    loading.stepDelitos = true
    setTimeout(() => {
      loading.stepDelitos = false
      emit('next-step', '/ingreso/denuncia-directa/nueva-denuncia/delitos')
    }, 600)
  } else {
    toastError('Debes ingresar al menos un denunciante para poder continuar')
  }
}

function agregarInterviniente () {
  documento_SET_DEFAULT_STATE()
  isEditando.value = false
  isCollapsed.value = !isCollapsed.value
  setTimeout(() => {
    appUtil.scrollTo(260)
  }, 100)
}

function asociarDocumentosASujeto (documentos, idSujetoRelacion) {
  if (documentos) {
    documentos.forEach((d) => {
      console.log(d)
      const doc = {
        id: d.id,
        idPropietario: idSujetoRelacion
      }
      console.log(doc)
      bodyRequest.value.push(doc)
    })
    console.log(bodyRequest.value)
  }
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
