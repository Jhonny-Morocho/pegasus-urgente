<template>
<AppFieldset
  class="col-12 pb-3"
  legend="NNA"
>
  <div class="col-12 md:col-9 lg:col-4 text-center">
    <h4>¿Es NNA? (*)</h4>
    <span>
      <AppSelectButton
        id="esNNAElDenuncianteVictima"
        v-model="form.esNNA"
        option-label="descripcion"
        option-value="id"
        :options="filterTipoRespuestaBasicaNNA"
        :rules="{ required }"
      />
    </span>
  </div>
  <AppDropdown
    v-if="esDistintoDeNo"
    id="conQuienVive"
    v-model="form.conQuienVive"
    class="col-12 md:col-3 mt-auto"
    label="¿Con quién vive?"
    option-label="descripcion"
    option-value="id"
    :options="tipoNnaResponsable"
    :retrieve-data-action="mantenedor_getTipoNnaResponsable"
    show-clear
  />
  <AppInput
    v-if="
      (form.conQuienVive === mantenedor_getTipoNnaResponsableByCodigo('7') &&
        esDistintoDeNo) ||
        (form.conQuienVive === mantenedor_getTipoNnaResponsableByCodigo('4') &&
          esDistintoDeNo) ||
        (form.conQuienVive === mantenedor_getTipoNnaResponsableByCodigo('3') &&
          esDistintoDeNo)
    "
    id="espeficConQuienVive"
    v-model="form.especifiqueConQuienVive"
    class="col-12 lg:col-3 mt-auto mr-3"
    label="Especifíque"
  />
  <AppInput
    v-if="esDistintoDeNo"
    id="nnaAQuienContoHechos"
    v-model="form.nnaAQuienContoHechos"
    class="col-12 mt-auto"
    label="Persona(s) a quien(es) el niño, niña o adolescente contó los hechos
            (si es que los contó)"
    :rules="esNNA ? { required } : undefined"
  />
  <AppTextarea
    v-if="esDistintoDeNo"
    id="describaComoSupo"
    v-model="form.nnaComoSupoHechos"
    class="col-12"
    cols="50"
    label="Describa como supo ud. de los hechos"
    rows="2"
    :rules="esNNA ? { required } : undefined"
  />
</AppFieldset>
</template>

<script setup>
import { watch, computed } from 'vue'

import { useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useMantenedorStore } from '@/modules/global/composables'

const { required } = useFormValidation()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const form = sujetosIntervinientesInject

const {
  mantenedor_getTipoNnaResponsable,
  tipoNnaResponsable,
  mantenedor_getTipoNnaResponsableByCodigo,
  mantenedor_getCodigoTipoRespuestaBasicaById,
  tipoRespuestaBasica,
  mantenedor_getIdTipoRespuestaBasicaByCodigo,
  mantenedor_getIdParentescoByCodigo
} = useMantenedorStore()

const filterTipoRespuestaBasicaNNA = computed(() => {
  const fixedLabel = tipoRespuestaBasica.value.map((e) => {
    if (e.descripcion.includes('No Consultado')) {
      return { ...e, descripcion: 'No Informado' }
    }
    return e
  })
  return fixedLabel.filter((respuesta) => respuesta.codigo !== '4')
})

const esNNA = computed(
  () => mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) === '1'
)

const esDistintoDeNo = computed(
  () =>
    mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) === '1' ||
    mantenedor_getCodigoTipoRespuestaBasicaById(form.esNNA) === '3'
)

watch(
  () => esDistintoDeNo.value,
  () => {
    if (esDistintoDeNo.value) {
      form.nnaEsAdultoProtector =
        mantenedor_getIdTipoRespuestaBasicaByCodigo('2')
      form.idNnaParentesco = mantenedor_getIdParentescoByCodigo('0')
    } else {
      form.nnaEsAdultoProtector = null
      form.idNnaParentesco = null
      form.nnaAQuienContoHechos = null
      form.nnaComoSupoHechos = null
      form.conQuienVive = null
    }
  }
)
</script>
