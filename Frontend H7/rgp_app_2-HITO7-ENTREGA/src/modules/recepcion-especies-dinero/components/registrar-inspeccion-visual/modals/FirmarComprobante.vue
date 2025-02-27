<template>
<div class="grid p-2">
  <div class="col-12 md:col-6">
    <div class="box p-4">
      <p class="title">
        Firma Custodio que Entrega
      </p>
      <div class="grid">
        <div
          class="col-12 md:col-6"
          style="border-style:solid;border-color:black;background-color:white"
        >
          Huella
        </div>
        <div class="col-12 md:col-6 pl-4">
          <p class="font-bold">
            RUT:
          </p>
          <p>
            {{ data.rutEntrega }}
          </p>
          <p class="font-bold">
            Nombre:
          </p>
          <p>
            {{ data.nombreEntrega }}
          </p>
        </div>
      </div>
      <Message
        class="w-full"
        severity="success"
      >
        <p class="my-auto">
          <strong>Completado!</strong> Firma o Huella Válida.
        </p>
      </Message>
      <div class="flex justify-content-end">
        <Button
          class="px-4 btn-primary"
          :label="'Confirmar'"
          @click="confirmarEntrega"
        />
      </div>
    </div>
  </div>
  <div class="col-12 md:col-6">
    <div class="box p-4">
      <p class="title">
        Firma Persona que Recibe
      </p>
      <div class="grid">
        <div
          class="col-12 md:col-6"
          style="border-style:solid;border-color:black;background-color:white"
        >
          Huella
        </div>
        <div class="col-12 md:col-6 pl-4">
          <p class="font-bold">
            RUT:
          </p>
          <p>
            {{ data.rutRecibe }}
          </p>
          <p class="font-bold">
            Nombre:
          </p>
          <p>
            {{ data.nombreRecibe }}
          </p>
        </div>
      </div>
      <Message
        class="w-full"
        severity="error"
      >
        <p class="my-auto">
          <strong>Error!</strong> Ocurrió un problema, favor reintentar.
        </p>
      </Message>
      <div class="flex justify-content-between">
        <Button
          class="px-4 p-button-outlined btnClaveUnica"
          icon="pi pi-external-link"
          icon-pos="right"
          :label="'Clave Única'"
          @click="claveUnica"
        />
        <Button
          class="px-4 btn-primary"
          :label="'Confirmar'"
          @click="confirmarRecibe"
        />
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  data: propTypes.object
})
</script>
<style lang="scss" scoped>
.title {
  font-size: 1.2em;
  margin-bottom: 2em;
}
.box {
  background-color: #e9ecef;
}
.btnClaveUnica {
  background-color: white;
}
p {
  margin-bottom: 0.8em;
}
</style>
