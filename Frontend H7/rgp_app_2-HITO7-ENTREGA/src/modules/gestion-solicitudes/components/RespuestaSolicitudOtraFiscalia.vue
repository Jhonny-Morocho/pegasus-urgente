<template>
<AppFieldset
  class="w-full"
  legend="Respuesta Solicitud Otra Fiscalía"
>
  <div class="col-12 flex">
    <div class="col-6 mb-2">
      <div class="flex flex-column px-1">
        <p class="mb-3">
          <strong>Institución colaboradora: </strong>Fiscalía Viña del Mar
        </p>
        <p class="my-3">
          <strong>Fecha y Hora de envío: </strong>01-08-2022
        </p>
        <p class="my-3">
          <strong>Respuesta: </strong>Diligencia Ejecutada
        </p>
      </div>
    </div>
  </div>
  <div
    class="col-12 p-3 pt-0"
  >
    <h2>Argumento Resultado de la Diligencia:</h2>
    <div class="pt-4">
      <div class="box">
        <div class="p-3">
          <strong>El argumento va aquí...........................
            ...............................................................................................................................................................................................................
          </strong>
        </div>
      </div>
    </div>
  </div>
  <div
    class="col-12 flex justify-content-left"
  >
    <Button
      icon="pi pi-download"
      icon-pos="right"
      label="Descargar Documento"
    />
  </div>
</AppFieldset>
</template>
<script setup>
</script>
<style scoped>
.box {
  border: 1px solid #000000;
  border-radius: 10px;
  height: 119px;
}

.box strong {
  line-height: 3rem;
  font-size: 16px;
}
</style>
