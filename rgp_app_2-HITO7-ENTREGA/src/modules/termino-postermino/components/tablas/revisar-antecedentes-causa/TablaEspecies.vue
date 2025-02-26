<template>
<AppDataTable
  id="tabla-especies"
  v-bind="$attrs"
  class="col-12"
>
  <Column header="Familia Especie">
    <template #body="{ data }">
      {{
        familiaEspecie(data?.familiaEspecie) ??
          "No esta el id en el mantenedor"
      }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="{ data }">
      {{
        tipoEspecie(data?.idTipoEspecie) ??
          data.idTipoEspecie
      }}
    </template>
  </Column>
  <Column header="Ámbito Especie">
    <template #body="{ data }">
      {{ ambitoEspecie(data?.ambitoEspecie) }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="{ data }">
      {{ data?.descripcion }}
    </template>
  </Column>
  <Column header="Cantidad">
    <template #body="{ data }">
      {{ data?.cantidadEspecie }}
    </template>
  </Column>
  <Column header="Observaciones">
    <template #body="{ data }">
      {{ data?.observacion || "N/A" }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        v-model="especie"
        :menu-options="seeMoreOption ? especiesOpcionSeeMore : especieOptions"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import AppMenuOptions from '@/modules/common/components/AppMenuOptions.vue'
import { ref, defineEmits, defineProps } from 'vue'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const props = defineProps({
  readOnly: Boolean,
  seeMoreOption: {
    type: Boolean,
    default: false
  }
})

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreAmbitoEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

function familiaEspecie (idFamiliaEspecie) {
  if (idFamiliaEspecie) {
    return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie)
  }
  return 'Sin Familia'
}

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}

function ambitoEspecie (idAmbito) {
  return mantenedor_getNombreAmbitoEspecie(idAmbito) ?? 'Sin Ambito' // llegan ambitos con 0
}

const emit = defineEmits([
  'ver-mas',
  'solicitar-inspeccion',
  'definir-destino'
])
/*eslint-disable*/

const especie = ref();

const especieOptions = ref([
  {
    label: "Ver Más",
    command: () => emit("ver-mas", especie.value),
    disabled: () => props.readOnly,
  },
  {
    label: "Solicitar Inspección Visual",
    command: () => emit("solicitar-inspeccion", especie.value),
    disabled: () => props.readOnly,
  },
  {
    label: "Definir Destino de la Especie",
    command: () => emit("definir-destino", especie.value),
    disabled: () => props.readOnly,
  },
]);

const especiesOpcionSeeMore = ref([
  {
    label: "Acciones",
    items: [
      {
        label: "Ver Más",
        command: () => {
          emit("ver-mas", especie.value);
        },
      },
    ],
  },
]);
</script>
