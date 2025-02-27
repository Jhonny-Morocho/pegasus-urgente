<template>
<AppDataTable v-bind="$attrs">
  <Column
    header="Seleccionar"
    header-class="w-1"
    selection-mode="single"
  />
  <Column header="Tipo Sujeto">
    <template #body="{ data }">
      {{ tipoSujeto(data?.tipoSujeto) }}
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
  <Column
    header="Dirección"
    hidden
  >
    <template #body="{ data }">
      {{ data?.direccion }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { useMantenedorStore } from '../../composables'

const { mantenedor_getNombreTipoSujeto } = useMantenedorStore()

function tipoSujeto (idTipoSujeto) {
  return mantenedor_getNombreTipoSujeto(idTipoSujeto)
}
</script>
