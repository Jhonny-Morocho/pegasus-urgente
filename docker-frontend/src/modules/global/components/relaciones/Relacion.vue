<template>
<section>
  <div class="mb-4">
    <AppFieldset legend="Relaciones">
      <AgregarRelacion
        v-if="!isPreclasificador"
        ref="refAgregarRelacion"
        class="pb-6"
        :delito-options="delitoOptions"
        :imputado-options="imputadoOptions"
        :is-disabled="isDisabled"
        :is-editando="editando"
        :loading-state="loadingTablaRelaciones"
        :victima-options="victimaOptions"
        @relacion:agregar="agregarRelacion"
        @relacion:cancelar-edicion="cancelarEdicion"
        @relacion:editar="editarRelacion"
      />
      <TablaRelaciones
        v-model:first="firstRecord"
        :data-relaciones="relaciones"
        :is-disabled="isDisabled"
        :is-editando="editando"
        :loading="loadingTablaRelaciones"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        @page="getRelaciones"
        @relacion:editar-relacion="setModoEdicion"
        @relacion:eliminar-relacion="eliminarRelacion"
      />
      <AgregarRelacion
        v-if="isPreclasificador"
        ref="refAgregarRelacion"
        class="pb-6"
        :delito-options="delitoOptions"
        :imputado-options="imputadoOptions"
        :is-disabled="isDisabled"
        :is-editando="editando"
        :loading-state="loadingTablaRelaciones"
        :victima-options="victimaOptions"
        @relacion:agregar="agregarRelacion"
        @relacion:cancelar-edicion="cancelarEdicion"
        @relacion:editar="editarRelacion"
      />
    </AppFieldset>
  </div>
</section>
</template>

<script setup>
import { computed, onMounted, ref, defineProps } from 'vue'
import AgregarRelacion from '@/modules/global/components/relaciones/AgregarRelacion.vue'
import TablaRelaciones from '@/modules/global/components/relaciones/TablaRelaciones.vue'

import { useDelitoStore, useMantenedorStore, useRelacionesStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types/prop.types'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'

const { toastWarning, toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const loadingTablaRelaciones = ref(false)

const {
  relaciones, relaciones_addRelacion, relaciones_editRelacion, paginacion,
  relaciones_deleteRelacion, relaciones_getRelaciones
} = useRelacionesStore()

const { delitos, delito_getDelitoByIdDenuncia } = useDelitoStore()
const { sujetosIntervinientes } = useSujetosIntervinientesStore()

const {
  mantenedor_getNombreFamiliaDelito, mantenedor_getNombreTipoDelito, mantenedor_getTiposDelito,
  mantenedor_getIdTipoSujetoByCodigo, mantenedor_getTiposSujetos, mantenedor_getFamiliasDelito
} = useMantenedorStore()

const editando = ref(false)
const firstRecord = ref(0)

const refAgregarRelacion = ref(null)

const props = defineProps({
  idDenuncia: propTypes.string,
  isDisabled: { type: Boolean, default: false },
  isPreclasificador: { type: Boolean, default: false },
  handleLoading: {
    type: Function,
    default () {
      return 'handleLoading props'
    }
  }
})

// GET RELACIONES BY ID
onMounted(() => {
  getRelaciones()
  if (!delitos.value.length) getDelitos()
})
mantenedor_getTiposSujetos()
mantenedor_getFamiliasDelito()
mantenedor_getTiposDelito()

async function getDelitos () {
  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: props.idDenuncia
    }
  })
}

function getRelaciones (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  loadingTablaRelaciones.value = true
  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: props.idDenuncia, params },
    resolve: () => {
      props.handleLoading()
    },
    loader: (l) => (loadingTablaRelaciones.value = l),
    reject: (err) => {
      console.log(err)
    }
  })
}

function relacionExiste (nuevaRelacion) {
  return relaciones.value.find((relacion) => {
    return relacion.idRelacionVictima === nuevaRelacion.idRelacionVictima && relacion.idRelacionImputado === nuevaRelacion.idRelacionImputado && relacion.idDetalleHechoDelictual === nuevaRelacion.idDetalleHechoDelictual
  })
}

function getContract (data) {
  const delito = delitoOptions.value.find((d) => d.idDetalleHechoDelictual === data.idDetalleHechoDelictual)

  const victima = sujetosIntervinientes.value.find((v) => v.idPersona === data.idPersonaVictima)

  const imputado = sujetosIntervinientes.value.find((v) => v.idPersona === data.idPersonaImputado)
  return {
    idDetalleHechoDelictual: data.idDetalleHechoDelictual ?? delito.idDetalleHechoDelictual,
    idDenuncia: props.idDenuncia,
    idRelacionVictima: victima?.idRelacionSujeto ?? null,
    idRelacionImputado: imputado?.idRelacionSujeto ?? null,
    idRelacionDelito: data.idRelacionDelito
  }
}

function agregarRelacion (data) {
  loadingTablaRelaciones.value = true
  const payloadRelacion = getContract(data)
  if (!relacionExiste(payloadRelacion) && !editando.value) {
    requestUtil({
      action: relaciones_addRelacion,
      payload: payloadRelacion,
      resolve: () => {
        toastSuccess('Relación agregada con éxito')
        cancelarEdicion()
        getRelaciones()
      }
    })
  } else {
    toastWarning('Ya existe una relación con esos datos')
    loadingTablaRelaciones.value = false
  }
}

function editarRelacion (data) {
  const payloadRelacion = getContract(data)
  if (!relacionExiste(payloadRelacion) && editando.value) {
    launchConfirmDialog({
      message: '¿Estás seguro(a) de modificar la relación?',
      accept: () => {
        loadingTablaRelaciones.value = true
        requestUtil({
          action: relaciones_editRelacion,
          payload: payloadRelacion,
          resolve: () => {
            toastSuccess('Relación modificada con éxito')
            cancelarEdicion()
            getRelaciones()
          }
        })
      }
    })
  } else {
    toastWarning('Ya existe una relación con esos datos')
    loadingTablaRelaciones.value = false
  }
}

function eliminarRelacion (data) {
  launchConfirmDialog({
    message: '¿Estas seguro(a) de querer eliminar la relación?',
    accept: () => {
      loadingTablaRelaciones.value = true
      requestUtil({
        action: relaciones_deleteRelacion,
        payload: data,
        resolve: () => {
          toastWarning('Relación eliminada')
          getRelaciones()
        }
      })
    }
  })
}

function setModoEdicion (data) {
  refAgregarRelacion.value.setForm(data)
  editando.value = true
}

function cancelarEdicion () {
  refAgregarRelacion.value.resetFormData()
  editando.value = false
}

function getLabelDelito (idFamilia, idDelito) {
  const familia = mantenedor_getNombreFamiliaDelito(idFamilia)
  const delito = mantenedor_getNombreTipoDelito(idDelito)
  if (!delito) {
    return familia
  }
  return `${familia} - ${delito}`
}

const delitoOptions = computed(() => {
  return delitos.value.map((d) => {
    return {
      ...d,
      labelDelito: getLabelDelito(d.delito.idFamiliaDelito, d.delito.idTipoDelito)
    }
  })
})

function getTipoVictima (tipo, idTipoDenunciante) {
  const sujetos = []
  sujetos.push({ nombreCompleto: 'Sin Datos', idPersona: 'Sin Datos' })
  sujetosIntervinientes.value.forEach((s) => {
    if (s.tipoSujeto === tipo || (s.tipoSujeto === idTipoDenunciante && s.esVictima)) {
      const nombreCompleto = s.razonSocial ?? `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno}`
      sujetos.push({
        ...s,
        nombreCompleto
      })
    }
  })
  return sujetos
}
function getTipoImputado (tipo) {
  const sujetos = []
  sujetos.push({ nombreCompleto: 'Sin Datos', idPersona: 'Sin Datos' })
  sujetosIntervinientes.value.forEach((s) => {
    if (s.tipoSujeto === tipo) {
      const nombreCompleto = s.razonSocial ?? `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno}`
      sujetos.push({
        ...s,
        nombreCompleto
      })
    }
  })
  return sujetos
}

const imputadoOptions = computed(() => {
  // codigo tipoSujeto imputado
  return getTipoImputado(mantenedor_getIdTipoSujetoByCodigo('3')) ?? getTipoImputado('3')
})
const victimaOptions = computed(() => {
  // codigo tipoSujeto victima  & codigo tipoSujeto denunciante
  return getTipoVictima(mantenedor_getIdTipoSujetoByCodigo('6'), mantenedor_getIdTipoSujetoByCodigo('1')) ?? getTipoVictima('6', '1')
})

</script>
