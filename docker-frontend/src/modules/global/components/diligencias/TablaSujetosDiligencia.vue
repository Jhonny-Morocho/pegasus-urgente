<template>
<AppDataTable
  id="tabla-sujetos-diligencia"
  v-bind="$attrs"
  class="col-12"
>
  <Column
    selection-mode="single"
  />
  <Column header="Tipo Sujeto">
    <template #body="{ data }">
      {{
        mantenedor_getNombreTipoSujeto(data?.tipoSujeto) ??
          mantenedor_getNombreTipoSujeto("0")
      }}
      {{
        (mantenedor_getCodigoTipoSujeto(data?.tipoSujeto) ||
          data?.tipoSujeto) === "1" && data.esVictima
          ? "(Víctima)"
          : ""
      }}
    </template>
  </Column>
  <Column header="N° Documento">
    <template #body="{ data }">
      {{ data?.numeroDocumento ?? 'N/A' }}
    </template>
  </Column>
  <Column header="Nombre Completo">
    <template #body="{ data }">
      {{ data?.nombres }}
    </template>
  </Column>
  <Column header="Alerta">
    <template #body="{ data }">
      <img
        v-if="data.tieneOrdenDetencionVigente"
        alt="handcuffs"
        src="https://cdn-icons-png.flaticon.com/512/620/620800.png"
        width="24"
      >
      <span v-else> No </span>
    </template>
  </Column>
  <Column header="RPA">
    <template #body="{ data }">
      {{ data.esRPA ? "Si" : "No" }}
    </template>
  </Column>
  <Column header="NNA">
    <template #body="{ data }">
      {{ data.esNNA ? "Si" : "No" }}
    </template>
  </Column>
  <Column header="Información Delictual">
    <template #body="{ data }">
      {{ data.detencion ? "Si" : "No" }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

const { mantenedor_getTiposSujetos, mantenedor_getNombreTipoSujeto, mantenedor_getCodigoTipoSujeto } = useMantenedorStore()

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposSujetos })
}
getDataMantenedor()
</script>
