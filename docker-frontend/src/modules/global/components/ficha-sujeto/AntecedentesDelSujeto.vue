<template>
<AppFieldset
  id="fieldset-informacion-de-identidad"
  legend="Información de Identidad"
>
  <InformacionDeIdentidad />
</AppFieldset>

<AppFieldset
  id="fieldset-caracterizacion"
  legend="Caracterización"
>
  <Caracterizacion />
</AppFieldset>

<AppFieldset
  id="fieldset-otros-documentos-asociados"
  legend="Otros documentos asociados"
/>

<AppFieldset
  id="fieldset-direcciones"
  legend="Direcciones"
/>

<AppFieldset
  id="fieldset-redes-familiares"
  legend="Redes Familiares"
/>
</template>

<script setup>
/*eslint-disable*/
import InformacionDeIdentidad from "@/modules/global/components/ficha-sujeto/antecedentes-del-sujeto/InformacionDeIdentidad.vue";
import Caracterizacion from "@/modules/global/components/ficha-sujeto/antecedentes-del-sujeto/Caracterizacion.vue";
import OtrosDocumentosAsociados from "@/modules/global/components/ficha-sujeto/antecedentes-del-sujeto/OtrosDocumentosAsociados.vue";
import Direcciones from "@/modules/global/components/ficha-sujeto/antecedentes-del-sujeto/Direcciones.vue";
import RedesFamiliares from "@/modules/global/components/ficha-sujeto/antecedentes-del-sujeto/RedesFamiliares.vue";
import { useDireccionStore } from "@/modules/direccion/composables";
import { onMounted } from "vue";
import { requestUtil } from "@/utils";
import { useFichaCausaStore } from "../../composables";

const { direcciones, direccion_getDirecciones } = useDireccionStore();

onMounted(() => {
  requestUtil({
    action: direccion_getDirecciones,
    payload: {
      idPersona: data.value.interviniente.persona.idPersona,
    },
  });
});

const { dataSujetoSeleccionado: data } = useFichaCausaStore();
</script>
