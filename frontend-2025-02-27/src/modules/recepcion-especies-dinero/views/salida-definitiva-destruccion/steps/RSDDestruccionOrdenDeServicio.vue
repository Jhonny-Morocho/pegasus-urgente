<template>
<section>
  <AppFieldset legend="Especies Involucradas">
    <TablaGenerarCuponDeDeposito 
      class="w-full mb-4"
      :selectable="false"
      :es-destruccion="true"
      :es-registro-salida="true"
    />
    <h3>Cantidad de especies a destruir: {{ totalEspecies }}</h3>
  </AppFieldset>
  <AppFieldset legend="Solicitar Orden de Servicio de Traslado">
    <FormOrdenTraslado tipo-de-servicio="traslado"/>
  </AppFieldset>
  <AppFieldset legend="Solicitar Orden de Servicio de Traslado">
    <FormOrdenTraslado tipo-de-servicio="destruccion"/>
  </AppFieldset>

  <AppBtnRightTeleported>
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Registrar Salida"
      @click="handleRegistrarSalida"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { ref } from 'vue';
import TablaGenerarCuponDeDeposito from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/TablaGenerarCuponDeDeposito.vue';
import FormOrdenTraslado from '@/modules/recepcion-especies-dinero/components/salida-destruccion/FormOrdenTraslado.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import { useConfirmDialog } from '@/modules/common/composables';

const { launchConfirmDialog } = useConfirmDialog()
const totalEspecies = ref(null)

function handleRegistrarSalida(){
  launchConfirmDialog({
    header: 'Registrar Salida',
    message: '¿Está seguro de Registrar Salida?',
    accept: () => {
      // request util etc...
    }
  })
}
</script>

<style scoped>
.p {
  margin: 20px 0 20px 0;
}
</style>