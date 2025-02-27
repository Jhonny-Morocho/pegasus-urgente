<template>
<section class="col-12">
  <AppFieldset class="grid prueba">
    <h2 class="mb-3 col-12">
      Dinero(s) Recepcionado:
    </h2>
    <AppDataTable
      id="tabla-especies-recepcionadas"
      class="col-12"
      :value="dineroRecepcionado"
    >
      <template #empty>
        No se han agregado archivos
      </template>
      <template #loading>
        Cargando datos de archivos
      </template>
      <Column header="Nue">
        <template #body="slotProps">
          {{ slotProps.data?.nue }}
        </template>
      </Column>
      <Column header="Familia Especie">
        <template #body="slotProps">
          {{ mantenedor_getNombreFamiliaEspecie(slotProps.data?.idFamiliaEspecie) }}
        </template>
      </Column>
      <Column header="Tipo Especie">
        <template #body="slotProps">
          {{ mantenedor_getNombreTipoEspecie(slotProps.data?.idTipoEspecie) }}
        </template>
      </Column>
      <Column header="Descripción">
        <template #body="slotProps">
          {{ slotProps.data?.dineros[0].descripcion }}
        </template>
      </Column>
      <Column header="Alerta">
        <template #body="slotProps">
          {{ slotProps.data?.alerta }}
        </template>
      </Column>
      <Column header="Monto">
        <template #body="slotProps">
          {{ slotProps.data?.dineros[0].montoRectificado }}
        </template>
      </Column>
      <Column header="Observaciones">
        <template #body="slotProps">
          {{ slotProps.data?.dineros[0].destinoDinero.observaciones }}
        </template>
      </Column>
    </AppDataTable>
    <AppFieldset
      class="mt-5 col-12"
      legend="Detalle del Dinero"
    >
      <div class="col-10 mb-6 flex justify-content-between">
        <h3>Monto Recepcionado: $ {{ formatoPesoChileno(dataDinero.cantidadMonto) }}</h3>
        <h3>Monto Rectificado: $ {{ formatoPesoChileno(dataDinero.montoRectificado) }}</h3>
      </div>
      <AppDataTable
        id="tabla-dineros-recepcionados"
        class="col-12"
        :value="desgloseDineroRecepcionado"
      >
        <template #empty>
          No se han agregado archivos
        </template>
        <template #loading>
          Cargando datos de archivos
        </template>
        <Column header="Nacionalidad del dinero ">
          <template #body="">
            {{ tipoMonedaNombre(dataDinero.tipoMoneda) }}
          </template>
        </Column>
        <Column header="Denominación">
          <template #body="slotProps">
            {{ mantenedor_getNombreDenominacionDinero(slotProps?.data.denominacion) }}
          </template>
        </Column>
        <Column header="Tipo de Dinero">
          <template #body="slotProps">
            {{ tipoDineroNombre(slotProps?.data.tipoDinero) }}
          </template>
        </Column>
        <Column header="Cantidad Denominación">
          <template #body="slotProps">
            {{ slotProps?.data.cantidad }}
          </template>
        </Column>
        <Column header="Total">
          <template #body="slotProps">
            {{ slotProps?.data.total }}
          </template>
        </Column>
      </AppDataTable>
    </AppFieldset>
  </AppFieldset>
</section>
</template>

<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { useMantenedorStore } from '@/modules/global/composables'
import { useIdentificacionNueStore } from '../../composables'
// UTILITIES
const { mantenedor_getNombreFamiliaEspecie, mantenedor_getNombreTipoEspecie } = useMantenedorStore()
const { mantenedor_getNombreDenominacionDinero, mantenedor_getNombreTipoDinero, mantenedor_getNombreMoneda } = useMantenedorStore()
const { causaEncontradaAsociadaANue, desgloseDineroSeteado } = useIdentificacionNueStore()
// VALUES
const dineroRecepcionado = causaEncontradaAsociadaANue.value.especiesDinero
const desgloseDineroRecepcionado = desgloseDineroSeteado.value
const dataDinero = causaEncontradaAsociadaANue.value.especiesDinero[0].dineros[0]

// LOGIC
function tipoMonedaNombre (idTipoMoneda) {
  if (idTipoMoneda) {
    return mantenedor_getNombreMoneda(idTipoMoneda)
  }
  return 'Sin Tipo'
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
