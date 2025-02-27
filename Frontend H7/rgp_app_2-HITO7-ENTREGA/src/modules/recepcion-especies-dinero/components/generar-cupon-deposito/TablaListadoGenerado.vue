<template>
<AppDataTable
  id="tablaListadoGenerado"
  breakpoint="960px"
  class="col-12"
  responsive-layout="stack"
  :rows="10"
>
  <Column
    field="nue"
    filter-field="nue"
    header="NUE"
  >
    <template #body="{data}">
      {{ data.nue }}
    </template>
  </Column>
  <Column
    field="rue"
    filter-field="rue"
    header="RUE"
  >
    <template #body="{data}">
      {{ data.rue }}
    </template>
  </Column>
  <Column
    field="ruc"
    filter-field="ruc"
    header="RUC"
  >
    <template #body="{data}">
      {{ data.ruc }}
    </template>
  </Column>
  <Column
    field="tipoDelito"
    filter-field="tipoDelito"
    header="Tipo Delito"
  >
    <template #body="{data}">
      {{ data.tipoDelito }}
    </template>
  </Column>
  <Column
    field="codigoFiscalia"
    filter-field="codigoFiscalia"
    header="Código Fiscalía"
  >
    <template #body="{data}">
      {{ data.codigoFiscalia }}
    </template>
  </Column>
  <Column
    field="numeroConvenio"
    filter-field="numeroConvenio"
    header="Número de Convenio"
  >
    <template #body="{data}">
      {{ data.numeroConvenio }}
    </template>
  </Column>
  <Column
    field="cuentaDeposito"
    filter-field="cuentaDeposito"
    header="Cuenta depósito"
  >
    <template #body="{data}">
      {{ data.cuentaDeposito }}
    </template>
  </Column>
  <Column
    field="monto"
    filter-field="monto"
    header="Monto"
  >
    <template #body="{data}">
      $ {{ data.montoDeposito }}
    </template>
  </Column>
  <Column
    v-if="!comprobanteCupon"
    header="Acciones"
    style="width:0"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="cuponSeleccionado"
        :menu-options="accionesListadoGenerado"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { ref, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['modal-cupon'])
const cuponSeleccionado = ref('')
defineProps({
  comprobanteCupon: propTypes.boolean
})
const accionesListadoGenerado = ref([
  {
    label: 'Acciones para la tarea',
    items: [
      {
        label: 'Vista Previa Cupón de Depósito',
        command: () => {
          emit('modal-cupon', cuponSeleccionado.value)
          console.log('vista cupon deposito', cuponSeleccionado.value)
        }
      }
    ]
  }
])

</script>
