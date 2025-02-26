<template>
<AppFieldset
  v-if="show && !formData.representaInstitucion"
  class="col-12"
  legend="Datos Complementarios"
  :toggleable="true"
>
  <SujetosIntervinientesDatosComplementariosVictima
    v-if="tipoSujeto === '6' || formData.tipoSujeto === '6'"
  />

  <SujetosIntervinientesDatosComplementariosDenunciante
    v-if="tipoSujeto === '1' && !formData.esVictima || formData.tipoSujeto === '1' && !formData.esVictima"
  />

  <SujetosIntervinientesDatosComplementariosDenuncianteVictima
    v-if="tipoSujeto === '1' && formData.esVictima || formData.tipoSujeto === '1' && formData.esVictima"
  />

  <SujetosIntervinientesDatosComplementariosImputado
    v-if="tipoSujeto === '3' || formData.tipoSujeto === '3'"
  />

  <SujetosIntervinientesDatosComplementariosTestigo
    v-if="tipoSujeto === '15' || formData.tipoSujeto === '15'"
  />
  <SujetosIntervinientesDatosComplementariosAbogado
    v-if="tipoSujeto === '21' || formData.tipoSujeto === '21'"
  />
</AppFieldset>
</template>

<script setup>
import { computed } from 'vue'

// global components
import SujetosIntervinientesDatosComplementariosVictima from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/SujetosIntervinientesDatosComplementariosVictima.vue'
import SujetosIntervinientesDatosComplementariosDenunciante from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/SujetosIntervinientesDatosComplementariosDenunciante.vue'
import SujetosIntervinientesDatosComplementariosImputado from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/SujetosIntervinientesDatosComplementariosImputado.vue'
import SujetosIntervinientesDatosComplementariosAbogado from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/SujetosIntervinientesDatosComplementariosAbogado.vue'
import SujetosIntervinientesDatosComplementariosTestigo from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/SujetoIntervinientesDatosComplementariosTestigo.vue'
import SujetosIntervinientesDatosComplementariosDenuncianteVictima from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/SujetosIntervinientesDatosComplementariosDenuncianteVictima.vue'

import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useMantenedorStore } from '../../composables'
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const formData = sujetosIntervinientesInject

const {
  mantenedor_getCodigoTipoSujeto
} = useMantenedorStore()

const sujetosPermitidos = [
  '21', // ABOGADO
  '6', // VICTIMA
  '1', // DENUNCIANTE
  '3', // IMPUTADO
  '15' // TESTIGO
]
const tipoSujeto = computed(() =>
  mantenedor_getCodigoTipoSujeto(formData.tipoSujeto)
)

const show = computed(() =>
  sujetosPermitidos.some((sujeto) => {
    return sujeto === tipoSujeto.value || sujeto === formData.tipoSujeto
  })
)
</script>
