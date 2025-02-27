<template>
<LoaderSkeleton v-if="isLoadingPage" />
<section v-show="!isLoadingPage">
  <DetenidosACDTablaDetenidos
    id="detenidos-acd"
    ref="refsujetoSeleccionadoEnviar"
    :detenidos-seleccionados="detenidosSeleccionados"
    :loading="isLoading"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="detenidos"
    @change="detenidosSeleccionados2"
    @detenido:editar="handleEditarDetenido"
    @page="getDataTableACD"
  />

  <AppBtnNextTeleported
    :disabled="!isSeleccionado"
    label="Definir Detenidos"
    :loading="isLoading"
    no-icon
    @click="handleSubmitForm"
  />
  <AppBtnNextTeleported
    class="mx-5 p-button-outlined bg-white"
    label="Volver a Bandeja"
    no-icon
    @click="router.push('/flagrancia/')"
  />
</section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DetenidosACDTablaDetenidos from '@/modules/flagrancia/components/detenidos-acd/DetenidosACDTablaDetenidos.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { usePamStore, useMantenedorStore } from '@/modules/global/composables'
import { useStepDetenidosACDStore } from '@/modules/flagrancia/composables/index'

import { requestUtil } from '@/utils'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const { detenidos, stepDetenidosACD_actualizarDecisionACD, stepDetenidosACD_getDataTableACD, stepDetenidosACD_registrarDecisionACD, stepDetenidosACD_setEsEnviadoACD, paginacion } = useStepDetenidosACDStore()

const { mantenedor_getjuzgados } = useMantenedorStore()

const { toastSuccess, toastError } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const { procesoPam } = usePamStore()

const router = useRouter()

// maneja los detenidos seleccionados
const detenidosSeleccionados = ref([])
const refsujetoSeleccionadoEnviar = ref(null)
const idsProcedimientoDetenido = ref(null)

const isLoading = ref(false)
const isLoadingPage = ref(false)
const firstRecord = ref(0)

onMounted(() => {
  isLoadingPage.value = true
  getDataTableACD()
}
)

function getDataTableACD (pagination = undefined) {
  requestUtil({ action: mantenedor_getjuzgados })
  if (!pagination) {
    firstRecord.value = 0
  }

  requestUtil({
    action: stepDetenidosACD_getDataTableACD,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia,
      idProcedimiento: procesoPam.value.idProcedimiento,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (l) => {
      isLoading.value = l
    },
    resolve: () => {
      isLoadingPage.value = false
    },
    reject: () => {
      isLoadingPage.value = false
    }
  })
}

function handleEditarDetenido (detenidoEditado) {
  isLoading.value = true
  if (!detenidoEditado.idProcedimientoDetenido) {
    requestUtil({
      action: stepDetenidosACD_registrarDecisionACD,
      payload: {
        ...detenidoEditado,
        idProcedimiento: procesoPam.value.idProcedimiento
      },
      resolve: () => {
        toastSuccess('El detenido ha sido actualizado con éxito')
        getDataTableACD()
      },
      reject: () => { isLoading.value = false }
    })
  } else {
    requestUtil({
      action: stepDetenidosACD_actualizarDecisionACD,
      payload: {
        ...detenidoEditado,
        idProcedimiento: procesoPam.value.idProcedimiento,
        fechaPresentacionAcd: detenidoEditado.fechaPresentacionAcd
      },
      resolve: () => {
        toastSuccess('El detenido ha sido actualizado con éxito')
        getDataTableACD()
      },
      reject: () => { isLoading.value = false }
    })
  }
}
const isSeleccionado = computed(() => {
  return idsProcedimientoDetenido.value?.length > 0
})

function detenidosSeleccionados2 () {
  idsProcedimientoDetenido.value = []
  refsujetoSeleccionadoEnviar.value.sujetoSeleccionadoEnviar.map((d) => {
    return idsProcedimientoDetenido.value.push(d.idProcedimientoDetenido)
  })
}

function handleSubmitForm () {
  console.log(idsProcedimientoDetenido.value)
  launchConfirmDialog({
    header: 'Enviar Detenidos',
    message: '¿Está seguro de querer definir Detenidos?',
    accept: () => {
      isLoading.value = true
      requestUtil({
        action: stepDetenidosACD_setEsEnviadoACD,
        payload: {
          idProcedimiento: procesoPam.value.idProcedimiento,
          procesoPam: {
            processDef: 'string',
            procesoPrincipal: 'string',
            idCausa: 'string',
            idDenuncia: procesoPam.value.idDenuncia,
            idProcedimiento: procesoPam.value.idProcedimiento,
            usuario: procesoPam.value.usuario,
            processInstanceId: procesoPam.value.taskProcessInstanceId,
            taskInstanceId: procesoPam.value.taskId,
            taskName: procesoPam.value.taskName,
            correlationKey: procesoPam.value.taskCorrelationKey
          },
          idsProcedimientoDetenido: idsProcedimientoDetenido.value
        },
        resolve: (d) => {
          console.log(d)
          toastSuccess('Detenidos enviados a nómina correctamente')
          router.push('/flagrancia/')
        },
        reject: () => {
          toastError('Ocurrio un error al Definir Detenidos')
          isLoading.value = false
        }
      })
    }
  })
}
</script>
