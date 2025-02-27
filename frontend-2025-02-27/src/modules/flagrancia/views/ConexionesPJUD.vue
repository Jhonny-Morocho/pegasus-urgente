<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperiorSecundario"
  page-title="
  Conexión con el PJUD "
/>
<section class="mt-6">
  <AppFieldset legend="Folios con Detenidos con RUC">
    <TablaConexionesPJUD :value="[]" />
  </AppFieldset>
</section>

<!-- evitar el sonar -->
<TablaRucsPJUD v-if="false" />
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaConexionesPJUD from '../components/detenidos-acd/RUCs-creados/TablaConexionesPJUD.vue'
import TablaRucsPJUD from '../components/detenidos-acd/RUCs-creados/TablaRucsPJUD.vue'
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
