<template>
<AppDataTable
  id="dataTableFuncionarios"
  v-bind="$attrs"
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
      {{ format(slotProps?.data?.rut) }}
    </template>
  </Column>
  <Column header="Nombre Funcionario">
    <template #body="slotProps">
      {{ slotProps?.data?.nombre }} {{ slotProps?.data?.apellidoPaterno }}
      {{ slotProps?.data?.apellidoMaterno }}
    </template>
  </Column>
  <Column header="Grado">
    <template #body="slotProps">
      {{ slotProps?.data?.grado }}
    </template>
  </Column>
  <Column header="N° Placa">
    <template #body="slotProps">
      {{ slotProps?.data?.numeroPlaca }}
    </template>
  </Column>
  <Column header="Es Testigo">
    <template #body="slotProps">
      <span v-if="slotProps?.data?.esTestigo">SI</span>
      <span v-else>NO</span>
    </template>
  </Column>
  <Column
    class="text-center"
    header="Acciones"
    style="width: 0"
  >
    <template #body="{ data }">
      <Button
        aria-controls="overlay_menu"
        aria-haspopup="true"
        class="p-button-rounded p-button-outlined"
        icon="pi pi-ellipsis-v"
        type="button"
        @click="toggleAcciones($event, data, index)"
      />
    </template>
  </Column>
</AppDataTable>
<Menu
  id="overlay_menu"
  ref="menuFuncionarios"
  :model=" menuFuncionariosItems"
  :popup="true"
/>
</template>

<script setup>
import { defineEmits, ref } from 'vue'

import { useConfirmDialog, useAppToast } from '@/modules/common/composables'
import { useFuncionarios, useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { format } from '@fiquu/cl-rut'

const { mantenedor_getNombreTipoFuncionarioById } = useMantenedorStore()

const { funcionario, funcionarios_deleteFuncionario } = useFuncionarios()
const { toastSuccess } = useAppToast()

const emit = defineEmits(['funcionario:rellenar', 'funcionario:actualizar-tabla'])

const { launchConfirmDialog } = useConfirmDialog()

const funcionarioSeleccionado = ref({})
const indexFuncionario = ref(null)

function toggleAcciones (event, data, index) {
  menuFuncionarios.value.toggle(event)
  funcionarioSeleccionado.value = data
  indexFuncionario.value = index
}

const menuFuncionarios = ref()
const menuFuncionariosItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-fw pi-pencil',
        label: 'Modificar',
        command: () =>
          handleEditarFuncionario(funcionarioSeleccionado.value, indexFuncionario.value)
      },
      {
        icon: 'pi pi-fw pi-trash',
        label: 'Eliminar',
        command: () =>
          handleEliminarFuncionario(funcionarioSeleccionado.value, indexFuncionario.value)
      }
    ]
  }
])
function handleEditarFuncionario (funcionarioData, index) {
  funcionarioData.rut = format(funcionarioData.rut.replace('-', ''))
  emit('funcionario:rellenar', { index, funcionarioData })
}

function handleEliminarFuncionario (f, indexFuncionarioValue) {
  launchConfirmDialog({
    message: `¿Está seguro de eliminar el funcionario? ${f.nombre} ${f.apellidoPaterno} ${f.apellidoMaterno}`,
    accept: () => {
      requestUtil({
        action: funcionarios_deleteFuncionario,
        payload: { idFuncionario: f.idFuncionario },
        resolve: () => {
          toastSuccess(`Funcionario ${f.nombre} ${f.apellidoPaterno} ${f.apellidoMaterno} eliminado`)
          emit('funcionario:actualizar-tabla')
        },
        reject: (e) => {
          console.error(e)
        }
      })
    }
  })
}
</script>
