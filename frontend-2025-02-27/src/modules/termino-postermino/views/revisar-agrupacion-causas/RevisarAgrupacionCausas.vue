<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperiorSecundario"
  page-title="Revisar Agrupación de Causa"
/>
<section class="mt-6">
  <AppFieldset legend="Revisar Propuesta">
    <div class="grid w-full">
      <div class="col-12 md:col-6 pl-4">
        <p><strong>Fecha/Hora: </strong></p>
        <p><strong>Motivo de Agrupación: </strong></p>
        <p><strong>Fiscal Asignado: </strong></p>
      </div>
      <div class="col-12 md:col-6 pr-4">
        <p><strong>Comentario: </strong></p>
        <p>Se tomó la decisión a raíz de .........</p>
      </div>
    </div>
  </AppFieldset>
  <AppFieldset legend="Propuesta Fiscal Adjunto: AGRUPAR CAUSAS">
    <div class="mb-3 w-full">
      <h3 class="text-xl mb-3">
        Causa Principal
      </h3>
      <TablaCausasAgrupar
        class="col-12"
        :value="causaPrincipal"
      />
    </div>

    <div class="mb-3 w-full">
      <h3 class="text-xl mb-3">
        Causas a Agrupar
      </h3>
      <TablaCausasAgrupar
        class="col-12"
        :value="causasAgrupar"
      />
    </div>
  </AppFieldset>
  <AppFieldset
    v-if="data.ingresarNotificacion"
    class="w-full"
    legend="Ingresar Notificación de Trasnferencia"
  >
    <AppDropdown
      id="plantilla"
      v-model="data.idPlantilla"
      class="col-4 p-fluid"
      label="Plantilla"
      option-label="descripcion"
      option-value="id"
      :options="plantillaOptions"
      @change="getPlantillaInstruccion"
    />
    <Editor
      id="editr-solicitud-transferencia"
      v-model="data.solicitudTransferencia"
      class="col-12"
      editor-style="height: 256px"
    />
  </AppFieldset>
  <div class="col-12 mb-4 grid">
    <h4 class="ml-2 col-12">
      ¿Enviar Consulta FR?
    </h4>
    <AppSelectButton
      id="enviar-consulta"
      v-model="data.consultarFR"
      class="col-4 p-fluid"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
    />
  </div>
  <AppFieldset
    v-if="data.consultarFR"
    legend="Ingresar datos para la consulta"
  >
    <ModalConsultar />
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined p-button-danger mr-5 px-5"
      icon="pi pi-times-circle"
      icon-pos="right"
      label="Recahzar Propuesta"
      @click="handleDecision((data.aprobarPropuesta = false))"
    />
    <Button
      class="btn-primary px-5"
      icon="pi pi-check-circle"
      icon-pos="right"
      label="Aprobar Propuesta"
      @click="handleDecision((data.aprobarPropuesta = true))"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
/* eslint-disable */
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import TablaCausasAgrupar from '@/modules/termino-postermino/components/tablas/TablaCausasAgrupar.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppDropdown from '@/modules/common/components/inputs/AppDropdown.vue'
import ModalConsultar from '@/modules/termino-postermino/components/modals/ModalConsultarFR.vue'
import ModalVer from '@/modules/termino-postermino/components/modals/ModalMostrarData.vue'
import ModalRechazoReaperturaVue from '../../components/modals/ModalRechazoReapertura.vue'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { onMounted, reactive, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useRouter } from 'vue-router'
import { useMenuSuperior, useTermino } from '@/modules/termino-postermino/composables'
import { useCausasRelacionadasStore } from '@/modules/preclasificador/composables'

const router = useRouter()
const handleBackStep = () => {
  router.push({ name: 'BandejaFiscalJefe' })
}
const { toastSuccess } = useAppToast()
const { launchDialog } = useAppDialog()
const { ruc } = useTermino()
const { itemsMenuSuperiorSecundario } = useMenuSuperior({ ruc })
const { causasRelacionadas_getCausasRelacionadas, causasRelacionadas } = useCausasRelacionadasStore()

const data = reactive({
  consultarFR: null,
  aprobarPropuesta: null,
  ingresarNotificacion: false,
  idPlantilla: null,
  solicitudTransferencia: ''
})

const plantillaOptions = ref([{ id: 1, descripcion: 'Plantilla Instrucción General' }])

function getPlantillaInstruccion () {
  const texto = `<p>Orden de Transferencia</p>
  <p>RUC N°: 2200000972-9</p>
  <p><br></p>
  <p>Sr. [COMPLETE NOMBRE]</p>
  <p>Subprefecto de Investigaciones</p>
  <p><br></p>
  <p>Presente</p>
  <p>Conforme a lo dispuesto en el artículo 79 del Código Procesal Penal, se ordena la transferencia de la causa RUC N°: 2200000972-9. 
  Solicito a usted practicar aquellas diligencias de investigación necesarias para proceder con la transferencia de la causa antes mencionada.</p>`
  data.solicitudTransferencia = texto
}

const causasAgrupar = ref([])
const causaPrincipal = ref([])

async function obtenerCausasRelacionadas () {
  requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      ruc: ruc.value
    }
  })
}

function setCausas(){
  causasRelacionadas.value.forEach((causa) => {
    if (causa.tipoCausa === 'Actual') {
      causaPrincipal.value.push(causa)
      return
    }
    causasAgrupar.value.push(causa)
  })
}

onMounted(async () => {
  obtenerCausasRelacionadas()
  setCausas()
})

async function handleDecision (aprobarPropuesta) {
  if (aprobarPropuesta) {
    launchDialog({
      component: ModalVer,
      header: 'Aprobar Propuesta',
      confirmLabel: 'Aprobar',
      props: {
        data: {
          message: `La siguiente causa será transferida: RUC: ${ruc.value}`
        }
      },
      accept: () => {
        toastSuccess('Exitoso. Causa Transferida')
      }
    })
  } else {
    launchDialog({
      component: ModalRechazoReaperturaVue,
      header: 'Rechazar Propuesta',
      confirmLabel: 'Rechazar',
      accept: async (data) => {
        console.log('Motivo Rechazo:', data)
      }
    })
  }
}
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
