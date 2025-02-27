<template>
<div>
  <AppFieldset legend="Relaciones">
    <TablaRelaciones
      class="mb-3"
      :data-relaciones="relaciones"
      :loading="isLoading"
      :read-only="isEditando"
      :total-records="paginacion?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
      @relacion:derivar-uravit="openModalDerivarURAVIT"
      @relacion:editar-relacion="setModoEdicion"
      @relacion:eliminar-relacion="eliminarRelacion"
    />

    <AgregarRelacion
      ref="refAgregarRelacion"
      :delito-options="delitoOptions"
      :imputado-options="imputadoOptions"
      :is-editando="isEditando"
      :victima-options="victimaOptions"
      @relacion:agregar="handleSubmitForm"
      @relacion:cancelar-edicion="cancelarEdicion"
      @relacion:editar="handleSubmitForm"
    />
  </AppFieldset>

  <Parentesco :id-denuncia="idDenuncia" />
</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import {
  useRelacionesStore,
  useMantenedorStore,
  useSujetosIntervinientesStore,
  useDelitoStore
} from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useDialog } from 'primevue/usedialog'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import AgregarRelacion from '@/modules/global/components/relaciones/AgregarRelacion.vue'
import ModalDerivarUravit from '@/modules/dirigir-investigacion/components/modals/ModalDerivarUravit.vue'
import Parentesco from '@/modules/global/components/parentesco/Parentesco.vue'

const {
  ruc,
  idDenuncia
} = useDirigirInvestigacionStore()

const dialog = useDialog()

const { launchConfirmDialog } = useConfirmDialog()

const { toastSuccess, toastError, toastWarning } = useAppToast()

const {
  mantenedor_getTiposSujetos,
  mantenedor_getCodigoTipoSujeto,
  mantenedor_getNombreFamiliaDelito,
  mantenedor_getNombreTipoDelito
} = useMantenedorStore()

const {
  relaciones,
  paginacion,
  relaciones_getRelaciones,
  relaciones_addRelacion,
  relaciones_editRelacion,
  relaciones_deleteRelacion
} = useRelacionesStore()

const {
  delitos,
  delito_getDelitoByIdDenuncia
} = useDelitoStore()

const {
  sujetosIntervinientes,
  sujetosIntervinientes_getSujetosByIdGlobal
} =
  useSujetosIntervinientesStore()

const firstRecord = ref(0)
const isLoading = ref(false)
const isEditando = ref(false)

async function getDelitos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    }
  })
}

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
    payload: {
      idDenuncia: idDenuncia.value,
      params
    }
  })
}

function getMantenedores () {
  requestUtil({ action: mantenedor_getTiposSujetos })
}

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    relaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => { isLoading.value = l }
  })
}

onMounted(async () => {
  getRelaciones()
  getMantenedores()
  getDelitos()
  getSujetos()
})

const refAgregarRelacion = ref(null)

function existeRelacion (nuevaRelacion) {
  return relaciones.value.find((relacion) =>
    relacion.idRelacionVictima === nuevaRelacion.idRelacionVictima &&
    relacion.idRelacionImputado === nuevaRelacion.idRelacionImputado &&
    relacion.idDetalleHechoDelictual === nuevaRelacion.idDetalleHechoDelictual
  )
}

function createContract (data) {
  const delito = delitoOptions.value.find(d => d.idDetalleHechoDelictual === data.idDetalleHechoDelictual)

  const victima = sujetosIntervinientes.value.find(
    (v) => v.idPersona === data.idPersonaVictima
  )

  const imputado = sujetosIntervinientes.value.find(
    (v) => v.idPersona === data.idPersonaImputado
  )

  return {
    idDenuncia: idDenuncia.value,
    idDetalleHechoDelictual:
      data.idDetalleHechoDelictual ?? delito.idDetalleHechoDelictual,
    idRelacionVictima: victima?.idRelacionSujeto ?? null,
    idRelacionImputado: imputado?.idRelacionSujeto ?? null,
    idRelacionDelito: data.idRelacionDelito
  }
}

// eslint-disable-next-line no-unused-vars
async function agregarRelacion (payload) {
  requestUtil({
    action: relaciones_addRelacion,
    payload: payload,
    resolve: async () => {
      toastSuccess('Relacion Agregada')
      cancelarEdicion()
      getRelaciones()
    },
    reject: (error) => {
      toastError('Ocurrió un error al crear la relación, intenta nuevamente')
      console.log('agregarRelacion() ->', error)
    }
  })
}

// eslint-disable-next-line no-unused-vars
async function editarRelacion (payload) {
  launchConfirmDialog({
    message: '¿Estás seguro(a) de modificar la relación?',
    accept: () => {
      requestUtil({
        action: relaciones_editRelacion,
        payload: payload,
        resolve: async () => {
          toastSuccess('Relacion Modificada')
          cancelarEdicion()
          getRelaciones()
        },
        reject: (error) => {
          toastError('Ocurrió un error al crear la relación, intenta nuevamente')
          console.log('agregarRelacion() ->', error)
        }
      })
      cancelarEdicion()
    }
  })
}

function handleSubmitForm (data) {
  const payload = createContract(data)

  if (existeRelacion(payload)) {
    toastWarning('Ya existe esa relación')
    return
  }

  if (!isEditando.value) {
    agregarRelacion(payload)
  } else {
    editarRelacion(payload)
  }
}

function cancelarEdicion () {
  isEditando.value = false
  refAgregarRelacion.value.resetFormData()
}

function eliminarRelacion (data) {
  launchConfirmDialog({
    message: '¿Estás seguro de eliminar la relación?',
    accept: async () => {
      requestUtil({
        action: relaciones_deleteRelacion,
        payload: data,
        resolve: async () => {
          toastWarning('Relación eliminada')
          getRelaciones()
        }
      })
    }
  })
}

function setModoEdicion (data) {
  refAgregarRelacion.value.setForm(data)
  isEditando.value = true
}

const imputadoOptions = computed(() => {
  const sujetos = [{ nombreCompleto: 'Sin Datos', idPersona: 'Sin Datos' }]

  sujetosIntervinientes.value?.forEach((s) => {
    if (mantenedor_getCodigoTipoSujeto(s.tipoSujeto) === '3') { // CODIGO 3: SUJETO TIPO IMPUTADO
      sujetos.push({
        idPersona: s.idPersona,
        nombreCompleto: `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno}`
      })
    }
  })

  return sujetos
})

const victimaOptions = computed(() => {
  const sujetos = [{ nombreCompleto: 'Sin Datos', idPersona: 'Sin Datos' }]

  sujetosIntervinientes.value?.forEach((s) => {
    if (
      mantenedor_getCodigoTipoSujeto(s.tipoSujeto) === '6' || // CODIGO 6: SUJETO TIPO VICTIMA
      (mantenedor_getCodigoTipoSujeto(s.tipoSujeto) === '1' && s.esVictima) // CODIGO 1: SUJETO TIPO DENUNCIANTE
    ) {
      sujetos.push({
        idPersona: s.idPersona,
        nombreCompleto: `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno}`
      })
    }
  })
  return sujetos
})

const delitoOptions = computed(() => {
  return delitos.value?.map(d => {
    return {
      idDetalleHechoDelictual: d.idDetalleHechoDelictual,
      labelDelito: getLabelDelito(d.delito.idFamiliaDelito, d.delito.idTipoDelito)
    }
  })
})

function getLabelDelito (idFamilia, idDelito) {
  const familia = mantenedor_getNombreFamiliaDelito(idFamilia)
  const delito = mantenedor_getNombreTipoDelito(idDelito)
  if (!delito) {
    return familia
  }
  return `${familia} - ${delito}`
}

function openModalDerivarURAVIT (sujeto) {
  dialog.open(ModalDerivarUravit, {
    props: {
      header: 'Derivar a URAVIT',
      modal: true,
      style: {
        width: '80%'
      }
    },
    data: {
      idGlobal: ruc.value,
      sujeto
    }
  })
}
</script>
