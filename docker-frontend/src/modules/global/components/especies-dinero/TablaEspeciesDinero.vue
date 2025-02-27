<template>
<AppDataTable
  id="dataTableEspecies"
  v-model:selection="especieSeleccionada"
  class="col-12"
  v-bind="{ ...$attrs }"
  :loading="isLoadingTable || loading"
  :value="dataEspeciesDinero"
>
  <Column
    v-if="isSolicitud"
    header="Seleccionar"
    style="width: 48px"
  >
    <template #body="{ data }">
      <div class="flex justify-content-center">
        <input
          :id="data.idTipoEspecie"
          v-model="especieSeleccionada"
          class="p-checkbox"
          type="radio"
          :value="data"
        >
      </div>
    </template>
  </Column>
  <Column header="Ámbito de Especie">
    <template #body="{ data }">
      {{ nombreAmbitoEspecie(data.ambitoEspecie) }}
    </template>
  </Column>
  <Column header="NUE">
    <template #body="{ data }">
      {{ data.nue }}
    </template>
  </Column>
  <Column header="Familia Especie">
    <template #body="{ data }">
      {{ familiaEspecie(data.familiaEspecie) ?? 'No definido' }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="{ data }">
      {{ tipoEspecie(data.idTipoEspecie) ?? 'No definido' }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="{ data }">
      <div v-tooltip.bottom="data.descripcion">
        {{ data.descripcion.slice(0, 15) }}<span v-if="data.descripcion.length > 15">...</span>
      </div>
    </template>
  </Column>
  <Column
    v-if="!isSolicitud"
    header="Cantidad"
  >
    <template #body="{ data }">
      {{ data.cantidadEspecie }}
    </template>
  </Column>
  <Column
    v-if="!readOnly && esFichaCausa && !isSolicitud"
    class="text-center"
    header="Acciones"
    style="width: 0"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="especieSeleccionada"
        :menu-options="esFichaCausa ? menuEspeciesFichacausa : menuEspecieItems"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps, ref, defineEmits, defineExpose, computed } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables/'
import { requestUtil } from '@/utils'

const especieSeleccionada = ref(null)

defineExpose({ especieSeleccionada })

const props = defineProps({
  dataEspeciesDinero: propTypes.array,
  isEditando: Boolean,
  isSolicitud: Boolean,
  readOnly: Boolean,
  esFichaCausa: Boolean,
  isLoadingTable: Boolean,
  isDisabled: { type: Boolean, default: false }

})

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getNombreAmbitoEspecie,
  mantenedor_getAllTiposEspecie,
  mantenedor_getAmbitoEspecie,
  mantenedor_getFamiliaEspecies,
  familiaEspecies, allTiposEspecie, ambitoEspecie

} = useMantenedorStore()

const emit = defineEmits([
  'tabla-especies:proponer-destino-especie',
  'tabla-especies:editar-especie',
  'tabla-especies:eliminar-especie'
])

const dataToEmit = null

function familiaEspecie (idFamiliaEspecie) {
  requestUtil({
    action: mantenedor_getFamiliaEspecies
  })
  return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie) ?? 'Sin Familia'
}

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie) ?? 'Sin Tipo'
}

function nombreAmbitoEspecie (idAmbito) {
  requestUtil({
    action: mantenedor_getAmbitoEspecie
  })
  return mantenedor_getNombreAmbitoEspecie(idAmbito) ?? 'Sin Ambito' // llegan ambitos con 0
}

const loading = computed(() => { return !familiaEspecies.value.length && !allTiposEspecie.value.length && !ambitoEspecie.value.length && !!props.dataEspeciesDinero.length })

// SI ALGO TIENE RELACION CON PRECLASIFICADOR PUEDEN ELIMINAR
// PRECLASIFICADOR TIENE SU PROPIA TABLA DE ESPECIES IGUAL QUE ASIGNACION

const menuEspecieItems = ref([
  {
    label: 'Acciones',
    items: [

      {
        label: 'Proponer destino de la especie',
        command: () => emit('tabla-especies:proponer-destino-especie', dataToEmit)
      }

    ]
  }
])
const menuEspeciesFichacausa = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () => emit('tabla-especies:editar-especie', especieSeleccionada.value),
        disabled: props.isDisabled

      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => {
          console.log(especieSeleccionada.value)
          emit('tabla-especies:eliminar-especie', especieSeleccionada.value)
        },
        disabled: props.isDisabled
      }
    ]
  }
])

</script>
