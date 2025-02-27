<template>
<section>
  <div>
    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
      <InputText
        id="texto"
        v-model="filtroTexto"
        class="p-inputtext-sm"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary p-button-sm"
        icon="pi pi-search"
        @click="buscar()"
      />
    </div>
    <TabPanel>
      <div
        v-if="loading"
      >
        <LoaderSkeleton />
      </div>
      <AppDataTable
        v-else
        :loading="loading"
        :rows="listCatalogos?.paginacion?.tamanoPagina"
        style="width: 100%"
        :total-records="listCatalogos?.paginacion?.elementosTotales"
        :value="listCatalogos?.data"
      >
        <Column
          class="text-center"
          field="id"
          header="ID"
        >
          <template #body="{ data }">
            {{ data.id }}
          </template>
        </Column>
        <Column
          header="Nombre archivo"
        >
          <template #body="{ data }">
            {{ data.nombreArchivo }}
          </template>
        </Column>
        <Column
          header="Fecha Creación"
        >
          <template #body="{ data }">
            {{ data.fechaCreacion }}
          </template>
        </Column>
        <Column
          header="Fecha agregación al CDD"
        >
          <template #body="{ data }">
            {{ formatDate(data.fechaAgregacion) }}
          </template>
        </Column>
        <Column
          header="Fecha ultima actualización"
        >
          <template #body="{ data }">
            {{ data.fechaUltActualizacion }}
          </template>
        </Column>
        <Column
          header="Vigencia Documental"
        >
          <template #body="{ data }">
            {{ data.vigenciaDocumental ? 'Si' : 'No' }}
          </template>
        </Column>
        <Column
          header="Versiones"
        >
          <template #body="{ data }">
            Versión {{ data.version }}
          </template>
        </Column>
        <Column
          header="Acciones"
        >
          <template #body="slotProps">
            <AppMenuOptions
              v-model="solicitudSeleccionada"
              :menu-options="accionesSolicitud"
              :slot-props="slotProps"
            />
          </template>
        </Column>
      </AppDataTable>
    </TabPanel>
  </div>
</section>
</template>

<script setup>
import { ref } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import catalogos from '@/modules/catalogo-documental-digital/components/mock/catalogos.json'
import ModalVerDocumento from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/modal/ModalVerDocumento.vue'
import ModalDetalleDocumento from '@/modules/catalogo-documental-digital/components/analisis-solicitud-actualizacion/modal/ModalDetalleDocumento.vue'
import { dateTimeUtil } from '@/utils'
const { launchDialog } = useAppDialog()

const listCatalogos = ref(catalogos)
const list = JSON.parse(JSON.stringify(listCatalogos))
const filtroTexto = ref('')

function openVerDocumento () {
  launchDialog({
    component: ModalVerDocumento,
    header: 'Ver Documento',
    width: '50%',
    cancelLabel: 'Cerrar'
  })
}

function openDetalleDocumento () {
  launchDialog({
    component: ModalDetalleDocumento,
    header: 'Ver Detalle del Documento',
    width: '60%',
    cancelLabel: 'Cerrar'
  })
}

function buscar () {
  if (filtroTexto.value.length === 0) {
    listCatalogos.value.data = [...list._rawValue.data]
    return
  }
  listCatalogos.value.data = [...list._rawValue.data]
    .filter(item => item.nombreArchivo.toLowerCase().includes(filtroTexto.value.toLowerCase()))
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

const accionesSolicitud = ref([
  {
    label: '',
    items: [
      {
        label: 'Ver Documento',
        command: () => {
          openVerDocumento()
        }
      },
      {
        label: 'Ver Detalle del Documento',
        command: () => {
          openDetalleDocumento()
        }
      }
    ]
  }
])
</script>
