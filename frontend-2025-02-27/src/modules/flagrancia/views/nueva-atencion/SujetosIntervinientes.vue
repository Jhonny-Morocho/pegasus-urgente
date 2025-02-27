<template>
<LoaderSkeleton v-if="loading.page" />
<div v-else>
  <AppFieldset legend="Sujetos Intervinientes Registrados">
    <div class="col-12">
      <TablaSujetos
        v-model:first="sujetos.firstRecord"
        :is-disabled="isFolioCerrado"
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
      :is-disabled="isFolioCerrado"
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
    v-if="
      $hasSomeRoles([
        `zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`
      ]) || esNuevaAtencionFiscal
    "
    :disabled="!isCollapsed"
    label="Delitos"
    :loading="loading.stepDelitos"
    @click="nextStep"
  />
</div>
</template>
<script setup>
import { ref, defineEmits, computed, provide, onMounted, reactive } from 'vue'

// components
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaSujetos from '@/modules/global/components/sujetos-intervinientes/tablas/TablaSujetos.vue'
import FormSujetosIntervinientes from '@/modules/global/components/forms/FormSujetosIntervinientes.vue'
import { useProcedimientosBandejaStore } from '@/modules/flagrancia/composables/useProcedimientosBandejaStore'

import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'

import {
  useSujetosIntervinientesStore,
  useDocumentoStore,
  useMantenedorStore,
  usePamStore
} from '@/modules/global/composables'

// form
import { useSujetosIntervinientesProvide } from '@/modules/global/composables/useSujetosIntervinientes'

// utils
import { appUtil, requestUtil } from '@/utils'

import {
  generateSujetoContract,
  populateInterviniente
} from '@/modules/global/contracts'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const { launchConfirmDialog } = useConfirmDialog()
const {
  pautasVif,
  declaraciones,
  hospitalizacion,
  ordenesDetencion,
  formulariosRiesgo,
  fotoHuellaFirma,
  documento_asociarIdPropietarioDocumentoCDD,
  documento_SET_DEFAULT_STATE
} = useDocumentoStore()

const { procesoPam } = usePamStore()

const {
  sujetosIntervinientes,
  paginacion,
  sujetosIntervinientes_getSujetosByIdRelacionSujeto,
  sujetosIntervinientes_getSujetosByIdGlobal,
  sujetosIntervinientes_deleteSujeto,
  sujetosIntervinientes_addSujeto,
  sujetosIntervinientes_addDireccion,
  sujetosIntervinientes_updateSujeto,
  flags
} = useSujetosIntervinientesStore()

const { esNuevaAtencionFiscal, estadoFolio } = useProcedimientosBandejaStore()

onMounted(() => {
  loading.page = true
  getDataMantenedor()
  getSujetos()
})

const isCollapsed = ref(true)
const isEditando = ref(false)

const codigoTipoDocumento = computed(() =>
  mantenedor_getCodigoTipoDocumentoIdentidad(
    formData.tipoDocumentoIdentificacion
  )
)

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

const {
  mantenedor_getCodigoTipoDocumentoIdentidad,
  mantenedor_getTiposDocumento,
  mantenedor_getTiposSujetos,
  mantenedor_getIdTipoSujetoByCodigo
} = useMantenedorStore()

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposDocumento })
  requestUtil({ action: mantenedor_getTiposSujetos })
}
const loading = reactive({
  tablaSujetos: false,
  stepDelitos: false,
  addButton: false,
  page: false
})

const isFolioCerrado = computed(() => estadoFolio.value === 'Cerrado')

function changeTipoSujeto () {
  resetByKeys(Object.keys(datosComplementarios))
}

const sujetos = reactive({
  isLoading: false,
  firstRecord: 0
})

async function getSujetos (pagination = undefined) {
  loading.tablaSujetos = true
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
    },
    resolve: () => {
      esFuncionarioTestigo()
    }
  })
}

const funcionarioTestigo = computed(() =>
  sujetosIntervinientes?.value.find((i) => {
    return (i.tipoSujeto === mantenedor_getIdTipoSujetoByCodigo('15')) && (!i.sexoBiologico || !i.fechaNacimiento)
  })
)
function esFuncionarioTestigo () {
  if (funcionarioTestigo.value) {
    launchConfirmDialog({
      message: `Es necesario completar los datos del funcionario ${funcionarioTestigo.value.nombres} ${funcionarioTestigo.value.apellidoMaterno}  ${funcionarioTestigo.value.apellidoPaterno}`,
      accept: () => {
        requestUtil({
          action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
          payload: {
            idRelacionSujeto: funcionarioTestigo.value.idRelacionSujeto
          },
          resolve: (sujeto) => {
            setModoEdicion(sujeto)
          },
          loader: (l) => (loading.addButton = l)
        })
      },
      rejectClass: 'hidden'
    })
  }
}

function handleLoading () {
  setTimeout(() => {
    loading.tablaSujetos = false
  }, 1500)
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

function agregarSujeto (payload) {
  loading.tablaSujetos = true
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
    },
    loader: (v) => {
      loading.addButton = v
      setTimeout(() => {
        loading.tablaSujetos = false
      }, 1500)
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

const emit = defineEmits(['next-step'])

function nextStep () {
  if (flags.value.existeDenunciante && !funcionarioTestigo.value) {
    loading.stepDelitos = true
    setTimeout(() => {
      loading.stepDelitos = false
      emit('next-step', 'FlagranciaNuevaAtencionDelito')
    }, 600)
  } else {
    funcionarioTestigo.value
      ? esFuncionarioTestigo()
      : toastError(
        'Debes ingresar al menos un denunciante para poder continuar'
      )
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

function eliminarSujeto (sujeto) {
  launchConfirmDialog({
    message: `¿Estás seguro(a) de eliminar a ${sujeto.nombres} ${sujeto.apellidoPaterno} ${sujeto.apellidoMaterno}`,
    accept: async () => {
      loading.tablaSujetos = true
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
        },
        loader: (_v) => {
          handleLoading()
        }
      })
    }
  })
}

// CDD

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

const bodyRequest = ref([])
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
