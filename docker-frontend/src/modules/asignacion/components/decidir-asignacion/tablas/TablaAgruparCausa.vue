<template>
<div class="w-full">
  <AppDataTable
    breakpoint="960px"
    class="editable-cells-table"
    edit-mode="cell"
    responsive-layout="stack"
    :value="causasAgrupar"
    @cell-edit-complete="onCellEditComplete"
  >
    <template #header>
      <div class="flex justify-content-start align-items-center">
        <h3 class="m-2">
          Causas a Agrupar
        </h3>
      </div>
    </template>
    <Column
      field="esCausaPrincipal"
      header="Seleccione Condición"
      style="min-width: 175px"
    >
      <template #editor="slotProps">
        <Dropdown
          v-model="slotProps.data['esCausaPrincipal']"
          class="my-0"
          option-label="descripcion"
          option-value="descripcion"
          :options="[
            { descripcion: 'Causa Principal' },
            { descripcion: 'Causa a Agrupar' }
          ]"
          placeholder="Seleccione Condición"
        />
      </template>
      <template #body="{ data }">
        <div
          v-if="data.ruc === ruc && data.esCausaPrincipal === 'Causa a Agrupar'"
          class="dropdownDatatable flex flex-row md:flex-row justify-content-between"
        >
          Causa Actual
          <i
            class="pi pi-chevron-down"
            style="color: darkgrey; margin-bottom: 3px"
          />
        </div>
        <div
          v-else
          class="dropdownDatatable flex flex-row md:flex-row justify-content-between"
        >
          {{ data.esCausaPrincipal }}
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
    >
      <template #body="slotProps">
        {{ slotProps.data[slotProps.column.props.field] }}
      </template>
    </Column>
    <Column
      field="rutVictima"
      header="RUT Víctima"
    >
      <template #body="slotProps">
        {{ slotProps.data[slotProps.column.props.field] }}
      </template>
    </Column>
    <Column
      field="rutImputado"
      header="RUT Imputado"
    >
      <template #body="slotProps">
        {{ slotProps.data[slotProps.column.props.field] }}
      </template>
    </Column>
    <Column
      field="delito"
      header="Delito"
    >
      <template #body="slotProps">
        {{ slotProps.data[slotProps.column.props.field] }}
      </template>
    </Column>
    <Column
      field="direccionDelito"
      header="Dirección Delito"
    >
      <template #body="slotProps">
        {{ slotProps.data[slotProps.column.props.field] }}
      </template>
    </Column>
    <Column
      field="tipoCausa"
      header="Tipo Causa"
    >
      <template #body="slotProps">
        {{ slotProps.data[slotProps.column.props.field] }}
      </template>
    </Column>

    <Column
      class="text-center"
      header="Acciones"
      style="width: 0"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="causaAEliminar"
          :menu-options="menuAccionesCausas"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue'
import { requestUtil } from '@/utils'
import { useCausaAsignacionStore } from '@/modules/asignacion/composables'
import { useCausasRelacionadasStore } from '@/modules/preclasificador/composables'
import { useAppToast } from '@/modules/common/composables'
import AppMenuOptions from '@/modules/common/components/AppMenuOptions.vue'

const { ruc } = useCausaAsignacionStore()
const { causasRelacionadas_getCausasRelacionadas, causasRelacionadas } = useCausasRelacionadasStore()

const causasAgrupar = ref([])

const { toastWarning } = useAppToast()

defineExpose({
  causasAgrupar
})

const onCellEditComplete = (event) => {
  const { data, newValue, field } = event

  if (newValue === 'Causa Principal') {
    causasAgrupar.value.forEach((causa) => {
      if (causa.ruc !== data.ruc) {
        causa.esCausaPrincipal = 'Causa a Agrupar'
      }
    })
  }

  data[field] = newValue
}

onMounted(async () => {
  obtenerCausasRelacionadas()

  causasAgrupar.value = causasRelacionadas.value

  // Setear la condicion de cada causa a 'Causa a Agrupar' excepto la causa actual
  causasAgrupar.value.forEach((causa) => {
    if (causa.tipoCausa === 'Actual') {
      causa.esCausaPrincipal = 'Causa Principal'
      return
    }
    causa.esCausaPrincipal = 'Causa a Agrupar'
  })
})

// Obtener causas relacionadas por ruc
async function obtenerCausasRelacionadas () {
  requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      ruc: ruc.value
    }
  })
}

async function eliminarCausa (causa) {
  console.log('🚀 ~ file: TablaAgruparCausa.vue ~ line 184 ~ eliminarCausa ~ causa', causa)
  causasAgrupar.value = causasAgrupar.value.filter((c) => c.ruc !== causa.ruc)
  toastWarning(`Causa con ruc: ${causa.ruc} eliminada`)
}

const causaAEliminar = ref(null)

const menuAccionesCausas = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => {
          eliminarCausa(causaAEliminar.value)
        },
        disabled: () => {
          return causaAEliminar.value?.tipoCausa === 'Actual'
        }
      }
    ]
  }
])
</script>
