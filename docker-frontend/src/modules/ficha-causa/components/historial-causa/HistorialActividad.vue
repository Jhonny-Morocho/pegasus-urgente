<template>
<AppFieldset
  legend="Ingreso"
  toggleable
>
  <TablaHistorial :value="[]" />
</AppFieldset>
<AppFieldset
  legend="Preclasificación"
  toggleable
>
  <TablaHistorial :value="[]" />
</AppFieldset>
<AppFieldset
  legend="Asignación"
  toggleable
>
  <TablaHistorial :value="[]" />
</AppFieldset>
<AppFieldset
  legend="Asignación"
  toggleable
>
  <TablaHistorial :value="[]" />
</AppFieldset>
<AppFieldset
  legend="Dirigir la Investigación"
  toggleable
>
  <TablaHistorial :value="[]" />
</AppFieldset>
<AppFieldset
  legend="Tramitación"
  toggleable
>
  <TablaHistorial :value="[]" />
</AppFieldset>
</template>

<script setup>
import TablaHistorial from '@/modules/global/components/historial-causa/TablaHistorial.vue'; </script>
