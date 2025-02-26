<template>
<AppFieldset
  legend="Especies/Dinero"
>
  <AppDataTable
    id="dataTableEspecies"
    v-model:first="firstRecord"
    v-model:selection="seleccionadas"
    class="w-full"
    :loading="loader"
    responsive-layout="scroll"
    :value="especies"
    @page="getEspecies"
  >
    <Column
      class="text-center"
      header-style="width: 3em"
      selection-mode="multiple"
    />
    <Column header="Familia Especie">
      <template #body="{ data }">
        {{ mantenedor_getNombreFamiliaEspecie(data?.familiaEspecie) ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Tipo Especie">
      <template #body="{ data }">
        {{ mantenedor_getNombreTipoEspecie(data?.idTipoEspecie) ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Descripción">
      <template #body="{ data }">
        {{ data?.descripcion ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Estado de la Especie">
      <template #body="{ data }">
        {{ data?.estadoEspecie ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Observaciones">
      <template #body="{ data }">
        {{ data?.observacion ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Cantidad">
      <template #body="{ data }">
        {{ data?.cantidadEspecie ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Ubicación">
      <template #body="{ data }">
        {{ data?.ubicación ?? 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
      style="width:0"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="especieSeleccionada"
          :menu-options="opciones"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import ModalSolicitarSalidaAudiencia from '@/modules/tramitar-audiencia/components/modals/ModalSolicitarSalidaAudiencia.vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useEspeciesDineroStore, useMantenedorStore } from '@/modules/global/composables'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'
import { useEspecieIncautadaPendienteRecepcionStore, useRegistroSalida } from '@/modules/recepcion-especies-dinero/composables'

const {
  idDenuncia,
  especiesSeleccionadas,
  solicitudes_SET_ESPECIES_SELECCIONADAS
} = useSolicitudesStore()

const { toastError } = useAppToast()
const { launchDialog } = useAppDialog()

const {
  especies,
  especiesDinero_getEspecieByIdDenuncia
} = useEspeciesDineroStore()

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie,
  mantenedor_getFamiliaEspecies
} = useMantenedorStore()

const loader = ref(false)
const firstRecord = ref(0)
const seleccionadas = ref([])

onMounted(() => {
  getMantenedor()
  getEspecies()
  if (especiesSeleccionadas.value.length) {
    seleccionadas.value = especiesSeleccionadas.value
  }
})

function getMantenedor () {
  requestUtil({ action: mantenedor_getAllTiposEspecie })
  requestUtil({ action: mantenedor_getFamiliaEspecies })
}

watch(seleccionadas, (val) => {
  solicitudes_SET_ESPECIES_SELECCIONADAS(val)
})

async function getEspecies (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => { loader.value = l },
    reject: () => toastError('Ocurrió un error inesperado al cargar la tabla de Especies/Dinero')

  })
}

const {
  stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie
} = useEspecieIncautadaPendienteRecepcionStore()

const {
  registroSalida_ingresarSolicitudSalida,
  registroSalida_ingresarSolicitudSalidaperitaje
} = useRegistroSalida()

const especieSeleccionada = ref()

function openModalSolicitarSalida () {
  const { idEspecie } = especieSeleccionada.value
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: idEspecie },
    resolve: (r) => {
      launchDialog({
        component: ModalSolicitarSalidaAudiencia,
        header: 'Solicitar Salida Temporal Audiencia',
        confirmLabel: 'Solicitar Salida',
        confirmIcon: 'pi pi-send',
        width: '80%',
        props: {
          especie: r
        },
        accept: (m) => {
          const payload = {
            nue: r.nue,
            idEspecie: r.idEspecie,
            idTipoSalida: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            lugarRecepcion: m.lugarReceptor ?? 'lugarmock',
            runReceptor: m.runReceptor,
            nombreReceptor: m.nombreReceptor,
            observaciones: m.observaciones,
            creadoPor: 'user'
          }
          requestUtil({
            action: registroSalida_ingresarSolicitudSalida,
            payload,
            resolve: (r) => console.log('responseSolicitud', r)
          })
        }
      })
    }
  })
}

function openModalPeritaje () {
  const { idEspecie } = especieSeleccionada.value
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: idEspecie },
    resolve: (r) => {
      launchDialog({
        component: ModalSolicitarSalidaAudiencia,
        header: 'Solicitar Salida Temporal Audiencia',
        confirmLabel: 'Solicitar Salida',
        confirmIcon: 'pi pi-send',
        width: '80%',
        props: {
          especie: r,
          peritaje: true
        },
        accept: (m) => {
          const payload = {
            nue: r.nue,
            idEspecie: r.idEspecie,
            idTipoSalida: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            lugarRecepcion: m.lugarReceptor ?? 'lugarmock',
            runReceptor: m.runReceptor,
            nombreReceptor: m.nombreReceptor,
            fechaAgendada: dateTimeUtil.formatToBackendWithTime(new Date()) + 'Z',
            plazoSalida: dateTimeUtil.formatToBackendWithTime(new Date()),
            observaciones: m.observaciones,
            creadoPor: 'user'
          }
          requestUtil({
            action: registroSalida_ingresarSolicitudSalidaperitaje,
            payload,
            resolve: (r) => console.log('responseSolicitud', r)
          })
        }
      })
    }
  })
}

const opciones = ref([
  {
    label: 'Solicitar Salida Temporal',
    items: [
      {
        label: 'Solicitar Salida Audiencia',
        command: () => openModalSolicitarSalida()
      },
      {
        label: 'Peritaje',
        command: () => openModalPeritaje()
      }
    ]
  }
])
</script>
