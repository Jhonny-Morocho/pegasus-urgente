<template>
<AppFieldset
  class="col-12"
  legend="Rótulo"
  :toggleable="true"
>
  <h2 class="col-12">
    N.U.E:
    <span style="color:red">
      {{ cadena.rotuloCadenaCustodia?.nue }}
    </span>
  </h2>
  <p
    v-if="cadena.rotuloCadenaCustodia?.ruc"
    class="col-12 md:col-6"
  >
    <span class="font-bold">RUC: </span>{{ cadena.rotuloCadenaCustodia?.ruc }}
  </p>
  <p
    v-if="cadena.rotuloCadenaCustodia?.folio"
    class="col-12 md:col-6"
  >
    <span class="font-bold">Folio: </span>{{ cadena.rotuloCadenaCustodia?.folio }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Fecha/Hora Levantamiento: </span>{{ cadena.rotuloCadenaCustodia?.fechaLevantamiento }} {{ cadena.rotuloCadenaCustodia?.horaLevantamiento }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Institución: </span>{{ cadena.rotuloCadenaCustodia?.institucionNue }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Levantada por: </span>{{ cadena.rotuloCadenaCustodia?.personaLevantamiento }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Unidad: </span>{{ cadena.rotuloCadenaCustodia?.unidadNue }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Dirección del S.S.: </span>{{ cadena.rotuloCadenaCustodia?.direccionLevantamiento }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Estado de Cadena de Custodia: </span>{{ mejorMensaje(cadena.rotuloCadenaCustodia?.estadoCadenaCustodia) }}
  </p>
  <p
    class="col-12 md:col-6"
  >
    <span class="font-bold">RUT: </span>{{ cadena.rotuloCadenaCustodia?.run }}
  </p>
  <p
    v-if="cadena.rotuloCadenaCustodia?.ruc"
    class="col-12 md:col-6"
  >
    <span class="font-bold">Fiscalía: </span>{{ cadena.rotuloCadenaCustodia?.fiscalia }}
  </p>
  <p
    v-else
    class="col-12 md:col-6"
  />
  <p class="col-12 md:col-6">
    <span class="font-bold">Grado/Cargo: </span>{{ cadena.rotuloCadenaCustodia?.grado }} / {{ cadena.rotuloCadenaCustodia?.cargo }}
  </p>
</AppFieldset>
</template>

<script setup>
import { useVerCadenaCustodia } from '../../composables'
const { cadena } = useVerCadenaCustodia()

function mejorMensaje (m) {
  return (m.charAt(0).toUpperCase() + m?.slice(1)).replaceAll('_', ' ')
}
</script>
