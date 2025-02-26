<template>
<section>
  <div class="col-12 grid bg">
    <div class="col-6">
      <div class="">
        <h3>Firma Destinatario que recibe especie</h3>
        <div class="col-12 grid">
          <div class="image col-6">
            <img class="img" alt="huella"/>
          </div>
          <div class="col-6">
            <div class="mb-4">
              <p><strong>RUT Custodio: </strong></p>
              <p>12.345.345-9</p>
            </div>
            <div class="mb-4">
              <p><strong>Nombre Custodio: </strong></p>
              <p>Cosme Fulanito</p>
            </div>
          </div>
        </div>
      </div>
      <Message severity="error">
        <strong>Error! </strong>Ocurrió un problema, favor reintentar
      </Message>
      <Message severity="success">
        <strong>Completdo! </strong>Firma o Huella válida
      </Message>
    
      <Button
        class="p-button-outlined mt-6"
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="Registrar Salida"
        @click="confirmar"
      />
    </div>
    <div class="col-6">
      <div class="">
        <h3>Firma Destinatario que recibe especie</h3>
        <div class="col-12 grid">
          <div class="image col-6">
            <img class="img" alt="huella"/>
          </div>
          <div class="col-6">
            <div class="mb-4">
              <p><strong>RUT Custodio: </strong></p>
              <p>12.345.345-9</p>
            </div>
            <div class="mb-4">
              <p><strong>Nombre Custodio: </strong></p>
              <p>Cosme Fulanito</p>
            </div>
          </div>
        </div>
      </div>
      <Message severity="error">
        <strong>Error! </strong>Ocurrió un problema, favor reintentar
      </Message>
      <Message severity="success">
        <strong>Completdo! </strong>Firma o Huella válida
      </Message>
    
      <Button
        class="p-button-outlined mt-6"
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="Registrar Salida"
        @click="confirmar"
      />
    </div>
  </div>
  <div class="col-12 flex justify-content-end mt-4">
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Registrar Salida"
      @click="firmar"
    />
  </div>
</section>
</template>

<script setup>
function confirmar(){
  // ...
}
</script>

<style scoped>
.image{
  width: 50px;
  height: 50px;
  color:grey;
}

.img{
  width: 50px;
}

.bg {
  background: rgb(245, 247, 255);
}
</style>