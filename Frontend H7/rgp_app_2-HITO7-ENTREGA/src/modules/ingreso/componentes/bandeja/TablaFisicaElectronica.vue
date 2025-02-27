<template>
<section>
  <AppDataTable
    id="denuncias-fisicas"
    v-bind="$attrs"
    ref="dt"
    class="mt-5"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column header="Ver Más">
      <template #body="{ data }">
        <Button
          class="btn-primary p-button-rounded"
          icon="pi pi-plus-circle"
          @click="openModalMasInfoDenuncia(data)"
        />
      </template>
    </Column>
    <Column
      v-if="false"
      header="Prioritario"
    >
      <template #body="{ data }">
        <Button
          :class="classEsPrioritario(data.prioritario)"
          :disabled="data?.estadoTarea === 'Completada'"
          icon="pi pi-flag-fill"
          @click="setPrioritario(data)"
        />
      </template>
    </Column>
    <Column
      field="tarea.taskName"
      filter-field="tarea.taskName"
      header="Nombre Tarea"
      :sortable="true"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data?.tarea.taskName"
          @click="ejecutarTarea(data)"
        />
      </template>
    </Column>
    <Column
      field="tarea.taskStatus"
      filter-field="tarea.taskStatus"
      header="Estado Tarea"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ estadoTarea(data.tarea.taskStatus) }}
      </template>
    </Column>
    <Column
      field="data.origenDenuncia"
      filter-field="data.origenDenuncia"
      header="Origen Denuncia"
      :sortable="true"
    >
      <template #body="{ data }">
        <div>
          <p
            v-if="
              JSON.parse(data?.tarea?.taskInputData?.denuncia)
                .denunciaElectronica
            "
            class=""
          >
            <img
              alt=""
              class="-mb-2"
              height="30"
              src="@/assets/images/Roundel_of_Carabineros_de_Chile.png"
            >
            AUPOL
          </p>

          <p v-else>
            {{ getOrigenDescripcion(data.origenDenuncia) }}
          </p>
        </div>
      </template>
    </Column>
    <Column
      field="data.denuncia.numeroDenuncia"
      filter-field="data.denuncia.numeroDenuncia"
      header="N° Parte/Denuncia"
      :sortable="true"
    >
      <template #body="{ data }">
        {{
          data?.data?.denuncia?.numeroDenuncia
            ? data?.data?.denuncia?.numeroDenuncia
            : 'N/A'
        }}
      </template>
    </Column>
    <Column
      field="tarea.taskCreatedOnDate"
      filter-field="tarea.taskCreatedOnDate"
      header="Fecha/Hora Recepción"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ formatFecha(data?.tarea?.taskCreatedOnDate) }}
      </template>
    </Column>
    <Column
      field="data.denuncia.tipoDelito"
      filter-field="data.denuncia.tipoDelito"
      header="Delito"
      :sortable="true"
    >
      <template #body="{ data }">
        {{
          data?.data?.denuncia?.delitos
            ? getNombreTipoDelitoById(
              data?.data?.denuncia?.delitos[0].tipoDelito
            )
            : 'N/A'
        }}
      </template>
    </Column>
    <Column
      field="alerta"
      filter-field="alerta"
      header="Alerta"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ data?.data?.denuncia?.alerta ?? 'N/A' }}
      </template>
    </Column>
    <Column
      field="tarea.taskCreatedOnDate"
      filter-field="tarea.taskCreatedOnDate"
      header="Fecha/Hora Asignación"
      :sortable="true"
    >
      <template #body="{ data }">
        {{ formatFecha(data?.tarea?.taskCreatedOnDate) }}
      </template>
    </Column>

    <Column
      field="fechaHoraRecepcion"
      filter-field="fechaHoraRecepcion"
      header="Tiempo de Espera"
    >
      <template #body="{ data }">
        <TiempoEspera :fecha="data?.tarea?.taskCreatedOnDate" />
      </template>
    </Column>
    <Column
      class="text-center"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="denunciaSeleccionada"
          :menu-options="opciones"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ModalMasInfoDenuncia from '@/modules/ingreso/componentes/bandeja/modals/ModalMasInfoDenuncia.vue'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'
import TiempoEspera from '@/modules/global/components/utilities/TiempoEspera.vue'

import { useAppDialog, useAppToast } from '@/modules/common/composables'
import {
  useDelitoStore,
  useMantenedorStore,
  useDocumentoStore,
  useEspeciesDineroStore,
  usePamStore,
  useRelacionesStore,
  useRelatoStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'

import {
  useCrearCausaStore,
  useIdentificacionDenunciaStore
} from '@/modules/ingreso/composables'

import { dateTimeUtil, requestUtil } from '@/utils'

const {
  pam_getDiagramaProcesoPrincipal,
  pam_getDiagramaProcesoActual,
  pam_SET_PROCESO
} = usePamStore()

const router = useRouter()

const { launchDialog } = useAppDialog()
const { toastError } = useAppToast()

const {
  crearCausa_SET_TIPO_DENUNCIA,
  crearCausa_SET_DATOS_COMPLETOS,
  crearCausa_SET_ID_DENUNCIA,
  crearCausa_RESET_RUC,
  crearCausa_SET_RUC,
  crearCausa_ES_DENUNCIA_ELECTRONICA
} = useCrearCausaStore()

const { identificacionDenuncia_getByIdDenuncia } =
  useIdentificacionDenunciaStore()

const {
  mantenedor_getTiposDenuncia,
  mantenedor_getInstitucionesDenuncia,
  institucionesDenuncia,
  mantenedor_getNombreTipoDelito,
  mantenedor_getNombreInstitucionesDenunciaById,
  mantenedor_getTiposDelito
} = useMantenedorStore()

const {
  sujetosIntervinientes_SET_DEFAULT_STATE,
  sujetosIntervinientes_getSujetosByIdGlobal,
  sujetosIntervinientes
} = useSujetosIntervinientesStore()
const { delito_SET_DEFAULT_STATE, delito_getDelitoByIdDenuncia, delitos } =
  useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()
const {
  identificacionDenuncia_SET_DEFAULT_STATE,
  identificacionDenuncia_getParteDenuncia,
  identificacionDenuncia_getTipoDenuncia
} = useIdentificacionDenunciaStore()

const emit = defineEmits(['tabla-digitador:set-prioritario', 'tasking'])
const denunciaSeleccionada = ref(null)

onMounted(() => {
  mantenedor_getTiposDelito()
})

function openModalMasInfoDenuncia (denuncia) {
  launchDialog({
    component: ModalMasInfoDenuncia,
    header: 'Más Información de la Denuncia',
    width: '30%',
    props: { denuncia }
  })
}

function setPrioritario (data) {
  emit('tabla-digitador:set-prioritario', data)
}

function limpiarStore () {
  identificacionDenuncia_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  crearCausa_RESET_RUC()
}

function getNombreTipoDelitoById (id) {
  return mantenedor_getNombreTipoDelito(id)
}

function estadoTarea (estado) {
  let state = estado
  if (estado === 'Created') {
    state = 'Creada'
  } else if (estado === 'Ready') {
    state = 'Lista'
  } else if (estado === 'Reserved') {
    state = 'Reservada'
  } else if (estado === 'InProgress') {
    state = 'En Proceso'
  } else if (estado === 'Completed') {
    state = 'Completada'
  }
  return state
}

function ejecutarTarea (dataDenuncia) {
  const { data, tarea } = dataDenuncia
  emit('tasking', true)
  const esDenunciaElectronica = data.denuncia.denunciaElectronica
  limpiarStore()
  mantenedor_getTiposDenuncia()
  if (esDenunciaElectronica) {
    crearCausa_ES_DENUNCIA_ELECTRONICA(esDenunciaElectronica)
    identificacionDenuncia_getTipoDenuncia('5')
    crearCausa_SET_TIPO_DENUNCIA('ELECTRONICA')
    crearCausa_SET_ID_DENUNCIA(data.denuncia.idDenuncia)
    pam_SET_PROCESO({
      ...tarea,
      idDenuncia: data.denuncia.idDenuncia,
      idCausa: data.denuncia.idCausa
    })
    const payload = {
      idDenuncia: data.denuncia.idDenuncia
    }
    requestUtil({
      action: sujetosIntervinientes_getSujetosByIdGlobal,
      payload: {
        idDenuncia: data.denuncia.idDenuncia
      },
      resolve: () => {
        requestUtil({
          action: delito_getDelitoByIdDenuncia,
          payload: {
            idDenuncia: data.denuncia.idDenuncia
          },
          resolve: () => getIdentificacionDenuncia(payload),
          reject: (e) => {
            toastError('Ha ocurrido un problema, intentelo nuevamente')
            emit('tasking', false)
          }
        })
      },
      reject: (e) => {
        toastError('Ha ocurrido un problema, intentelo nuevamente')
        emit('tasking', false)
      }

    })
  } else {
    // esto es para denuncia fisica
    crearCausa_SET_TIPO_DENUNCIA('FISICA')
    crearCausa_SET_RUC(data?.denuncia?.ruc)
    pam_SET_PROCESO(tarea)

    // se setea en identificación denuncia store el objeto tipo denuncia con el código del mantenedor
    identificacionDenuncia_getTipoDenuncia('2')
    requestUtil({
      action: identificacionDenuncia_getParteDenuncia,
      payload: {
        numeroParteDenuncia: data?.denuncia?.numeroDenuncia
      },
      resolve: ({ detalles, fechaRecepcionDenuncia, idDenuncia }) => {
        // temporal, remover id denuncia viniendo del parte
        pam_SET_PROCESO({
          ...tarea,
          idDenuncia: idDenuncia,
          idCausa: data.denuncia.idCausa
        })

        const identificacionParteDenuncia = {
          numeroParteDenuncia: detalles[0].numeroParteDenuncia,
          fechaIngresoPartesBandeja: dateTimeUtil.formatToFrontendWithTime(
            fechaRecepcionDenuncia
          ),
          fechaParteDenunciaBandeja: dateTimeUtil.formatToFrontendWithTime(
            detalles[0].fechaOcurrencia
          ),
          idDenuncia: idDenuncia
        }
        requestUtil({
          action: identificacionDenuncia_getByIdDenuncia,
          payload: identificacionParteDenuncia,
          resolve: () => {
            crearCausa_SET_ID_DENUNCIA(data?.denuncia?.idDenuncia)
            router.push(
              '/ingreso/denuncia-fisica/nueva-denuncia/identificacion-denuncia'
            )
          },

          reject: (e) => {
            emit('tasking', false)
            toastError('Ha ocurrido un problema, intentelo nuevamente')
          }
        })
      },
      reject: (e) => {
        toastError('Ha ocurrido un problema, intentelo nuevamente')
        emit('tasking', false)
      }
    })
  }
}

function getIdentificacionDenuncia (payload) {
  requestUtil({
    action: identificacionDenuncia_getByIdDenuncia,
    payload: payload,
    resolve: (r) => {
      crearCausa_SET_DATOS_COMPLETOS({
        identificacion: r,
        intervinientes: sujetosIntervinientes.value,
        delitos: delitos.value
      })
      router.push('/ingreso/validar-duplicidad')
    },
    reject: (e) => {
      emit('tasking', false)
      toastError('Ha ocurrido un problema, intentelo nuevamente')
    }
  })
}
function classEsPrioritario (prioritario) {
  if (prioritario) {
    return 'p-button-rounded p-button-secondary  p-button-outlined'
  } else {
    return 'p-button-rounded p-button-warning p-button-outlined'
  }
}

async function handleDiagramaPam ({ tarea }) {
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

const opciones = ref([
  {
    label: 'Ejecutar Tarea',
    command: () => {
      ejecutarTarea(denunciaSeleccionada.value)
    }
  },
  {
    label: 'Ver Proceso',
    command: () => {
      handleDiagramaPam(denunciaSeleccionada.value)
    }
  }
])

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

onMounted(() => {
  if (!institucionesDenuncia) { requestUtil({ action: mantenedor_getInstitucionesDenuncia }) }
})

function getOrigenDescripcionId (id) {
  if (id === '1') {
    return 'CARABINEROS'
  } else if (id === '2') {
    return 'PDI'
  } else if (id === '4') {
    return 'PODER JUDICIAL'
  } else if (id === '3') {
    return 'GENDARMERÍA'
  } else {
    return 'OTRA INSTITUCIÓN'
  }
}

function getOrigenDescripcion (id) {
  return (
    mantenedor_getNombreInstitucionesDenunciaById(id) ??
    getOrigenDescripcionId(id)
  )
}
</script>
<style scoped>
.naranjo {
  color: #ed7b0e !important;
}
</style>
