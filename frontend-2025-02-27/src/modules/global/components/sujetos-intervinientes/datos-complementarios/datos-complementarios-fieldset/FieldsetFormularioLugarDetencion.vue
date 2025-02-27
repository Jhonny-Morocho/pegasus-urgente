<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Lugar de Detención"
>
  <div class="col-12 md:col-6 lg:col-3 text-center">
    <h4>¿El Imputado se encuentra detenido?</h4>
    <AppSelectButton
      id="seEncuentraDetenido"
      v-model="form.estaDetenido"
      class="mb-3"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
      :rules="{ required }"
      @change="resetCampos"
    />
  </div>
  <AppFieldset
    v-if="form.estaDetenido"
    class="mt-3"
    legend="Lugar de detención"
    :toggleable="true"
  >
    <div class="col-12">
      <MapInput
        v-if="useMap"
        :auto-complete="!form.readonly"
        :draggable="!form.readonly"
        @set-map-values="setMap"
      />
      <div class="grid">
        <AppSelectButton
          id="useMap"
          v-model="useMap"
          class="col-12 md:col-6 lg:col-3"
          option-label="name"
          option-value="value"
          :options="direccionMapa"
        />
        <div class="grid">
          <AppDropdown
            id="region"
            v-model="form.regionDeDetencion"
            class="col-12 md:col-3"
            :disabled="useMap"
            label="Región"
            option-label="descripcion"
            option-value="id"
            :options="regiones"
            :retrieve-data-action="mantenedor_getRegiones"
            :rules="{ required }"
            show-clear
            @change="setLugarDetencionManual"
          />
          <AppDropdown
            id="comuna"
            v-model="form.comunaDeDetencion"
            class="col-12 md:col-3 p-fluid"
            :disabled="useMap"
            label="Comuna"
            option-label="descripcion"
            option-value="id"
            :options="useMap ? comuna : comunasOption"
            :retrieve-data-action="mantenedor_getComunas"
            :rules="{ required }"
            show-clear
            @change="setLugarDetencionManual"
          />
          <AppInput
            id="calle"
            v-model="form.calleDetencion"
            class="col-12 md:col-6 lg:col-3"
            :disabled="useMap"
            label="Calle"
            :rules="{ required }"
            @change="setLugarDetencionManual"
          />
          <AppInput
            id="numero"
            v-model="form.numeroCalledetencion"
            class="col-12 md:col-6 lg:col-3"
            :disabled="useMap"
            label="Número"
            :rules="{ required }"
            @change="setLugarDetencionManual"
          />

          <AppInput
            id="poblacion"
            v-model="form.poblacionDetencion"
            class="col-12 md:col-6 lg:col-3"
            label="Población"
            :rules="{
              required,
            }"
          />

          <AppInput
            id="casaDeptoOficina"
            v-model="form.tipoViviendaDetencion"
            class="col-12 md:col-6 lg:col-3"
            label="Casa/Depto./Oficina"
            :rules="{
              required,
            }"
          />

          <AppInput
            id="cuadrante"
            v-model="form.cuadranteDetencion"
            class="col-12 md:col-6 lg:col-3"
            label="Cuadrante"
            :rules="{
              required,
            }"
          />

          <AppInput
            id="sector"
            v-model="form.sectorDetencion"
            class="col-12 md:col-6 lg:col-3"
            label="Sector"
            :rules="{
              required,
            }"
          />

          <AppInput
            id="block"
            v-model="form.blockDetencion"
            class="col-12 md:col-6 lg:col-3"
            label="Block"
            :rules="{
              required,
            }"
          />

          <AppInput
            id="interseccion"
            v-model="form.interseccionDetencion"
            class="col-12 md:col-6 lg:col-3"
            label="Intersección"
            :rules="{
              required,
            }"
          />

          <AppInput
            id="observacionReferencia"
            v-model="form.referenciaDetencion"
            class="col-12 md:col-6 lg:col-3"
            label="Observación de referencia"
            :rules="{
              required,
            }"
          />

          <AppCalendar
            id="fechaHoraDetencion"
            v-model="form.fechaHoraDetencion"
            class="col-12 md:col-6 lg:col-3"
            date-format="dd-mm-yy"
            label="Fecha y Hora de la detención"
            :rules="{
              required,
            }"
            :show-button-bar="true"
            :show-icon="true"
            :show-time="true"
          />

          <AppDropdown
            id="causaDeLaDetencion"
            v-model="form.causaDetencion"
            class="col-12 md:col-6 lg:col-3 mt-auto"
            label="Causa de la detención"
            option-label="descripcion"
            option-value="id"
            :options="causaDetencion"
            :retrieve-data-action="mantenedor_getCausaDetencion"
            :rules="{
              required,
            }"
            show-clear
          />

          <div class="col-12 md:col-6 lg:col-3">
            <h4 class="mb-2">
              ¿Pasa a Control de Detención?(*)
            </h4>
            <span>
              <AppSelectButton
                id="pasoControlDetencion"
                v-model="form.pasaControlDetencion"
                option-label="name"
                option-value="value"
                :options="options"
                :rules="{
                  required,
                }"
              />
            </span>
          </div>
          <AppDropdown
            id="destinoImputado"
            v-model="form.destinoImputado"
            class="col-12 md:col-6 lg:col-3 mt-auto"
            :disabled="!form.pasaControlDetencion"
            label="Destino del Imputado"
            option-label="name"
            option-value="name"
            :options="[
              { name: 'Mantiene la detención' },
              { name: 'Dejar en libertad' },
            ]"
            :rules="
              form.pasaControlDetencion
                ? {
                  required,
                }
                : undefined
            "
            show-clear
          />
          <div class="col-12 md:col-6 lg:col-3">
            <h4 class="mb-2">
              ¿Muerte bajo custodia?(*)
            </h4>
            <span>
              <AppSelectButton
                id="muerteBajoCustodia"
                v-model="form.muertesBajoCustodia"
                option-label="name"
                option-value="value"
                :options="options"
                :rules="{
                  required,
                }"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </AppFieldset>
</AppFieldset>
</template>

<script setup>
import { computed, ref } from 'vue'

// composables
import { useFormValidation } from '@/modules/common/composables'

import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useMantenedorStore } from '@/modules/global/composables'
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const form = sujetosIntervinientesInject

const useMap = ref(true)

const {
  regiones,
  comuna,
  mantenedor_getRegiones,
  mantenedor_getComunas,
  mantenedor_getIdRegionByNombre,
  mantenedor_getIdComunaByNombre,
  mantenedor_getDescripcionRegionById,
  mantenedor_getDescripcionComunasById,
  mantenedor_getCausaDetencion,
  causaDetencion
} = useMantenedorStore()

const comunasOption = computed(() => {
  return comuna.value.filter((c) => c.idPadre === form.regionDeDetencion)
})

function setLugarDetencionManual () {
  form.lugarDetencion = `${form.calleDetencion} ${
    form.numeroCalledetencion
  }, ${mantenedor_getDescripcionComunasById(
    form.comunaDeDetencion
  )}, ${mantenedor_getDescripcionRegionById(form.regionDeDetencion)}`
}

const setMap = (values) => {
  const { region, comuna, calle, numero, lat, lng } = values

  form.regionDeDetencion = mantenedor_getIdRegionByNombre(region)
  form.comunaDeDetencion = mantenedor_getIdComunaByNombre(comuna)
  form.calleDetencion = calle
  form.numeroCalledetencion = numero
  form.lat = lat
  form.lng = lng
  form.lugarDetencion = `${calle} ${numero}, ${comuna}, ${region}`
}

const options = [
  { name: 'Si', value: true },
  { name: 'No', value: false }
]

const direccionMapa = [
  { name: 'Manual', value: false },
  { name: 'Map', value: true }
]
const { required } = useFormValidation()

function resetCampos () {
  if (!form.estaDetenido) {
    form.regionDeDetencion = null
    form.comunaDeDetencion = null
    form.calleDetencion = ''
    form.numeroCalledetencion = ''
    form.poblacionDetencion = ''
    form.tipoViviendaDetencion = ''
    form.cuadranteDetencion = ''
    form.sectorDetencion = ''
    form.blockDetencion = ''
    form.interseccionDetencion = ''
    form.referenciaDetencion = ''
    form.fechaHoraDetencion = null
    form.causaDetencion = null
    form.pasaControlDetencion = null
    form.destinoImputado = null
    form.muertesBajoCustodia = null
    form.lugarDetencion = ''
  }
}
</script>
