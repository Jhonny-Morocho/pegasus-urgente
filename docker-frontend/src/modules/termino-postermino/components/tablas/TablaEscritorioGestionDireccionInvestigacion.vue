<template>
<AppDataTable
  id="tabla-gestion-direccion-investigacion"
  v-bind="$attrs"
  ref="dt"
  class="mt-5 w-full"
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
  <Column selection-mode="multiple" />
  <Column
    class="text-center"
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
    header="Nombre Tarea"
  >
    <template #body="{ data: { data, tarea } }">
      <Button
        class="p-button-text pl-0 ml-0 btn-primary-outline"
        :label="tarea?.taskName"
        @click="iniciarTarea({ data, tarea })"
      />
    </template>
  </Column>
  <Column
    class="text-center"
    header="RUC"
    style="min-width: 128px"
  >
    <template #body="{ data: { data, tarea } }">
      <Button
        class="p-button-text pl-0 ml-0 btn-primary-outline w-max"
        :label="data?.causa?.ruc"
        @click="openFichaCausa({ data, tarea })"
      />
    </template>
  </Column>
  <Column
    class="text-center"
    header="Origen Denuncia"
  >
    <template #body="{ data: { data } }">
      {{ tipoDenuncia(data?.causa?.idOrigenDenuncia) || 'No definido' }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Fecha/Hora Creación Causa"
  >
    <template #body="{ data: { data } }">
      {{ formatDate(data?.causa?.fechaCreacion) }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Delito"
  >
    <template #body="{ data: { data } }">
      <div
        v-if="data?.causa?.delitos?.length"
        :class="data?.causa?.delitos ? 'text-sm text-left' : ''"
      >
        <ul
          v-for="delito in data?.causa?.delitos"
          :key="delito.tipoDelito"
          class="list-none pl-0"
        >
          <li>
            {{ tipoDelito(delito?.tipoDelito) || delito?.hechoDelictual }}
          </li>
        </ul>
      </div>
      <div v-else>
        N/A
      </div>
    </template>
  </Column>
  <Column
    class="text-center"
    header="Alerta"
  >
    <template #body="{ data: { data } }">
      {{ formatAlerta(data?.causa?.alerta) ?? 'Sin alertas' }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Preclasificador"
  >
    <template #body="{ data: { data } }">
      {{ data?.causa?.nombrePreclasificador || 'N/A' }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Propuesta"
  >
    <template #body="{ data: { data } }">
      {{ propuestaPreclasificador(data?.causa?.decisionAsignacion) }}
    </template>
  </Column>
  <Column
    class="text-center"
    header="Complejidad"
  >
    <template #body="{ data: { data } }">
      <p style="text-transform: capitalize">
        {{ data?.causa?.complejidad || 'No definido' }}
      </p>
    </template>
  </Column>
  <Column
    class="text-center"
    header="Fiscal Propuesto"
  >
    <template #body="{ data: { data } }">
      {{ fiscalAsignado(data?.causa?.idFiscalAsignado) || 'No definido' }}
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
</template>

<script setup>
import { ref } from 'vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useMantenedorStore, usePamStore } from '@/modules/global/composables'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import { useAppDialog } from '@/modules/common/composables'

const { launchDialog } = useAppDialog()

const {
  allFiscales,
  mantenedor_getTipoDenunciaNombreById,
  mantenedor_getNombreTipoDelito
} = useMantenedorStore()

const { pam_getDiagramaProcesoActual, pam_getDiagramaProcesoPrincipal } =
  usePamStore()

// eslint-disable-next-line no-undef
const emit = defineEmits([
  'iniciar:tarea',
  'ver-ficha-causa',
  'aprobar-propuesta'
])

const causaSeleccionada = ref()

function openMasInfoTarea (causa) {
  console.log('openMasInfoTarea', causa)
}

function setPrioritario (causa) {
  console.log(
    '🚀 ~ file: TablaEscritorioGestionDireccionInvestigacion.vue:46 ~ setPrioritario ~ causa',
    causa
  )
}

function openFichaCausa (causa) {
  emit('ver-ficha-causa', causa)
}

function iniciarTarea (causa) {
  emit('iniciar:tarea', causa)
}

function aprobarPropuesta (causa) {
  emit('aprobar-propuesta', causa)
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
        command: () => aprobarPropuesta(causaSeleccionada.value)
      }
    ]
  }
])

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

function formatAlerta (value) {
  // /,/g => todas las comas en el string
  return value?.replace(/,/g, ', ')
}

function formatDate (date) {
  if (!date) {
    return ''
  }
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function tipoDelito (idTipoDelito) {
  return mantenedor_getNombreTipoDelito(idTipoDelito)
}

function tipoDenuncia (idTipoDenuncia) {
  return mantenedor_getTipoDenunciaNombreById(idTipoDenuncia)
}

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}

function fiscalAsignado (idFiscal) {
  const fiscalFound = allFiscales.value?.find(
    (fiscal) => fiscal.funcionarioId === idFiscal
  )
  return fiscalFound?.nombresCompletos
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
