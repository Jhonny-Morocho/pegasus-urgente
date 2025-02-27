<template>
<div class="grid col-12">
  <div class="field col-12 md:col-6 lg:col-4">
    <span class="p-float-label">
      <AppDropdown
        id="aQuienRepresetaElAbogado"
        v-model="form.tipoSujetoQueRepresenta"
        class="col-12"
        label="¿A quién representa el Abogado?"
        option-label="descripcion"
        option-value="id"
        :options="tipoRepresentado"
        :retrieve-data-action="mantenedor_getTipoRepresentado"
        show-clear
      />
    </span>
  </div>
  <div class="col-12 md:col-6 lg:col-4">
    <span class="p-float-label">
      <AppInput
        id="nombreDelRepresentado"
        v-model="form.nombreDelRepresentado"
        class="col-12"
        label="Nombre del representado"
        :rules="{ alfabetico }"
      />
    </span>
  </div>
  <div class="col-12 md:col-6 lg:col-4">
    <span class="p-float-label">
      <AppInput
        id="apellidoDelRepresentado"
        v-model="form.apellidoDelRepresentado"
        class="col-12"
        label="Apellido del representado"
        :rules="{ alfabetico }"
      />
    </span>
  </div>
  <div class="field col-12 md:col-6 lg:col-4">
    <span class="p-float-label">
      <AppDropdown
        id="aQueInstuitucionPertenece"
        v-model="form.tipoInstitucionQuePertenece"
        class="col-12"
        label="¿A qué tipo de institución pertenece?"
        option-label="descripcion"
        option-value="id"
        :options="tipoInstitucionPerteneciente"
        :retrieve-data-action="mantenedor_getTipoInstitucionPerteneciente"
        show-clear
      />
    </span>
  </div>
  <div
    v-if="form.tipoInstitucionQuePertenece === mantenedor_getIdTipoInstitucionPertenecienteByCodigo('6')"
    class="col-12 md:col-6 lg:col-4"
  >
    <span class="p-float-label">
      <AppInput
        id="otraInstitucion"
        v-model="form.otraInstitucion"
        class="col-12"
        label="Otro"
      />
    </span>
  </div>
  <div class="col-12 md:col-6 lg:col-4">
    <span class="p-float-label">
      <AppInput
        id="nombreEspecificoInstitucion"
        v-model="form.nombreInstitucionQuePertenece"
        class="col-12"
        label="Nombre específico de institución donde trabaja"
      />
    </span>
  </div>
  <div class="field col-12 md:col-6 lg:col-4">
    <span class="p-float-label">
      <AppDropdown
        id="acreditacionRepresentacion"
        v-model="form.comoAcreditaRepresentacion"
        class="col-12"
        label="Como acredita su representación"
        option-label="descripcion"
        option-value="id"
        :options="tipoAcreditacion"
        :retrieve-data-action="mantenedor_getTipoAcreditacion"
        show-clear
      />
    </span>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const { alfabetico } = useFormValidation()

const {
  tipoRepresentado, mantenedor_getTipoRepresentado,
  tipoInstitucionPerteneciente, mantenedor_getTipoInstitucionPerteneciente,
  tipoAcreditacion, mantenedor_getTipoAcreditacion,
  mantenedor_getIdTipoInstitucionPertenecienteByCodigo,
  mantenedor_getCodigoTipoSujeto
} = useMantenedorStore()

const form = sujetosIntervinientesInject

const esAbogado = computed(() => mantenedor_getCodigoTipoSujeto(form.tipoSujeto) === '21')

form.esAbogado = esAbogado.value
</script>
