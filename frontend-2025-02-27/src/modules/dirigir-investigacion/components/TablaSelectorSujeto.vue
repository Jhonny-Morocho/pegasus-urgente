<template>
<AppDataTable
  id="tabla-selector-sujetos"
  class="w-full"
  v-bind="$attrs"
>
  <Column selection-mode="multiple" />
  <Column header="Tipo Sujeto">
    <template #body="{ data }">
      {{ tipoSujeto(data) }}
    </template>
  </Column>
  <Column header="N° Documento">
    <template #body="{ data }">
      {{ data?.numeroDocumento }}
    </template>
  </Column>
  <Column header="Nombre Completo">
    <template #body="{ data }">
      {{ `${data?.nombres} ${data?.apellidoPaterno} ${data?.apellidoMaterno}` }}
    </template>
  </Column>
  <Column header="Edad">
    <template #body="{ data }">
      {{ data?.edad }}
    </template>
  </Column>
  <Column header="Alerta">
    <template #body="{ data }">
      <section v-if="data.alertas?.length">
        <div
          v-for="alerta in data.alertas"
          :key="alerta"
        >
          {{ alerta }}
        </div>
      </section>
      <span v-else>Sin Alertas</span>
    </template>
  </Column>
  <Column header="Dirección">
    <template #body="{ data }">
      {{ data?.direccion || 'N/A' }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { useMantenedorStore } from '@/modules/global/composables'

const {
  mantenedor_getNombreTipoSujeto,
  mantenedor_getCodigoTipoSujeto
} = useMantenedorStore()

function tipoSujeto (sujeto) {
  const descripcionTipoSujeto = mantenedor_getNombreTipoSujeto(sujeto?.tipoSujeto)
  const codigoTipoSujeto = mantenedor_getCodigoTipoSujeto(sujeto?.tipoSujeto)

  // CODIGO 1: Sujeto Tipo Denunciante
  if (codigoTipoSujeto === '1' && sujeto?.esVictima) {
    return `${descripcionTipoSujeto} (Víctima)`
  }

  return descripcionTipoSujeto
}
</script>
