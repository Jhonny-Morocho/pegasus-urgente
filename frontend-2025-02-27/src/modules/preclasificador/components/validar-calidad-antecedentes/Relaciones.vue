<template>
<LoaderSkeleton v-if="loadingPage" />

<section v-show="!loadingPage">
  <Relaciones
    :handle-loading="handleLoading"
    :id-denuncia="idDenuncia"
    is-preclasificador
  />

  <Parentesco
    :id-denuncia="idDenuncia"
  />
</section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import Relaciones from '@/modules/global/components/relaciones/Relacion.vue'
import Parentesco from '@/modules/global/components/parentesco/Parentesco.vue'
import { useCausaPreclasificadorStore } from '@/modules/preclasificador/composables'

const { idDenuncia } = useCausaPreclasificadorStore()

const loadingPage = ref(false)

onMounted(() => {
  loadingPage.value = true
})

// SE ACOPLO EL COMPONENTE RELACIONES POR LO QUE NO PUEDO
// SETEAR flujoPreclasificador.cambiarTipificacionOtro = true

function handleLoading () {
  setTimeout(() => {
    loadingPage.value = false
  }, 1500)
}

</script>
