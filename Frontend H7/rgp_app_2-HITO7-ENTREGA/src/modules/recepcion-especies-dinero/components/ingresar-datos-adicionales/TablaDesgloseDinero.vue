<template>
<AppDataTable
  id="dataDenominacionDineros"
  class="editable-cells-table w-full"
  edit-mode="cell"
  responsive-layout="stack"
  :total-records="data?.desglose?.length"
  :value="data?.desglose"
  @cell-edit-complete="onCellEditComplete"
>
  <Column header="Denominación">
    <template #body="slotProps">
      {{
        formatoPesoChileno(
          mantenedor_getNombreDenominacionDinero(slotProps?.data.denominacion)
        )
      }}
    </template>
  </Column>
  <Column header="Tipo Dinero">
    <template #body="slotProps">
      {{
        mantenedor_getNombreTipoDinero(slotProps?.data.tipo)
      }}
    </template>
  </Column>
  <Column
    v-if="esRectificar"
    field="cantidadDinero"
    header="Cantidad"
  >
    <template #editor="{ data, field }">
      <AppInputNumber
        id="cantidadDinero"
        v-model="data[field]"
        class="m-0"
        show-buttons
        :step="1"
        :use-grouping="false"
      />
    </template>
    <template #body="{ data, field }">
      <AppInputNumber
        id="cantidadDinero"
        v-model="data[field]"
        class="m-0"
        show-buttons
        :step="1"
        :use-grouping="false"
      />
    </template>
  </Column>
  <Column
    v-else
    header="Cantidad"
  >
    <template #body="slotProps">
      {{ slotProps?.data.cantidadDinero }}
    </template>
  </Column>
  <Column header="Total">
    <template #body="slotProps">
      {{
        formatoPesoChileno(
          slotProps?.data.cantidadDinero *
            +mantenedor_getNombreDenominacionDinero(slotProps?.data.denominacion)
        )
      }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps } from 'vue'

defineProps({
  readOnly: Boolean,
  data: propTypes.object
})

const {
  mantenedor_getNombreDenominacionDinero,
  mantenedor_getNombreTipoDinero
} = useMantenedorStore()

function formatoPesoChileno (monto) {
  return `$${new Intl.NumberFormat('es-CL').format(monto)}`
}

const onCellEditComplete = (event) => {
  const { data, newValue, field } = event
  data[field] = newValue
}
</script>
