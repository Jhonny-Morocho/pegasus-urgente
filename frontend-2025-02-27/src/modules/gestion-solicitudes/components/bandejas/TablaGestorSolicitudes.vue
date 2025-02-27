<template>
<section class="mt-5">
  <AppDataTable
    id="tabla-gestor-solicitudes"
    v-bind="$attrs"
    ref="dt"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column header="Ver más">
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined"
          :disabled="noColumnMasInfo"
          icon="pi pi-plus"
          @click="openMasInfoTarea(data)"
        />
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
          :class="prioritarioStyle(data?.tarea?.taskPriority)"
          icon="pi pi-flag-fill"
          @click="setCausaPrioritaria(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreTarea"
      filter-field="nombreTarea"
      header="Nombre de la Tarea"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data.tarea.taskName"
          @click="sendToTarea(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="ruc"
      filter-field="ruc"
      header="RUC"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline w-max"
          :label="data?.data?.causa?.ruc || 'No disponible'"
          @click="sendToTarea(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="alerta"
      filter-field="alerta"
      header="Alerta"
    >
      <template #body="{ data }">
        {{ data?.data?.causa?.alerta || "N/A" }}
      </template>
    </Column>
    <Column
      class="text-left"
      field="judicializada"
      filter-field="judicializada"
      header="Causa Judicializada"
    >
      <template #body="{ data }">
        {{ data.data?.causa?.causaJudicializada || "N/A" }}
      </template>
    </Column>
    <Column
      class="text-left"
      field="delito"
      filter-field="delito"
      header="Delito"
    >
      <template #body="{ data }">
        <section>
          {{
            mantenedor_getNombreTipoDelito(
              data.data?.causa?.delitos[0]?.tipoDelito
            ) ||
              data.data?.causa?.delitos[0]?.hechoDelictual ||
              "N/A"
          }}
        </section>
      </template>
    </Column>
    <Column
      class="text-left"
      field="responsable"
      filter-field="responsable"
      header="Responsable de Materializar"
    >
      <template #body="{ data }">
        <section>
          <!-- */* preguntar -->
          {{ data?.data?.solicitud?.idResponsableMaterializar || "N/A" }}
        </section>
      </template>
    </Column>
    <Column
      class="text-left"
      field="Institución"
      filter-field="Institución"
      header="Institución ejecutora"
    >
      <template #body="{ data }">
        <section>
          {{
            mantenedor_getNombreInstitucion(
              data?.data?.solicitud?.idInstitucionEjecutora
            ) || "N/A"
          }}
        </section>
      </template>
    </Column>
    <Column
      class="text-left"
      field="plazo"
      filter-field="plazo"
      header="Plazo"
    >
      <template #body="{ data }">
        <section>
          {{ data?.data?.solicitud?.plazoSolicitud || "N/A" }}
        </section>
      </template>
    </Column>
    <Column
      class="text-left"
      field="fechaSolicitud"
      filter-field="fechaSolicitud"
      header="Fecha/Hora Solicitud"
    >
      <template #body="{ data }">
        <section>
          {{ data?.data?.solicitud?.fechaHoraSolicitud || "N/A" }}
        </section>
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
/* eslint-disable no-unreachable */
import { defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDialog } from '@/modules/common/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import MasInformacionCausa from '@/modules/gestion-solicitudes/components/modals/MasInformacionCausa.vue'
import { useMantenedorStore, usePamStore } from '@/modules/global/composables'
import {
  useGestionSolicitudesStore,
  usePamGestionSolicitudes
} from '../../composables'

const { launchDialog } = useAppDialog()

defineProps({
  noColumnMasInfo: {
    type: Boolean,
    default: () => false
  }
})

const router = useRouter()
const {
  mantenedor_getInstituciones,
  mantenedor_getNombreInstitucion,
  mantenedor_getTiposDelito,
  mantenedor_getNombreTipoDelito
} = useMantenedorStore()

const { pam_SET_PROCESO } = usePamStore()

const { tareaPam, pamGestionSolicitudes_iniciarYReservar } =
  usePamGestionSolicitudes()

const { gestionSolicitudes_getActividad } = useGestionSolicitudesStore()

onMounted(() => {
  requestUtil({
    action: mantenedor_getTiposDelito
  })
  requestUtil({
    action: mantenedor_getInstituciones
  })
})

function openMasInfoTarea (causa) {
  launchDialog({
    component: MasInformacionCausa,
    header: 'Más Información de la Causa',
    width: '20%',
    props: { data: causa },
    cancelLabel: 'Cerrar'
  })
}

async function sendToTarea (causa) {
  requestUtil({
    action: pamGestionSolicitudes_iniciarYReservar,
    payload: {
      tareaPam: causa.tarea,
      idTarea: causa.tarea.taskId
    },
    resolve: () => {
      requestUtil({
        action: gestionSolicitudes_getActividad,
        payload: {
          idTarea: causa.data.solicitud?.id
        },
        resolve: () => {
          pam_SET_PROCESO({
            ...tareaPam.value,
            taskId: tareaPam.value.taskId.toString(),
            taskProcessInstanceId:
              tareaPam.value.taskProcessInstanceId.toString()
          })

          if (causa.tarea.taskName === 'Materializar Solicitudes') {
            router.push({ name: 'materializarSolicitud' })
          }
          if (causa.tarea.taskName === 'Materializar Solicitudes (Rechazada)') {
            router.push({ name: 'materializarSolicitud' })
          }
        }
      })
    }
  })
}

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}

// eslint-disable-next-line no-unused-vars
function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>
