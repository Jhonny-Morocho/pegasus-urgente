<template>
<div class="col-4 mb-2">
  <div class="flex flex-column px-1">
    <p class="mb-3">
      <strong>Nombre completo: </strong>{{ ` ${data?.nombres} ${data?.apellidoPaterno} ${data?.apellidoMaterno}` }}
    </p>
    <p class="my-3">
      <strong>Nacionalidad: </strong>{{ data?.idNacionalidad }}
    </p>
    <p class="my-3">
      <strong>Fecha de Nacimiento: </strong>{{ data?.fechaNacimiento }}
    </p>
    <p class="mt-3">
      <strong>Número de serie: </strong>{{ data?.crr }}
    </p>
  </div>
</div>
<div class="col-4 mb-2">
  <div class="flex flex-column px-1">
    <p class="mb-3">
      <strong>Sexo: </strong>{{ mantenedor_getDescripcionTipoSexoById(data?.sexoBiologico) }}
    </p>
    <p class="my-3">
      <strong>Edad: </strong>{{ data?.edad }}
    </p>
    <p class="my-3">
      <strong>Lugar de Nacimiento: </strong>{{ data?.redSocial?.persona?.ciudadNacimiento }}
    </p>
    <p class="mt-3">
      <strong>Inscripción de nacimiento: </strong>N/A
    </p>
  </div>
</div>
<div class="col-4 mb-2">
  <div class="flex flex-column px-1">
    <p class="mb-1">
      <strong>Fecha de Vencimiento: </strong>N/A
    </p>
    <div class="grid mt-3">
      <p class="col-2 my-1">
        <strong>Firma: </strong>
      </p>
      <div class="col-9">
        <img
          v-if="!data?.firma"
          id="imagen-firma-encontrada"
          alt="img-firma-encontrada"
          src="@/assets/images/firma.png"
          style="width: 45%; margin: auto"
        >
        <img
          v-else
          id="imagen-firma"
          alt="img-firma"
          :src="`data:image/jpg;base64,${data?.firma}`"
          style="width: 45%; margin: auto"
        >
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { useFichaCausaStore, useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getDescripcionTipoSexoById } = useMantenedorStore()

const { dataSujetoSeleccionado: data } = useFichaCausaStore()
</script>
