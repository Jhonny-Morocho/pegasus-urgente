<template>
<hr>
<div class="grid mt-4 mb-0">
  <div class="col-12 md:col-4 text-center">
    <img
      v-if="!info?.avatarUrl"
      id="imagen-perfil"
      alt="img-perfil"
      src="@/assets/images/foto-perfil.png"
    >
    <img
      v-else
      id="imagen-perfil"
      alt="img-perfil"
      :src="info?.avatarUrl"
    >
  </div>
  <div class="col-12 md:col-8 grid">
    <div class="col-12 md:col-6 my-auto">
      <p class="mb-3">
        <strong>Nombre: </strong>
        {{ info?.nombre }}
      </p>
      <p class="mb-3">
        <strong>Cargo:</strong>
        {{ info?.cargo }}
      </p>
      <p>
        <strong>Fiscalía: </strong>
        {{ info?.fiscalia }}
      </p>
    </div>
    <div class="col-12 md:col-6 my-auto">
      <p class="mb-3">
        <strong>Teléfono: </strong>
        {{ info.telefono }}
      </p>
      <p class="mb-3">
        <strong>Anexo: </strong>
        {{ info?.anexo }}
      </p>
      <p>
        <strong>Correo: </strong>
        {{ info?.email }}
      </p>
    </div>
  </div>
</div>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  info: propTypes.object
})
</script>
