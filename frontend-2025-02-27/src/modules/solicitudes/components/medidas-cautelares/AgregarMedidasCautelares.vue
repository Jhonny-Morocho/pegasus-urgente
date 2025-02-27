<template>
<LoaderSkeleton v-if="loader" />
<section v-show="!loader">
  <AppFieldset
    :legend="
      esIntrusiva || intrusiva
        ? 'Medidas Intrusivas Vigentes'
        : 'Medidas Cautelares Vigentes'
    "
  >
    <TablaMedidasCautelaresVigentes
      :is-intrusiva="esIntrusiva || intrusiva"
      :loading="isLoading"
      :medidas-cautelares="medidasCautelaresVigentes"
      :rows="rows"
      :tiene-acciones="acciones"
      :total-records="totalRecords"
    />
  </AppFieldset>

  <AppFieldset
    :legend="
      esIntrusiva || intrusiva
        ? 'Agregar Medida Intrusiva'
        : 'Agregar Medida Cautelar'
    "
  >
    <FormAgregarMedidasCautelares
      class="w-full"
      :is-intrusiva="esIntrusiva || intrusiva"
    />
  </AppFieldset>
</section>

<AppBtnNextTeleported
  :label="'Elaborar Escrito'"
  :loading="loader"
  @click="handleNextStep"
/>
</template>
<script setup>
import { defineProps, onMounted, ref, defineEmits } from 'vue'
import { useRoute } from 'vue-router'

import TablaMedidasCautelaresVigentes from '@/modules/solicitudes/components/medidas-cautelares/TablaMedidasCautelaresVigentes.vue'
import FormAgregarMedidasCautelares from '@/modules/solicitudes/components/medidas-cautelares/FormAgregarMedidasCautelares.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const emit = defineEmits(['next-step'])

const { medidasCautelares, mantenedor_getListadoMedidasCautelares } =
  useMantenedorStore()

const route = useRoute()
const intrusiva = ref(false)
const medidasCautelaresVigentes = ref([]) // falta endPoint

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  medidasCautelares: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Number,
    default: 10
  },
  acciones: {
    type: Boolean,
    default: false
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  deleteMedidasCallback: {
    type: Function,
    default: null
  },
  esIntrusiva: {
    type: Boolean,
    default: false
  }
})

onMounted(async () => {
  if (medidasCautelares.value?.length === 0) {
    await requestUtil({ action: mantenedor_getListadoMedidasCautelares })
  }

  if (
    route.path ===
    '/solicitudes/autorizacion-de-diligencias/agregar-medidas-intrusivas'
  ) {
    intrusiva.value = true
  }
})

function handleNextStep () {
  emit('next-step', '/solicitudes/completar-solicitar/elaborar-escrito')
}
</script>
