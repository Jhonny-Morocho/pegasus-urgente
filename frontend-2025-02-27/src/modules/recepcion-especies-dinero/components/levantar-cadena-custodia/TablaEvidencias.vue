<template>
<AppDataTable
  id="tabla-evidencias"
  v-bind="$attrs"
  class="col-12"
>
  <Column
    header="Cantidad/Monto"
  >
    <template #body="{data}">
      {{ data?.cantidad }}
    </template>
  </Column>
  <Column
    v-if="esDinero"
    header="Coincide"
  >
    <template #body="{data}">
      {{ data?.coincide }}
    </template>
  </Column>
  <Column
    header="Descripción"
  >
    <template #body="{data}">
      {{ data.descripcionEspecie }}
    </template>
  </Column>
  <Column
    header="Lugar de levantamiento"
  >
    <template #body="{data}">
      {{ data.lugarLevantamiento }}
    </template>
  </Column>
  <Column
    v-if="show"
    header="Imagen"
  >
    <template #body="{ data }">
      <i
        v-if="data.fotografias[0].base64 === 'imagenes.value'"
        class="pi pi-images link"
        style="font-size: 2em"
        @click="openModalImagen(data.fotografias)"
      />
      <span v-else>Sin Imagen</span>
    </template>
  </Column>
  <Column
    v-else
    header="Imagen"
  >
    <template #body="{ data }">
      <i
        class="pi pi-images link"
        style="font-size: 2em"
        @click="openModalImagen(data.fotografias)"
      />
    </template>
  </Column>
  <Column
    v-if="show"
    header="Acciones"
    style="width:0"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="evidenciaSeleccionada"
        :menu-options="accionesEvidenciaLevantamiento"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { onMounted, ref, defineProps, defineEmits } from 'vue'
import { useLevantamientoCadenaCustodio } from '../../composables/useLevantamientoCadenaCustodio'
import ModalImagenEvidencia from '../../components/ver-cadena-custodia/modals/ModalImagenEvidencia'
import { useAppDialog } from '@/modules/common/composables'

const { levantamientoCadena_getEvidencias } = useLevantamientoCadenaCustodio()

onMounted(() => {
  levantamientoCadena_getEvidencias()
})

defineProps({
  show: {
    type: Boolean,
    default: true
  },
  editando: {
    type: Boolean,
    required: false
  }
})
const emit = defineEmits(['modificar', 'eliminar'])

const evidenciaSeleccionada = ref()

const { launchDialog } = useAppDialog()
// const { launchConfirmDialog } = useConfirmDialog()
// const { toastWarning } = useAppToast()

function openModalImagen (data) {
  launchDialog({
    component: ModalImagenEvidencia,
    header: `Imágenes`,
    width: '50%',
    props: {
      data
    },
    cancelLabel: 'Cerrar'
  })
}

const openEliminar = (data) => {
  console.log('DATA Evidencia eliminar', data)
  emit('eliminar', data)
}
const openModificarEvidencia = (data) => {
  console.log('DATA Evidencia', data)
  emit('modificar', data)
  // launchConfirmDialog({
  //   message: `¿Estás seguro de modificar la evidencia?`,
  //   accept: () => {
  //     levantamientoCadenaCustodio_SET_DATA_EVIDENCIA(data)
  //     toastWarning('Evidencia modificada con exitosamente')
  //   }
  // })
}
const accionesEvidenciaLevantamiento = ref([
  {
    label: 'Acciones para la tarea',
    items: [
      {
        label: 'Modificar',
        command: (props) => {
          console.log('Modificar')
          props.editando = true
          openModificarEvidencia(evidenciaSeleccionada.value)
        }
      },
      {
        label: 'Eliminar',
        command: (props) => {
          console.log('Eliminar', evidenciaSeleccionada.value)
          props.editando = false
          openEliminar(evidenciaSeleccionada.value)
        }
      }
    ]
  }
])
</script>
