<template>
<section class="mt-3">
  <h4 class="mb-6 text-bluegray-900">
    Definir Delitos y Relaciones
  </h4>

  <AppFieldset
    :legend="tituloResumen"
    :loading="isLoadingResumenCausa"
    :toggleable="true"
  >
    <div class="grid w-full py-3">
      <ResumenCausa
        :causa="resumenCausa"
      />
    </div>
  </AppFieldset>

  <AppFieldset
    legend="Delitos"
    :toggleable="true"
  >
    <TablaDelitos
      :loading="isLoadingTablaDelitos"
      :total-records="delitos?.length"
      :value="delitos"
    />
  </AppFieldset>

  <AppFieldset
    legend="Relaciones"
    :toggleable="true"
  >
    <TablaRelaciones
      :loading="isLoadingTablaRelaciones"
      :total-records="paginacion?.elementosTotales"
      :value="relaciones?.length"
    />
  </AppFieldset>

  <div>
    <div class="mb-3 px-2 grid">
      <Button
        class="p-button-outlined col-6 md:col-4"
        icon="pi pi-paperclip"
        icon-pos="right"
        label="Agregar Relación"
        @click="abrirFieldsetRelacion"
      />
    </div>

    <AppFieldset
      :collapsed="collapsedAgregarRelacionFieldset"
      legend="Agregar Relación"
      :toggleable="true"
    >
      <AgregarRelacion />
    </AppFieldset>
  </div>
  <AppBtnNextTeleported
    label="Definir Especies"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { ref, computed, defineEmits, onMounted } from 'vue'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useCausasRelacionadasStore, useDelitoStore, useRelacionesStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import ResumenCausa from '@/modules/dirigir-investigacion/components/ResumenCausa.vue'
import AgregarRelacion from '@/modules/global/components/relaciones/AgregarRelacion.vue'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import TablaDelitos from '@/modules/dirigir-investigacion/components/analizar-causas-a-agrupar/tablas-resumen-agrupacion/TablaDelitos.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const {
  delitos,
  delito_postManyDelitosByIdDenuncia
} = useDelitoStore()

const {
  relaciones,
  relaciones_postManyRelacionesByIdDenuncia
} = useRelacionesStore()

const {
  causasRelacionadas
} = useCausasRelacionadasStore()

const {
  resumenCausa,
  causaPrincipal,
  dirigirInvestigacion_getResumenCausa
} = useDirigirInvestigacionStore()

const collapsedAgregarRelacionFieldset = ref(true)

const emit = defineEmits(['next-step'])

const tituloResumen = computed(() =>
  `Resumen Causa Principal  |  RUC ${causaPrincipal.value?.ruc} - ${resumenCausa.value?.delito || 'Delito'}`
)

const isLoadingTablaDelitos = ref(false)
const isLoadingTablaRelaciones = ref(false)

function abrirFieldsetRelacion () {
  collapsedAgregarRelacionFieldset.value = !collapsedAgregarRelacionFieldset.value
}

const handleNextStep = () => {
  emit('next-step', '/dirigir-investigacion/analizar-causas-a-agrupar/definir-especies')
}

async function getAllDelitosByManyIdDenuncia () {
  // desestructurar los delitos
  const delitos = causasRelacionadas.value.map((el) => { return el?.delitos })

  // desestructurar los ids y si hay repetidos no tomarlos en cuenta
  const idDenuncias = new Set(delitos.flatMap(arr => arr.map(obj => obj.idDenuncia)))

  // volver a transformar en un arreglo
  const uniqueIds = Array.from(idDenuncias)

  // llamar al servicio para traerme todos los delitos asociados a n causas
  await requestUtil({
    action: delito_postManyDelitosByIdDenuncia,
    payload: {
      params: {
        page: 0,
        size: 10
      },
      listaDenuncias: uniqueIds
    },
    resolve: (_res) => { console.log(_res) },
    reject: (_err) => { console.log(_err) },
    loader: (l) => { isLoadingTablaDelitos.value = l }
  })
}

async function getAllRelacionesByManyIdDenuncia () {
  // desestructurar los delitos
  const relaciones = causasRelacionadas.value.map((el) => { return el?.delitos })

  // desestructurar los ids y si hay repetidos no tomarlos en cuenta
  const idDenuncias = new Set(relaciones.flatMap(arr => arr.map(obj => obj.idDenuncia)))

  // volver a transformar en un arreglo
  const uniqueIds = Array.from(idDenuncias)

  // llamar al servicio para traerme todos los delitos asociados a n causas
  await requestUtil({
    action: relaciones_postManyRelacionesByIdDenuncia,
    payload: {
      listaDenuncias: uniqueIds
    },
    resolve: (_res) => { console.log(_res) },
    reject: (_err) => { console.log(_err) },
    loader: (l) => { isLoadingTablaRelaciones.value = l }
  })
}

const isLoadingResumenCausa = ref(false)
async function getResumenCausaSeleccionadaPrincipal () {
  await requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: { ruc: causaPrincipal.value?.ruc },
    loader: (l) => { isLoadingResumenCausa.value = l }
  })
}

onMounted(async () => {
  getResumenCausaSeleccionadaPrincipal()
  getAllDelitosByManyIdDenuncia()
  getAllRelacionesByManyIdDenuncia()
})
</script>
