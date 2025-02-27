<template>
<section>
  <h2 class="mx-2">
    Especies Recepcionadas:
  </h2>
  <AppDataTable
    id="tabla-especies-recepcionadas"
    class="col-12"
    :value="data"
  >
    <template #empty>
      No se han agregado archivos
    </template>
    <template #loading>
      Cargando datos de archivos
    </template>
    <Column header="Familia Especie">
      <template #body="slotProps">
        {{ mantenedor_getNombreFamiliaEspecie(slotProps?.data.idFamilia) ?? 'No definido' }}
      </template>
    </Column>
    <Column header="Tipo Especie">
      <template #body="slotProps">
        {{ mantenedor_getNombreTipoEspecie(slotProps?.data.idTipoEspecie) ?? 'No definido' }}
      </template>
    </Column>
    <Column header="Descripción">
      <template #body="slotProps">
        {{ slotProps?.data.descripcion ?? slotProps?.data.descripcionEspecie }}
      </template>
    </Column>
    <Column header="Marca">
      <template #body="slotProps">
        {{ slotProps?.data.esPeligrosa ? "Especie Peligrosa" : "No definido" }}
      </template>
    </Column>
    <Column header="Cantidad">
      <template #body="slotProps">
        {{ slotProps?.data.monto }}
      </template>
    </Column>
    <Column header="Observaciones">
      <template #body="slotProps">
        {{ slotProps?.data.observaciones === "" ? 'Sin Observaciones': slotProps?.data.observaciones }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { useMantenedorStore } from '@/modules/global/composables'

// UTILITIES
defineProps({
  data: propTypes.object
})

const { mantenedor_getNombreFamiliaEspecie, mantenedor_getNombreTipoEspecie } = useMantenedorStore()

// LOGIC

</script>
