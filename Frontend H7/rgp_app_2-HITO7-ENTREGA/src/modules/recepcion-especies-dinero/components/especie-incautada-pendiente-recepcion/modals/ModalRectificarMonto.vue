<template>
<div class="mt-2">
  <div class="p-0 m-0">
    <hr class="p-0 m-0">
  </div>
  <h3 class="my-5">
    Lista de Monedas: {{ tipoMonedaNombre() }}
  </h3>
  <DataTable
    id="dataDenominacionDineros"
    v-model:editingRows="editingRows"
    class="editable-cells-table"
    edit-mode="row"
    sort-field="total"
    :value="desgloseDineroSeteado"
    @row-edit-save="handleMonto"
  >
    <Column
      field="estado"
      header="Denominación"
    >
      <template #body="slotProps">
        {{ denominacionNombre(slotProps.data.denominacion) }}
      </template>
    </Column>
    <Column
      field="tipoDinero"
      header="Tipo Dinero"
    >
      <template #body="slotProps">
        {{ tipoDineroNombre(slotProps.data.tipoDinero) }}
      </template>
    </Column>
    <Column
      field="cantidad"
      header="Cantidad"
    >
      <span>
        <Button
          class="p-button-rounded p-button-warning p-button-outlined mr-2"
          icon="pi pi-pencil"
        />
      </span>
      <template #editor="{ data, field }">
        <span>
          <AppInputNumber
            id="prueba"
            v-model=" data[field]"
            class="col-12 mb-0"
            label="prueba"
            show-buttons
            :step="1"
            :use-grouping="false"
          />
        </span>
      </template>
    </Column>
    <Column
      field="total"
      header="Total"
    >
      <template #body="slotProps">
        $ {{ formatoPesoChileno(slotProps.data.total) }}
      </template>
    </Column>
    <Column
      body-style="text-align:center"
      :row-editor="true"
      style="width:10%; min-width:8rem"
    />
  </DataTable>
  <div class="flex flex-column mt-6">
    <h3 class="my-3">
      Monto Inicial: {{ formatoPesoChileno(montoInicial) }}
    </h3>
    <h3 class="my-3">
      Monto Total Rectificado: $ {{ formatoPesoChileno(montoRectificado) }}
    </h3>
    <h3 class="my-3">
      Diferencia: $ {{ formatoPesoChileno(diferenciaMontos) }}
    </h3>
  </div>
</div>
</template>
<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps, ref } from 'vue'
// import { useIdentificacionNueStore } from '@/modules/recepcion-especies-dinero/composables'
// import { requestUtil } from '@/utils'

// UTILITIES
const {
  mantenedor_getNombreMoneda,
  mantenedor_getNombreDenominacionDinero,
  mantenedor_getNombreTipoDinero
} = useMantenedorStore()

// const {
// stepIdentificacionNue_RECTIFICAR_MONTO,
// desgloseDineroSeteado,
// montoInicial,
// diferenciaMontos
// montoRectificado
// } = useIdentificacionNueStore()

// VALUES
defineProps({
  dataDinero: {
    type: Object,
    default: () => {
      return null
    }
  }
})

const editingRows = ref([])
// LOGIC
function handleMonto (event) {
  const { newData } = event
  // const nuevoDesglose = desgloseDineroSeteado.value
  const denominacionDinero = parseInt(denominacionNombre(newData.denominacion))
  // let diferencia = null

  newData.total = denominacionDinero * newData.cantidad
  // requestUtil({
  //   action: stepIdentificacionNue_RECTIFICAR_MONTO,
  //   payload: { nuevoDesglose, nuevoTotal, diferencia },
  //   reject: (err) => {
  //     console.log(err)
  //   }
  // })
}

function tipoMonedaNombre (idTipoMoneda) {
  if (idTipoMoneda) {
    return mantenedor_getNombreMoneda(idTipoMoneda)
  }
  return 'Sin Tipo'
}

function denominacionNombre (idDenominacion) {
  if (idDenominacion) {
    return mantenedor_getNombreDenominacionDinero(idDenominacion)
  }
  return 'Sin Denominación'
}

function tipoDineroNombre (idTipoDinero) {
  if (idTipoDinero) {
    return mantenedor_getNombreTipoDinero(idTipoDinero)
  }
  return 'Sin Tipo'
}
function formatoPesoChileno (monto) {
  const dinero = monto
  return new Intl.NumberFormat('es-CL').format(dinero)
}
</script>
