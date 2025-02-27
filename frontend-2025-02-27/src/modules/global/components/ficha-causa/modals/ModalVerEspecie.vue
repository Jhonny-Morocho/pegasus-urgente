<template>
<AppFieldset
  legend="Identificación Especie/Dinero"
>
  <div class="col-12 md:col-6">
    <p class="mb-3">
      <span style="font-weight: bold">Familia Especie:</span>
      {{ data.especie.familiaEspecie }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Tipo Especie:</span>
      {{ data.especie.tipoEspecie }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Cantidad:</span>
      {{ data.especie.cantidad }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Unidad de Medida:</span>
      {{ data.especie.unidadMedida }}
    </p>
  </div>
  <div class="col-12 md:col-6">
    <p class="mb-3">
      <span style="font-weight: bold">Familia Especie:</span>
      {{ data.especie.especiePeligrosa }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Tipo Especie:</span>
      {{ data.especie.especieEvidencia }}
    </p>
    <p>
      <span style="font-weight: bold">Cantidad:</span>
      {{ data.especie.medioParaCometerDelito }}
    </p>
  </div>
  <div class="col-12">
    <span style="font-weight: bold">Descripcion:</span>
    <p>
      {{ data.especie.descripcion }}
    </p>
  </div>
</AppFieldset>
<AppFieldset
  legend="Características Especie/Dinero"
>
  <div class="col-12 md:col-6">
    <p class="mb-3">
      <span style="font-weight: bold">Tipo de Vehículo:</span>
      {{ data.especie.caractersiticas.tipo }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Patente:</span>
      {{ data.especie.caractersiticas.patente }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Marca:</span>
      {{ data.especie.caractersiticas.marca }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Modelo:</span>
      {{ data.especie.caractersiticas.modelo }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Color:</span>
      {{ data.especie.caractersiticas.color }}
    </p>
    <p>
      <span style="font-weight: bold">VIN o Chasis:</span>
      {{ data.especie.caractersiticas.vin }}
    </p>
  </div>
  <div class="col-12 md:col-6">
    <p class="mb-3">
      <span style="font-weight: bold">Número de motor:</span>
      {{ data.especie.caractersiticas.numeroMotor }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Herramientas en el Vehículo:</span>
      {{ data.especie.caractersiticas.herramientasVehiculo }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Lugar de Custodia:</span>
      {{ data.especie.caractersiticas.lugarCustodia }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Estaciona en:</span>
      {{ data.especie.caractersiticas.estacionaEn }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Estado del Vehículo:</span>
      {{ data.especie.caractersiticas.estadoVehiculo }}
    </p>
    <p>
      <span style="font-weight: bold">Signos de fuerza:</span>
      {{ data.especie.caractersiticas.signosFuerza }}
    </p>
  </div>
</AppFieldset>
</template>
<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
const data = defineProps({
  especie: propTypes.object
})
</script>
