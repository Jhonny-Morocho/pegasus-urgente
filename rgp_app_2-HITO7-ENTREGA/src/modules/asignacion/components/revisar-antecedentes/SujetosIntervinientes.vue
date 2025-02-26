<template>
<div v-if="isLoading">
  <LoaderSkeleton />
</div>
<AppFieldset
  v-else
  legend="Sujetos Intervinientes Registrados"
>
  <div class="col-12 flex justify-content-end mt-0">
    <AppInput
      id="input-filtro"
      v-model="inputFiltro"
      class="m-0 p-0"
      label="Buscar Interviniente"
      style="width: 250px"
    />
  </div>
  <TablaSujetos
    v-model:first="firstRecord"
    :is-editando="isEditando"
    is-preclasificador
    :loading="isLoading"
    :read-only="!isCollapsed"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="filtroSujetos"
    @contactar-victima="openModalContactarVictima"
    @eliminar-sujeto="eliminarSujeto"
    @page="getSujetos"
    @set-modo-lectura="setModoLectura"
    @set-sujeto-editar="setModoEdicion"
    @ver-ficha-sujeto="openModalInformacionDelictual"
  />
</AppFieldset>
<FormSujetosIntervinientes
  class="col-12"
  :form-submitted="formSubmitted"
  :is-collapsed="isCollapsed"
  :is-editando="isEditando"
  :loading-button="isLoading"
  :read-only="formData.readonly"
  :reset-form-data="resetFormData"
  :validation-scope="sujetosIntervinientesValidationScope"
  @agregar-interviniente="toggleFormularioIntervinientes"
  @cancelar-edicion="toggleFormularioIntervinientes"
  @change-tipo-sujeto="changeTipoSujeto"
  @handle-submit-form="handleSubmitForm"
  @reset-form-data="resetFormData"
/>
</template>
<script setup>
import { ref, provide, onMounted, computed } from 'vue'
import {
  useAppDialog,
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useSujetosIntervinientesProvide } from '@/modules/global/composables/useSujetosIntervinientes'
import { appUtil, requestUtil } from '@/utils'
import {
  generateSujetoContract,
  populateInterviniente
} from '@/modules/global/contracts'
import ModalSolicitarContactarVictima from '@/modules/preclasificador/components/modals/ModalSolicitarContactarVictima.vue'
import {
  useCausaAsignacionStore,
  useFlujoPamAsignacion
} from '@/modules/asignacion/composables'
import {
  useSujetosIntervinientesStore,
  useDocumentoStore,
  useMantenedorStore
} from '@/modules/global/composables'
import TablaSujetos from '@/modules/global/components/sujetos-intervinientes/tablas/TablaSujetos.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import FormSujetosIntervinientes from '@/modules/global/components/forms/FormSujetosIntervinientes.vue'
import ModalInformacionDelictualSujeto from '@/modules/global/components/modals/ModalInformacionDelictualSujeto.vue'

const {
  sujetosIntervinientes,
  paginacion,
  sujetosIntervinientes_addSujeto,
  sujetosIntervinientes_addDireccion,
  sujetosIntervinientes_updateSujeto,
  sujetosIntervinientes_deleteSujeto,
  sujetosIntervinientes_getSujetosByIdRelacionSujeto,
  sujetosIntervinientes_contactarVictima,
  sujetosIntervinientes_getSujetosByIdGlobal,
  sujetosIntervinientes_getSujetoEnCausaByID
} = useSujetosIntervinientesStore()

const { mantenedor_getTiposDocumento, mantenedor_getTiposSujetos } =
  useMantenedorStore()

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

const { ruc, idDenuncia } = useCausaAsignacionStore()
const { flujoAsignacion } = useFlujoPamAsignacion()

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()

const isLoading = ref(false)
const isCollapsed = ref(true)
const isEditando = ref(false)
const inputFiltro = ref('')

const { formData, sujetosIntervinientesValidationScope, datosComplementarios } =
  useSujetosIntervinientesProvide()

provide(sujetosIntervinientesValidationScope, formData)

const { isFormValid, formSubmitted, resetFormData, resetByKeys } =
  useFormValidation({
    formData,
    validationScope: sujetosIntervinientesValidationScope
  })

const { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } =
  useAppToast()

function toggleFormularioIntervinientes () {
  isCollapsed.value = !isCollapsed.value
  cancelarEdicion()
}

function changeTipoSujeto () {
  resetByKeys(Object.keys(datosComplementarios))
}

function setModoEdicion (sujeto) {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
    payload: {
      idRelacionSujeto: sujeto.idRelacionSujeto
    },
    resolve: (response) => {
      populateInterviniente(response, formData)
      isCollapsed.value = false
      isEditando.value = true
    },
    reject: (e) => console.log(e)
  })
}

function setModoLectura (sujeto) {
  console.log(sujeto)
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
    payload: {
      idRelacionSujeto: sujeto.idRelacionSujeto
    },
    resolve: (response) => {
      populateInterviniente(response, formData)
      isCollapsed.value = false
      formData.readonly = true
    },
    reject: (e) => console.log(e)
  })
}

function cancelarEdicion () {
  isEditando.value = false
  formData.readonly = false
  resetFormData()
}

function openModalInformacionDelictual (sujeto) {
  launchDialog({
    component: ModalInformacionDelictualSujeto,
    header: 'Información Delictual',
    width: '80%',
    props: {
      data: sujeto,
      ruc: ruc.value
    }
  })
}

function openModalContactarVictima (sujeto) {
  const payload = {
    idPersona: sujeto.idPersona,
    ruc: ruc.value
  }
  requestUtil({
    action: sujetosIntervinientes_getSujetoEnCausaByID,
    payload: payload,
    resolve: (response) => {
      launchDialog({
        component: ModalSolicitarContactarVictima,
        header: 'Solicitar Contactar a la Víctima',
        width: '80%',
        confirmLabel: 'Solicitar Contacto',
        cancelLabel: 'Cancelar',
        props: { interviniente: response.interviniente, ruc: ruc.value },
        accept: async ({ comentarioCierre }) => {
          contactarVictima({
            comentario: comentarioCierre,
            ruc: payload.ruc,
            idVictima: payload.idPersona
          })
        }
      })
    },
    reject: (e) => console.log(e)
  })
}

async function contactarVictima ({ comentario, ruc: rucVictima, idVictima }) {
  requestUtil({
    action: sujetosIntervinientes_contactarVictima,
    payload: { comentario, rucVictima, idVictima },
    resolve: () => toastSuccess('Solicitud Enviada'),
    reject: (e) => console.log(e)
  })
}

const firstRecord = ref(0)

async function getSujetos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (isLoading.value = l)
  })
}

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposDocumento })
  requestUtil({ action: mantenedor_getTiposSujetos })
}

onMounted(async () => {
  getSujetos()
  getDataMantenedor()
})

const { includeWord } = appUtil

const filtroSujetos = computed(() => {
  const sujetos = sujetosIntervinientes.value

  if (inputFiltro.value) {
    return sujetos?.filter(
      (sujeto) =>
        includeWord(sujeto.nombreCompleto, inputFiltro.value) || // Nombre Interviniente
        includeWord(sujeto.nroDocumento, inputFiltro.value) || // Número Doc. Identificación
        includeWord(sujeto.tipoSujeto, inputFiltro.value) // Tipo Sujeto
    )
  }
  return sujetos
})

async function addInterviniente () {
  console.log('add')

  const interviniente = generateSujetoContract(formData)

  requestUtil({
    action: sujetosIntervinientes_addSujeto,
    payload: interviniente,
    resolve: async (v) => {
      addDocumentosPersona(v)
      documento_SET_DEFAULT_STATE('interviniente')
      toastSuccess('Agregado con éxito!')
      flujoAsignacion.requiereCambiarTipificacion = true

      if (formData.direccion) {
        addDireccionSrcel(v.idPersona)
      } else {
        toggleFormularioIntervinientes()
      }
      getSujetos()
      appUtil.scrollTo(0)
    },
    loader: (l) => (isLoading.value = l),
    reject: (e) => {
      console.log('error guardando: ', e)
      toastError('Ha ocurrido un problema')
    }
  })
}

async function modificarInterviniente () {
  console.log('modificar')

  const interviniente = generateSujetoContract(formData)

  requestUtil({
    action: sujetosIntervinientes_updateSujeto,
    payload: interviniente,
    resolve: async () => {
      toastWarning('Interviniente Modificado')
      documento_SET_DEFAULT_STATE('interviniente')
      toggleFormularioIntervinientes()
      getSujetos()
      appUtil.scrollTo(0)
    },
    loader: (l) => (isLoading.value = l),
    reject: (e) => {
      console.log('error editando: ', e)
      toastError('Ha ocurrido un problema')
    }
  })
}

function eliminarSujeto (sujeto) {
  const nombreSujeto = `${sujeto.nombres} ${sujeto.apellidoPaterno} ${sujeto.apellidoMaterno}`
  launchConfirmDialog({
    message: `¿Estás seguro(a) de eliminar a ${nombreSujeto}?`,
    accept: async () => {
      requestUtil({
        action: sujetosIntervinientes_deleteSujeto,
        payload: {
          idRelacionSujeto: sujeto.idRelacionSujeto
        },
        resolve: async () => {
          toastSuccess(`Se eliminó el interviniente ${nombreSujeto}`)
          getSujetos()
        }
      })
    }
  })
}

async function handleSubmitForm () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  formData.idDenuncia = idDenuncia.value

  if (!isEditando.value) {
    addInterviniente()
  } else {
    modificarInterviniente()
  }
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
      console.log('agrego la dirección del srcel')
      cancelarEdicion()
    },
    reject: (r) => console.log('error en addDireccionSrcel: ', r)
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
