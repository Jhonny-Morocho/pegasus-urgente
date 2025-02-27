<template>
<section class="w-full">
  <div>
    <InputText
      v-model="filtrosTabla['global'].value"
      class="mb-4 col-12 md:col-4 md:col-offset-8 md:w-4"
      :global-filter-fields="['nombreCompletoVictima', 'nombreCompletoImputado', 'nombreDelito']"
      placeholder="Búsqueda"
    />
  </div>
  <AppDataTable
    id="dataTableRelaciones"
    v-bind="$attrs"
    v-model:filters="filtrosTabla"
  >
    <Column
      v-if="selectable"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column
      field="nombreCompletoVictima"
      header="Victima(s)"
    >
      <template #body="{ data }">
        {{ data?.nombreCompletoVictima || 'Sin Victima' }}
      </template>
    </Column>
    <Column
      field="nombreCompletoImputado"
      header="Imputado(s)"
    >
      <template #body="{ data }">
        {{ data?.nombreCompletoImputado || 'Sin Imputado' }}
      </template>
    </Column>
    <Column
      field="nombreDelito"
      header="Delito"
    >
      <template #body="{ data }">
        {{ data?.nombreDelito }}
      </template>
    </Column>
    <Column header="Estado">
      <template #body="{ data }">
        {{ data?.estadoRelacionDescripcion || '--' }}
      </template>
    </Column>
    <Column header="Etapa">
      <template #body="{ data }">
        {{ data?.etapaRelacionDescripcion || '--' }}
      </template>
    </Column>
    <slot name="URAVIT" />
    <Column
      v-if="!readOnly"
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="relacionSeleccionada"
          :menu-options="menuRelacionesItems"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'
import { FilterMatchMode } from 'primevue/api'

defineProps({
  readOnly: Boolean,
  selectable: Boolean
})

const filtrosTabla = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const emit = defineEmits(['relacion:editarRelacion', 'relacion:eliminarRelacion', 'relacion:derivarUravit'])

const relacionSeleccionada = ref(null)

const menuRelacionesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () => emit('relacion:editarRelacion', relacionSeleccionada.value)
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => emit('relacion:eliminarRelacion', relacionSeleccionada.value)
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Derivar a URAVIT',
        command: () => emit('relacion:derivarUravit', relacionSeleccionada.value),
        disabled: () => true
      }
    ]
  }
])
</script>
