<template>
<main>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`RUC: N° ${ruc}`"
    :page-subtitle="`Nombre Causa: ${nombreCausa}`"
    :page-title="pageTitle"
  />

  <AppSteps
    v-if="!isTelefonica"
    :model="steps"
  />

  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnsSteps
    @back-step="handleBackStep"
  />
</main>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '../../composables'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'

const route = useRoute()
const router = useRouter()

const { ruc, causa } = useDirigirInvestigacionStore()

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const { isTelefonica, isCitacion, atributos } = useSolicitudesStore()

const pageTitle = computed(() => isCitacion.value ? 'Citación' : 'Comunicación')
const nombreCausa = computed(() => causa.value?.data?.causa?.nombre)

function handleBackStep () {
  const indexStepActual = steps.value.findIndex(step => step.to.name === route.name)

  if (indexStepActual > 0) {
    router.push(steps.value[indexStepActual - 1].to)
  } else {
    router.push({ name: 'DIDesarrolloInvestigacion' })
  }
}

const labelStepResumen = computed(() => atributos.hasSelectorSujeto ? 'Resumen / Sujetos' : 'Resumen')

const steps = ref([
  {
    label: labelStepResumen,
    to: { name: isCitacion.value ? 'DISCitacionResumen' : 'DISComunicacionResumen' }
  },
  {
    label: 'Elaboración del Escrito',
    to: { name: isCitacion.value ? 'DISCitacionElaboracionEscrito' : 'DISComunicacionElaboracionEscrito' }
  }
])
</script>
