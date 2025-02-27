<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperiorSecundario"
  page-title="
RUC creados exitosamente "
/>
<section class="mt-6">
  <AppFieldset legend="Folios con Detenidos con RUC">
    <TablaRucsCreados :value="[]" />
  </AppFieldset>
  <div class="grid">
    <AppFieldset
      class="col-5 mr-6"
      legend="RUCs Creados con CRR"
    >
      <TablaRucsPJUD />
    </AppFieldset>
    <AppFieldset
      class="col-5 py-0 py-5"
      legend="Conexión con el PJUD"
      :style="{ height: 'fit-content' }"
    >
      <div
        v-if="false"
        class="grid m-0"
      >
        <i class="pi pi-check-circle text-green-500 mr-4 ml-3 text-2xl" />
        <h3>Todos los RUC han sido enviados al PJUD</h3>
      </div>
      <div
        v-else
        class="grid m-0"
      >
        <i class="pi pi-exclamation-triangle text-red-500 mr-4 ml-3 text-4xl" />
        <div class="m-0">
          <p class="">
            Se ha producido un error en la conexión con el PJUD
          </p>
          <p class="">
            Los RUC no fueron enviados
          </p>
          <p class="">
            Intente enviar la Nómina nuevamente más tarde
          </p>
          <Button
            class="btn-primary px-5"
            icon="pi pi-send"
            icon-pos="right"
            label="Enviar Nómina"
            @click="handleDecision((data.aprobarPropuesta = true))"
          />
        </div>
      </div>
    </AppFieldset>
  </div>
</section>
</template>

<script setup>
/* eslint-disable */
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaRucsCreados from '../components/detenidos-acd/RUCs-creados/TablaRucsCreados.vue'
import TablaRucsPJUD from '../components/detenidos-acd/RUCs-creados/TablaRucsPJUD.vue'
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
