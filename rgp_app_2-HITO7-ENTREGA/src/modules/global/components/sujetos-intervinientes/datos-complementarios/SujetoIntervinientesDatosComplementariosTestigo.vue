<template>
<div class="grid col-12">
  <FieldsetFormularioTestigoProtegido />
  <FieldsetFormularioOrdenDetencionVigente />
  <FieldsetFormularioDeclaracion />
  <FieldsetFormularioConoceAlImputadoElTestigo />
  <FieldsetFormularioConoceTestigo />
</div>
</template>

<script setup>
// componentes datos complementarios
import FieldsetFormularioDeclaracion from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDeclaracion.vue'
import FieldsetFormularioTestigoProtegido from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioTestigoProtegido.vue'
import FieldsetFormularioOrdenDetencionVigente from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioOrdenDetencionVigente.vue'
import FieldsetFormularioConoceAlImputadoElTestigo from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDescripcionConoceImputado.vue'
import FieldsetFormularioConoceTestigo from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioConoceAlgunTestigo.vue'
</script>
