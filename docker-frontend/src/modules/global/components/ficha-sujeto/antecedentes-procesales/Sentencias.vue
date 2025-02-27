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
    field="esVif"
    header="VIF"
  >
    <template #body="data">
      {{ data.esVif }}
    </template>
  </Column>
  <Column
    field="esRpa"
    header="RPA"
  >
    <template #body="data">
      {{ data.esRpa }}
    </template>
  </Column>
  <Column
    field="procedimiento"
    header="Procedimiento"
  >
    <template #body="data">
      {{ data.procedimiento }}
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
    field="fechaSentencia"
    header="Fecha Sentencia"
  >
    <template #body="data">
      {{ data.fechaSentencia }}
    </template>
  </Column>
  <Column
    field="detalle"
    header="Detalle"
  >
    <template #body="data">
      {{ data.detalle }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="data">
      <AppMenuOptions
        v-model="antecedenteSeleccionado"
        :auto-z-index="false"
        :menu-options="accionesDireccion"
        :slot-props="data"
        :z-base-index="99999"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { useAppDialog } from '@/modules/common/composables'
import { ref } from 'vue'
import ModalVerSentencia from '@/modules/global/components/ficha-sujeto/modals/ModalVerSentencia.vue'
import ModalDetallesFiscalAsignado from '@/modules/global/components/ficha-causa/modals/ModalDetallesFiscalAsignado.vue'

const { launchDialog } = useAppDialog()
const accionesDireccion = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Sentencia',
        command: () => {
          verModalSentencia()
        }
      }
    ]
  }
])
function verModalSentencia () {
  launchDialog({
    component: ModalVerSentencia,
    header: 'Sentencia',
    accept: () => {
      console.log('')
    },
    reject: () => {
      console.log('')
    },
    width: '60%'
  })
}
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
    width: '69%'
  })
}
</script>
