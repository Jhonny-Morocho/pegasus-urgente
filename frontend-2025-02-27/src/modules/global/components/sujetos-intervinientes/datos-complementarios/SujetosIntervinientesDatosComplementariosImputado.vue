<template>
<div class="grid col-12">
  <FieldsetFormularioEsRPA />
  <FieldsetFormularioSeAplicoFuerza />
  <FieldsetFormularioPresentaLesiones />
  <FieldsetFormularioDatosHospitalizacion v-if="form.presentaLesiones" />
  <FieldsetFormularioDatosFuncionarioPublico />
  <FieldsetFormularioOrdenDetencionVigente />
  <FieldsetFormularioLugarDetencion />
</div>
</template>

<script setup>
import { watch } from 'vue'
// componentes datos complementarios
import FieldsetFormularioEsRPA from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioEsRPA.vue'
import FieldsetFormularioSeAplicoFuerza from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioSeAplicoFuerza.vue'
import FieldsetFormularioPresentaLesiones from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioPresentaLesiones.vue'
import FieldsetFormularioDatosHospitalizacion from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDatosHospitalizacion.vue'
import FieldsetFormularioDatosFuncionarioPublico from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDatosFuncionarioPublico.vue'
import FieldsetFormularioOrdenDetencionVigente from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioOrdenDetencionVigente.vue'
import FieldsetFormularioLugarDetencion from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioLugarDetencion.vue'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const form = sujetosIntervinientesInject

function resetHospitalizacion () {
  form.quedoHospitalizado = false
  form.idOrganismoSalud = ''
  form.nombresMedico = ''
  form.rutMedicoTratante = ''
}
watch(() => form.presentaLesiones, () => { if (!form.presentaLesiones) resetHospitalizacion() })
</script>
