<template>
<section class="mt-3">
  <h4 class="mb-6 text-bluegray-900">
    Definir Especies
  </h4>
  <AppFieldset
    :legend="tituloResumen"
    toggleable
  >
    <div class="grid w-full py-3">
      <ResumenCausa :causa="resumenCausa" />
    </div>
  </AppFieldset>
  <AppFieldset legend="Especies / Dinero">
    <TablaDefinirEspecies
      :loading="isLoadingTablaEspecies"
      :total-records="especies?.length"
      :value="especies"
    />
  </AppFieldset>
  <AppBtnNextTeleported
    label="Resumen Causa Principal"
    @click="handleNextStep"
  />
</section>
</template>
<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import { useCausasRelacionadasStore, useEspeciesDineroStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { requestUtil } from '@/utils'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import ResumenCausa from '@/modules/dirigir-investigacion/components/ResumenCausa.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaDefinirEspecies from '@/modules/dirigir-investigacion/components/analizar-causas-a-agrupar/TablaDefinirEspecies.vue'

const { resumenCausa } = useDirigirInvestigacionStore()
const { especies, especiesDinero_postManyEspeciesByIdDenuncia } = useEspeciesDineroStore()

const {
  causasRelacionadas
} = useCausasRelacionadasStore()

const emit = defineEmits(['next-step'])

const tituloResumen = computed(() =>
  `Resumen Causa Principal  |  RUC ${resumenCausa.value?.ruc} - ${resumenCausa.value?.delito || 'Delito'}`
)

const handleNextStep = () => {
  emit('next-step', '/dirigir-investigacion/analizar-causas-a-agrupar/resumen-agrupacion')
}

const isLoadingTablaEspecies = ref(false)

function getAllEspeciesByManyIdDenuncia () {
  // desestructurar los delitos
  const relaciones = causasRelacionadas.value.map((el) => { return el?.delitos })

  // desestructurar los ids y si hay repetidos no tomarlos en cuenta
  const idDenuncias = new Set(relaciones.flatMap(arr => arr.map(obj => obj.idDenuncia)))

  // volver a transformar en un arreglo
  const uniqueIds = Array.from(idDenuncias)

  // llamar al servicio para traerme todos los delitos asociados a n causas
  requestUtil({
    action: especiesDinero_postManyEspeciesByIdDenuncia,
    payload: {
      listaDenuncias: uniqueIds
    },
    resolve: (_res) => { console.log(_res) },
    reject: (_err) => { console.log(_err) },
    loader: (l) => { isLoadingTablaEspecies.value = l }
  })
}

onMounted(() => {
  getAllEspeciesByManyIdDenuncia()
})
</script>
