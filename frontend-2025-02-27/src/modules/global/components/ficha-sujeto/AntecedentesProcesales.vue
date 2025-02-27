<template>
<AppFieldset legend="Causas Asociadas">
  <CausasAsociadas />
</AppFieldset>

<AppFieldset legend="Órdenes de detención">
  <OrdenesDeDetencion />
</AppFieldset>

<AppFieldset legend="Formalización del imputado">
  <FormalizacionDelImputado />
</AppFieldset>

<AppFieldset legend="Citaciones">
  <Citaciones />
</AppFieldset>

<AppFieldset legend="Medidas Cautelares">
  <MedidasCautelares />
</AppFieldset>

<AppFieldset legend="Sentencias">
  <Sentencias />
</AppFieldset>

<AppFieldset legend="Intervinientes relacionados">
  <IntervinientesRelacionados />
</AppFieldset>

<AppFieldset legend="Audiencias programadas">
  <AudienciasProgramadas />
</AppFieldset>

<AppFieldset legend="Detenciones anteriores">
  <TablaAntecedentesProcesales />
</AppFieldset>

<AppFieldset legend="Acuerdos reparatorios">
  <TablaAntecedentesProcesales />
</AppFieldset>

<AppFieldset legend="Resoluciones aplicadas al imputado">
  <TablaAntecedentesProcesales />
</AppFieldset>

<AppFieldset legend="Suspensión condicional">
  <TablaAntecedentesProcesales />
</AppFieldset>
</template>

<script setup>
import CausasAsociadas from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/CausasAsociadas.vue'
import OrdenesDeDetencion from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/OrdenesDeDetencion.vue'
import Sentencias from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/Sentencias.vue'
import FormalizacionDelImputado from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/FormalizacionDelImputado.vue'
import Citaciones from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/Citaciones.vue'
import MedidasCautelares from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/MedidasCautelares.vue'
import IntervinientesRelacionados from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/IntervinientesRelacionados.vue'
import AudienciasProgramadas from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/AudienciasProgramadas.vue'

import TablaAntecedentesProcesales from '@/modules/global/components/ficha-sujeto/antecedentes-procesales/TablaAntecedentesProcesales.vue'
</script>
