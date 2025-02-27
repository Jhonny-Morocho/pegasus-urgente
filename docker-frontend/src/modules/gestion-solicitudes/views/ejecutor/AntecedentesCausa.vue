<template>
<section class="mt-4 mb-2">
  <FieldsetResumenCausa />
  <FielsetSujetosIntervinientes :ruc="ruc" />
  <FieldsetDelitos :ruc="ruc" />
  <FieldsetRelaciones :ruc="ruc" />
  <FieldsetEspeciesDinero />
  <FieldsetPautasAplicadas />
  <FieldsetMedidasProteccionAplicadas />
  <FieldsetMedidasCautelares />
  <FieldsetAnotaciones />
  <FieldsetDocumentos />
  <FieldsetDiligencias />
  <FieldsetMinutas />
</section>
</template>

<script setup>
import FieldsetResumenCausa from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetResumenCausa.vue'
import FieldsetRelaciones from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetRelaciones.vue'
import FielsetSujetosIntervinientes from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetSujetosIntervinientes.vue'
import FieldsetDelitos from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetDelitos.vue'
import FieldsetEspeciesDinero from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetEspeciesDinero.vue'
import FieldsetPautasAplicadas from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetPautasAplicadas.vue'
import FieldsetMedidasProteccionAplicadas from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetMedidasProteccionAplicadas.vue'
import FieldsetMedidasCautelares from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetMedidasCautelares.vue'
import FieldsetAnotaciones from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetAnotaciones.vue'
import FieldsetDiligencias from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetDiligencias.vue'
import FieldsetMinutas from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetMinutas.vue'
import FieldsetDocumentos from '@/modules/gestion-solicitudes/components/antecedentes-causa/FieldsetDocumentos.vue'

import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

const {
  ruc
} = useDirigirInvestigacionStore()
</script>

<style lang="scss" scoped>
::v-deep(.p-tabmenu) {
.p-tabmenu-nav {
    .p-tabmenuitem {
        a.p-menuitem-link {
        height: 100%;
        }
    }
  }
}
</style>
