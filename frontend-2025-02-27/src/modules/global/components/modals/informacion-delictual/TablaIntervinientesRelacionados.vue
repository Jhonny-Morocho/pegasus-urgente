<template>
<AppDataTable
  id="intervinientes-relacionados"
  class="col-12"
  v-bind="$attrs"
>
  <Column header="Tipo">
    <template #body="{ data }">
      {{ data?.Tipo }}
    </template>
  </Column>
  <Column header="Nro Documento">
    <template #body="{ data }">
      {{ data?.documento }}
    </template>
  </Column>
  <Column header="Nombre Completo">
    <template #body="{ data }">
      {{ data?.nombreCompleto }}
    </template>
  </Column>
  <Column header="Tipo Persona">
    <template #body="{ data }">
      {{ data?.tipoPersona }}
    </template>
  </Column>
  <Column header="Edad">
    <template #body="{ data }">
      {{ data?.edad }}
    </template>
  </Column>
  <Column header="Género">
    <template #body="{ data }">
      {{ data?.genero }}
    </template>
  </Column>
  <Column header="Fecha Nacimiento">
    <template #body="{ data }">
      {{ data?.fechaNacimiento }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        v-model="selected"
        :menu-options="opcionesMenuAcciones"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref(null)

const opcionesMenuAcciones = ref([
  {
    items: [
      {
        label: 'Ver Interviniente',
        icon: 'pi pi-search',
        command: () => {
          console.log('Ver Interviniente')
        }
      }
    ]
  }
])
</script>
