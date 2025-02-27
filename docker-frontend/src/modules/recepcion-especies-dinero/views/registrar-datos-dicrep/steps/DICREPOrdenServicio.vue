<template>
<section>
  <AppFieldset legend="Solicitar Orden de Servicio de Traslado">
    <FormOrdenTraslado tipo-de-servicio="traslado"/>
  </AppFieldset>

  <AppBtnRightTeleported>
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Registrar Salida"
      @click="handleNextStep"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import FormOrdenTraslado from '@/modules/recepcion-especies-dinero/components/salida-destruccion/FormOrdenTraslado.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

function handleNextStep(){
  router.push({ name: 'DICREPOficioEntrega' })
}
</script>