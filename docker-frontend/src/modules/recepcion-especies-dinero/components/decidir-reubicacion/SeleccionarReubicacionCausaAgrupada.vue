<template>
<div class="grid col-12 md:col-6">
  <p class="col-12">
    <span class="font-bold mr-2">Fiscalía Regional:</span>{{ data?.dataCausa?.fiscaliaRegional }}
  </p>
  <p class="col-12">
    <span class="font-bold mr-2">Fiscalía Local:</span>{{ data?.dataCausa?.fiscaliaLocal }}
  </p>
</div>
<div
  v-if="esReubicacion"
  class="grid col-12 md:col-6"
>
  <p class="col-12">
    <span class="font-bold mr-2">RUC Causa Agrupada:</span>{{ data?.dataCausa?.ruc || dataReubicacion.dataCausa.causa.rolUnico }}
  </p>
  <p class="col-12">
    <span class="font-bold mr-2">RUC Causa Principal:</span>{{ data?.dataCausa?.rucPrincipal ?? data?.dataCausa?.ruc }}
  </p>
</div>
<div
  v-else
  class="grid col-12 md:col-6"
>
  <p class="col-12">
    <span class="font-bold mr-2">Familia Especie:</span>
    {{
      mantenedor_getNombreFamiliaEspecie(data.familiaEspecie ?? masData?.idFamilia)
    }}
  </p>
  <p class="col-12">
    <span class="font-bold mr-2">Tipo Especie:</span>
    {{
      tipoEspecie(data?.idTipoEspecie ?? masData?.idTipoEspecie)
    }}
  </p>
</div>
<AppForm
  id="reubicar-causa"
  class="grid w-full m-0"
  :form-submitted="formSubmitted"
  validation-scope="reubicar-causa"
>
  <span
    v-if="esReubicacion || seleccionCasillero"
    class="grid col-12"
  >
    <p
      class="mt-2 col-12"
      style="font-size: 1.2em"
    >
      Ubicación actual:
    </p>
    <div class="col-12 md:col-4">
      <p>
        <span class="font-bold mr-2">Bodega:</span>{{ props.seleccionarUbicacion?.nombreBodega || props.dataReubicacion.especie.nombreBodega }}
      </p>
    </div>
    <div class="col-12 md:col-4">
      <p>
        <span class="font-bold mr-2">Sector:</span>{{ props.seleccionarUbicacion?.nombreSector || props.dataReubicacion.especie.nombreSector }}
      </p>
    </div>
    <div class="col-12 md:col-4">
      <p>
        <span class="font-bold mr-2">Casillero:</span>{{ props.seleccionarUbicacion?.nombreCasillero|| props.dataReubicacion.especie.nombreCasillero }}
      </p>
    </div>
  </span>
  <p
    class="col-12"
    style="font-size: 1.2em"
  >
    {{ esReubiacion ? 'Seleccione Reubicación:' : 'Seleccione Ubicación:' }}
  </p>
  <AppDropdown
    id="bodega"
    v-model="form.bodega"
    class="col-12 md:col-4"
    label="Seleccione Bodega"
    option-label="nombre"
    option-value="idBodega"
    :options="bodegas"
    show-clear
  />
  <AppDropdown
    id="sector"
    v-model="form.sector"
    class="col-12 md:col-4"
    label="Seleccione Sector"
    option-label="nombre"
    option-value="idSector"
    :options="sectores"
    show-clear
  />
  <AppDropdown
    id="casillero"
    v-model="form.casillero"
    class="col-12 md:col-4"
    label="Seleccione Casillero"
    :option-disabled="tieneEspacio === false"
    option-label="nombre"
    option-value="idCasillero"
    :options="casilleros"
    show-clear
  />
  <AppBtnNextTeleported
    class="mr-2"
    :disabled="props.ubicacionRegistrada"
    icon="pi pi-arrow-right"
    icon-pos="right"
    label="Generar Etiqueta"
    @click="nextStep"
  />
</AppForm>
</template>
<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { defineProps, defineEmits, reactive, watch, defineExpose, ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useIngresoDinero } from '../../composables'

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getAllTiposEspecie,
  mantenedor_getNombreTipoEspecie
} = useMantenedorStore()

const {
  stepIngresoDinero_getGenerarEtiqueta,
  stepIngresoDinero_getBodegasByIdFiscalia,
  stepIngresoDinero_getSectoresByIdBodega,
  stepIngresoDinero_getCasillerosByIdSector,
  stepIngresoDinero_getBodegaDinero,
  rues
} = useIngresoDinero()

const props = defineProps({
  data: propTypes.object,
  masData: propTypes.object,
  seleccionarUbicacion: propTypes.object,
  dataReubicacion: propTypes.object,
  ubicacionRegistrada: {
    type: Boolean,
    default: false
  },
  esReubicacion: {
    type: Boolean,
    default: false
  },
  seleccionCasillero: {
    type: Boolean,
    default: false
  }
})

const form = reactive({
  bodega: null,
  sector: null,
  casillero: null,
  tieneEspacio: null
})

const { formSubmitted } = useFormValidation({
  form,
  validationScope: 'reubicar-causa'
})
const bodegas = ref([])
const bodegasDinero = ref([])

const sectores = ref([])

const casilleros = ref([])

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}

function getBodegas () {
  requestUtil({
    action: stepIngresoDinero_getBodegasByIdFiscalia,
    payload: {
      idFiscalia: '3fa85f64-5717-4562-b3fc-2c963f66afa2'
    },
    resolve: (res) => {
      bodegas.value = res
    }
  })
}
getBodegas()
function getBodegaDinero () {
  console.log('es data', props.data.esDinero)
  requestUtil({
    action: stepIngresoDinero_getBodegaDinero,
    payload: {
      esDinero: props.data.esDinero
    },
    resolve: (res) => {
      bodegasDinero.value.push(res)
    }
  })
}
getBodegaDinero()

watch(
  () => form.bodega,
  () => getSectores(form.bodega)
)

function getSectores (data) {
  requestUtil({
    action: stepIngresoDinero_getSectoresByIdBodega,
    payload: {
      idBodega: data
    },
    resolve: (res) => {
      sectores.value = res
    }
  })
}

watch(
  () => form.sector,
  () => getCasilleros(form.sector)
)

function getCasilleros (data) {
  requestUtil({
    action: stepIngresoDinero_getCasillerosByIdSector,
    payload: {
      idSector: data
    },
    resolve: (res) => {
      casilleros.value = res
    }
  })
}

watch(
  () => props.seleccionarUbicacion,
  () => {
    const { idBodega, idSector, idCasillero, tieneEspacio } = props.seleccionarUbicacion
    form.bodega = idBodega
    form.sector = idSector
    form.casillero = tieneEspacio ? idCasillero : null
    form.tieneEspacio = tieneEspacio
  }
)

const emit = defineEmits(['generar-etiqueta'])

function nextStep () {
  emit('generar-etiqueta', form)
  requestUtil({
    action: stepIngresoDinero_getGenerarEtiqueta,
    payload: { rue: rues.value.at(-1).RUE }
  })
}

defineExpose({ form, casilleros: casilleros })
</script>
