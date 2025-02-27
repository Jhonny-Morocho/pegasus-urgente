<template>
<section>
  <AppDataTable
    id="dataTableIntervinientes"
    v-model="expandedRows"
    class="col-12 mt-5"
    :value="sujetosIntervinientes"
  >
    <Column header="Id">
      <template #body="{ data: { idPersona } }">
        {{ idPersona }}
      </template>
    </Column>
    <Column header="Nombres del Interviniente">
      <template #body="{ data: { interviniente } }">
        {{ interviniente.nombres }}
      </template>
    </Column>
    <Column header="Tipo de Interviniente">
      <template #body="{ data: { tipoSujeto } }">
        {{ tipoSujeto }}
      </template>
    </Column>
    <Column header="Número de Documento">
      <template #body="{ data: { interviniente } }">
        {{ interviniente.identificaciones[0].numeroDocumentoIdentificacion }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="{ index, data }">
        <Button
          class="mr-2 p-button-rounded"
          icon="pi pi-map-marker"
          @click="displayMapaDir(data.idPersona)"
        />
        <Button
          class="p-button-rounded p-button-warning p-button-outlined mr-2"
          icon="pi pi-pencil"
          @click="handleEditarSujeto(index, data)"
        />
        <Button
          class="p-button-rounded p-button-outlined p-button-danger"
          icon="pi pi-trash"
          @click="handleEliminarInterviniente(data)"
        />
      </template>
    </Column>
  </AppDataTable>
  <SujetosIntervinientesTablaDirecciones
    v-if="
      Object.keys(intervinienteSeleccionado).length &&
        intervinienteSeleccionado.interviniente.direcciones
    "
    :interviniente="intervinienteSeleccionado"
  />
</section>
</template>

<script setup>
import { ref } from 'vue'
// commons
import { useConfirmDialog } from '@/modules/common/composables/useConfirmDialog'

// store
import { useSujetosIntervinientesStore } from '@/modules/global/composables/useSujetosIntervinientesStore'

// components
import SujetosIntervinientesTablaDirecciones from './SujetosIntervinientesTablaDirecciones.vue'

// consts
const intervinienteSeleccionado = ref({})

const { sujetosIntervinientes, sujetosIntervinientes_deleteSujeto } =
  useSujetosIntervinientesStore()

const { launchConfirmDialog } = useConfirmDialog()
const expandedRows = ref([])

function handleEditarSujeto (indexFuncionario, funcionario) {
  console.log('editar sujeto', indexFuncionario, funcionario)
}

function displayMapaDir (id) {
  if (
    Object.keys(intervinienteSeleccionado).length &&
    intervinienteSeleccionado.value.idPersona !== id
  ) {
    intervinienteSeleccionado.value = sujetosIntervinientes.value.find(
      (sujeto) => sujeto.idPersona === id
    )
  } else {
    intervinienteSeleccionado.value = {}
  }
}

function handleEliminarInterviniente (data) {
  console.log(data)
  launchConfirmDialog({
    message: `¿Está seguro de eliminar al interviniente ${data.interviniente.nombres}`,
    accept: () => {
      if (
        Object.keys(intervinienteSeleccionado).length &&
        intervinienteSeleccionado.value.idPersona === data.idPersona
      ) {
        intervinienteSeleccionado.value = {}
      }
      sujetosIntervinientes_deleteSujeto(data.idPersona)
    }
  })
}
</script>
