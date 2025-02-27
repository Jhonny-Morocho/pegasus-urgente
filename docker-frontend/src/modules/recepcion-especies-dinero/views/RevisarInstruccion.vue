<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Instrucción de Destino"
  />
  <InstruccionDeDestino
    ref="datosRevisarInstruccion"
    :data-instruccion="dataInstruccion"
  />
  <AppBtnsSteps
    :button-back-disabled="$route.path === `/custodia`"
    @back-step="handleBackStep"
  />
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-angle-double-right"
    icon-pos="right"
    label="Registrar Instrucción"
    :loading="isSomethingLoading"
    @click="handleRegistrarInstruccion"
  />
</section>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import { useIngresoDinero, useItemsMenuSuperiorCadena, useRevisarInstruccion } from '@/modules/recepcion-especies-dinero/composables'
import InstruccionDeDestino from '@/modules/recepcion-especies-dinero/views/revisar-instruccion/InstruccionDeDestino.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useConfirmDialog } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const { revisarInstruccion_registrarInstruccion, revisarInstruccion_registrarInstruccionTransferencia } = useRevisarInstruccion()
const { launchConfirmDialog } = useConfirmDialog()
const { dataInstruccion } = useIngresoDinero()

const router = useRouter()
const datosRevisarInstruccion = ref()

function handleBackStep () {
  launchConfirmDialog({
    header: 'Fijación Fotogáfica',
    message: 'Se encuentra por salir con una Fijación Fotográfica inconclusa.',
    acceptLabel: 'Salir',
    accept: () => router.push('/custodia/custodio')
  })
}

function handleRegistrarInstruccion () {
  launchConfirmDialog({
    header: 'Registrar Instrucción de Salida',
    message: '¿Está seguro de Registrar Instrucción de Salida?',
    acceptLabel: 'Aceptar',
    accept: () => {
      if (dataInstruccion.value.salidaTemporal) {
        requestUtil({
          action: revisarInstruccion_registrarInstruccion,
          payload: {
            idEspecie: dataInstruccion.value.data.data.especie.idEspecie,
            tareaId: dataInstruccion.value.data.tarea.taskId,
            observaciones: datosRevisarInstruccion.value.form.observaciones

          },
          resolve: () => {
            router.push('/custodia/custodio')
          }
        })
      } else if (dataInstruccion.value.salidaTransferencia) {
        requestUtil({
          action: revisarInstruccion_registrarInstruccionTransferencia,
          payload: {
            idEspecie: dataInstruccion.value.data.data.especie.idEspecie,
            tareaId: dataInstruccion.value.data.tarea.taskId,
            observaciones: datosRevisarInstruccion.value.form.observaciones

          },
          resolve: (res) => {
            console.log('res transsss', res)
            router.push('/custodia/custodio')
          }
        })
      }
    }
  })
}

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
</script>
