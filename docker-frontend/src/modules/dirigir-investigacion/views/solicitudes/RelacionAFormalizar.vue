<template>
<section>
  <AppFieldset legend="Relaciones">
    <TablaRelaciones
      v-model:first="firstRecord"
      v-model:selection="relacionesSeleccionadas"
      is-preclasificador
      :loading="isLoading"
      :read-only="true"
      :rows="10"
      selectable
      :total-records="relaciones.length"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>

  <AppBtnNextTeleported
    class="ml-8 px-5"
    :disabled="listaImputados.length <= 0"
    icon="pi pi-arrow-right"
    icon-pos="right"
    :label="labelNextStep"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useDelitoStore, useRelacionesStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const router = useRouter()
const route = useRoute()
const {
  idDenuncia,
  dirigirInvestigacion_SET_MEDIDAS_CAUTELARES
} = useDirigirInvestigacionStore()
const {
  relaciones,
  relaciones_getRelaciones
} = useRelacionesStore()
const {
  sujetosIntervinientes,
  sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()
const {
  delitos,
  delito_getDelitoByIdDenuncia
} = useDelitoStore()

const isLoading = ref(false)
const firstRecord = ref(0)
const relacionesSeleccionadas = ref([])

const listaImputados = inject('listaImputados')

async function getRelaciones (pagination = undefined) {
  isLoading.value = true
  if (!pagination) {
    firstRecord.value = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  await requestUtil({
    action: relaciones_getRelaciones,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    }
  })
}

async function getSujetos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  await requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    }
  })
}

async function getDelitos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  await requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    }
  })
}

watch(relacionesSeleccionadas, (val) => {
  listaImputados.value = val
})

onMounted(async () => {
  // setear lista medidas cautelares step2 a su estado x defecto
  dirigirInvestigacion_SET_MEDIDAS_CAUTELARES([])

  // creamos una lista de promesas, si NO existen sujetos o delitos en store, agregar a lista
  const promisesList = [getRelaciones()]

  if (sujetosIntervinientes.value.length <= 0) {
    promisesList.push(getSujetos())
  }
  if (delitos.value.length <= 0) {
    promisesList.push(getDelitos())
  }
  if (relaciones.value.length === 1) {
    relacionesSeleccionadas.value = relaciones.value
  }

  // llamar a los endpoints correspondientes para luego setear loading
  Promise.all(promisesList).then(() => {
    isLoading.value = false
  })
})

const labelNextStep = computed(() => {
  if (route.name.includes('DISMCI')) {
    return 'Agregar Medidas Cautelares o Intrusivas'
  }
  return 'Agregar Medidas Cautelares'
})

function handleNextStep () {
  // Directriz Investigacion - Solicitar Orden de Detención
  if (route.name.includes('DISOD')) {
    router.push({ name: 'DISODAgregarMedidasCautelares' })
  }
  // Directriz Investigacion - Solicitar Audiencia de Formalizacion
  if (route.name.includes('DISAF')) {
    router.push({ name: 'DISAFAgregarMedidasCautelares' })
  }
  // Directriz Investigacion - Solicitar Medidas Cautelares o Intrusivas
  if (route.name.includes('DISMCI')) {
    router.push({ name: 'DISMCIAgregarMedidasCautelares' })
  }
}
</script>
