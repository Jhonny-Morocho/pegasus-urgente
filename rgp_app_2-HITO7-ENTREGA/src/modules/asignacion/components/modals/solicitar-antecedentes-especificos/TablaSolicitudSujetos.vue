<template>
<section class="w-full">
  <AppDataTable v-bind="$attrs">
    <Column
      class="text-center"
      header="Seleccionar"
      selection-mode="single"
    />
    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ mantenedor_getNombreTipoSujeto(data?.tipoSujeto) ?? mantenedor_getNombreTipoSujeto('0') }}
        {{ (mantenedor_getCodigoTipoSujeto(data?.tipoSujeto) || data?.tipoSujeto) === '1' && data.esVictima ? '(Víctima)' : '' }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        {{ data?.numeroDocumento }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ data?.nombres }}
      </template>
    </Column>
    <Column header="Edad">
      <template #body="{ data }">
        {{ data?.edad }}
      </template>
    </Column>
    <Column
      header="Alerta"
      hidden
    >
      <template #body="{ data }">
        <div class="flex justify-content-around">
          <ChipAlerta
            v-for="(alerta, index) in data.alerta"
            :key="index"
            :alerta="alerta"
          />
        </div>
      </template>
    </Column>
    <Column
      header="Dirección"
      hidden
    >
      <template #body="{ data }">
        {{ data?.direccion }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'
import { useMantenedorStore } from '@/modules/global/composables'

const {
  mantenedor_getNombreTipoSujeto,
  mantenedor_getCodigoTipoSujeto
} = useMantenedorStore()

</script>
