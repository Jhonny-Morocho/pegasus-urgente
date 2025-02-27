<template>
<AppDataTable
  id="tablaDocumentos"
  class="col-12"
  :loading="loading"
  :total-records="documentos?.length ?? 0"
  :value="documentos"
  v-bind="$attrs"
>
  <Column header="Fecha">
    <template #body="slotProps">
      {{ dateTimeUtil.formatToFrontendWithTime(slotProps.data.fecha_creacion) }}
    </template>
  </Column>
  <Column header="Nombre del archivo">
    <template #body="slotProps">
      {{ slotProps.data.nombre_archivo ? slotProps.data.nombre_archivo : slotProps.data.titulo }}
    </template>
  </Column>
  <Column header="Descripción del archivo">
    <template #body="slotProps">
      <span v-if="slotProps.data.descripcion">
        {{ slotProps.data.descripcion }}
      </span>
      <span v-else>Sin descripción</span>
    </template>
  </Column>
  <Column header="Procedencia/Etapa">
    <template #body="slotProps">
      {{ slotProps.data.procedencia ?? 'Sin procedencia' }}
    </template>
  </Column>
  <Column 
    v-if="showImage"
    header="Imagen"
  >
    <template #body="slotProps">
      <i class="pi pi-image link" @click="openVerImage(slotProps)"/>
    </template>
  </Column>
  <Column
    v-if="!readOnly"
    class="text-center"
    header="Acciones"
    style="width:0"
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
  ref="menuAccionesTablaFijacionFotografica"
  :model="accionesTablaFijacionFotografica"
  :popup="true"
/>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { propTypes } from '@/modules/common/types'
// components
import ModalVerDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalVerDocumento.vue';
// composables
import { useAppDialog } from '@/modules/common/composables';
// utils
import { dateTimeUtil } from '@/utils'

defineProps({
  documentos: propTypes.array,
  readOnly: Boolean,
  showImage: Boolean,
  loading: Boolean,
  loaderGetArchivos: Boolean
})

const { launchDialog } = useAppDialog()
const menuAccionesTablaFijacionFotografica = ref('')
const tareaSeleccionada = ref('')

const emit = defineEmits(['get-archivo', 'delete-archivo'])

const accionesTablaFijacionFotografica = ref([
  {
    items: [
      {
        label: 'Ver archivo',
        command: () => {
          emit('get-archivo', tareaSeleccionada.value.id_filenet)
        }
      },
      {
        label: 'Eliminar',
        command: () => {
          emit('delete-archivo', tareaSeleccionada.value)
        }
      }
    ]
  }
])

function toggleAcciones (event, data) {
  menuAccionesTablaFijacionFotografica.value.toggle(event)
  tareaSeleccionada.value = data
}

function openVerImage(dataDocumento){
  launchDialog({
    component: ModalVerDocumento,
    header: `${dataDocumento.nombreArchivo}`,
    props: { data: dataDocumento },
    cancelLabel: 'Cerrar',
    width: '60%',
  })
}
</script>

<style scoped>
.link {
  color: #2C6DDF;
  cursor: pointer;
  font-size: 2rem;
}
</style>