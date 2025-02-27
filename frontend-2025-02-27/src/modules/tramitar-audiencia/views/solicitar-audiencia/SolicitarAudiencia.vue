<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`Nombre de Causa: ${resumenCausa?.nombreCausa}`"
    :page-subtitle="`RUC: ${resumenCausa.ruc}`"
    :page-title="`Solicitud Audiencia de ${antecedentesAudiencia?.tipo}`"
  />
  <AppSteps
    :model="stepsSolicitarAudiencia"
  />
  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useMenuSuperior, useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'

const route = useRoute()
const router = useRouter()

const { resumenCausa, ruc, tramitarAudiencia_getAntecedentesAudiencia } = useTramitarAudiencia()
const { itemsMenuSuperior } = useMenuSuperior({ ruc })

const stepsSolicitarAudiencia = [
  {
    label: 'Resumen Relaciones Especie',
    to: { name: 'ResumenRelacionesEspecies' }
  },
  {
    label: '¿Desea agregar medidas cautelares?',
    to: { name: 'MedidasCautelares' }
  },
  {
    label: 'Elaboración del Escrito',
    to: { name: 'ElaborarEscrito' }
  }
]

function handleBackStep () {
  const indexActualStep = stepsSolicitarAudiencia.findIndex((s) => s.to.name === route.name)

  indexActualStep > 0 ? router.push(stepsSolicitarAudiencia[indexActualStep - 1].to) : router.push('/tramitar-audiencia')
}

const antecedentesAudiencia = ref()
function getAntecedentesAudiencia () {
  requestUtil({
    action: tramitarAudiencia_getAntecedentesAudiencia,
    resolve: (data) => {
      antecedentesAudiencia.value = data
    }
  })
}

onMounted(() => {
  getAntecedentesAudiencia()
})
</script>
