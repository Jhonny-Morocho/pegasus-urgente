<template>
<div>
  <AppFieldset legend="Relaciones">
    <TablaRelaciones
      class="mb-3"
      :loading="tablaRelaciones.isLoading"
      read-only
      :total-records="relaciones.length"
      :value="relaciones"
      @page="getRelaciones"
      @relacion:derivar-uravit="openModalDerivarURAVIT"
      @relacion:editar-relacion="setModoEdicion"
      @relacion:eliminar-relacion="eliminarRelacion"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useRelacionesStore } from '@/modules/global/composables'
import { useDialog } from 'primevue/usedialog'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
/* eslint-disable no-unused-vars */
// import ModalDerivarUravit from '@/modules/dirigir-investigacion/components/modals/ModalDerivarUravit.vue'
import { useTermino } from '../../composables'

const { ruc, idDenuncia } = useTermino()

const dialog = useDialog()

const { launchConfirmDialog } = useConfirmDialog()

const { toastSuccess, toastError, toastWarning } = useAppToast()

const { relaciones, relaciones_getRelaciones } = useRelacionesStore()

const tablaRelaciones = reactive({
  isLoading: false,
  isEditando: false,
  firstRecord: 0
})

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    tablaRelaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tablaRelaciones.isLoading = l)
  })
}

onMounted(async () => {
  getRelaciones()
})
</script>
