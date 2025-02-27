<template>
<AppFieldset
  legend="Causa Agrupada a la Principal"
  toggleable
>
  <Causa :data-causa="mockDataCausa" />
</AppFieldset>
<AppFieldset
  collapsed="true"
  legend="Causa Principal"
  toggleable
>
  <Causa :data-causa="mockDataCausa" />
</AppFieldset>
<AppFieldset
  collapsed="true"
  legend="Especies/Dinero de Causa Agrupada a la Principal"
  toggleable
>
  <EspeciesDinero :especies-dineros="mockEspeciesDinero" />
</AppFieldset>
<AppBtnNextTeleported
  class="mr-2"
  icon="pi pi-arrow-right"
  icon-pos="right"
  label="Seleccionar Reubicación "
  @click="nextStep"
/>
</template>
<script setup>
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import EspeciesDinero from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/EspeciesDinero.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useRouter } from 'vue-router'

const mockDataCausa = {
  ruc: '2200938215-8',
  fechaCreacionCausa: '18-09-2022',
  fiscaliaLocal: 'Casablanca',
  estadoCausa: 'Vigente',
  fiscalAsignado: 'Samuel Núñez P.',
  nombreCausa: 'Hurto simple 4 A 40 UTM a Gustavo',
  delitos: ['810 - Robo en lugar no habitado']
}

const mockEspeciesDinero = {
  nue: 1939406,
  especiesDineros: [
    {
      rue: '00012345-1',
      familiaEspecie: 'Herramienta',
      tipoEspecie: 'Napoleón',
      descripcion: 'Napoleón marca Stanley',
      alerta: true,
      cantidadMonto: 1,
      observaciones: 'Especie fue encontrada en un bolso de mano',
      bodega: 'Bodega 1',
      sector: 'Sector 1',
      casillero: 'Casillero 1'
    },
    {
      rue: '00012346-1',
      familiaEspecie: 'Herramienta',
      tipoEspecie: 'Alicate',
      descripcion: 'Alicate color rojo',
      alerta: false,
      cantidadMonto: 1,
      observaciones: 'Alicate con grasa',
      bodega: 'Bodega 1',
      sector: 'Sector 2',
      casillero: 'Casillero 2'
    },
    {
      rue: '00012347-1',
      familiaEspecie: 'Herramienta',
      tipoEspecie: 'Llaves',
      descripcion: 'Llave inglesa, llave francesa',
      alerta: false,
      cantidadMonto: 1,
      observaciones: 'Especie fue encontrada en un bolso de mano',
      bodega: 'Bodega 1',
      sector: 'Sector 2',
      casillero: 'Casillero 2'
    }
  ]
}

const router = useRouter()

function nextStep () {
  router.push('/custodia/custodio/decidir-reubicacion/seleccionar-reubicacion')
}
</script>
