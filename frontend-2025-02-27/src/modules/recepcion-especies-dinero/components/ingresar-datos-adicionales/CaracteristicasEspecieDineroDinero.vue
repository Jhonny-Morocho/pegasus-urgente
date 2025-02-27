<template>
<AppFieldset
  class="col-12 p-fluid"
  legend="Características Especie/Dinero"
>
  <AppDropdown
    id="tipo-vehiculo"
    v-model="formData.tipoVehiculo"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Tipo de Vehiculo"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Tipo 1', value: 1 },
      { name: 'Tipo 2', value: 2 },
    ]"
    show-clear
  />
  <AppInput
    id="patente-vehiculo"
    v-model="formData.patente"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Patente"
  />
  <AppInput
    id="marca-vehiculo"
    v-model="formData.marca"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Marca"
  />
  <AppInput
    id="modelo-vehiculo"
    v-model="formData.modelo"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Modelo"
  />
  <AppInput
    id="color-vehiculo"
    v-model="formData.color"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Color"
  />
  <AppInput
    id="vin-vehiculo"
    v-model="formData.vin"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="VIN o Chasis"
  />
  <AppInput
    id="numero-motor-vehiculo"
    v-model="formData.numeroMotor"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Número de Motor"
  />
  <AppDropdown
    id="tiene-herramientas"
    v-model="formData.herramientasAdentro"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Herramientas en el Vehículo"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Rueda Repuesto', value: 1 },
      { name: 'Gata', value: 2 },
      { name: 'Cable Puente Batería', value: 2 },
    ]"
    show-clear
  />
  <AppInput
    id="lugar-custodia"
    v-model="formData.lugarCustodia"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Lugar de Custodia"
  />
  <AppDropdown
    id="estaciona-en"
    v-model="formData.lugarEstacionaComunmente"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Estaciona en"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Vía Pública', value: 1 },
      { name: 'Recinto Privado', value: 2 },
      { name: 'Exterior del Domicilio', value: 3 },
    ]"
    show-clear
  />
  <AppDropdown
    id="estado-vehiculo"
    v-model="formData.estadoVehiculo"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Estado del Vehículo"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Abolladuras', value: 1 },
      { name: 'Rayado', value: 2 },
      { name: 'Sin daño', value: 3 },
    ]"
    show-clear
  />
  <AppDropdown
    id="signos-fuerza"
    v-model="formData.signosFuerza"
    class="col-3 mb-0"
    :disabled="readOnly"
    label="Signos de Fuerza"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Chapas de puertas forzadas', value: 1 },
      { name: 'Vidrios rotos', value: 2 },
    ]"
    show-clear
  />
</AppFieldset>
</template>

<script setup>
import { defineProps, reactive } from 'vue'
// VALUES
const formData = reactive(getFormDataInitial())
defineProps({
  readOnly: Boolean
})
function getFormDataInitial () {
  return {
    tipoVehiculo: '',
    patente: '',
    marca: '',
    modelo: '',
    color: '',
    vin: '',
    numeroMotor: '',
    herramientasAdentro: '',
    lugarCustodia: '',
    lugarEstacionaComunmente: '',
    estadoVehiculo: '',
    signosFuerza: ''

  }
}
</script>
