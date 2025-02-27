<template>
<section>
  <AgregarMedidasCautelares
    :is-loading="isLoading"
    :medidas-cautelares="[]"
    :rows="rows"
    :total-records="paginacion.paginasTotales"
  />
</section>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { requestUtil } from '@/utils'

// composables
import {
  useMantenedorStore,
  useRelacionesStore
} from '@/modules/global/composables'

// components
import AgregarMedidasCautelares from '@/modules/solicitudes/components/medidas-cautelares/AgregarMedidasCautelares.vue'
import { useSolicitudesStore } from '../composables'

const { idDenuncia } = useSolicitudesStore()

const { relaciones_getRelacionesConMedidasCautelares } = useRelacionesStore()

const { medidasCautelares, mantenedor_getListadoMedidasCautelares } =
  useMantenedorStore()

const isLoading = ref(false)

const relacionesConMedidas = ref([])

const paginacion = reactive({
  elementosTotales: 0,
  paginaActual: 0,
  paginasTotales: 0,
  tamanoPagina: 10
})

onMounted(async () => {
  if (medidasCautelares.value?.length === 0) {
    await requestUtil({ action: mantenedor_getListadoMedidasCautelares })
  }
  obtenerListaMedidasCautelares()
})

async function obtenerListaMedidasCautelares () {
  requestUtil({
    action: relaciones_getRelacionesConMedidasCautelares,
    payload: {
      idDenuncia: idDenuncia.value,
      medidaCodigo: 0, // MEDIDA_CAUTELAR = 0, MEDIDAS_INTRUSIVAS = 1 y MEDIDAS_PROTECCION = 2
      relacionesIds: ['159f8afc-a388-43c4-a771-ce422dca1545'], // id relacion de prueba, siempre devuelve medidas
      estados: [0, 1, 2]
    },
    resolve: ({ data }) => {
      // Por ahora se guarda y se setea en la misma vista
      relacionesConMedidas.value = data?.data
      paginacion.value = data?.paginacion
    },
    loader: (l) => (isLoading.value = l)
  })
}
</script>
