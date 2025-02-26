<template>
<div class="grid col-12">
  <FieldsetFormularioEsNNA />
  <FieldsetFormularioDatosFuncionarioPublico />
  <FieldsetFormularioOrdenDetencionVigente />
  <FieldsetFormularioConoceAlImputadoElDenunciante />
  <FieldsetFormularioConoceAlgunTestigo />
</div>
</template>

<script setup>
// componentes datos complementarios
import FieldsetFormularioEsNNA from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioEsNNA.vue'
import FieldsetFormularioConoceAlgunTestigo from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioConoceAlgunTestigo.vue'
import FieldsetFormularioDatosFuncionarioPublico from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDatosFuncionarioPublico.vue'
import FieldsetFormularioOrdenDetencionVigente from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioOrdenDetencionVigente.vue'
import FieldsetFormularioConoceAlImputadoElDenunciante from '@/modules/global/components/sujetos-intervinientes/datos-complementarios/datos-complementarios-fieldset/FieldsetFormularioDescripcionConoceImputado.vue'

</script>
