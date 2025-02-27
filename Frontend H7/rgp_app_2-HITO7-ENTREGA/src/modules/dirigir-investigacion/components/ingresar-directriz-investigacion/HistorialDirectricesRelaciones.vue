<template>
<section>
  <AppFieldset
    :collapsed="esIngreso"
    legend="Historial de Directrices de Relaciones"
    :toggleable="true"
  >
    <AppDataTable
      class="col-12"
      data-key="id"
      responsive-layout="stack"
      :value="directrices"
      v-bind="$attrs"
    >
      <Column
        field="victima"
        header="Victima(s)"
      >
        <template #body="{data}">
          {{ data?.nombreVictima || 's/d' }}
        </template>
      </Column>
      <Column
        field="imputado"
        header="Imputado(s)"
      >
        <template #body="{data}">
          {{ data?.nombreImputado || 's/d' }}
        </template>
      </Column>
      <Column
        field="delito"
        header="Delito(s)"
      >
        <template #body="{data}">
          {{ data?.nombreDelito || 's/d' }}
        </template>
      </Column>
      <Column
        field="fechaDirectrizRelacion"
        header="Fecha/Hora"
      >
        <template #body="{data}">
          {{ formatDate(data?.fechaCreacion) || 's/d' }}
        </template>
      </Column>
      <Column
        field="usuario"
        header="Usuario"
      >
        <template #body="{data}">
          {{ data?.creadoPor || 's/d' }}
        </template>
      </Column>
      <Column
        class="p-0"
        field="directriz"
        header="Directriz de Investigación en la Relación"
      >
        <template #body="{data}">
          {{ data?.descripcionDirectriz || 's/d' }}
        </template>
      </Column>
      <Column
        class="text-center"
        header="Acciones"
      >
        <template #body="slotProps">
          <AppMenuOptions
            v-model="historialRelacionSeleccion"
            :menu-options="menuItems"
            :slot-props="slotProps"
          />
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'
import ModalVerDirectriz from '@/modules/dirigir-investigacion/components/modals/ModalVerDirectriz.vue'

const { launchDialog } = useAppDialog()

function openModal (historialSeleccionado) {
  console.log('🚀 ~ file: HistorialDirectricesRelaciones.vue ~ line 88 ~ openModal ~ historialSeleccionado', historialSeleccionado)
  launchDialog({
    component: ModalVerDirectriz,
    header: 'Ver Directriz',
    width: '67%',
    props: {
      directriz: historialSeleccionado?.descripcionDirectriz || '--'
    }
  })
}

const historialRelacionSeleccion = ref(null)

defineProps({
  esIngreso: Boolean,
  directrices: propTypes.array
})

const menuItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Ver Directriz',
        command: () => openModal(historialRelacionSeleccion.value)
      }
    ]
  }
])

function formatDate (value) {
  let fechaCreacion = value

  fechaCreacion = dateTimeUtil.addNMinutes(fechaCreacion, -180)

  return fechaCreacion
}
</script>
