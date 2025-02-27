<template>
<LoaderSkeleton v-if="loadingPage" />

<section v-show="!loadingPage">
  <Relaciones
    :handle-loading="handleLoading"
    :id-denuncia="idDenuncia"
    is-preclasificador
  />

  <Parentesco :id-denuncia="idDenuncia" />
</section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Relaciones from '@/modules/global/components/relaciones/Relacion.vue'
import Parentesco from '@/modules/global/components/parentesco/Parentesco.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useCausaAsignacionStore } from '@/modules/asignacion/composables'

const { idDenuncia } = useCausaAsignacionStore()
const loadingPage = ref(false)

// SE ACOPLO EL COMPONENTE RELACIONES POR LO QUE NO PUEDO
// SETEAR flujoAsignacion.requiereCambiarTipificacion = true

onMounted(() => {
  loadingPage.value = true
})

function handleLoading () {
  setTimeout(() => {
    loadingPage.value = false
  }, 1500)
}
</script>
