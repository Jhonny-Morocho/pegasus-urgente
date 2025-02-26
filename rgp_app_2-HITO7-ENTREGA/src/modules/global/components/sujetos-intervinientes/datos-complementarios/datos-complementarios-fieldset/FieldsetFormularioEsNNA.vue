<template>
<AppFieldset
  class="col-12 pb-3"
  legend="NNA"
>
  <!--  VICTIMA -->
  <template v-if="victima">
    <div class="col-12 md:col-9 lg:col-4 text-center">
      <h4>¿Es NNA?(*)</h4>
      <span>
        <AppSelectButton
          id="esNNALaVictima"
          v-model="form.esNNA"
          option-label="descripcion"
          option-value="id"
          :options="filterTipoRespuestaBasicaNNA"
          :rules="{ required }"
          @change="resetCamposVictima"
        />
      </span>
    </div>
    <AppDropdown
      v-if="esDistintoDeNo"
      id="conQuienVive"
      v-model="form.conQuienVive"
      class="col-12 md:col-6 lg:col-3 mt-auto"
      label="¿Con quién vive?"
      option-label="descripcion"
      option-value="id"
      :options="tipoNnaResponsable"
      :retrieve-data-action="mantenedor_getTipoNnaResponsable"
      show-clear
      @change="resetEspecifique"
    />
    <AppInput
      v-if="
        (form?.conQuienVive ===
          mantenedor_getTipoNnaResponsableByCodigo('7') &&
          esDistintoDeNo) ||
          (form?.conQuienVive ===
            mantenedor_getTipoNnaResponsableByCodigo('4') &&
            esDistintoDeNo) ||
          (form.conQuienVive ===
            mantenedor_getTipoNnaResponsableByCodigo('3') &&
            esDistintoDeNo)
      "
      id="espeficConQuienVive"
      v-model="form.especifiqueConQuienVive"
      class="col-12 md:col-6 lg:col-4 mt-auto"
      label="Especifíque"
    />
  </template>

  <!-- DENUNCIANTE -->
  <template v-if="denunciante">
    <div class="col-12 md:col-9 lg:col-4 text-center">
      <h4>¿Es NNA? (*)</h4>
      <span>
        <AppSelectButton
          id="esNNA"
          v-model="form.esNNA"
          option-label="descripcion"
          option-value="id"
          :options="filterTipoRespuestaBasicaNNA"
          :rules="{ required }"
          @change="resetCamposDenunciante"
        />
      </span>
    </div>
    <AppDropdown
      v-if="mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) === '1'"
      id="idNnaParentesco"
      v-model="form.idNnaParentesco"
      class="col-12 lg:col-7 mt-auto"
      label="Indicar parentesco, vínculo o relación con niño, niña o adolencente"
      option-label="descripcion"
      option-value="id"
      :options="parentesco"
      :retrieve-data-action="mantenedor_getParentesco"
      :rules="esNNA ? { required } : undefined"
      show-clear
    />
    <AppInput
      v-if="mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) === '1'"
      id="nnaAQuienContoHechosDenunciante"
      v-model="form.nnaAQuienContoHechos"
      class="col-12 lg:col-7 mt-auto"
      label="Persona(s) a quien(es) el niño, niña o adolescente contó los hechos
            (si es que los contó)"
      :rules="esNNA ? { required } : undefined"
    />
    <AppDropdown
      id="esEldenuncianteProtectorDeLaVictima"
      v-model="form.nnaEsAdultoProtector"
      class="col-12 lg:col-5"
      :class="{ 'mt-auto': !esNNA }"
      label="¿Es el Denunciante el adulto protector/referente de la Víctima?"
      option-label="descripcion"
      option-value="id"
      :options="filterTipoRespuestaBasicaNNA"
      :rules="esNNA ? { required } : undefined"
      show-clear
    />
    <AppTextarea
      id="describaComoSupo"
      v-model="form.nnaComoSupoHechos"
      class="col-12"
      cols="50"
      label="Describa como supo ud. de los hechos"
      rows="2"
      :rules="esNNA ? { required } : undefined"
    />
  </template>
</AppFieldset>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

import { useMantenedorStore } from '@/modules/global/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useFormValidation } from '@/modules/common/composables'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const {
  mantenedor_getCodigoTipoSujeto,
  mantenedor_getParentesco,
  parentesco,
  mantenedor_getTipoNnaResponsable,
  tipoNnaResponsable,
  mantenedor_getTipoNnaResponsableByCodigo,
  tipoRespuestaBasica,
  mantenedor_getCodigoTipoRespuestaBasicaById
} = useMantenedorStore()

const { required } = useFormValidation()

const form = sujetosIntervinientesInject
const esNNA = ref(false)

const tipoSujeto = computed(() =>
  mantenedor_getCodigoTipoSujeto(form.tipoSujeto)
)

const filterTipoRespuestaBasicaNNA = computed(() => {
  const fixedLabel = tipoRespuestaBasica.value.map((e) => {
    if (e.descripcion.includes('No Consultado')) {
      return { ...e, descripcion: 'No Informado' }
    }
    return e
  })
  return fixedLabel.filter((respuesta) => respuesta.codigo !== '4')
})

const victima = ref(tipoSujeto.value === '6' || form.tipoSujeto === '6')
const denunciante = ref(tipoSujeto.value === '1' || form.tipoSujeto === '1')

watch(
  () => form.esNNA,
  () => {
    esNNA.value =
      mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) === '1'
  }
)
const esDistintoDeNo = computed(
  () =>
    mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) === '1' ||
    mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) === '3'
)

function resetCamposDenunciante () {
  if (mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) !== '1') {
    form.nnaAQuienContoHechos = ''
    form.idNnaParentesco = null
  }
}

function resetCamposVictima () {
  if (!esDistintoDeNo.value) {
    form.conQuienVive = null
    form.especifiqueConQuienVive = ''
  }
}
function resetEspecifique () {
  if (
    (form?.conQuienVive !== mantenedor_getTipoNnaResponsableByCodigo('7') &&
      esDistintoDeNo) ||
    (form?.conQuienVive !== mantenedor_getTipoNnaResponsableByCodigo('4') &&
      esDistintoDeNo) ||
    (form.conQuienVive !== mantenedor_getTipoNnaResponsableByCodigo('3') &&
      esDistintoDeNo)
  ) {
    form.especifiqueConQuienVive = ''
  }
}
</script>
