<template>
<section>
  <AppFieldset legend="Nómina de Detenidos">
    <AppFilters
      class="w-full"
      v-bind="$attrs"
      @filter="emit('filter')"
    />
    <AppDataTable
      id="tabla-busqueda-procedimientos"
      class="col-12"
      :loading="loading"
      responsive-layout="stack"
      :value="nomina"
      @page="getDataTablaNominaDeDetenidos"
    >
      <Column header="Folio">
        <template #body="{ data }">
          {{ data.folio }}
        </template>
      </Column>
      <Column header="RUC">
        <template #body="{ data }">
          {{ data.ruc }}
        </template>
      </Column>
      <Column header="N° Documento">
        <template #body="{ data }">
          {{ data.numeroDocumento }}
        </template>
      </Column>
      <Column header="Nombre Completo">
        <template #body="{ data }">
          {{ data.nombreCompleto }}
        </template>
      </Column>
      <Column header="Tipo Detención">
        <template #body="{ data }">
          {{ data.tipoDetencion }}
        </template>
      </Column>
      <Column header="Delito">
        <template #body="{ data }">
          {{ data.descripcionTipoDelito }}
        </template>
      </Column>
      <Column header="Fecha Detención">
        <template #body="{ data }">
          {{ dateTimeUtil.formatToFrontend(data.fechaDetencion) }}
        </template>
      </Column>
      <Column header="Lugar Detención">
        <template #body="{ data }">
          {{ data.idLugarDetencion }}
        </template>
      </Column>
      <Column header="Pasar ACD">
        <template #body="{ data }">
          {{ data.pasarAcd }}
        </template>
      </Column>
      <Column header="Juzgado">
        <template #body="{ data }">
          {{ mantenedor_getNombreJuzgado(data.juzgado) ?? 'N/A' }}
        </template>
      </Column>
      <Column header="Fecha de presentación de ACD">
        <template #body="{ data }">
          {{ data.fechaDePresentacionAcd ? dateTimeUtil.formatToFrontend(data.fechaDePresentacionAcd) : 'N/A' }}
        </template>
      </Column>
      <Column header="Bloque">
        <template #body="{ data }">
          {{ data.bloque ?? 'N/A' }}
        </template>
      </Column>
      <Column
        class="text-center"
        header="Acciones"
      >
        <template #body="slotProps">
          <AppMenuOptions
            v-model="detenidoSeleccionado"
            :menu-options="accionesNominaDetenidos"
            :slot-props="slotProps"
          />
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
  <Menu
    id="overlay_menu"
    ref="menuDetenidos"
    :model="opcionesTablaDetenidos"
    :popup="true"
    @click="toggleAcciones"
  />
</section>
</template>

<script setup>
/*eslint-disable*/
import { ref, defineEmits, defineExpose, onMounted } from 'vue'
import { useAppToast, useAppDialog, useConfirmDialog } from '@/modules/common/composables'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import { useTramitarAudiencia } from '../composables'

const { toastSuccess, toastWarning } = useAppToast()
const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()

const { mantenedor_getNombreJuzgado } = useMantenedorStore()

const emit = defineEmits(['filter'])

const accionesNominaDetenidos = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Apercibir',
        command: () => {
          handleApercibir(detenidoSeleccionado.value)
        }
      }
    ]
  }
])

const opcionesTablaDetenidos = ref(null)
const loading = ref(false)

const detenidoSeleccionado = ref({})

const firstRecord = ref(0)
const reloadTablaProcedimientos = ref(false)

const { nomina, tramitarAudiencia_getNominaDetenidos, tramitarAudiencia_apercibirDetenidoACD } = useTramitarAudiencia()

function getDataTablaNominaDeDetenidos(pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page || 0,
    size: pagination?.rows || 10
  }
  requestUtil({
    action: tramitarAudiencia_getNominaDetenidos,
    payload: { params },
    loader: (l) => {
      loading.value = l
    }
  })
}

async function handleApercibir(detenido) {
  launchConfirmDialog({
    header: `Apercibir ${detenido.nombreCompleto}`,
    message: `¿Está seguro de Apercibir a ${detenido.nombreCompleto}`,
    width: '60%',
    accept: () => {
      requestUtil({
        action: tramitarAudiencia_apercibirDetenidoACD,
        payload: { numeroDocumento: detenido.numeroDocumento }
      })
    }
  })
}

onMounted(() => {
  getDataTablaNominaDeDetenidos()
})

defineExpose({ reloadTablaProcedimientos })
</script>
