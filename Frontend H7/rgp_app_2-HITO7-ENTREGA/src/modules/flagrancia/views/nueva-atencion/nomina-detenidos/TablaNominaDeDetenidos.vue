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
      :loading="loader"
      responsive-layout="stack"
      :rows="paginacionNomina?.tamanoPagina"
      :total-records="paginacionNomina?.elementosTotales"
      :value="nomina"
      @detenido:editar="handleEditarDetenido"
      @page="getDataTablaNominaDeDetenidos"
    >
      <Column header="Folio">
        <template #body="{ data }">
          {{ data.folio }}
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
          {{ mantenedor_getDescripcionCausaDetencionById(data.tipoDetencion) }}
        </template>
      </Column>
      <Column header="Delito">
        <template #body="{ data }">
          {{ data.descripcionTipoDelito }}
        </template>
      </Column>
      <Column header="Fecha Detención">
        <template #body="{ data }">
          {{ dateTimeUtil.formatToFrontendWithTime(data.fechaDetencion) }}
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
          {{ data.fechaDePresentacionAcd ? dateTimeUtil.formatToFrontendWithTime(data.fechaDePresentacionAcd) : 'N/A' }}
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
</section>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose, onMounted } from 'vue'
import { useAppToast, useAppDialog } from '@/modules/common/composables'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { useStepDetenidosACDStore } from '@/modules/flagrancia/composables/index'
import { propTypes } from '@/modules/common/types/prop.types'
import { requestUtil, dateTimeUtil } from '@/utils'
import ModalDefinirDetenidosStepACD from '@/modules/flagrancia/components/detenidos-acd/modales/ModalDefinirDetenidosStepACD.vue'
import { useMantenedorStore } from '@/modules/global/composables'

const { nomina, paginacionNomina, stepDetenidosACD_getNominaDetenidos, stepDetenidosACD_actualizarDecisionACD } = useStepDetenidosACDStore()
const { toastSuccess, toastWarning } = useAppToast()
const { launchDialog } = useAppDialog()

const {
  mantenedor_getNombreJuzgado, mantenedor_getCausaDetencion,
  mantenedor_getDescripcionCausaDetencionById
} = useMantenedorStore()

const emit = defineEmits(['filter'])
const detenidoSeleccionado = ref(null)
const firstRecord = ref(0)
const loader = ref(false)
const reloadTablaProcedimientos = ref(false)

const accionesNominaDetenidos = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Modificar',
        command: () => {
          handleEditarDetenido(detenidoSeleccionado.value)
        }
      }
    ]
  }
])

defineProps({
  detenidosSeleccionados: propTypes.array
})

onMounted(() => {
  loader.value = true
  getMantenedor()
  getDataTablaNominaDeDetenidos()
})

function getMantenedor () {
  requestUtil({ action: mantenedor_getCausaDetencion })
}

function getDataTablaNominaDeDetenidos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page || 0,
    size: pagination?.rows || 10
  }
  requestUtil({
    action: stepDetenidosACD_getNominaDetenidos,
    payload: { params },
    loader: (l) => { setTimeout(() => { loader.value = l }, 2000) }
  })
}

function handleEditarDetenido (detenido) {
  reloadTablaProcedimientos.value = false
  if (detenido.pasarAcd === 'Apercibido') toastWarning('Sujeto Apercibido no se puede modificar')
  else {
    launchDialog({
      header: 'Detenidos Pasan ACD',
      component: ModalDefinirDetenidosStepACD,
      width: '75vw',
      confirmLabel: 'Guardar',
      props: {
        detenido: {
          ...detenido
        }
      },
      accept: (detenidoEditado) => {
        loader.value = true
        requestUtil({
          action: stepDetenidosACD_actualizarDecisionACD,
          payload: {
            ...detenidoEditado,
            idProcedimiento: detenido.idProcedimiento,
            idRelacionSujeto: detenido.idRelacionSujeto
          },
          resolve: () => {
            toastSuccess('El detenido ha sido actualizado con éxito')
            reloadTablaProcedimientos.value = true
            getDataTablaNominaDeDetenidos()
          },
          reject: () => { loader.value = false }
        })
      }
    })
  }
}

defineExpose({ reloadTablaProcedimientos, loader })
</script>
