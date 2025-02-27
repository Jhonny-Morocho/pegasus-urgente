<template>
<LoaderSkeleton v-if="loader" />
<section v-show="!loader">
  <ResumenCausa
    :causa="resumenCausa"
    :loading="loader"
    title="Resumen Causa"
    @ficha-causa="openFichaCausa"
  />

  <Relaciones />
  <EspeciesDinero v-if="hasEspeciesDinero" />
</section>

<AppBtnNextTeleported
  class="ml-8"
  :disabled="!relacionesSeleccionadas.length"
  label="Agregar Medidas Cautelares"
  :loading="loader"
  @click="handleNextStep"
/>
</template>

<script setup>
import { defineEmits, ref, onMounted } from 'vue'
import Relaciones from '@/modules/global/components/solicitudes/Relaciones.vue'
import EspeciesDinero from '@/modules/global/components/solicitudes/EspeciesDinero.vue'
import ResumenCausa from '@/modules/global/components/solicitudes/ResumenCausa.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useRoute, useRouter } from 'vue-router'
import { useSolicitudesStore } from '../composables'
import { useMantenedorStore, useRelacionesStore } from '@/modules/global/composables'

const router = useRouter()
const route = useRoute()

const {
  idCausa,
  resumenCausa,
  solicitudes_getResumenCausa,
  relacionesSeleccionadas,
  dataSelector
} = useSolicitudesStore()

const { atributos, mantenedor_getAtributos } = useMantenedorStore()

const hasEspeciesDinero = atributos.value.some((e) => e.codigoAtributo === '24')

const emit = defineEmits(['next-step'])
const { toastError } = useAppToast()

// eslint-disable-next-line no-unused-vars
const { relaciones } = useRelacionesStore()

const loader = ref(false)

onMounted(() => {
  getResumenCausa()
  requestUtil({
    action: mantenedor_getAtributos,
    payload: {
      idActividad:
         dataSelector.value?.selectorSubSubTipo ||
         dataSelector.value?.selectorSubTipo
    }
  })
})

function openFichaCausa (causa) {
  console.log('openFichaCausa', causa)
}

async function getResumenCausa () {
  requestUtil({
    action: solicitudes_getResumenCausa,
    payload: { idCausa: idCausa.value },
    loader: (l) => {
      loader.value = l
    },
    reject: () => toastError('Ocurrió un error inesperado')
  })
}

// refactorizar está atrocidad
function handleNextStep () {
  loader.value = true
  if (route.path === '/solicitudes/completar-solicitar/resumen-relaciones-especies') {
    router.push({ name: 'solicitudMedidasCautelares' })
  } else if (route.path === '/solicitudes/comunicacion/resumen-sujetos') {
    router.push({ name: 'solicitudDeComunicacionEleborarEscrito' })
  } else if (route.path === '/solicitudes/otro-tipo/resumen-relacion') {
    router.push({ name: 'solicitudesOtroTipoMedidasCautelares' })
  } else if (
    route.path === '/solicitudes/autorizacion-de-diligencias/resumen-relacion'
  ) {
    router.push({ name: 'solicitudAutorizacionDiligenciasMedidasIntrusivas' })
  } else {
    emit(
      'next-step',
      '/gestion-solicitudes/fiscal/solicitar-audiencia/elaborar-solicitud-audiencia'
    )
  }
}
</script>
