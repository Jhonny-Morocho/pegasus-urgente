<template>
<AppFieldset
  legend="Resumen de la Causa"
>
  <div
    v-if="collapsedWhileLoading"
    class="w-full"
  >
    <LoaderSkeleton />
  </div>
</AppFieldset>
<ResumenCausa
  :causa="resumenCausa"
  title="Resumen Causa"
/>
<AppFieldset legend="Relaciones">
  <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
    <InputText
      id="filter-text"
      class="p-inputtext-sm"
      placeholder="Buscar"
    />
    <Button
      class="btn-primary p-button-sm"
      icon="pi pi-search"
    />
  </div>
  <!-- <Relaciones :relaciones="relaciones" /> -->
  <TablaRelaciones
    v-model:first="tables.relaciones.firstRecord"
    v-model:selection="relacionesSeleccionadas.value"
    :loading="tables.relaciones.isLoading"
    selectable
    :total-records="paginacion?.elementosTotales"
    :value="relaciones"
    @derivar-uravit="launchDerivarUravitModal"
    @page="getRelaciones"
  />
</AppFieldset>
<AppFieldset legend="Lista de Especies Dinero">
  <TablaEspecies
    v-model:first="tables.especies.firstRecord"
    v-model:selection="especiesSeleccionadas.value"
    :loading="tables.especies.isLoading"
    :rows="paginacionEspecies?.tamanoPagina"
    selectable
    :total-records="paginacionEspecies?.elementosTotales"
    :value="especies"
    @page="getEspecies"
    @solicitar-peritaje="launchSolicitarPeritajeModal"
    @solicitar-salida-audiencia="launchSolicitarSalidaAudienciaModal"
  />
</AppFieldset>

<AppBtnRightTeleported>
  <Button
    class="btn-primary px-5"
    icon="pi pi-arrow-right"
    icon-pos="right"
    label="Agregar Medidas Cautelares"
    @click="handleNextStep"
  />
</AppBtnRightTeleported>
</template>

<script setup>
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import TablaRelaciones from '@/modules/tramitar-audiencia/components/tables/TablaRelaciones.vue'
import TablaEspecies from '@/modules/tramitar-audiencia/components/tables/TablaEspecies.vue'
import { onMounted, reactive, ref } from 'vue'
import { useEspeciesDineroStore, useRelacionesStore } from '@/modules/global/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { useRouter } from 'vue-router'
import { useAppDialog } from '@/modules/common/composables'
import ModalSolicitarSalidaAudiencia from '@/modules/tramitar-audiencia/components/modals/ModalSolicitarSalidaAudiencia.vue'
import ModalDerivarUravit from '@/modules/tramitar-audiencia/components/modals/ModalDerivarUravit.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useEspecieIncautadaPendienteRecepcionStore, useRegistroSalida } from '@/modules/recepcion-especies-dinero/composables'
// import Relaciones from '@/modules/global/components/solicitudes/Relaciones.vue'

const { launchDialog } = useAppDialog()
const router = useRouter()

// *** Uncomment To implement Pinia Store: *** //

// const tramitarAudienciaStore = useTramitarAudienciaStore()
// === import methods === //
// const { tramitarAudiencia_getAntecedentesCausa } = tramitarAudienciaStore
// === import variables and makes it reactive === //
// const { causa } = storeToRefs(tramitarAudienciaStore)

const {
  tramitarAudiencia_getAntecedentesCausa,
  idDenuncia,
  resumenCausa,
  relacionesSeleccionadas,
  especiesSeleccionadas,
  tramitarAudiencia_SET_RELACIONES,
  tramitarAudiencia_SET_ESPECIES
} = useTramitarAudiencia()

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  especies: {
    firstRecord: 0,
    isLoading: false
  }
})

/* === Relaciones === */

const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

const collapsedWhileLoading = ref(true)

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.relaciones.isLoading = l)
  })
}

/* === ESPECIES === */

const { especies, especiesDinero_getEspecieByIdDenuncia, paginacionEspecies } = useEspeciesDineroStore()

async function getEspecies (pagination = undefined) {
  if (!pagination) {
    tables.especies.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.especies.isLoading = l)
  })
}

onMounted(() => {
  getRelaciones()
  getEspecies()
  requestUtil({
    action: tramitarAudiencia_getAntecedentesCausa,
    resolve: (r) => {
      collapsedWhileLoading.value = false
    }
  })
})

/* ============================== */

/* === Solicitar Salida Audiencia === */

const {
  stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie
} = useEspecieIncautadaPendienteRecepcionStore()

const {
  registroSalida_ingresarSolicitudSalida,
  registroSalida_ingresarSolicitudSalidaperitaje
} = useRegistroSalida()

const launchSolicitarSalidaAudienciaModal = (especie) => {
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: especie.idEspecie },
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

/* === Solicitar Peritaje === */

const launchSolicitarPeritajeModal = (especie) => {
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: especie.idEspecie },
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

/* === Derivar a URAVIT === */

const launchDerivarUravitModal = (relacion) => {
  launchDialog({
    component: ModalDerivarUravit,
    header: 'Derivar a URAVIT',
    width: '80%',
    props: {
      relacion,
      causa: resumenCausa.value
    },
    confirmLabel: 'Enviar a URAVIT',
    accept: (r) => {
      console.log('Enviar a URAVIT', r)
    }
  })
}

async function handleNextStep (to) {
  requestUtil({
    action: tramitarAudiencia_SET_RELACIONES,
    payload: relacionesSeleccionadas.value
  })

  requestUtil({
    action: tramitarAudiencia_SET_ESPECIES,
    payload: especiesSeleccionadas.value
  })

  router.push('medidas-cautelares')
}
</script>
