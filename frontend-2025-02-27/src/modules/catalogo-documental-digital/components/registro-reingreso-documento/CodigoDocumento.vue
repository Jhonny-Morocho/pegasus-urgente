<template>
<section class="col-12 p-0">
  <div
    class="p-inputgroup px-2"
    style="height: 36px; margin-top: 6px"
  >
    <AppInput
      id="codigo-barras"
      v-model="formData.codigoBarras"
      class="w-4"
      label="Ingresar Código de Barras"
    />
    <Button
      class="btn-primary"
      icon="pi pi-search"
      @click="handleBuscarDocumento"
    />
  </div>
</section>
</template>
<script setup>
// COMPONENTS

// UTILS
import { reactive, defineEmits } from 'vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useSolicitudesEncargadoBodega } from '../../composables'
const { toastSuccess, toastError } = useAppToast()
const { solicitudesEncargadoBodega_getSolicitudParaReingreso } = useSolicitudesEncargadoBodega()

// VALUES
const emit = defineEmits(['mostrar'])
const formData = reactive({
  codigoBarras: ''
})

// LOGIC
function handleBuscarDocumento () {
  requestUtil({
    action: solicitudesEncargadoBodega_getSolicitudParaReingreso,
    payload: {
      codigoBarras: formData.codigoBarras
    },
    resolve: () => {
      toastSuccess('Busqueda Exitosa')
      emit('mostrar', true)
    },
    reject: () => {
      toastError('No se encontró el documento')
      emit('mostrar', false)
    }
  })
}
</script>
