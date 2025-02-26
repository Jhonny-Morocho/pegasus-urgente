<template>
<section>
  <AppFieldset legend="Búsqueda de Procedimientos con Detenidos">
    <AppFilters
      class="w-full"
      v-bind="detenidos.filters"
      @filter="emit('filter')"
    />
    <AppDataTable
      id="tabla-procedimientos-detenidos"
      class="col-12"
      :loading="loader"
      responsive-layout="stack"
      :rows="paginacionProcedimientoDetenidos?.tamanoPagina"
      :total-records="paginacionProcedimientoDetenidos?.elementosTotales"
      :value="procedimientoSinRucs"
      @page="getDataProcedimientoDetenidos"
    >
      <Column header="Institución">
        <template #body="{ data }">
          {{ mantenedor_getNombreInstitucionesDenunciaById(data.institucion) ?? 'Sin Información' }}
        </template>
      </Column>
      <Column header="Folio">
        <template #body="{ data }">
          {{ data.folio }}
        </template>
      </Column>
      <Column header="Estado">
        <template #body="{ data }">
          {{ data.estado === '2' ? 'Cerrado' : 'Abierto' }}
        </template>
      </Column>
      <Column header="Delito">
        <template #body="{ data }">
          {{ data.descripcionDelito }}
        </template>
      </Column>
      <Column header="Clasif. Proc.">
        <template #body="{ data }">
          {{ data.clasificacionProcedimiento ?? 'Flagrancia / ODA' }}
        </template>
      </Column>
      <Column header="Detenidos">
        <template #body="{ data }">
          {{ data.cantidadDetenidos }}
        </template>
      </Column>
      <Column header="Iniciar chat">
        <template #body="{ data }">
          <Button
            class="p-button-rounded p-button-outlined btn-primary-outline"
            icon="pi pi-comments"
            @click="handleInitChat(data)"
          />
        </template>
      </Column>
      <Column header="Instru.">
        <template #body="{ data }">
          <Button
            class="p-button-rounded p-button-outlined btn-primary-outline"
            icon="pi pi-book"
            @click="sendToDiligencias(data)"
          />
        </template>
      </Column>
      <Column header="Fecha Ingreso Folio">
        <template #body="{ data }">
          {{ dateTimeUtil.formatToFrontendWithTime(data.fechaIngresoFolio) }}
        </template>
      </Column>
      <Column header="Fiscal/Turno">
        <template #body="{ data }">
          {{ data.fiscalTurno.toUpperCase() }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>

<script setup>
import { reactive, ref, defineProps, defineExpose, watch, onMounted } from 'vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useStepDetenidosACDStore } from '@/modules/flagrancia/composables'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { useMantenedorStore } from '@/modules/global/composables'
import ChatComponent from '@/modules/common/components/ChatComponent.vue'
import { useAppDialog } from '@/modules/common/composables'

const {
  stepDetenidosACD_getProcedimientoConDetenidos, paginacionProcedimientoDetenidos,
  procedimientoSinRucs, stepDetenidosACD_SET_PROCEDIMIENTO_SIN_RUCS
} = useStepDetenidosACDStore()

const { mantenedor_getNombreInstitucionesDenunciaById } = useMantenedorStore()

const { launchDialog } = useAppDialog()

const props = defineProps({
  reload: Boolean
})

const detenidos = reactive({
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined
  },
  firstRecord: 0
})

const firstRecord = ref(0)
const loader = ref(false)

onMounted(() => {
  loader.value = true
  getDataProcedimientoDetenidos()
})

function getDataProcedimientoDetenidos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page || 0,
    size: pagination?.rows || 10
  }
  requestUtil({
    action: stepDetenidosACD_getProcedimientoConDetenidos,
    payload: { params },
    resolve: () => {
      stepDetenidosACD_SET_PROCEDIMIENTO_SIN_RUCS()
    },
    loader: (l) => { loader.value = l }
  })
}

function update () {
  if (props.reload) setTimeout(() => { getDataProcedimientoDetenidos() }, 2000)
}

function handleInitChat (data) {
  // WIP Necesito el idDenuncia, en la respuesta del get...mientras se coloca idProcedimiento
  launchDialog({
    component: ChatComponent,
    header: `Chat | Procedimiento: ${data?.idProcedimiento}`,
    width: '50vw',
    props: {
      roomId: data?.idProcedimiento
    }
  })
}

function sendToDiligencias () {
  console.log('botón instrucciones')
}

watch(props, () => update())

defineExpose({ loader })

</script>
