<template>
<LoaderSkeleton v-if="loading.page" />

<section v-show="!loading.page">
  <Relaciones
    :handle-loading="handleLoading"
    :id-denuncia="procesoPam.idDenuncia"
    :is-disabled="isFolioCerrado"
  />

  <Parentesco
    :id-denuncia="procesoPam.idDenuncia"
    :is-disabled="isFolioCerrado"
  />

  <AppBtnNextTeleported
    v-if="$hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`]) || esNuevaAtencionFiscal"
    label="Especies/Dinero"
    :loading="loading.stepEspecies"
    @click="handleNextStep"
  /> >
</section>
</template>

<script setup>
import { computed, defineEmits, onMounted, reactive } from 'vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import Relaciones from '@/modules/global/components/relaciones/Relacion.vue'
import Parentesco from '@/modules/global/components/parentesco/Parentesco.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useRelacionesStore, usePamStore } from '@/modules/global/composables'
import { useProcedimientosBandejaStore } from '@/modules/flagrancia/composables/useProcedimientosBandejaStore'
import { useAppToast } from '@/modules/common/composables'

const { procesoPam } = usePamStore()
const { relaciones } = useRelacionesStore()
const { esNuevaAtencionFiscal, estadoFolio } = useProcedimientosBandejaStore()
const { toastError } = useAppToast()

const isFolioCerrado = computed(() => estadoFolio.value === 'Cerrado')
const loading = reactive({
  stepEspecies: false,
  page: false
})

onMounted(() => {
  loading.page = true
})

function handleLoading () {
  setTimeout(() => {
    loading.page = false
  }, 1500)
}

const emit = defineEmits(['next-step'])

function handleNextStep () {
  if (relaciones.value?.length > 0) {
    loading.stepEspecies = true
    setTimeout(() => {
      loading.stepEspecies = false
      emit('next-step', 'FlagranciaNuevaAtencionEspeciesDinero')
    }, 600)
  } else toastError('Debes registrar al menos una Relación')
}
</script>
