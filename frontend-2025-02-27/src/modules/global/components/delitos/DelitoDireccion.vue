<template>
<AppFieldset legend="Ingresar dirección">
  <div class="col-12 md:col-3">
    <AppSelectButton
      id="direccionManualMap"
      v-model="direccionManualMap"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Manual', value: true },
        { name: 'Mapa', value: false }
      ]"
    />
  </div>

  <MapInput
    v-if="!direccionManualMap"
    class="col-12"
    @set-map-values="setMap"
  />

  <div class="col-12">
    <div class="grid">
      <AppInput
        v-if="!direccionManualMap"
        id="region"
        v-model="form.region"
        class="col-12 md:col-6 lg:col-3"
        disabled
        label="Región"
        :rules="{
          required
        }"
      />
      <AppDropdown
        v-else
        id="region"
        v-model="form.region"
        class="col-12 md:col-6 lg:col-3"
        label="Seleccione la Región"
        option-label="nombre"
        option-value="codigo"
        :options="regiones"
        :rules="{
          required
        }"
        show-clear
      />
      <AppInput
        v-if="!direccionManualMap"
        id="comuna"
        v-model="form.comuna"
        class="col-12 md:col-6 lg:col-3"
        disabled
        label="Comuna"
        :rules="{
          required
        }"
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
      />
      <AppInput
        id="calle"
        v-model="form.calle"
        class="col-12 md:col-6 lg:col-3"
        :disabled="!direccionManualMap"
        label="Calle"
        :rules="{
          required
        }"
      />
      <AppInput
        id="numero"
        v-model="form.numero"
        class="col-12 md:col-6 lg:col-3"
        :disabled="!direccionManualMap"
        label="Número"
        :rules="{
          required
        }"
      />
      <AppInput
        id="departamentoOficina"
        v-model="form.departamentoOficina"
        class="col-12 md:col-6 lg:col-3"
        label="Departamento u Oficina"
      />
      <AppInput
        id="block"
        v-model="form.block"
        class="col-12 md:col-6 lg:col-3"
        label="Block"
      />
      <AppInput
        id="cuadrante"
        v-model="form.cuadrante"
        class="col-12 md:col-6 lg:col-3"
        label="Cuadrante"
      />
      <AppInput
        id="sector"
        v-model="form.sector"
        class="col-12 md:col-6 lg:col-3"
        label="Sector"
      />
      <AppInput
        id="poblacionVilla"
        v-model="form.poblacionVilla"
        class="col-12 md:col-6 lg:col-3"
        label="Población o Villa"
      />
      <AppInput
        id="interseccion"
        v-model="form.interseccion"
        class="col-12 md:col-6 lg:col-3"
        label="Intersección"
      />
      <AppInput
        id="observacionReferencia"
        v-model="form.observacionReferencia"
        class="col-12 md:col-6"
        label="Observación de referencia"
      />
      <div class="col-12 md:col-6 lg:col-3 p-fluid">
        <AppInput
          id="lat"
          v-model="form.latitud"
          class="p-fluid"
          disabled
          label="Latitud"
        />
      </div>
      <div class="col-12 md:col-6 lg:col-3 p-fluid">
        <AppInput
          id="lng"
          v-model="form.longitud"
          class="p-fluid"
          disabled
          label="Longitud"
        />
      </div>
      <AppInput
        id="lugarEspecifico"
        v-model="form.lugarEspecifico"
        class="col-12 md:col-6"
        label="Lugar específico"
      />
      <AppCheckbox
        id="esPrincipal"
        v-model="form.esPrincipal"
        class="col-12 md:col-3"
        label="¿Es dirección principal?"
      />
      <AppCheckbox
        id="esRural"
        v-model="form.esRural"
        class="col-12 md:col-3"
        label="Ubicacion Rural"
      />
    </div>
  </div>
</AppFieldset>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useMantenedorStore } from '../../composables'

const direccionManualMap = ref(false)

const { required } = useFormValidation()

const { mantenedor_getIdRegionByNombre, mantenedor_getIdComunaByNombre, mantenedor_getRegiones, mantenedor_getComunas, regiones, comunas } = useMantenedorStore()
const { delitoInject } = useDelitoInject()

console.lotg('dsada', regiones.value)
const form = delitoInject.direccion

const getRegionesComunas = () => {
  requestUtil({
    action: mantenedor_getRegiones
  })
  requestUtil({
    action: mantenedor_getComunas
  })
}
getRegionesComunas()

const comunasOption = computed(() => {
  return comunas.value.filter((comuna) => comuna.codigo.substring(0, 2) === form.region)
})
console.log(comunasOption)
const setMap = (values) => {
  const { region, comuna, calle, numero, lat, lng } = values

  form.region = mantenedor_getIdRegionByNombre(region)
  form.comuna = mantenedor_getIdComunaByNombre(comuna)
  form.calle = calle
  form.numero = numero
  form.lat = lat
  form.lng = lng
}
</script>
