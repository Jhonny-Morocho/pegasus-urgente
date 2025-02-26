<template>
<div class="grid col-12">
  <FieldsetFormularioEsRPA />
  <FieldsetFormularioOrdenDetencionVigente />
  <FieldsetFormularioRestringidoLibertad />
  <FieldsetFormularioSeAplicoFuerza />
  <FieldsetFormularioPresentaLesiones />
  <FieldsetFormularioDatosHospitalizacion />
  <FieldsetFormularioMuerteBajoCustodia />
  <RegistroFotoHuellaFirma />
</div>
</template>

<script setup>
// componentes datos complementarios
import FieldsetFormularioEsRPA from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioEsRPA.vue'
import FieldsetFormularioOrdenDetencionVigente from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioOrdenDetencionVigente.vue'
import FieldsetFormularioRestringidoLibertad from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioRestringidoLibertad.vue'
import FieldsetFormularioSeAplicoFuerza from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioSeAplicoFuerza.vue'
import FieldsetFormularioPresentaLesiones from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioPresentaLesiones.vue'
import FieldsetFormularioDatosHospitalizacion from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDatosHospitalizacion.vue'
import FieldsetFormularioMuerteBajoCustodia from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioMuerteBajoCustodia.vue'
import RegistroFotoHuellaFirma from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/registroFotoHuellaFirma.vue'

</script>
