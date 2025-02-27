<template>
<section class="col-12">
  <AppDataTable
    id="dataTableRelaciones"
    v-bind="$attrs"
  >
    <Column
      v-if="selectable"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column
      v-if="checked"
      header="En Consulta"
      header-style="width: 3em"
    >
      <template #body>
        <i class="pi pi-check-circle text-green-500 text-xl" />
      </template>
    </Column>
    <Column header="Victima(s)">
      <template #body="{ data }">
        {{ data?.nombreCompletoVictima ?? 'Sin Victima' }}
      </template>
    </Column>
    <Column header="Imputado(s)">
      <template #body="{ data }">
        {{ data?.nombreCompletoImputado ?? 'Sin Imputado' }}
      </template>
    </Column>
    <Column header="Delito">
      <template #body="{ data }">
        {{ data?.nombreDelito }}
      </template>
    </Column>
    <Column header="Estado de la relación">
      <template #body="{ data }">
        {{ data?.estado || 'N/A' }}
      </template>
    </Column>
    <Column header="Etapa de la relación">
      <template #body="{ data }">
        {{ data?.etapa || 'N/A' }}
      </template>
    </Column>
    <Column
      v-if="derivaUravit"
      header="Deriva a URAVIT"
    >
      <template #body="{ data }">
        {{ data?.derivaUravit }}
      </template>
    </Column>
    <Column
      v-if="alerta"
      header="Alerta"
    >
      <template #body="{ data }">
        {{ data?.alerta || 'N/A' }}
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

defineProps({
  readOnly: Boolean,
  selectable: Boolean,
  checked: Boolean,
  derivaUravit: Boolean,
  alerta: Boolean
})

const emit = defineEmits(['relacion:verDirectriz'])

const relacionSeleccionada = ref(null)

const menuRelacionesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-eye',
        label: 'Ver Directriz',
        command: () => emit('relacion:verDirectriz', relacionSeleccionada.value)
      }
    ]
  }
])
</script>
