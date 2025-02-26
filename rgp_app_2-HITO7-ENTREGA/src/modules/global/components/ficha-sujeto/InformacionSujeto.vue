<template>
<AppFieldset
  class="p-fluid"
  :legend="` ${data?.nombres} ${data?.apellidoPaterno} ${data?.apellidoMaterno}`"
>
  <div class="grid col-12 px-6">
    <div class="col-12 md:col-6 lg:col-5 w-min">
      <img
        v-if="!data?.foto"
        id="imagen-perfil"
        alt="img-perfil"
        src="@/assets/images/foto-perfil.png"
      >
      <img
        v-else
        id="imagen-perfil-encontrada"
        alt="img-perfil-encontrada"
        :src="`data:image/jpg;base64,${data?.foto}`"
        style="width: 50%; margin: auto"
      >
    </div>
    <div class="col-12 md:col-6 md:mt-3 lg:col-7 lg:ml-6 flex flex-column justify-content-around">
      <span><strong>RUT: </strong>{{ data?.numeroDocumento }}</span>
      <span><strong>Tipo de Documento: </strong>{{ data?.tipoDocumento ?? 'null' }}</span>
    </div>
  </div>
  <div
    v-if="false"
    class="col-12 lg:col-6"
  >
    <Message severity="error">
      <strong>Atención: </strong>SUJETO PRESENTA ORDEN DE DETENCIÓN VIGENTE
    </Message>
  </div>
</AppFieldset>
</template>

<script setup>
import { useFichaCausaStore } from '../../composables'

const { dataSujetoSeleccionado: data } = useFichaCausaStore()
</script>

<style scoped>
span {
  font-size: 1.2rem;
}
</style>
