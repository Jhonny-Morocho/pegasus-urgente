<template>
<AppDataTable
  id="direcciones-sujeto"
  class="col-12"
  :value="data"
>
  <Column
    field="ruc"
    header="RUC"
  >
    <template #body="{ data }">
      <Button
        class="p-button-text pl-0 ml-0 btn-primary-outline"
        :label="data?.ruc"
        @click="sendToFichaCausa(data)"
      />
    </template>
  </Column>
  <Column
    field="fiscalia"
    header="Fiscalía"
  >
    <template #body="data">
      {{ data.fiscalia }}
    </template>
  </Column>
  <Column
    field="fiscal"
    header="Fiscal"
  >
    <template #body="{ data }">
      <Button
        class="p-button-text pl-0 ml-0 btn-primary-outline"
        :label="data?.fiscal"
        @click="openModalDetallesFiscalAsignado(data)"
      />
    </template>
  </Column>
  <Column
    field="delito"
    header="Delito"
  >
    <template #body="data">
      {{ data.delito }}
    </template>
  </Column>
  <Column
    field="estadoCausa"
    header="Estado Causa"
  >
    <template #body="data">
      {{ data.estadoCausa }}
    </template>
  </Column>
  <Column
    field="fechaOrdenDetencion"
    header="Fecha Órden de Detención"
  >
    <template #body="data">
      {{ data.fechaOrdenDetencion }}
    </template>
  </Column>
  <Column
    field="estadoOrdenDetencion"
    header="Estado Órden de Detención"
  >
    <template #body="data">
      {{ data.estadoOrdenDetencion }}
    </template>
  </Column>
  <Column
    field="fechaTerminoOrdenDetencion"
    header="Fecha Término Órden de Detención"
  >
    <template #body="data">
      {{ data.fechaTerminoOrdenDetencion }}
    </template>
  </Column>
  <Column
    field="fechaCambioEstadoDeOrden"
    header="Fecha cambio estado Orden"
  >
    <template #body="data">
      {{ data.fechaCambioEstadoDeOrden }}
    </template>
  </Column>
  <Column
    field="tribunal"
    header="Tribunal"
  >
    <template #body="data">
      {{ data.tribunal }}
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { useAppDialog } from '@/modules/common/composables'
import ModalDetallesFiscalAsignado from '@/modules/global/components/ficha-causa/modals/ModalDetallesFiscalAsignado.vue'

const { launchDialog } = useAppDialog()
// Hay que hacer dinamico el modal del fiscal ??
function openModalDetallesFiscalAsignado () {
  launchDialog({
    component: ModalDetallesFiscalAsignado,
    header: 'Detalles Fiscal Asignado',
    accept: () => {
      console.log('accept')
    },
    reject: () => {
      console.log('reject')
    },
    width: '50%'
  })
}
</script>
