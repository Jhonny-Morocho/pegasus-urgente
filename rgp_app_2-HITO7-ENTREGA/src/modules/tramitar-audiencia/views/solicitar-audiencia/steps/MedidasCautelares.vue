<template>
<AppFieldset legend="Medidas Cautelares Vigentes">
  <div
    v-if="loader"
    class="col-12"
  >
    <LoaderSkeleton />
  </div>
  <TablaMedidasCautelares
    v-else
    readonly
    :value="antecedentesAudiencia?.medidasCautelares"
  />
</AppFieldset>
<AppFieldset
  :collapsed="loader"
  legend="Agregar Medida Cautelar"
>
  <FormAgregarMedidasCautelares
    class="w-full"
    :lista-imputados="imputados"
    :opciones-medidas-cautelares="medidasCautelares"
    @medidas:agregar="addMedidaCautelar"
  />
  <h3 class="mb-6">
    Medidas Cautelares a Solicitar
  </h3>
  <TablaMedidasCautelares
    :tiene-acciones="(tieneAcciones = true)"
    :value="medidasCautelares"
    @medidas:eliminar="deleteMedidaCautelar"
  />
</AppFieldset>
<AppBtnRightTeleported>
  <Button
    class="btn-primary px-5"
    icon="pi pi-arrow-right"
    icon-pos="right"
    label="Escrito de Solicitud"
    @click="handleNextStep"
  />
</AppBtnRightTeleported>
</template>
<script setup>
import TablaMedidasCautelares from '@/modules/tramitar-audiencia/components/tables/TablaMedidasCautelares.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import FormAgregarMedidasCautelares from '@/modules/tramitar-audiencia/components/FormAgregarMedidasCautelares.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import { useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { requestUtil } from '@/utils'
import { onMounted, ref } from 'vue-demi'
import { useMantenedorStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const {
  medidasCautelares,
  tramitarAudiencia_getAntecedentesAudiencia,
  tramitarAudiencia_SET_MEDIDAS_CAUTELARES,
  tramitarAudiencia_DELETE_MEDIDA_CAUTELAR,
  idDenuncia
} = useTramitarAudiencia()

/* IMPUTADO */
const { sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

const {
  mantenedor_getCodigoTipoSujeto,
  mantenedor_getTiposSujetos,
  mantenedor_getListadoMedidasCautelares
} = useMantenedorStore()

const isLoading = ref(false)

const imputados = ref([])

function getSujetos (pagination = undefined) {
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: idDenuncia.value, params },
    // loader: (l) => (tables.sujetos.isLoading = l),
    resolve: (sujetos) => {
      sujetos.data.forEach((s) => { s.tipoSujeto = mantenedor_getCodigoTipoSujeto(s?.tipoSujeto) })
      imputados.value = sujetos.data.filter((s) => s.tipoSujeto === '3')
    },
    loader: (l) => {
      isLoading.value = l
    }
  })
}

/* ANTECEDENTES AUDIENCIA */

const antecedentesAudiencia = ref()
async function getAntecedentesAudiencia () {
  requestUtil({
    action: tramitarAudiencia_getAntecedentesAudiencia,
    reject: (e) => console.error(e),
    resolve: (antecedentes) => {
      antecedentesAudiencia.value = antecedentes
      loader.value = false
    }
  })
}

/* MEDIDAS CAUTELARES */

async function addMedidaCautelar (medida) {
  // guarda en store y despliega en la tabla
  const medidaCautelar = reactive({
    medida: medida.medidaCautelar,
    imputado: medida.imputado,
    descripcionMedidaCautelar: medida.descripcion
  })
  requestUtil({
    action: tramitarAudiencia_SET_MEDIDAS_CAUTELARES,
    payload: medidaCautelar
  })
}

async function deleteMedidaCautelar (data) {
  requestUtil({
    action: tramitarAudiencia_DELETE_MEDIDA_CAUTELAR,
    payload: data
  })
}

function handleNextStep () {
  router.push('/tramitar-audiencia/solicitar-audiencia/elaborar-escrito')
}

const loader = ref(true)

onMounted(async () => {
  getAntecedentesAudiencia()
  getSujetos()
  requestUtil({ action: mantenedor_getTiposSujetos })
  requestUtil({ action: mantenedor_getListadoMedidasCautelares })
})
</script>
