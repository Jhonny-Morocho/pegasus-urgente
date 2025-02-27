<template>
<div class="grid">
  <AppFieldset
    class="col-12"
    legend="Ingresar Dirección"
  >
    <div class="col-12 md:col-4">
      <AppSelectButton
        id="modo-manual"
        v-model="modoManual"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Ingresar Manual', value: true },
          { name: 'Utilizar Mapa', value: false },
        ]"
        @change="resetDireccion()"
      />
    </div>
    <MapInput
      v-if="!modoManual"
      :auto-complete="!readOnly"
      class="col-12"
      :position="position"
      @set-map-values="setMap"
    />
    <div class="col-12">
      <div class="flex col-12 p-0">
        <AppSelectButton
          id="ubicacionRural"
          v-model="formData.ubicacionRural"
          class="col-3 p-fluid"
          :disabled="readOnly"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Es rural', value: true },
            { name: 'No', value: false },
          ]"
          @change="resetRural()"
        />
      </div>
      <div class="grid">
        <AppInput
          id="latitud"
          v-model="pos.latitud"
          class="p-fluid"
          :class="formData.ubicacionRural ? 'col-4' : 'col-3'"
          :disabled="disabled"
          label="Latitud"
          :rules="{ required }"
          @blur="disableButton = false"
        />
        <AppInput
          id="longitud"
          v-model="pos.longitud"
          class="p-fluid"
          :class="formData.ubicacionRural ? 'col-4' : 'col-3'"
          :disabled="disabled"
          label="Longitud"
          :rules="{ required }"
          @blur="disableButton = false"
        />
        <div
          v-show="formData.ubicacionRural"
          class="col-3 p-fluid"
        >
          <Button
            class="btn-primary buttonSearch"
            :disabled="disableButton"
            icon="pi pi-search"
            @click="setCoodsManualmente"
          />
        </div>
        <AppDropdown
          id="region"
          v-model="formData.region"
          class="col-12 md:col-3 p-fluid"
          :disabled="!modoManual"
          label="Región"
          option-label="descripcion"
          option-value="id"
          :options="regiones"
          :retrieve-data-action="mantenedor_getRegiones"
          :rules="{ required }"
          show-clear
          @change="getComunaOptions"
        />
        <AppDropdown
          id="comuna"
          v-model="formData.comuna"
          class="col-12 md:col-3 p-fluid"
          :disabled="!modoManual"
          label="Comuna"
          option-label="descripcion"
          option-value="id"
          :options="comunasOptions ?? comuna"
          :retrieve-data-action="mantenedor_getComunas"
          :rules="{ required }"
          show-clear
        />
        <AppInput
          id="calle"
          v-model="formData.calle"
          class="col-12 md:col-6 lg:col-3 p-fluid"
          :disabled="disabled"
          label="Calle"
          :rules="!formData.ubicacionRural ? { required } : undefined"
        />
        <AppInput
          id="numero"
          v-model="formData.numero"
          class="col-12 md:col-6 lg:col-3 p-fluid"
          :disabled="disabled"
          label="Número"
          :rules="!formData.ubicacionRural ? { required } : undefined"
        />
        <AppInput
          id="departamento-oficina"
          v-model="formData.departamentoOficina"
          class="col-12 md:col-6 lg:col-3 p-fluid"
          :disabled="readOnly"
          label="Departamento u Oficina"
        />
        <AppInput
          id="block"
          v-model="formData.block"
          class="col-12 md:col-6 lg:col-3 p-fluid"
          :disabled="readOnly"
          label="Block"
        />
        <AppInput
          id="cuadrante"
          v-model="formData.cuadrante"
          class="col-12 md:col-6 lg:col-3 p-fluid"
          :disabled="readOnly"
          label="Cuadrante"
          :rules="formData.ubicacionRural ? { required } : undefined"
        />
        <AppInput
          id="sector"
          v-model="formData.sector"
          class="col-12 md:col-6 lg:col-3 p-fluid"
          :disabled="readOnly"
          label="Sector"
        />
        <AppInput
          id="poblacion-villa"
          v-model="formData.poblacionVilla"
          class="col-12 md:col-6 lg:col-3 p-fluid"
          :disabled="readOnly"
          label="Población o Villa"
        />
        <AppInput
          id="interseccion"
          v-model="formData.interseccion"
          class="col-12 md:col-6 lg:col-3 p-fluid"
          :disabled="readOnly"
          label="Intersección"
        />
        <AppInput
          id="observacion-referencia"
          v-model="formData.observacionReferencia"
          class="col-12 md:col-6 p-fluid"
          :disabled="readOnly"
          label="Observación de referencia"
          :rules="formData.ubicacionRural ? { required } : undefined"
        />
        <AppInput
          id="lugar-especifico"
          v-model="formData.lugarEspecifico"
          class="col-12 md:col-6 p-fluid"
          :disabled="readOnly"
          label="Lugar específico"
        />
      </div>
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { defineProps, ref, computed, reactive } from 'vue'

// composables
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'

import { useMantenedorStore } from '@/modules/global/composables'

const props = defineProps({
  readOnly: Boolean
})

const { required } = useFormValidation()

const { delitoInject } = useDelitoInject()
const formData = delitoInject

const {
  regiones,
  comuna,
  mantenedor_getRegiones,
  mantenedor_getComunas,
  mantenedor_getIdRegionByNombre,
  mantenedor_getIdComunaByNombre,
  mantenedor_getComunasByIdRegion,
  mantenedor_getIdTipoDireccionByCodigo,
  mantenedor_getTiposDireccion,
  tiposDireccion
} = useMantenedorStore()

const disabled = computed(
  () => (!formData.ubicacionRural && !modoManual.value) || props.readOnly
)

const modoManual = ref(false)
const comunasOptions = ref(null)

const disableButton = ref(false)

const pos = reactive({
  latitud: 0,
  longitud: 0
})

const position = computed(() => {
  return {
    latitude: formData.latitud || 0,
    longitude: formData.longitud || 0
  }
})

function setIdTipoDireccion () {
  if (!tiposDireccion.value.length) {
    requestUtil({
      action: mantenedor_getTiposDireccion,
      resolve: () => { formData.idTipoDireccion = mantenedor_getIdTipoDireccionByCodigo('0') }
    })
  } else {
    formData.idTipoDireccion = mantenedor_getIdTipoDireccionByCodigo('0')
  }
}
setIdTipoDireccion()

async function getComunaOptions () {
  resetDireccion()
  comunasOptions.value = null
  if (formData.region) {
    requestUtil({
      action: mantenedor_getComunasByIdRegion,
      payload: { idRegion: formData.region },
      resolve: (res) => {
        comunasOptions.value = res
      }
    })
  }
}

function setMap (values) {
  const { region, comuna, calle, numero, lat, lng, emited } = values
  comunasOptions.value = null
  formData.region = mantenedor_getIdRegionByNombre(region)
  formData.comuna = mantenedor_getIdComunaByNombre(comuna)
  formData.calle = calle
  formData.numero = numero

  formData.latitud = lat.toString()
  formData.longitud = lng.toString()
  pos.latitud = lat.toString()
  pos.longitud = lng.toString()

  disableButton.value = emited
}

function resetRural () {
  formData.calle = ''
  formData.numero = ''
  formData.latitud = 0
  formData.longitud = 0
  pos.latitud = 0
  pos.longitud = 0
}

function setCoodsManualmente () {
  formData.latitud = pos.latitud
  formData.longitud = pos.longitud
}

function resetDireccion () {
  formData.comuna = ''
  formData.calle = ''
  formData.numero = ''
  formData.latitud = ''
  formData.longitud = ''
}
</script>
<style scoped>
.buttonSearch {
  width: 34px;
  height: 34px;
  border-radius: 0px 4px 4px 0px;
  border-color: rgb(214, 214, 214);
}
</style>
