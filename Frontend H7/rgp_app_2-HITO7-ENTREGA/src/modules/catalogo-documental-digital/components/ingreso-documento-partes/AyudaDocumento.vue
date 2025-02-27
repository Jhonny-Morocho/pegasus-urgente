<template>
<div class="card pt-5 pb-3">
  <div class="grid formgrid pregunta">
    <div class="ayuda end">
      <a>¿Necesitas ayuda?</a>
    </div>
    <div class="end">
      <Button
        v-tooltip="
          `Para realizar el proceso de digitalizacion realice los siguientes paso:
          \n1.Verifique conexion de escanear a equipo  \n2.Ejecute aplicacion para escanear documentos
          \n3.Ingresar documento fisico en escaner \n4.Iniciar proceso de escaneo`
        "
        class="question"
        icon="pi pi-question-circle"
        type="button"
      />
    </div>
  </div>
</div>
</template>

<style scoped>
.question {
  color: black;
  background-color: transparent;
  padding: 1px 0px 0px 0px;
}
.question:hover {
  color: black;
  background-color: transparent;
}

.end {
  text-align: end;
}

.pregunta {
  justify-content: end;
  width: 98%;
}

.ayuda {
  color: #686868;
  font-size: 17px;
}

.modal {
  color: #a45407;
  padding: 1px 0px 0px 0px;
}
</style>
