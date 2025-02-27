<template>
<AppDataTable
  id="dataTableFuncionarios"
  v-bind="{...$attrs}"
  :total-records="funcionario.length"
  :value="funcionario"
>
  <Column header="Tipo Funcionario">
    <template #body="slotProps">
      {{ mantenedor_getNombreTipoFuncionarioById(slotProps.data.tipo) }}
    </template>
  </Column>
  <Column header="Rut Funcionario">
    <template #body="slotProps">
      {{ format(slotProps.data.rut) }}
    </template>
  </Column>
  <Column header="Nombre Funcionario">
    <template #body="slotProps">
      {{ slotProps.data.nombre }} {{ slotProps.data.apellidoPaterno }}
      {{ slotProps.data?.apellidoMaterno }}
    </template>
  </Column>
  <Column header="Grado">
    <template #body="slotProps">
      {{ slotProps.data.grado }}
    </template>
  </Column>
  <Column header="N° Placa">
    <template #body="slotProps">
      {{ slotProps.data.numeroPlaca }}
    </template>
  </Column>
  <Column header="Es Testigo">
    <template #body="slotProps">
      <span v-if="slotProps.data.esTestigo">SI</span>
      <span v-else>NO</span>
    </template>
  </Column>
  <Column
    class="text-center"
    header="Acciones"
    style="width:0px"
  >
    <template #body="slotProps">
      <Button
        aria-controls="overlay_menu"
        aria-haspopup="true"
        class="p-button-rounded p-button-outlined"
        icon="pi pi-ellipsis-v"
        type="button"
        @click="toggleAcciones($event, slotProps.index, slotProps.data)"
      />
    </template>
  </Column>
</AppDataTable>
<Menu
  id="overlay_menu"
  ref="menuFuncionarios"
  :model="menuItems"
  :popup="true"
/>
</template>

<script setup>
import { defineEmits, ref, computed } from 'vue'
import { requestUtil } from '@/utils'
import { format } from '@fiquu/cl-rut'

import { useConfirmDialog, useAppToast } from '@/modules/common/composables'
import { useFuncionarios, usePamStore, useMantenedorStore } from '@/modules/global/composables'
import { useProcedimientosBandejaStore } from '@/modules/flagrancia/composables/useProcedimientosBandejaStore'

const {
  funcionarios_deleteFuncionario, funcionarios_DELETE_FUNCIONARIO,
  funcionarios_getFuncionarioIdProcedimiento, funcionario
} = useFuncionarios()
const { mantenedor_getNombreTipoFuncionarioById } = useMantenedorStore()
const { estadoFolio } = useProcedimientosBandejaStore()

const { procesoPam } = usePamStore()

const { toastSuccess } = useAppToast()

const emit = defineEmits(['funcionario:rellenar'])

const { launchConfirmDialog } = useConfirmDialog()

function handleEditarFuncionario (index, funcionarioData) {
  emit('funcionario:rellenar', {
    index,
    funcionarioData
  })
}

function handleEliminarFuncionario (indexFuncionarioValue, funcionarioEliminar) {
  console.log('index: ', indexFuncionarioValue, ' funcionario: ', funcionarioEliminar)
  launchConfirmDialog({
    message: `¿Está seguro de eliminar el funcionario? ${funcionarioEliminar.nombre} ${funcionarioEliminar.apellidoPaterno} ${funcionarioEliminar.apellidoMaterno}`,
    accept: () => {
      if (funcionarioEliminar.idFuncionario) {
        requestUtil({
          action: funcionarios_deleteFuncionario,
          payload: { idFuncionario: funcionarioEliminar.idFuncionario },
          resolve: () => {
            toastSuccess(`Funcionario ${funcionarioEliminar.nombre} ${funcionarioEliminar.apellidoPaterno} ${funcionarioEliminar.apellidoMaterno} eliminado`)
            getFuncionarios()
          }
        })
      } else {
        funcionarios_DELETE_FUNCIONARIO(indexFuncionarioValue)
        toastSuccess(`Funcionario ${funcionarioEliminar.nombre} ${funcionarioEliminar.apellidoPaterno} ${funcionarioEliminar.apellidoMaterno} eliminado`)
      }
    }
  })
}

function getFuncionarios () {
  requestUtil({
    action: funcionarios_getFuncionarioIdProcedimiento,
    payload: {
      idProcedimiento: procesoPam.value.idProcedimiento
    }

  })
}
const indexFuncionario = ref(null)
const dataFuncionario = ref({})
const isFolioCerrado = computed(() => estadoFolio.value === 'Cerrado')

function toggleAcciones (event, index, f) {
  menuFuncionarios.value.toggle(event)
  indexFuncionario.value = index
  dataFuncionario.value = f
}

const menuFuncionarios = ref()

const menuItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () => handleEditarFuncionario(indexFuncionario.value, dataFuncionario.value),
        disabled: isFolioCerrado.value

      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () => handleEliminarFuncionario(indexFuncionario.value, dataFuncionario.value),
        disabled: isFolioCerrado.value

      }
    ]
  }
])
</script>
