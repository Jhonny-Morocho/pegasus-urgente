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
    field="audiencia"
    header="Audiencia"
  >
    <template #body="data">
      {{ data.audiencia }}
    </template>
  </Column>
  <Column
    field="fechaFormalizacion"
    header="Fecha Formalización"
  >
    <template #body="data">
      {{ data.fechaFormalizacion }}
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
    field="fiscalia"
    header="Fiscalía"
  >
    <template #body="data">
      {{ data.fiscalia }}
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
    field="detalle"
    header="Detalle"
  >
    <template #body="data">
      <Button
        class="p-button-text pl-0 ml-0 btn-primary-outline"
        :label="data?.detalle"
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
