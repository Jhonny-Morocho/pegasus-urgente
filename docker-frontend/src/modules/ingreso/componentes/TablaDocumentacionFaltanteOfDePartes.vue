<template>
<section>
  <AppDataTable
    id="tablaDocumentacionFaltante"
    class="w-full"
    v-bind="$attrs"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="partesBandeja"
    @page="getDataBandeja"
  >
    <Column
      class="text-center"
      header="Seleccionar"
      style="width: 94px"
    >
      <template #body="{ data }">
        <input
          :id="data"
          v-model="caratulasSeleccionadas"
          class="p-checkbox"
          type="checkbox"
          :value="data"
        >
      </template>
    </Column>
    <Column
      header="Carátula"
      sortable
    >
      <template #body="data">
        {{ data?.data?.data?.denuncia?.caratula }}
      </template>
    </Column>
    <Column
      header="N° de Parte/Denuncia"
      sortable
    >
      <template #body="data">
        {{ data?.data?.data?.denuncia?.numeroDenuncia ?? 'N/A' }}
      </template>
    </Column>
    <Column
      header="Institución de Origen"
      sortable
    >
      <template #body="data">
        {{ data?.data?.data?.denuncia?.idInstitucionOrigen ?? 'N/A' }}
      </template>
    </Column>
    <Column
      header="Fecha/Hora Recepción"
      sortable
    >
      <template #body="data">
        <span>
          {{ dateTimeUtil.formatToFrontendWithTime(data?.data?.tarea?.taskCreatedOnDate) ?? 'N/A' }}
        </span>
      </template>
    </Column>
    <Column
      header="Doc. Asociados"
      sortable
    >
      <template #body="data">
        {{ data?.data?.data?.denuncia?.cantDocAsociados ?? 'N/A' }}
      </template>
    </Column>
    <Column
      header="Doc. Faltantes"
      sortable
    >
      <template #body="data">
        {{ data?.data?.data?.denuncia?.cantDocFaltantes ?? 'N/A' }}
      </template>
    </Column>
    <Column
      header="Doc. Solicitados"
      sortable
    >
      <template #body="data">
        {{ data?.data?.data?.denuncia?.cantDocSolicitados ?? 'N/A' }}
      </template>
    </Column>
    <Column
      header="Acciones"
      style="width: 48px"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="denunciaSeleccionada"
          :menu-options="accionesSolicitarDocumentacionFaltante"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useOficinaPartesStore } from '@/modules/global/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'

const { oficinaPartes_getPartesDenunciaById, paginacion, partesBandeja } = useOficinaPartesStore()
const emit = defineEmits(['tasking'])
const router = useRouter()
const denunciaSeleccionada = ref()
const caratulasSeleccionadas = ref([])
const { toastError } = useAppToast()
const accionesSolicitarDocumentacionFaltante = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Solicitar Documentos',
        command: () => {
          solicitarDocumentacion()
        }
      }
    ]
  }
])
function solicitarDocumentacion () {
  const data = denunciaSeleccionada.value
  requestUtil({
    action: oficinaPartes_getPartesDenunciaById,
    payload: data,
    resolve: () => {
      handlePlantilla()
    },
    loader: (l) => emit('tasking', l),
    reject: () => {
      toastError('Ocurrió un error inesperado')
    }
  })
}
function handlePlantilla () {
  router.push('/ingreso/solicitar-documentacion/faltante/documentos-solicitar')
}

</script>
