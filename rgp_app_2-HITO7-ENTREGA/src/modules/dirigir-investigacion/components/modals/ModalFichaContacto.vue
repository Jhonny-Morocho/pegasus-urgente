<template>
<div>
  <hr class="mt-0">
  <AppFieldset
    class="mt-5"
    legend="Direcciones y Contacto"
  >
    <div class="col-12 md:col-6">
      <p><strong>Tipo Dirección: </strong>{{ informacionSujeto?.direccion?.tipoDireccion || 'N/A' }}</p>
      <p><strong>Dirección: </strong>{{ generarNombreDireccion(informacionSujeto?.direccion) || 'N/A' }}</p>
      <p><strong>Comuna: </strong>{{ informacionSujeto?.direccion?.comuna || 'N/A' }}</p>
    </div>
    <div class="col-12 md:col-6">
      <p><strong>Región: </strong>{{ informacionSujeto?.direccion?.region || 'N/A' }}</p>
      <p><strong>Teléfono: </strong>{{ informacionSujeto?.telefonoMovilContacto || 'N/A' }}</p>
      <p><strong>Correo Electrónico: </strong>{{ informacionSujeto?.correoElectronicoContacto || 'N/A' }}</p>
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { reactive, inject, onMounted } from 'vue'

const dialogRef = inject('dialogRef')

const informacionSujeto = reactive({ ...dialogRef.value.data?.interviniente })

onMounted(() => {
  console.log(informacionSujeto)
})

function generarNombreDireccion (direccion) {
  console.log(direccion)
  let nombreDireccionCompleta = ''

  if (!direccion) {
    return 'N/A'
  }

  if (direccion?.calle) {
    nombreDireccionCompleta += direccion.calle + ' '
  }

  if (direccion?.numeroCalle) {
    nombreDireccionCompleta += direccion.numeroCalle
  }

  return nombreDireccionCompleta
}
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
