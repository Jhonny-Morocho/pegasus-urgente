<template>
<section>
  <div class="col-12 mb-2 lg:col-12 lg:mb-0">
    <div class="grid formgrid">
      <div class="col-3">
        <img
          id="imagen-detalle-solicitud"
          alt="img-detalle-solicitud"
          class="w-full"
          src="@/assets/images/detalleSolicitud.png"
        >
      </div>
      <div class="col-4 p-5">
        <div class="grid formgrid py-3">
          <div class="col-4">
            <strong class=""> Nombre: </strong>
          </div>
          <div class="col-8">
            <p>
              {{ user?.name || 'N/A' }}
            </p>
          </div>
        </div>
        <div class="grid formgrid py-3">
          <div class="col-4">
            <strong class=""> Teléfono: </strong>
          </div>
          <div class="col-8">
            <p>
              {{ user?.telefono || 'N/A' }}
            </p>
          </div>
        </div>
        <div class="grid formgrid py-3">
          <div class="col-4">
            <strong> Fiscalía: </strong>
          </div>
          <div class="col-8">
            <p>
              {{ fiscaliaActual.fiscalia || 'N/A' }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-4 p-5">
        <div class="grid formgrid py-3">
          <div class="col-4">
            <strong class=""> Anexo: </strong>
          </div>
          <div class="col-8">
            <p>
              {{ user?.anexo || 'N/A' }}
            </p>
          </div>
        </div>
        <div class="grid formgrid py-3">
          <div class="col-4">
            <strong> Correo: </strong>
          </div>
          <div class="col-8">
            <p>
              {{ user?.email || 'N/A' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script setup>
// COMPOSABLES
import { useSessionStore } from '@/modules/session/composables'

// VALUES
const { user, fiscaliaActual } = useSessionStore()

</script>
