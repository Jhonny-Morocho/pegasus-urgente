<template>
<AppDataTable
  id="especies-dinero"
  class="col-12 mb-5"
  :no-paginator="props.modal === true ? false : true"
  :value="arrayEspeciesDineros"
>
  <Column header="RUE">
    <template #body="slotProps">
      {{ slotProps.data.RUE }}
    </template>
  </Column>
  <Column header="Familia Especie">
    <template #body="slotProps">
      {{ mantenedor_getNombreFamiliaEspecie(slotProps.data.idFamilia) }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="slotProps">
      {{ mantenedor_getNombreTipoEspecie(slotProps.data.tipo) }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="slotProps">
      {{ slotProps.data.descripcion }}
    </template>
  </Column>>
  <Column header="Cantidad/Monto">
    <template #body="slotProps">
      {{ slotProps.data.cantidad }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { computed, defineProps } from 'vue'
import { requestUtil } from '@/utils'

const props = defineProps({
  especiesDineros: propTypes.object,
  modal: Boolean
})

const arrayEspeciesDineros = computed(() => props.especiesDineros.map((e) => {
  return {
    ...e,
    nue: props.especiesDineros.nue
  }
}))
const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
  // mantenedor_getCodigoFamiliaEspecieById
} = useMantenedorStore()

requestUtil({
  action: mantenedor_getAllTiposEspecie
})

requestUtil({
  action: mantenedor_getFamiliaEspecies
})
</script>

<style scoped>
span {
  font-weight: bold;
  margin-right: 6px;
}
.nue {
  margin-top: 4px;
  font-size: 1.2em;
}
</style>
