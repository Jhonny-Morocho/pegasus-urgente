<template>
<section>
  <AppDataTable
    id="tabla-asignacion"
    v-bind="$attrs"
    ref="dt"
    class="mt-5"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column header="Ver más">
      <template #body="{ data }">
        <Button
          class="btn-primary p-button-rounded"
          icon="pi pi-plus-circle"
          @click="openMasInfoTarea(data)"
        />
      </template>
    </Column>
    <Column header="Seleccionar Causa">
      <template #body="{ data: { data, tarea } }">
        <section class="text-center">
          <Checkbox
            v-model="causasAceptar"
            :disabled="puedeAprobarPreclasificacion(data?.causa)"
            name="causa=seleccionada"
            :value="{ data, tarea }"
          />
        </section>
      </template>
    </Column>
    <Column
      class="text-center"
      field="prioritario"
      filter-field="prioritario"
      header="Prioritario"
    >
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined"
          :class="prioritarioStyle(data?.prioritario)"
          disabled
          icon="pi pi-flag-fill"
          @click="setPrioritario(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreTarea"
      filter-field="nombreTarea"
      header="Nombre de la Tarea"
      :sortable="true"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data.tarea?.taskName ?? 'Preclasificar Causa'"
          @click="iniciarTarea(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="ruc"
      filter-field="ruc"
      header="RUC"
      :sortable="true"
      style="min-width: 128px"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline w-max"
          :label="data?.data?.causa?.ruc"
          @click="openFichaCausa(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="origenDenuncia"
      filter-field="origenDenuncia"
      header="Origen Denuncia"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        {{ tipoDenuncia(data?.causa?.idOrigenDenuncia) ?? 'No definido' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="fechaCreacion"
      filter-field="fechaHoraCreacion"
      header="Fecha/Hora Creación Causa"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        {{ formatDate(data?.causa?.fechaCreacion) }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="delito"
      filter-field="delito"
      header="Delito"
      :sortable="true"
    >
      <template #body="{ data:{ data } }">
        <div
          v-if="data?.causa?.delitos?.length"
          :class="data?.causa?.delitos ? 'text-sm text-left' : ''"
        >
          <ul
            v-for="delito in data?.causa?.delitos"
            :key="delito.tipoDelito"
            class="list-none pl-0"
          >
            <li>{{ tipoDelito(delito?.tipoDelito) || delito?.hechoDelictual }}</li>
          </ul>
        </div>
        <div v-else>
          N/A
        </div>
      </template>
    </Column>
    <Column
      class="text-center"
      field="alerta"
      filter-field="alerta"
      header="Alerta"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        {{ formatAlerta(data?.causa?.alerta) ?? 'Sin alertas' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="preclasificador"
      filter-field="preclasificador"
      header="Preclasificador"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        {{ data?.causa?.nombrePreclasificador || 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="propuesta"
      filter-field="propuesta"
      header="Propuesta"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        {{ propuestaPreclasificador(data?.causa?.decisionAsignacion) }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="complejidad"
      filter-field="complejidad"
      header="Complejidad"
      :sortable="true"
    >
      <template
        #body="{ data: { data } }"
      >
        <p
          style="text-transform: capitalize;"
        >
          {{ data?.causa?.complejidad ?? 'No definido' }}
        </p>
      </template>
    </Column>
    <Column
      class="text-center"
      field="fiscalPropuesto"
      filter-field="fiscalPropuesto"
      header="Fiscal Propuesto"
      :sortable="true"
    >
      <template #body="{ data: { data } }">
        {{ fiscalAsignado(data?.causa?.idFiscalAsignado) ?? 'No definido' }}
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="causaSeleccionada"
          :menu-options="opcionesBandeja"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useMantenedorStore, usePamStore } from '@/modules/global/composables'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import ModalMasInfoCausa from '@/modules/asignacion/components/bandeja/ModalMasInfoCausa.vue'
import { useBandejaAsignacionStore } from '@/modules/asignacion/composables'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  causa: propTypes.array
})

const emit = defineEmits([
  'update:causa',
  'iniciar:tarea',
  'ver-ficha-causa',
  'aprobar-propuesta'
])

const causasAceptar = computed({
  get: () => props.causa,
  set: (value) => emit('update:causa', value)
})

const { launchDialog } = useAppDialog()
const { toastWarning } = useAppToast()

const {
  pam_getDiagramaProcesoActual,
  pam_getDiagramaProcesoPrincipal
} = usePamStore()

const { bandejaAsignacion_togglePrioritario } = useBandejaAsignacionStore()

const causaSeleccionada = ref(null)

const { mantenedor_getNombreTipoDelito, mantenedor_getTipoDenunciaNombreById, allFiscales } = useMantenedorStore()

function tipoDelito (id) {
  return mantenedor_getNombreTipoDelito(id)
}

function tipoDenuncia (idTipoDenuncia) {
  return mantenedor_getTipoDenunciaNombreById(idTipoDenuncia)
}

function fiscalAsignado (idFiscal) {
  const fiscalFound = allFiscales.value?.find(fiscal => fiscal.funcionarioId === idFiscal)
  return fiscalFound?.nombresCompletos
}

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}

function openMasInfoTarea (tareaCausa) {
  const { tarea, data } = tareaCausa
  launchDialog({
    component: ModalMasInfoCausa,
    header: 'Más Información de la Causa',
    width: '40%',
    props: {
      tarea,
      dataCausa: data
    },
    cancelLabel: 'Cerrar'
  })
}

const opcionesBandeja = ref([
  {
    label: 'Acciones para la tarea',
    items: [
      {
        label: 'Ejecutar Tarea',
        command: () => {
          iniciarTarea(causaSeleccionada.value)
        }
      },
      {
        label: 'Ver Procesos',
        command: () => {
          verProceso(causaSeleccionada.value)
        }
      },
      {
        label: 'Ver Carpeta',
        command: () => {
          console.log('*se abre la carpeta*')
        }
      },
      {
        label: 'Aceptar Propuesta',
        command: () => aprobarPropuesta(causaSeleccionada.value),
        disabled: () => puedeAprobarPreclasificacion(causaSeleccionada.value?.data?.causa)
      }
    ]
  }
])

function puedeAprobarPreclasificacion (causa) {
  return causa?.complejidad === 'alta' || !causa?.existePropuestaAsignacion
}

async function verProceso ({ tarea }) {
  let imagenProcesoPrincipal = null
  let imagenProcesoActual = null

  // NO QUITAR AWAIT
  await requestUtil({
    action: pam_getDiagramaProcesoPrincipal,
    payload: { taskId: tarea.taskId },
    resolve: (imagen) => {
      imagenProcesoPrincipal = imagen
    }
  })
  await requestUtil({
    action: pam_getDiagramaProcesoActual,
    payload: { taskId: tarea.taskId },
    resolve: (res) => {
      imagenProcesoActual = res
    }
  })

  launchDialog({
    component: ModalDiagramaPam,
    width: '90%',
    showHeader: false,
    props: {
      taskId: tarea.taskId,
      imagenProcesoPrincipal: imagenProcesoPrincipal,
      imagenProcesoActual: imagenProcesoActual
    }
  })
}

function iniciarTarea (tareaCausa) {
  emit('iniciar:tarea', tareaCausa)
}

function aprobarPropuesta (causa) {
  emit('aprobar-propuesta', causa)
}

async function setPrioritario (data) {
  requestUtil({
    action: bandejaAsignacion_togglePrioritario, // POR HACER: FALTA ENDPOINT ESPECIFICO PARA ASIGNACION
    payload: {
      idBandeja: data.data.bandeja,
      prioritario: !data.prioritario
    },
    resolve: (response) => {
      const message = response.prioritario ? 'ahora es prioritaria' : 'ya no es prioritaria'
      toastWarning(`La causa con RUC ${response.ruc} ${message}`)
    }
  })
}

function openFichaCausa (tareaCausa) {
  emit('ver-ficha-causa', tareaCausa)
}

function formatDate (date) {
  if (!date) {
    return ''
  }
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function formatAlerta (value) {
  // /,/g => todas las comas en el string
  return value?.replace(/,/g, ', ')
}

function propuestaPreclasificador (value) {
  switch (value) {
    case 'clasificacion':
      return 'Seguir Linea Investigativa'
    case 'desestimacion':
      return 'Desestimar Causa'
    case 'transferencia':
      return 'Transferir Causa'
    case 'agrupacion':
      return 'Agrupar Causas'
    default:
      return 'No definido'
  }
}
</script>
