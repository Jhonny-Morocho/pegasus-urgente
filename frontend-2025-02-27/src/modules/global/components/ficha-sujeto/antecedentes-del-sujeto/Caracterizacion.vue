<template>
<div class="col-4 mb-2">
  <div class="flex flex-column px-1">
    <p class="my-3">
      <strong>Identidad de Genero: </strong>
      {{ data?.sexoDeclarado || 'N/A' }}
    </p>
    <p class="my-3">
      <strong>Estado Civil: </strong>{{ mantenedor_getEstadoCivilDescripcionById(data?.estadoCivil) }}
    </p>
    <p class="mt-3">
      <strong>Idioma o Dialecto: </strong>{{ data?.idioma || 'N/A' }}
    </p>
  </div>
</div>
<div class="col-4 mb-2">
  <div class="flex flex-column px-1">
    <p class="mb-3">
      <strong>Escolaridad: </strong>{{ data?.escolaridad || 'N/A' }}
    </p>
    <p class="my-3">
      <strong>Profesión u Oficio: </strong>{{ data?.profesionOficioOcupacion || 'N/A' }}
    </p>
    <p class="my-3">
      <strong>Alias: </strong>N/A
    </p>
    <p class="mt-3">
      <strong>Condición de Discapacidad</strong>{{ data?.idTipoDiscapacidad || 'N/A' }}
    </p>
  </div>
</div>
<div class="col-4 mb-2">
  <div class="flex flex-column px-1">
    <p class="mb-3">
      <strong>Etnia: </strong>{{ data?.pueblosOriginarios || 'N/A' }}
    </p>
    <p class="my-3">
      <strong>Estado Migratorio: </strong>{{ data?.estadoMigratorio || 'N/A' }}
    </p>
    <p class="my-3">
      <strong>Sabe Leer y Escribir: </strong>N/A
    </p>
    <p class="mt-3">
      <strong>Discapacidad: </strong>{{ data?.tipoDiscapacidad || 'N/A' }}
    </p>
  </div>
</div>
<div class="col-12">
  <p class="mt-3 ml-2">
    <strong>Descripción Física: </strong>N/A
  </p>
</div>
</template>
<script setup>
import { useFichaCausaStore, useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getEstadoCivilDescripcionById } = useMantenedorStore()

const { dataSujetoSeleccionado: data } = useFichaCausaStore()
</script>
