<template>
<div class="w-full">
  <AppDataTable
    breakpoint="960px"
    class="editable-cells-table"
    edit-mode="cell"
    responsive-layout="stack"
    :total-records="causasAgrupacion.length"
    :value="causasAgrupacion"
    @cell-edit-complete="onCellEditComplete"
  >
    <Column>
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined btn-primary-outline"
          icon="pi pi-plus"
          @click="abrirModalCausa(data)"
        />
      </template>
    </Column>
    <Column
      v-tooltip="'Seleccione una Condicion'"
      field="condicion"
      header="Condicion"
    >
      <template #editor="slotProps">
        <AppDropdown
          id="decision-causa"
          v-model="slotProps.data['condicion']"
          class="p-fluid m-0"
          label="Seleccione Condición"
          option-label="condicion"
          option-value="condicion"
          :options="[{ condicion: 'Causa Principal' }, { condicion: 'Causa a Agrupar' }]"
          placeholder
          show-clear
        />
      </template>
      <template #body="{ data }">
        <div class="dropdownDatatable flex flex-row md:flex-row justify-content-between p-2">
          <span>{{ data?.condicion }} </span>
          <i
            class="pi pi-chevron-down"
            style="color: darkgrey; margin-bottom: 3px"
          />
        </div>
      </template>
    </Column>
    <Column
      field="ruc"
      header="RUC"
    />
    <Column
      field="rutVictima"
      header="RUT VICTIMA"
    />
    <Column
      field="rutImputado"
      header="RUT IMPUTADO"
    />
    <Column
      field="delito"
      header="Delito"
    />
    <Column
      field="fiscalia"
      header="Fiscalia"
    />
    <Column
      field="fiscalAsignado"
      header="Fiscal Asignado"
    />
    <Column
      field="causaJudicilizada"
      header="Causa Judicializada"
    >
      <template #body="{ data }">
        {{ data?.causaJudicilizada }}
      </template>
    </Column>
    <Column>
      <template #body="slotProps">
        <AppMenuOptions
          v-model="causaAEliminar"
          :menu-options="menuAccionesAgruparCausa"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

import ModalVerMasCausa from '@/modules/dirigir-investigacion/components/modals/ModalVerMasCausa.vue'
import { useAppDialog } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

const { resumenCausa } = useDirigirInvestigacionStore()
const { launchDialog } = useAppDialog()

const props = defineProps({
  causasAgrupacion: propTypes.array
})

onMounted(() => {
  console.log('cmp - TablaAgruparCausas.vue - onMounted()')
  setCondicionesCausas()
})

const causaAEliminar = ref(null)

/** Setear condiciones de las causas (Principal, Agrupar) */
function setCondicionesCausas () {
  props.causasAgrupacion.forEach((causa) => {
    if (causa.tipoCausa === 'Actual') {
      causa.condicion = 'Causa Principal'
      return
    }
    causa.condicion = 'Causa a Agrupar'
  })
}

/** In-Cell editing para la condicion de la Causa */
function onCellEditComplete (e) {
  const { data, newValue, field } = e

  data[field] = newValue
}

const menuAccionesAgruparCausa = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => {
          console.log('handleEliminarCausa()', causaAEliminar.value)
        },
        disabled: () => {
          return causaAEliminar.value?.tipoCausa === 'Actual'
        }
      }
    ]
  }
])
function abrirModalCausa () {
  console.log(resumenCausa)
  launchDialog({
    component: ModalVerMasCausa,
    header: 'Más Información de la Causa',
    width: '48%',
    props: { data: resumenCausa },
    cancelLabel: 'Cerrar'
  })
}
</script>
<style scoped>
.dropdownDatatable {
  padding: 0.75rem !important;
  cursor: pointer;
}
</style>
