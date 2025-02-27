<template>
<section>
  <AgregarMedidasCautelares
    :delete-medidas-callback="deleteMedidaCautelar"
    :is-loading="isLoading"
    :lista-imputados="listaImputados"
    :medidas-cautelares="[]"
    :rows="rows"
    :total-records="paginacion.paginasTotales"
  />

  <AppBtnNextTeleported
    class="ml-8 px-5"
    icon="pi pi-arrow-right"
    icon-pos="right"
    label="Escrito de Solicitud"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { onMounted, ref, inject, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'

// composables
import { useMantenedorStore, useRelacionesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

// components
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AgregarMedidasCautelares from '@/modules/solicitudes/components/medidas-cautelares/AgregarMedidasCautelares.vue'

const router = useRouter()

const {
  ruc,
  idDenuncia,
  dirigirInvestigacion_delEliminarMedidaCautelar
} = useDirigirInvestigacionStore()

const {
  relaciones_getRelacionesConMedidasCautelares
} = useRelacionesStore()

const {
  medidasCautelares,
  mantenedor_getListadoMedidasCautelares
} = useMantenedorStore()

const listaImputados = inject('listaImputados')

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

async function deleteMedidaCautelar (id) {
  requestUtil({
    action: dirigirInvestigacion_delEliminarMedidaCautelar,
    payload: {
      ruc: ruc.value,
      idMedidaCautelar: id
    },
    loader: (l) => (isLoading.value = l),
    resolve: async () => {
      obtenerListaMedidasCautelares()
    }
  })
}

function handleNextStep () {
  // Enviar a vista escrito solicitud correspondiente a la solicitud
  // Refactorizar utilizando solicitudes Dinamicas (formkit)
  if (router.currentRoute.value.path.includes('solicitar-audiencia-formalizacion')) {
    router.push({ name: 'DISAFElaborarSolicitudAudiencia' })
  } else if (router.currentRoute.value.path.includes('solicitar-medidas-cautelares-intrusivas')) {
    router.push({ name: 'DISODElaborarSolicitudAudiencia' })
  } else if (router.currentRoute.value.path.includes('solicitar-orden-detencion')) {
    router.push({ name: 'DISMCIElaborarSolicitudMedidasCautelares' })
  }
}
</script>
