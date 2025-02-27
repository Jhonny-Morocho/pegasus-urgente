<template>
<section class="mt-3">
  <h4 class="mb-6 text-bluegray-900">
    Seleccione las Causas que desea Agrupar
  </h4>

  <AppFieldset legend="Seleccione Causas a Agrupar">
    <Button
      class="col-12 md:col-3 md:col-offset-9"
      label="Buscar en Mis Causas"
      @click="openModalCausasRelacionadas"
    />

    <TablaCausasAgrupar
      v-model:first="firstRecord"
      v-model:selection="causaPrincipal"
      :loading="isLoadingTablaCausasRelacionadas"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="causasRelacionadas"
      @page="getCausasRelacionadas"
    />
  </AppFieldset>
  <AppBtnNextTeleported
    label="Definir Delitos y Relaciones"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { ref, defineEmits, computed, onMounted, watch } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useDynamicDialog } from '@/modules/common/composables'
import { useCausasRelacionadasStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaCausasAgrupar from '@/modules/global/components/causas-relacionadas/TablaCausasAgrupar.vue'
import ModalConsultarCausasRelacionadas from '@/modules/global/components/causas-relacionadas/ModalConsultarCausasRelacionadas.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const { launchDynamicDialog } = useDynamicDialog()

const { toastWarning } = useAppToast()

const {
  paginacion,
  causasRelacionadas,
  causasRelacionadas_getCausasRelacionadas,
  causasRelacionadas_guardarCausasRelacionadas
} = useCausasRelacionadasStore()

const { causa, dirigirInvestigacion_SET_CAUSA_PRINCIPAL } = useDirigirInvestigacionStore()

const causaPrincipal = ref()

const emit = defineEmits(['next-step'])

const idCausa = computed(() => {
  return causa.value?.data?.causa?.idCausa
})

const isLoadingTablaCausasRelacionadas = ref(false)

function openModalCausasRelacionadas () {
  launchDynamicDialog({
    component: ModalConsultarCausasRelacionadas,
    header: 'Consultar Causas Relacionadas',
    width: '80%',
    onClose: ({ data }) => {
      if (data?.length) {
        guardarCausasRelacionadas(data)
      }
    }
  })
}

function guardarCausasRelacionadas (_causas) {
  // payload { idCausa: id de la causa actual, idCausaRelacionada: id de causa seleccionada}
  let causasRelacionadasAGuardar = []

  // generar payload con las causas seleccionadas y sus valores correspondientes
  causasRelacionadasAGuardar = _causas.map((el) => {
    return {
      idCausa: idCausa.value,
      idCausaRelacionada: el.idCausa
    }
  })

  requestUtil({
    action: causasRelacionadas_guardarCausasRelacionadas,
    payload: {
      causasRelacionadas: causasRelacionadasAGuardar
    },
    resolve: () => {
      getCausasRelacionadas()
    }
  })
}

const firstRecord = ref(0)
async function getCausasRelacionadas (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  await requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      idCausa: idCausa.value,
      params
    },
    loader: (l) => { isLoadingTablaCausasRelacionadas.value = l }
  })
}

const handleNextStep = () => {
  if (!causaPrincipal.value) {
    toastWarning('Debe seleccionar una Causa como Principal!')
    return
  }
  emit('next-step', '/dirigir-investigacion/analizar-causas-a-agrupar/definir-delitos-y-relaciones')
}

watch(causaPrincipal, (newValue) => {
  dirigirInvestigacion_SET_CAUSA_PRINCIPAL(newValue)
})

onMounted(() => {
  getCausasRelacionadas()
})
</script>
