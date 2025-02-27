<template>
<div class="grid col-12">
  <FieldsetFormularioEsNNA />
  <FieldsetFormularioRiesgoNNA />
  <FieldsetFormularioPautaVif />
  <FieldsetFormularioDeclaracion />
  <FieldsetFormularioPresentaLesiones />
  <FieldsetFormularioDatosHospitalizacion v-if="form.presentaLesiones" />
  <FieldsetFormularioMedidasProteccion />
  <FieldsetFormularioConoceAlgunTestigo />
  <FieldsetFormularioDescripcionConoceImputadoLaVictima />
</div>
</template>

<script setup>
// componentes datos complementarios
import FieldsetFormularioEsNNA from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioEsNNA.vue'
import FieldsetFormularioRiesgoNNA from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioRiesgoNNa.vue'
import FieldsetFormularioPautaVif from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioPautaVif.vue'
import FieldsetFormularioDeclaracion from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDeclaracion.vue'
import FieldsetFormularioPresentaLesiones from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioPresentaLesiones.vue'
import FieldsetFormularioDatosHospitalizacion from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDatosHospitalizacion.vue'
import FieldsetFormularioMedidasProteccion from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioMedidasProteccion.vue'
import FieldsetFormularioConoceAlgunTestigo from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioConoceAlgunTestigo.vue'
import FieldsetFormularioDescripcionConoceImputadoLaVictima from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDescripcionConoceImputado.vue'

import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const form = sujetosIntervinientesInject

</script>
