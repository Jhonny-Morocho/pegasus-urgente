<template>
<section>
  <div class="mb-4">
    <AppFieldset
      legend="Parentesco"
    >
      <AgregarParentesco
        ref="refAgregarParentesco"
        class="pb-6"
        :is-disabled="isDisabled"
        :is-editando="editando"
        :loading-state="loadingTablaParentesco"
        @parentesco:agregar="agregarParentesco"
        @parentesco:cancelar-edicion="cancelarEdicion"
        @parentesco:editar="editarParentesco"
      />
      <TablaParentesco
        :is-disabled="isDisabled"
        :is-editando="editando"
        :loading="loadingTablaParentesco"
        :rows="paginacionParentesco?.tamanoPagina"
        :total-records="paginacionParentesco?.elementosTotales"
        :value="parentesco"
        @page="getParentesco"
        @parentesco:editar-parentesco="setModoEdicion"
        @parentesco:eliminar-parentesco="eliminarParentesco"
      />
    </AppFieldset>
  </div>
</section>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue'
import AgregarParentesco from '@/modules/global/components/parentesco/AgregarParentesco.vue'
import TablaParentesco from '@/modules/global/components/parentesco/TablaParentesco.vue'
import {
  useRelacionesStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'

import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types/prop.types'

const { toastWarning, toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const loadingTablaParentesco = ref(false)

const {
  parentesco, paginacionParentesco,
  relaciones_addParentesco,
  relaciones_editParentesco,
  relaciones_deleteParentesco,
  relaciones_getParentesco
} = useRelacionesStore()

const { sujetosIntervinientes, sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

const props = defineProps({
  idDenuncia: propTypes.string,
  isDisabled: { type: Boolean, default: false }
})
const editando = ref(false)

const refAgregarParentesco = ref(null)

onMounted(() => {
  getSujetosIntervinientes()
  getParentesco()
})

function getSujetosIntervinientes () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: props.idDenuncia
    }
  })
}

const firstRecord = ref(0)
function getParentesco (pagination = undefined) {
  loadingTablaParentesco.value = true
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page || 0,
    size: pagination?.rows || 10
  }

  requestUtil({
    action: relaciones_getParentesco,
    payload: { idDenuncia: props.idDenuncia, params },
    loader: (l) => (loadingTablaParentesco.value = l),
    reject: (err) => {
      console.log(err)
    }
  })
}

function existeParentescoForPut (nuevaRelacion) {
  return parentesco.value.find((p) => {
    return (p.idPersonaReferencial === nuevaRelacion.idPersonaReferencial &&
      p.idPersonaReferenciada === nuevaRelacion.idPersonaReferenciada &&
      p.idTipo === nuevaRelacion.idTipo
    )
  })
}
function existeParentescoForPost (nuevaRelacion) {
  return parentesco.value.find((p) => {
    return (
      p.idPersonaReferencial === nuevaRelacion.idPersonaReferencial &&
      p.idPersonaReferenciada === nuevaRelacion.idPersonaReferenciada
    )
  })
}

function getContract (data) {
  const referencial = sujetosIntervinientes.value.find(
    (v) => v.idPersona === data.idPersonaReferencial
  )

  const referenciado = sujetosIntervinientes.value.find(
    (v) => v.idPersona === data.idPersonaReferenciada
  )
  return {
    idTipo: data.idTipo ?? null,
    idPersonaReferencial: referencial?.idPersona ?? null,
    idPersonaReferenciada: referenciado?.idPersona ?? null,
    idRelacionAfinidad: data?.idRelacionAfinidad ?? null
  }
}

function agregarParentesco (data) {
  loadingTablaParentesco.value = true
  const payloadParentesco = getContract(data)
  if (!existeParentescoForPost(payloadParentesco) && !editando.value) {
    requestUtil({
      action: relaciones_addParentesco,
      payload: payloadParentesco,
      resolve: () => {
        toastSuccess('Parentesco agregada con éxito')
        cancelarEdicion()
        getParentesco()
      }
    })
  } else {
    toastWarning('Ya existe una relación de parentesco con esos datos')
    loadingTablaParentesco.value = false
  }
}

function editarParentesco (data) {
  const payloadParentesco = getContract(data)
  if (!existeParentescoForPut(payloadParentesco) && editando.value) {
    launchConfirmDialog({
      message: '¿Estás seguro(a) de modificar la relación de parentesco?',
      accept: () => {
        loadingTablaParentesco.value = true
        requestUtil({
          action: relaciones_editParentesco,
          payload: payloadParentesco,
          resolve: () => {
            toastSuccess('Parentesco modificada con éxito')
            cancelarEdicion()
            getParentesco()
          }
        })
      }
    })
  } else {
    toastWarning('Ya existe una relación de parentesco con esos datos')
  }
}

function eliminarParentesco (data) {
  launchConfirmDialog({
    message: '¿Estas seguro(a) de querer eliminar la relación de parentesco?',
    accept: () => {
      loadingTablaParentesco.value = true
      requestUtil({
        action: relaciones_deleteParentesco,
        payload: { idRelacionAfinidad: data.idRelacionAfinidad },
        resolve: () => {
          toastWarning('Parentesco eliminado')
          getParentesco()
        }
      })
    }
  })
}

function setModoEdicion (data) {
  refAgregarParentesco.value.setForm(data)
  editando.value = true
}

function cancelarEdicion () {
  refAgregarParentesco.value.resetFormData()
  editando.value = false
}

</script>
