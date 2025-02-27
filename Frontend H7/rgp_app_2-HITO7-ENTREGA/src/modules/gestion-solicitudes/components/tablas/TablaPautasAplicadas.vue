<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Pauta">
    <template #body="{ data }">
      {{ data?.pauta }}
    </template>
  </Column>
  <Column header="Sujeto/Interviniente">
    <template #body="{ data }">
      {{ data?.pauta }}
    </template>
  </Column>
  <Column header="Fecha/Hora de la solicitud">
    <template #body="{ data }">
      {{ data?.pauta }}
    </template>
  </Column>
  <Column header="Ponderación">
    <template #body="{ data }">
      {{ data?.pauta }}
    </template>
  </Column>
  <Column header="Evaluación de riesgo">
    <template #body="{ data }">
      {{ data?.usuarioQueAplica }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.evaluacionRiesgo }}
    </template>
  </Column>
  <Column header="Alerta SIAU">
    <template #body="{ data }">
      {{ data?.evaluacionRiesgo }}
    </template>
  </Column>
</AppDataTable>
</template>
