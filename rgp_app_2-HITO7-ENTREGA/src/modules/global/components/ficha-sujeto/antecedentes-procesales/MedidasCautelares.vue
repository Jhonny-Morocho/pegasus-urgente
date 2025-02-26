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
    field="nombreCausa"
    header="Nombre Causa"
  >
    <template #body="data">
      {{ data.nombreCausa }}
    </template>
  </Column>
  <Column
    field="nombreMedidaCautelar"
    header="Nombre Medida"
  >
    <template #body="data">
      {{ data.nombreMedidaCautelar }}
    </template>
  </Column>
  <Column
    field="alerta"
    header="Alerta"
  >
    <template #body="data">
      {{ data.alerta }}
    </template>
  </Column>
  <Column
    field="estado"
    header="Estado"
  >
    <template #body="data">
      {{ data.estado }}
    </template>
  </Column>
  <Column
    field="detalleMedidaOCondicion"
    header="Detalle medida y/o condición"
  >
    <template #body="data">
      {{ data.detalleMedidaOCondicion }}
    </template>
  </Column>
  <Column
    field="nroControl"
    header="Nro. de control"
  >
    <template #body="data">
      {{ data.nroControl }}
    </template>
  </Column>
  <Column
    field="fechaDeRegistro"
    header="Fecha de registro"
  >
    <template #body="data">
      {{ data.fechaDeRegistro }}
    </template>
  </Column>
  <Column
    field="observaciones"
    header="Observaciones"
  >
    <template #body="{ data }">
      <Button
        class="p-button-text pl-0 ml-0 btn-primary-outline"
        :label="data?.observaciones"
        @click="abrirModalDetalle(data)"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { useAppDialog } from '@/modules/common/composables'
import ModalDetalle from '@/modules/global/components/ficha-sujeto/modals/ModalDetalle.vue'

const { launchDialog } = useAppDialog()

function abrirModalDetalle () {
  launchDialog({
    component: ModalDetalle,
    header: 'Detalles ',
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
