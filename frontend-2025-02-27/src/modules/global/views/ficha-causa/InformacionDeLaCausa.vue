<template>
<section class="grid">
  <div class="col-12">
    <FieldsetResumenDeLaCausa id="fieldset-resumen-de-la-causa" />

    <FieldsetInformacionDeLaDenuncia
      v-if="dataCausa.codigoTipoDenuncia == '2'"
      id="fieldset-informacion-denuncia"
    />

    <FieldsetDatosDelDenunciante
      id="fieldset-datos-denunciante"
      :data-denunciante="dataDenunciante"
      :is-loading="loading.loadingSujetos"
    />

    <FieldsetListaDeIntervinientes
      id="fieldset-intervinientes"
      :data-intervinientes="dataSujetosintervinientes"
      :loading="loading.loadingSujetos"
    />

    <FieldsetDelitos
      id="fieldset-delitos"
      class="w-full"
      :data-delitos="dataDelitos"
      :loading="loading.loadingDelito"
    />

    <FieldsetRelaciones
      id="fieldset-relaciones"
      class="w-full"
      :data-relaciones="dataRelaciones"
      :loading="loading.loadingRelaciones"
    />

    <FieldsetRelatoDelHecho
      id="fieldset-relato"
      class="w-full"
      :data-causa="dataRelato"
      :loading="loading.loadingRelato"
    />

    <FieldsetListaEspeciesDinero
      id="fieldset-especies-dinero"
      class="w-full clasePrueba"
      :data-especies-dinero="dataEspeciesDinero"
      :loading="loading.loadingEspecies"
    />
    <FieldsetDiligencias
      id="fieldset-diligencias"
      class="w-full"
      :data-diligencias="[]"
    />

    <FieldsetAnotaciones
      id="fieldset-anotacinoes"
      class="w-full"
      :data-anotaciones="dataAnotaciones"
      :loading="loading.loadingAnotaciones"
    />

    <FieldsetAudiencias
      id="fieldset-audiencias"
      class="w-full"
      :data-audiencias="dataAudiencias"
    />
    <FieldsetCausasAgrupadas
      id="fieldset-causas-agrupadas"
      class="w-full"
      :data-causas-agrupadas="dataCausasAgrupadas"
    />
  </div>
</section>
</template>

<script setup>
import FieldsetResumenDeLaCausa from '@/modules/global/components/ficha-causa/FieldsetResumenDeLaCausa.vue'
import FieldsetInformacionDeLaDenuncia from '@/modules/global/components/ficha-causa/FieldsetInformacionDeLaDenuncia.vue'
import FieldsetDatosDelDenunciante from '@/modules/global/components/ficha-causa/FieldsetDatosDelDenunciante.vue'
import FieldsetListaDeIntervinientes from '@/modules/global/components/ficha-causa/FieldsetListaDeIntervinientes.vue'
import FieldsetDelitos from '@/modules/global/components/ficha-causa/FieldsetDelitos.vue'
import FieldsetRelaciones from '@/modules/global/components/ficha-causa/FieldsetRelaciones.vue'
import FieldsetRelatoDelHecho from '@/modules/global/components/ficha-causa/FieldsetRelatoDelHecho.vue'
import FieldsetListaEspeciesDinero from '@/modules/global/components/ficha-causa/FieldsetListaEspeciesDinero.vue'
import FieldsetDiligencias from '@/modules/global/components/ficha-causa/FieldsetDiligencias.vue'

import FieldsetAnotaciones from '@/modules/global/components/ficha-causa/FieldsetAnotaciones.vue'
import FieldsetAudiencias from '@/modules/global/components/ficha-causa/FieldsetAudiencias.vue'
import FieldsetCausasAgrupadas from '@/modules/global/components/ficha-causa/FieldsetCausasAgrupadas.vue'

import { useDelitoStore, useEspeciesDineroStore, useFichaCausaStore, useMantenedorStore, useRelacionesStore, useRelatoStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { computed, onMounted, reactive, ref } from 'vue'
import { useCrearCausaStore } from '@/modules/ingreso/composables'

const { causaSeleccionada } = useFichaCausaStore()
const { sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()
const { relaciones_getRelaciones } = useRelacionesStore()
const { relato_getRelatoByIdDenuncia, relato } = useRelatoStore()
const { especiesDinero_getEspecieByIdDenuncia, especies } = useEspeciesDineroStore()
const { delito_getDelitoByIdDenuncia } = useDelitoStore()
const { mantenedor_getIdTipoSujetoByCodigo } = useMantenedorStore()
const { causa } = useCrearCausaStore()

const dataSujetosintervinientes = ref([])
const dataRelaciones = ref([])
const dataRelato = ref({})
const dataEspeciesDinero = ref([])
const dataDelitos = ref([])
const dataAnotaciones = ref([])

const dataCausa = computed(() => {
  return causa.value ? causa.value : causaSeleccionada.value
})

const dataDenunciante = computed(() => {
  return dataSujetosintervinientes.value.filter((s) => s.tipoSujeto === mantenedor_getIdTipoSujetoByCodigo('1'))
})

const loading = reactive({
  loadingSujetos: false,
  loadingDelito: false,
  loadingRelaciones: false,
  loadingRelato: false,
  loadingEspecies: false,
  loadingAnotaciones: false
})

onMounted(() => {
  setSujetos()
  setDelitos()
  setRelaciones()
  setRelato()
  setEspecies()
})
function setRelaciones () {
  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: dataCausa.value.idDenuncia },
    loader: (l) => { loading.loadingRelaciones = l },
    resolve: (r) => {
      dataRelaciones.value = r.data
      console.log('Relaciones Obtenidas:', dataRelaciones.value)
    }
  })
}

function setSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: dataCausa.value.idDenuncia },
    loader: (l) => { loading.loadingSujetos = l },
    resolve: ({ data }) => {
      dataSujetosintervinientes.value = data
      console.log('Sujetos Obtenidos:', dataSujetosintervinientes.value)
    }
  })
}
function setDelitos () {
  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: { idDenuncia: dataCausa.value.idDenuncia },
    loader: (l) => { loading.loadingDelito = l },
    resolve: ({ data }) => {
      dataDelitos.value = data
      console.log('Delitos Obtenidos:', dataDelitos.value)
    }
  })
}
function setRelato () {
  console.log(dataCausa.value)
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: { idDenuncia: dataCausa.value.idDenuncia },
    loader: (l) => { loading.loadingRelato = l },
    resolve: () => {
      dataRelato.value = relato.value
      console.log('Relato Obtenido:', dataRelato.value)
    }
  })
}

function setEspecies () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: dataCausa.value.idDenuncia },
    loader: (l) => { loading.loadingEspecies = l },
    resolve: () => {
      dataEspeciesDinero.value = especies.value
      console.log('Especies Obtenidas:', dataEspeciesDinero.value)
    }
  })
}

</script>
