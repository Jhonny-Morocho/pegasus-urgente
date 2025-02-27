<template>
<main>
  <hr class="mb-4">
  <section class="flex justify-content-center align-items-center mb-3">
    <i
      class="pi text-5xl mx-2"
      :class="
        isAltaComplejidad
          ? 'pi-check-circle text-green-500'
          : 'pi-exclamation-triangle text-yellow-500'
      "
    />
    <h1 class="font-normal text-xl mx-2">
      {{
        isAltaComplejidad
          ? "Se Enviará la Consulta a FR"
          : "Se Concluirá Seguir Linea Investigativa"
      }}
    </h1>
  </section>
  <ul class="flex flex-column list-none gap-2 px-3">
    <li><strong>RUC: </strong>{{ data?.ruc }}</li>
    <li><strong>Número de Intervinientes: </strong>{{ data?.numeroIntervinientes }}</li>
    <section
      v-if="isAltaComplejidad"
      class="flex flex-column list-none gap-2"
    >
      <li class="capitalize">
        <strong>Complejidad: </strong> Altamente Compleja
      </li>
      <li><strong>Fiscal Propuesto: </strong>{{ data?.fiscalPropuesto }}</li>
      <li><strong>Impacto: </strong>{{ data?.impacto || "Sin Impacto" }}</li>
      <li><strong>Consulta al Fiscal Regional: </strong></li>
      <li>
        <Editor
          id="consulta-fiscal"
          v-model="textoFR"
          class="w-full"
          editor-style="height: 256px"
          readonly
        />
      </li>
    </section>
  </ul>
</main>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps, ref } from 'vue'

const props = defineProps({
  isAltaComplejidad: Boolean,
  data: propTypes.object
})

const textoFR = ref(props?.data?.consultaFiscal)
</script>
