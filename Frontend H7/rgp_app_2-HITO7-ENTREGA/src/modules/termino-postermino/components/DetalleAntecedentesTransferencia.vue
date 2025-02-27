<template>
<main
  v-if="loading"
  class="w-full formgrid grid px-4 py-0 mt-2 mx-0"
>
  <LoaderSkeleton height="20vh" />
</main>
<main
  v-else
  class="w-full formgrid grid px-4 py-0 mt-2 mx-0"
>
  <ul class="col-12 md:col-6 list-none flex flex-column gap-3">
    <li><strong>Fiscalía Origen: </strong>{{ isLoading.fiscalias ? 'Cargando...' : fiscaliaOrigen }}</li>
    <li><strong>Fiscalía Destino: </strong>{{ isLoading.fiscalias ? 'Cargando...' : fiscaliaDestino }}</li>
    <li><strong>Motivo de Transferencia: </strong>{{ isLoading.motivos ? 'Cargando...' : motivoTransferencia }}</li>
  </ul>
  <ul class="col-12 md:col-6 list-none flex flex-column gap-3">
    <li>
      <strong>Comentario: </strong>
      <p>{{ antecedentesTransferencia?.descripcion }}</p>
    </li>
  </ul>
</main>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  antecedentesTransferencia: propTypes.object,
  loading: Boolean
})

const isLoading = reactive({
  fiscalias: false,
  motivos: false
})

const {
  mantenedor_getFiscalias,
  mantenedor_getMotivosTransferencia,
  mantenedor_getNombreFiscaliaById,
  mantenedor_getNombreMotivoTransferenciaById
} = useMantenedorStore()

const fiscaliaOrigen = computed(() => {
  return mantenedor_getNombreFiscaliaById(props.antecedentesTransferencia?.idFiscaliaOrigen) || 'Fiscalía Desconocida'
})

const fiscaliaDestino = computed(() => {
  return mantenedor_getNombreFiscaliaById(props.antecedentesTransferencia?.idFiscaliaDestino) || 'Fiscalía Desconocida'
})

const motivoTransferencia = computed(() => {
  return mantenedor_getNombreMotivoTransferenciaById(props.antecedentesTransferencia?.idMotivo) || 'Motivo Desconocido'
})

function getDataMantenedor () {
  requestUtil({
    action: mantenedor_getMotivosTransferencia,
    loader: (l) => { isLoading.motivos = l }
  })
  requestUtil({
    action: mantenedor_getFiscalias,
    loader: (l) => { isLoading.fiscalias = l }
  })
}

onMounted(() => {
  getDataMantenedor()
})

</script>
