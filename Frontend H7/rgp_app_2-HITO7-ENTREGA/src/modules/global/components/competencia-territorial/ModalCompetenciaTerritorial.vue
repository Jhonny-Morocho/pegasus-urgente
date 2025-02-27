<template>
<hr>
<main class="pt-4 px-4">
  <AppFieldset legend="Consultar Georreferenciación">
    <section class="w-full p-fluid">
      <AppDropdown
        id="delito"
        v-model="delitoSeleccionado"
        class="col-12 md:col-6"
        label="Seleccione el delito"
        :loading="isLoading.delitos || isLoading.mantenedor"
        option-label="descripcion"
        :options="delitosOptions"
        placeholder
        show-clear
        @change="setDireccion"
      />
    </section>
    <section class="w-full">
      <MapInput
        :auto-complete="false"
        :draggable="false"
        :position="position"
      />
    </section>
    <section class="w-full p-fluid grid mt-2">
      <AppInput
        id="direccion-region"
        v-model="direccion.region"
        class="col-12 md:col-6"
        label="Región"
      />
      <AppInput
        id="direccion-comuna"
        v-model="direccion.comuna"
        class="col-12 md:col-6"
        label="Comuna"
      />
      <AppInput
        id="direccion-calle"
        v-model="direccion.calle"
        class="col-12 md:col-6"
        label="Calle"
      />
      <AppInput
        id="direccion-numero"
        v-model="direccion.numero"
        class="col-12 md:col-6"
        label="Número"
      />
    </section>
    <section class="w-full flex justify-content-center align-items-center mt-2">
      <Button
        class="px-5 btn-form"
        :disabled="!delitoSeleccionado"
        icon="pi pi-search"
        icon-pos="right"
        label="Consultar Georreferenciación"
        :loading="isLoading.consultarGeorreferencia"
        @click="consultarGeorreferencia"
      />
    </section>
  </AppFieldset>
  <AppFieldset legend="Resultado Georreferenciación">
    <TablaFiscaliaCompetente
      :loading="isLoading.consultarGeorreferencia"
      :value="fiscaliasCompetentes"
    />
  </AppFieldset>
</main>
</template>

<script setup>
import { reactive, ref, defineProps, computed, onMounted, defineExpose } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { isEmpty } from 'lodash'
import { useDelitoStore, useMantenedorStore, useGeorreferenciaStore } from '@/modules/global/composables'
import MapInput from '@/modules/common/components/inputs/MapInput.vue'
import TablaFiscaliaCompetente from './TablaFiscaliaCompetente.vue'

const props = defineProps({
  idDenuncia: propTypes.string
})

const idDenuncia = computed(() => props?.idDenuncia)

const { toastError } = useAppToast()

const { delito_getDelitoByIdDenuncia, delito_SET_DEFAULT_STATE, delitos } = useDelitoStore()

const {
  mantenedor_getComunas,
  mantenedor_getRegiones,
  mantenedor_getTiposDelito,
  mantenedor_getDescripcionComunasById,
  mantenedor_getDescripcionRegionById
} = useMantenedorStore()

const { georreferencia_getFiscaliaPorCompetenciaTerritorial } = useGeorreferenciaStore()

const delitoSeleccionado = ref()
const fiscaliasCompetentes = ref([])

const isLoading = reactive({
  delitos: false,
  consultarGeorreferencia: false,
  mantenedor: false
})

const direccion = reactive({
  calle: '',
  numero: '',
  comuna: '',
  region: '',
  latitud: 0,
  longitud: 0,
  ubicacionRural: false
})

const position = computed(() => {
  return {
    latitude: direccion.latitud,
    longitude: direccion.longitud
  }
})

const direccionDelito = computed(() => {
  if (isEmpty(delitoSeleccionado.value)) return null

  if (direccion.ubicacionRural) {
    return `${direccion?.latitud},${direccion.longitud}`
  }

  return `${direccion.calle} ${direccion.numero}, ${direccion.comuna}, ${direccion.region}`
})

function setDireccion () {
  const delito = delitoSeleccionado.value
  direccion.ubicacionRural = delito?.direccion?.ubicacionRural
  direccion.latitud = Number(delito?.direccion?.latitud)
  direccion.longitud = Number(delito?.direccion?.longitud)

  if (direccion.ubicacionRural && !delito?.direccion?.calle) {
    direccion.calle = 'Ubicación Rural'
  }

  if (delito?.direccion?.calle) {
    direccion.calle = delito?.direccion?.calle
  }

  direccion.numero = delito?.direccion?.numero || 'S/N'
  direccion.comuna = delito?.direccion?.comuna
  direccion.region = delito?.direccion?.region
}

function consultarGeorreferencia () {
  requestUtil({
    action: georreferencia_getFiscaliaPorCompetenciaTerritorial,
    payload: {
      direccion: direccionDelito.value,
      comuna: direccion.comuna,
      region: direccion.region
    },
    loader: (l) => { isLoading.consultarGeorreferencia = l },
    resolve: (data) => {
      const { descripcion } = delitoSeleccionado.value
      fiscaliasCompetentes.value = [{
        delito: descripcion,
        region: direccion.region,
        ...data
      }]
    }
  })
}

function getDelitos () {
  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        page: 0,
        size: 20
      }
    },
    loader: (l) => { isLoading.delitos = l }
  })
}

const delitosOptions = computed(() => {
  return delitos.value.map((d) => {
    return {
      descripcion: d.delito?.tipoDelito || d.delito?.familiaDelito,
      direccion: {
        ubicacionRural: d.direccionDelito?.ubicacionRural,
        comuna: comuna(d.direccionDelito?.comuna),
        region: region(d.direccionDelito?.region),
        calle: d.direccionDelito?.calle,
        numero: d.direccionDelito?.numero,
        latitud: d.direccionDelito?.latitud,
        longitud: d.direccionDelito?.longitud
      }
    }
  })
})

function comuna (idComuna) {
  return mantenedor_getDescripcionComunasById(idComuna)
}

function region (idRegion) {
  return mantenedor_getDescripcionRegionById(idRegion)
}

function getDataMantenedor () {
  requestUtil({
    action: mantenedor_getRegiones,
    loader: (l) => { isLoading.mantenedor = l }
  })
  requestUtil({
    action: mantenedor_getComunas,
    loader: (l) => { isLoading.mantenedor = l }
  })
  requestUtil({
    action: mantenedor_getTiposDelito,
    loader: (l) => { isLoading.mantenedor = l }
  })
}

onMounted(() => {
  getDataMantenedor()
  getDelitos()
  delito_SET_DEFAULT_STATE()
})

function retrieveData (retrieve) {
  if (!fiscaliasCompetentes.value.length) {
    toastError('Debes buscar una fiscalía competente')
    return
  }
  retrieve?.(fiscaliasCompetentes.value)
}

defineExpose({ retrieveData })
</script>
