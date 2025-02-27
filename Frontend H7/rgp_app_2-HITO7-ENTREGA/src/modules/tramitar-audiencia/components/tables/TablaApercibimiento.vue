<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Nombre">
    <template #body="{ data }">
      {{ `${data?.nombres} ${data?.apellidoPaterno} ${data?.apellidoMaterno}` }}
    </template>
  </Column>
  <Column header="Tipo Sujeto">
    <template #body="{ data }">
      {{ mantenedor_getNombreTipoSujeto(data?.tipoSujeto) ?? mantenedor_getNombreTipoSujeto('0') }}
      {{ (mantenedor_getCodigoTipoSujeto(data?.tipoSujeto) || data?.tipoSujeto) === '1' && data.esVictima ? '(Víctima)' : '' }}
    </template>
  </Column>
  <Column header="Apercibimiento">
    <template #body="{ index }">
      <AppSelectButton
        id="apercibimiento"
        v-model="apercibimiento[index]"
        class="p-fluid"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
/* eslint-disable */
import { useMantenedorStore } from "@/modules/global/composables";
import { ref } from "vue-demi";

const { mantenedor_getNombreTipoSujeto, mantenedor_getCodigoTipoSujeto } = useMantenedorStore()
const apercibimiento = ref([])
</script>
