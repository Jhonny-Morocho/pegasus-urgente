<template>
<div class="col-12 flex">
  <div class="col-4">
    <strong>RUC: </strong>2200938215-8
  </div>
  <div class="col-4">
    <strong>Fiscalía:</strong> Casablanca
  </div>
  <div class="col-4">
    <strong>Fiscal Asignado:</strong> Samuel Núñez Parga
  </div>
</div>
<SujetoInterviniente />
<DireccionContacto />

<AppFieldset
  class="w-full m-0"
  legend="Derivar a URAVIT"
>
  <div class="w-full mt-5">
    <div class="col-12 flex">
      <div class="col-4">
        <p>
          ¿Es Urgente??
        </p>
        <AppSelectButton
          id="archivo-provisional-consulta"
          v-model="adjuntarCarpeta"
          class="w-full"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false }
          ]"
        />
      </div>
      <div class="col-8">
        <AppTextarea
          id="comentario"
          class="col-12"
          cols="60"
          label="Causal o Motivo Derivación (*)"
          rows="5"
        />
      </div>
    </div>
  </div>
</AppFieldset>
</template>
<script setup>
import SujetoInterviniente from '@/modules/gestion-solicitudes/components/SujetoInterviniente.vue'
import DireccionContacto from '@/modules/gestion-solicitudes/components/DireccionContacto.vue'
</script>
