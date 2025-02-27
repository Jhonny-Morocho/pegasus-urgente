<template>
<div class="col-12">
  <AppDataTable
    id="tabla-resumen-delitos"
    v-bind="{ ...$attrs }"
  >
    <Column header="Familia Delito">
      <template #body="{ data }">
        {{ getNombreFamiliaDelitoById(data?.delito?.idFamiliaDelito) || data?.delito?.familiaDelito }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{ data }">
        {{ data?.delito?.tipoDelito || 'SIN TIPO DELITO' }}
      </template>
    </Column>
    <Column header="¿Es VIF?">
      <template #body="{ data }">
        {{ data.esVif || data.vif ? 'Si' : 'No' }}
      </template>
    </Column>
    <Column header="Dirección Delito">
      <template #body="{ data }">
        {{ data?.direccionDelito?.calle }} {{ data?.direccionDelito?.numero }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ data?.direccionDelito?.comunaNombre }}
      </template>
    </Column>
    <Column header="Fecha Delito">
      <template #body="{ data }">
        {{ fechaDelito(data?.fechaOcurrencia) }}
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { dateTimeUtil } from '@/utils'
import { defineProps } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getIdFamiliaDelitoByIdTipoDelito, mantenedor_getNombreFamiliaDelito } = useMantenedorStore()
function getNombreFamiliaDelitoById (idFamilia, idTipo) {
  if (idFamilia) {
    return mantenedor_getNombreFamiliaDelito(idFamilia)
  } else {
    return mantenedor_getNombreFamiliaDelito(mantenedor_getIdFamiliaDelitoByIdTipoDelito(idTipo))
  }
}

defineProps({})

function fechaDelito (fecha) {
  return dateTimeUtil.formatToFrontendWithTime(fecha)
}
</script>
