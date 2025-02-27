<template>
<div class="grid">
  <div class="col-12 md:col-4 text-center">
    <img
      v-if="!fotoPerfil"
      id="imagen-perfil"
      alt="img-perfil"
      src="@/assets/images/foto-perfil.png"
    >
  </div>
  <div class="col-12 md:col-8 grid">
    <div class="col-12 md:col-6 my-auto">
      <p class="mb-3">
        <span style="font-weight: bold">Nombre:</span>
        {{ user?.name }}
      </p>
      <p class="mb-3">
        <span style="font-weight: bold">Cargo:</span>
        {{ user?.cargo }}
      </p>
      <p>
        <span style="font-weight: bold">Fiscalía:</span>
        {{ user?.fiscalias[0]?.fiscalia }}
      </p>
    </div>
    <div class="col-12 md:col-6 my-auto">
      <p class="mb-3">
        <span style="font-weight: bold">Teléfono:</span>
        {{ user.telefono }}
      </p>
      <p class="mb-3">
        <span style="font-weight: bold">Anexo:</span>
        {{ user?.anexo }}
      </p>
      <p>
        <span style="font-weight: bold">Correo:</span>
        {{ user?.email }}
      </p>
    </div>
  </div>
</div>
</template>
<script setup>
import { useSessionStore } from '@/modules/session/composables'

const { user } = useSessionStore()
</script>
