<template>
<div v-if="isLoading">
  <LoaderSkeleton />
</div>
<AppFieldset
  v-else
  legend="Lista de Sujetos/Intervinientes"
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
    @definir-medidas-proteccion="openModalDefinirMedidasProteccion"
    @eliminar="eliminarSujeto"
    @get-direcciones="verDireccionesHistoricas"
    @get-ficha-contacto="openFichaContacto"
    @get-ficha-sujeto="getFichaSujeto"
    @modificar="setModoEdicion"
    @page="getSujetos"
    @set-sujeto-editar="setModoEdicion"
    @solicitar-app-pauta="openModalAplicacionPauta"
    @ver-mas="setModoLectura"
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
import { useDialog } from 'primevue/usedialog'
import { appUtil, requestUtil } from '@/utils'
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation,
  useAppDialog
} from '@/modules/common/composables'
import {
  generateSujetoContract,
  populateInterviniente
} from '@/modules/global/contracts'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import {
  useSujetosIntervinientesStore,
  useDocumentoStore,
  useMantenedorStore,
  useSujetosIntervinientesProvide
} from '@/modules/global/composables'
import { useDireccionStore } from '@/modules/direccion/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaSujetos from '@/modules/dirigir-investigacion/components/TablaSujetos.vue'
import FormSujetosIntervinientes from '@/modules/global/components/forms/FormSujetosIntervinientes.vue'
import ModalDireccionesHistoricas from '../../components/modals/ModalDireccionesHistoricas.vue'
import ModalSolicitudAplicacionPauta from '@/modules/dirigir-investigacion/components/modals/ModalSolicitudAplicacionPauta.vue'
import ModalFichaContacto from '@/modules/dirigir-investigacion/components/modals/ModalFichaContacto.vue'
import ModalInformacionDelictualSujeto from '@/modules/global/components/modals/ModalInformacionDelictualSujeto.vue'
import ModalDefinirMedidasProteccion from '@/modules/dirigir-investigacion/components/modals/ModalDefinirMedidasProteccion.vue'

const {
  sujetosIntervinientes,
  paginacion,
  sujetosIntervinientes_addSujeto,
  sujetosIntervinientes_addDireccion,
  sujetosIntervinientes_deleteSujeto,
  sujetosIntervinientes_getSujetosByIdRelacionSujeto,
  sujetosIntervinientes_getSujetosByIdGlobal,
  sujetosIntervinientes_updateSujeto
} = useSujetosIntervinientesStore()
const {
  direccion_getDirecciones,
  direccion_putActualizarDireccion
} = useDireccionStore()

const { ruc, idDenuncia, resumenCausa } = useDirigirInvestigacionStore()

const { mantenedor_getTiposDocumento, mantenedor_getTiposSujetos } =
  useMantenedorStore()

const { launchDialog } = useAppDialog()

const { documento_SET_DEFAULT_STATE } = useDocumentoStore()

const { launchConfirmDialog } = useConfirmDialog()

const dialog = useDialog()

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
      isCollapsed.value = false
      isEditando.value = true
      populateInterviniente(response, formData)
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
      isCollapsed.value = false
      formData.readonly = true
      populateInterviniente(response, formData)
    },
    reject: (e) => console.log(e)
  })
}

function cancelarEdicion () {
  isEditando.value = false
  formData.readonly = false
  resetFormData()
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
  await requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (isLoading.value = l)
  })
}

function getDataMantenedor () {
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
        includeWord(sujeto.nombres, inputFiltro.value) || // Nombre Interviniente
        includeWord(sujeto.numeroDocumento, inputFiltro.value) || // Número Doc. Identificación
        includeWord(sujeto.descripcionTipoSujeto, inputFiltro.value) // Tipo Sujeto
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
      console.log('resolve')
      documento_SET_DEFAULT_STATE('interviniente')
      toastSuccess('Agregado con éxito!')

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

function verDireccionesHistoricas (sujeto) {
  requestUtil({
    action: direccion_getDirecciones,
    payload: {
      idPersona: sujeto?.idPersona
    },
    resolve: () => {
      const nombreCompleto =
        sujeto?.nombres +
        ' ' +
        sujeto?.apellidoPaterno +
        ' ' +
        sujeto?.apellidoMaterno

      launchDialog({
        component: ModalDireccionesHistoricas,
        header: `Direcciones Históricas de ${nombreCompleto}`,
        width: '70%',
        confirmLabel: 'Guardar',
        accept: (data) => {
          console.warn(data)
          if (data) {
            const payloadParse = { ...data }
            payloadParse.esPrincipal = true

            requestUtil({
              action: direccion_putActualizarDireccion,
              payload: { ...payloadParse, persona: sujeto?.idPersona }
            })
          }
        }
      })
    }
  })
}

function eliminarSujeto (sujeto) {
  console.log(sujeto)
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

function openModalAplicacionPauta (sujeto) {
  dialog.open(ModalSolicitudAplicacionPauta, {
    props: {
      header: 'Solicitud Aplicación Pauta',
      modal: true,
      style: {
        width: '70%'
      }
    },
    data: {
      idGlobal: ruc.value,
      sujeto
    }
  })
}

function openModalDefinirMedidasProteccion (sujeto) {
  dialog.open(ModalDefinirMedidasProteccion, {
    props: {
      header: 'Definir Medidas de Protección',
      modal: true,
      style: {
        width: '70%'
      }
    },
    data: {
      ruc: ruc.value,
      resumenCausa: resumenCausa.value,
      sujeto
    }
  })
}

function openFichaContacto (sujeto) {
  const nombreCompleto =
    sujeto?.nombres +
    ' ' +
    sujeto?.apellidoPaterno +
    ' ' +
    sujeto?.apellidoMaterno

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
    payload: {
      idRelacionSujeto: sujeto.idRelacionSujeto
    },
    resolve: (response) => {
      dialog.open(ModalFichaContacto, {
        props: {
          header: `Ficha de Contacto - ${nombreCompleto}`,
          modal: true,
          style: {
            width: '70%'
          }
        },
        data: {
          ...response
        }
      })
    },
    reject: (e) => console.log(e)
  })
}

async function getFichaSujeto (sujeto) {
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
</script>
