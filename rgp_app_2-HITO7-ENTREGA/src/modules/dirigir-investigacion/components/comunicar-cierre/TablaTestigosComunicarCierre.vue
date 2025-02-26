<template>
<section class="col-12">
  <AppDataTable
    v-bind="$attrs"
    id="tabla-sujetos"
    edit-mode="cell"
    @cell-edit-complete="onCellEditComplete"
  >
    <Column selection-mode="multiple" />

    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ data?.descripcionTipoSujeto }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        {{ data?.numeroDocumento }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ data?.nombres }}
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ data?.direccion }}
      </template>
    </Column>

    <Column header="Comuna">
      <template #body="{ data }">
        {{ data?.comuna }}
      </template>
    </Column>
    <Column header="Apercibido">
      <template #body>
        Si
      </template>
    </Column>
    <Column
      field="detencion"
      header="Identidad Protegida"
    >
      <template #editor="slotProps">
        <Checkbox
          v-model="slotProps.data.detencion"
          :binary="true"
        />
      </template>
      <template #body="{ data }">
        <Checkbox
          v-model="data.detencion"
          :binary="true"
        />
      </template>
    </Column>
    <Column
      field="detencion"
      header="Envío Reservado al Tribunal"
    >
      <template #editor="slotProps">
        <Checkbox
          v-model="slotProps.data.detencion"
          :binary="true"
        />
      </template>
      <template #body="{ data }">
        <Checkbox
          v-model="data.detencion"
          :binary="true"
        />
      </template>
    </Column>
    <Column
      v-if="!readOnly && !isEditando"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="sujeto"
          :menu-options="opcionesSujeto"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import Checkbox from 'primevue/checkbox'

defineProps({
  readOnly: Boolean,
  isEditando: Boolean
})

const emit = defineEmits(['modificar', 'eliminar', 'ver-mas', 'get-ficha-sujeto', 'get-ficha-contacto', 'get-direcciones', 'derivar-a-uravit', 'solicitar-app-pauta', 'definir-medidas-proteccion'])

const sujeto = ref()

function onCellEditComplete (event) {
  const { data, newValue, field } = event
  console.log({ data, newValue, field })

  data[field] = newValue
}

const opcionesSujeto = ref([
  {
    label: 'Derivar a URAVIT',
    command: () => {
      emit('derivar-a-uravit', sujeto.value)
    }
  }
])
</script>
