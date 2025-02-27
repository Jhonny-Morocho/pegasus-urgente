<template>
<AppForm
  id="agregar-direccion"
  :form-readonly="readonly"
  :form-submitted="formSubmitted"
  validation-scope="modalDireccion"
>
  <AppFieldset
    class="margin_direcciones"
    legend="Búsqueda por Maps"
  >
    <!-- Google maps -->
    <MapInput
      v-if="useMap"
      :auto-complete="!readonly"
      class="col-12"
      :draggable="!readonly"
      :position="positionDireccion"
      @set-map-values="setMap"
    />
    <AppSelectButton
      id="useMap"
      v-model="useMap"
      option-label="name"
      option-value="value"
      :options="direccionMapa"
    />
    <div class="formgrid grid">
      <AppDropdown
        id="tipoDireccion"
        v-model="formData.tipo"
        class="col-12 md:col-3"
        label="Tipo de dirección"
        option-label="descripcion"
        option-value="id"
        :options="tiposDireccion"
        :retrieve-data-action="mantenedor_getTiposDireccion"

        :rules="{
          required,
        }"
        show-clear
      />
      <AppDropdown
        id="region"
        v-model="formData.region"
        class="col-12 md:col-3"
        :disabled="useMap"
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
        :disabled="useMap"
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
        class="p-fluid col-12 md:col-3"
        :disabled="useMap"
        label="Calle"
        :rules="{
          required,
        }"
      />
      <AppInput
        id="numero"
        v-model="formData.numero"
        class="p-fluid col-12 md:col-3"
        :disabled="useMap"
        label="Número"
        :rules="{
          required,
        }"
      />
      <AppInput
        id="tipoVivienda"
        v-model="formData.tipoVivienda"
        class="p-fluid col-3"
        label="Casa/Depto/Oficina"
      />
      <AppInput
        id="block"
        v-model="formData.block"
        class="p-fluid col-3"
        label="Block"
      />
      <AppInput
        id="cuadrante"
        v-model="formData.cuadrante"
        class="p-fluid col-3"
        label="Cuadrante"
      />
      <AppInput
        id="sector"
        v-model="formData.sector"
        class="p-fluid col-3"
        label="Sector"
      />
      <AppInput
        id="nombrePoblacionVilla"
        v-model="formData.nombrePoblacionVilla"
        class="p-fluid col-3"
        label="Población o Villa"
      />

      <AppInput
        id="interseccion"
        v-model="formData.interseccion"
        class="p-fluid col-3"
        label="Intersección"
      />
      <AppInput
        id="observacion"
        v-model="formData.observacion"
        class="p-fluid col-6"
        label="Observación de referencia"
      />
      <div
        v-if="!existeDireccionNotificacion"
        class="col-4 p-fluid"
      >
        <div class="p-field-checkbox p-2">
          <AppCheckbox
            id="indicadorDireccionNotificacion"
            v-model="formData.indicadorDireccionNotificacion"
            label="Dirección de Notificación"
          />
        </div>
      </div>
    </div>
  </AppFieldset>
</AppForm>
</template>

<script setup>
import { defineProps, defineExpose, reactive, ref } from 'vue'

// utils
import { requestUtil, appUtil } from '@/utils'

// composables
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'

// consts

const {
  regiones,
  mantenedor_getRegiones,
  comuna,
  mantenedor_getComunas,
  tiposDireccion,
  mantenedor_getTiposDireccion,
  mantenedor_getIdRegionByNombre,
  mantenedor_getIdComunaByNombre,
  mantenedor_getComunasByIdRegion
} = useMantenedorStore()

const { toastError } = useAppToast()

const useMap = ref(true)
const comunasOptions = ref(null)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  existeDireccionNotificacion: { type: Boolean, default: false },
  readonly: Boolean
})

const formData = reactive(appUtil.clone(props.data))

const positionDireccion = reactive({
  latitude: null,
  longitude: null
})

setTimeout(() => {
  positionDireccion.latitude = props.data.lat
  positionDireccion.longitude = props.data.lng
}, 500)

const { isFormValid, formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'modalDireccion'
})

function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError('Los campos no son correctos')
    return
  }
  retrieveCb?.(formData)
}

const direccionMapa = [
  { name: 'Manual', value: false },
  { name: 'Map', value: true }
]

async function getComunaOptions () {
  resetDireccion()
  comunasOptions.value = null
  if (formData.region) {
    requestUtil({
      action: mantenedor_getComunasByIdRegion,
      payload: { idRegion: formData.region },
      resolve: (res) => { comunasOptions.value = res }
    })
  }
}
const setMap = (values) => {
  if (props.readonly) return
  const { region, comuna, calle, numero, lat, lng } = values
  comunasOptions.value = null
  formData.region = mantenedor_getIdRegionByNombre(region)
  formData.comuna = mantenedor_getIdComunaByNombre(comuna)
  formData.calle = calle
  formData.numero = numero
  formData.lat = lat
  formData.lng = lng
}

function resetDireccion () {
  formData.comuna = ''
  formData.calle = ''
  formData.numero = ''
  formData.latitud = ''
  formData.longitud = ''
}
defineExpose({ retrieveData })
</script>

<style scoped>
.margin_direcciones input {
  margin: 10px;
}
</style>
