<template>
<section class="mb-6 pb-6">
  <AppFieldset legend="Parte/Denuncia Registrados">
    <DataTable
      class="w-full px-3"
      :paginator="true"
      responsive-layout="scroll"
      :rows="5"
      striped-rows
      :total-records="partes.length"
      :value="partes"
    >
      <Column
        field="numeroParteDenuncia"
        header="Nº Parte Denuncia"
      />
      <Column
        field="documentosRecibidos"
        header="Documentos Recibidos"
      >
        <template #body="{ data }">
          <span>
            {{ data.documentos.length || 0 }}
          </span>
        </template>
      </Column>
      <Column
        field="documentos"
        header="Documentos Faltantes"
      >
        <template #body="{ data }">
          <span>
            {{ data.documentos.filter((d) => d.esDocumentoFaltante === true).length }}
          </span>
        </template>
      </Column>
      <Column
        field="fechaOcurrencia"
        header="Fecha/Hora Denuncia"
      >
        <template #body="{ data }">
          <span>
            {{ dateTimeUtil.formatToFrontendWithTime(data.fechaOcurrencia) }}
          </span>
        </template>
      </Column>
      <Column
        header="Acciones"
        style="width: 74px"
      >
        <template #body="{ data }">
          <div class="flex justify-content-center">
            <Button
              aria-controls="overlay_menu"
              aria-haspopup="true"
              class="p-button-rounded p-button-outlined btn-primary-outline"
              icon="pi pi-ellipsis-v"
              type="button"
              @click="toggleAcciones($event, data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </AppFieldset>
  <Menu
    id="overlay_menu"
    ref="menuPartes"
    :model="menuPartesItems"
    :popup="true"
  />
</section>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useOficinaPartesStore } from '@/modules/global/composables/useOficinaPartesStore'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'

const { launchConfirmDialog } = useConfirmDialog()
const { toastWarning } = useAppToast()
const { partes, oficinaPartes_ELIMINAR_PARTE_DENUNCIA } = useOficinaPartesStore()

const emit = defineEmits(['tabla-parte-denuncia:modificar'])
const menuPartes = ref()
let dataToEmit = null
const idParte = ref('')

function toggleAcciones (event, data) {
  idParte.value = data.idParte
  dataToEmit = data
  menuPartes.value.toggle(event)
}

function handleEliminarParte () {
  launchConfirmDialog({
    message: `¿Estás seguro de eliminar Parte/Denuncia?`,
    accept: () => {
      oficinaPartes_ELIMINAR_PARTE_DENUNCIA(idParte)
      toastWarning('Parte Eliminado')
    }
  })
}

const menuPartesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Modificar',
        command: () => {
          emitEditarParte(dataToEmit)
        }
      },
      {
        label: 'Eliminar',
        command: () => handleEliminarParte()
      }
    ]
  }
])
function emitEditarParte (data) {
  emit('tabla-parte-denuncia:modificar', data)
}

</script>
