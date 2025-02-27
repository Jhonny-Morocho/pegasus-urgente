<template>
<AppDataTable
  id="dataEspeciesDinero"
  v-model:selection="especieSeleccionada"
  v-bind="$attrs"
  class="w-full"
  :loading="loaderNoIngresadas"
  responsive-layout="stack"
  :total-records="data.length"
  :value="data"
  @row-select="onRowSelect"
>
  <Column
    v-if="!selectable"
    class="text-center"
    header="Seleccionar"
    selection-mode="single"
  />
  <!-- modelo 2 -->
  <Column
    v-if="esModelo2"
    header="NUE"
  >
    <template #body="slotProps">
      <span
        class="link"
        @click="openConsultarCadenaCustodia"
      >
        {{ slotProps?.nue }}
      </span>
    </template>
  </Column>
  <Column
    v-if="esModelo2"
    header="RUE"
  >
    <template #body="slotProps">
      <span
        class="link"
        @click="openVerEspecie"
      >
        {{ slotProps?.rue }}
      </span>
    </template>
  </Column>
  <!-- campos generales -->
  <Column header="Familia Espiece">
    <template #body="slotProps">
      <span v-if="mantenedor_getNombreFamiliaEspecie(slotProps?.data.idFamilia)">
        {{ mantenedor_getNombreFamiliaEspecie(slotProps?.data.idFamilia) }}
      </span>
      <ProgressBar
        v-else
        mode="indeterminate"
        style="height: 0.5em"
      />
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="slotProps">
      <span v-if="mantenedor_getNombreTipoEspecie(slotProps?.data.idTipoEspecie)">
        {{ mantenedor_getNombreTipoEspecie(slotProps?.data.idTipoEspecie) }}
      </span>
      <ProgressBar
        v-else
        mode="indeterminate"
        style="height: 0.5em"
      />
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="slotProps">
      {{ slotProps?.data.descripcion }}
    </template>
  </Column>
  <!-- campos modelo 1 -->
  <div v-if="!esModelo2">
    <Column header="Marca">
      <template #body="slotProps">
        {{ slotProps?.data.descripcion }}
      </template>
    </Column>
    <Column :header="esDinero ? 'Monto' : 'Cantidad'">
      <template #body="slotProps">
        {{ esDinero ? "$ " + slotProps?.data.monto : slotProps?.data.cantidad }}
      </template>
    </Column>
    <Column header="Observaciones">
      <template #body="slotProps">
        {{
          !!slotProps?.data.observaciones
            ? slotProps?.data.observaciones
            : "Sin observaciones"
        }}
      </template>
    </Column>
    <Column header="Imágenes">
      <!-- eslint-disable-next-line vue/no-template-shadow -->
      <template #body="{data}">
        <i
          v-if="data?.documentos?.find((e) => e.id_filenet) !== undefined"
          class="pi pi-images link"
          style="font-size: 2em"
          @click="openModalImagen(data)"
        />
        <span v-else>Sin Imagen</span>
      </template>
    </Column>
    <Column header="Ingresada">
      <template #body="slotProps">
        {{ slotProps?.data.ingresada ? "Si" : "No" }}
      </template>
    </Column>
  </div>
  <!-- modelo2 -->
  <div v-if="esModelo2">
    <Column
      header="Cantidad"
    >
      <template #body="slotProps">
        {{ slotProps?.cantidad }}
      </template>
    </Column>
  </div>

  <!-- modelo3 -->
  <div v-if="esModelo3">
    <Column header="Bodega">
      <template #body="slotProps">
        {{ slotProps?.bodega }}
      </template>
    </Column>
    <Column header="Sector">
      <template #body="slotProps">
        {{ slotProps?.sector }}
      </template>
    </Column>
    <Column header="Casillero">
      <template #body="slotProps">
        {{ slotProps?.casillero }}
      </template>
    </Column>
  </div>
  <!-- campo codigo fiscalia -->
  <Column
    v-if="codigoFiscalia"
    header="Código Fiscalía"
  >
    <template #body="slotProps">
      {{ slotProps?.codigoFiscalia }}
    </template>
  </Column>

  <!-- acciones -->
  <Column
    v-if="!esDinero && !readOnly"
    class="text-center"
    field="acciones"
    filter-field="acciones"
    header="Acciones"
    style="width: 0"
  >
    <template #body="slotProps">
      <Button
        aria-controls="overlay_menu"
        aria-haspopup="true"
        class="p-button-rounded p-button-outlined btn-primary-outline"
        icon="pi pi-ellipsis-v"
        type="button"
        @click="toggleAcciones($event, slotProps.data)"
      />
    </template>
  </Column>
</AppDataTable>
<Menu
  id="overlay_menu"
  ref="menuAccionesTablaEspeciesIncautadas"
  :model="accionesTablaEspeciesIncautadas"
  :popup="true"
/>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { ref, defineProps, defineEmits } from 'vue'

const especieSeleccionada = ref()
const menuAccionesTablaEspeciesIncautadas = ref('')
const tareaSeleccionada = ref('')

const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
  // mantenedor_getCodigoFamiliaEspecieById
} = useMantenedorStore()

requestUtil({
  action: mantenedor_getAllTiposEspecie
})

requestUtil({
  action: mantenedor_getFamiliaEspecies
})

defineProps({
  data: propTypes.array,
  selectable: Boolean,
  readOnly: Boolean,
  esDinero: Boolean,
  codigoFiscalia: Boolean,
  loaderNoIngresadas: Boolean,
  esModelo2: {
    type: Boolean,
    default: false
  },
  esModelo3: {
    type: Boolean,
    default: false
  }
})

// const esDinero = computed(() => !!props.data.find(e => mantenedor_getCodigoFamiliaEspecieById(e.idFamilia) === '21'))

const emit = defineEmits(['seleccionar-especie', 'separar-item', 'open-modal-imagen'])

function onRowSelect () {
  emit('seleccionar-especie', especieSeleccionada.value)
}
function toggleAcciones (event, data) {
  menuAccionesTablaEspeciesIncautadas.value.toggle(event)
  tareaSeleccionada.value = data
}

function openModalImagen (data) {
  emit('open-modal-imagen', data)
}

const accionesTablaEspeciesIncautadas = ref([
  {
    label: 'Acciones Antecedentes',
    items: [
      {
        label: 'Separar',
        command: () => {
          emit('separar-item', tareaSeleccionada.value)
        }
      }
    ]
  }
])
</script>
<style scoped>
.link{
  cursor: pointer;
  color: #2C6DDF;
}
</style>
