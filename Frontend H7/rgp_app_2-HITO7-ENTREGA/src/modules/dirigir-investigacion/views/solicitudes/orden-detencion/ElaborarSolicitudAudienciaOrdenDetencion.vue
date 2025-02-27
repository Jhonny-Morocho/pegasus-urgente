<template>
<section>
  <AppForm
    id="enviarsolicitud"
    :form-submitted="formSubmitted"
    validation-scope="enviarsolicitud"
  >
    <div class="my-2 col-12 md:col-6 lg:col-4">
      <p class="text-center">
        ¿Desea derivar la Materialización al Equipo Jurídico?
      </p>
      <AppSelectButton
        id="deriva-a-juridico"
        v-model="formData.derivaMaterializacionEquipoJuridico"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
      />
    </div>

    <AppFieldset
      class="w-full"
      :collapsed="formData.derivaMaterializacionEquipoJuridico === null"
      legend="Materializa Fiscal"
    >
      <p class="col-12 md:col-4">
        <span style="font-weight: bold">Fiscalía:</span>
        {{ resumenCausa?.nombreFiscaliaLocal }}
      </p>
      <p class="col-12 md:col-4">
        <span style="font-weight: bold">Fiscal Asignado:</span>
        {{ resumenCausa?.nombreFiscalAsignado }}
      </p>
      <div class="col-12 p-0 my-2">
        <AppDropdown
          id="medida-cautelar"
          v-model="formData.nombreTribunal"
          class="col-12 md:col-4"
          label="Tribunales"
          :options="['Tribunal-1','Tribunal-2','Tribunal-3']"
          :rules="{
            required,
          }"
          show-clear
        />
      </div>

      <EscritoMaterializaFiscal
        v-if="!formData.derivaMaterializacionEquipoJuridico"
        v-model="formData"
        :has-archivo-provisional-consulta="false"
        :institucion-options="[]"
        :plantilla-diligencias-options="plantillasDiligencia"
        :unidad-policial-options="[]"
        @get-plantilla-instruccion="getPlantilla"
        @vista-previa-instruccion="vistaPrevia"
      />
      <InstruccionEquipoJuridico
        v-else
        v-model="formData"
        has-revisa-escrito
        :institucion-options="[]"
        :unidad-policial-options="[]"
      />
    </AppFieldset>

    <AppFieldset
      class="w-full mt-6"
      collapsed
      legend="¿Desea agregar un documento a la solicitud?"
      :toggleable="false"
    >
      <h3 class="text-center w-full my-6">
        Agregar un documento 😅
      </h3>
    </AppFieldset>

    <AppBtnNextTeleported
      class="mr-2"
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar Solicitud"
      @click="handleEnviarSolicitud()"
    />
  </AppForm>
</section>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useAppDialog, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore, useDiligenciaStore, usePamStore } from '@/modules/global/composables'
import ModalVerEscrito from '@/modules/dirigir-investigacion/components/modals/ModalVerEscrito.vue'
import EscritoMaterializaFiscal from '@/modules/dirigir-investigacion/components/EscritoMaterializaFiscal.vue'
import InstruccionEquipoJuridico from '@/modules/dirigir-investigacion/components/InstruccionEquipoJuridico.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()
const { toastError, TOAST_MESSAGES, toastSuccess } = useAppToast()
const {
  resumenCausa,
  ruc,
  dirigirInvestigacion_postCrearSolicitudOrdenDetencion
} = useDirigirInvestigacionStore()
const { diligencia_getEscritoMaterializacionDiligencia } = useDiligenciaStore()
const {
  plantillasDiligencia,
  mantenedor_getPlantillasDiligencia,
  mantenedor_getInstituciones
} = useMantenedorStore()

const { pam_reservarIniciarTarea } = usePamStore()

onMounted(async () => {
  requestUtil({ action: mantenedor_getPlantillasDiligencia })
  requestUtil({ action: mantenedor_getInstituciones })
})

const formData = ref({
  derivaMaterializacionEquipoJuridico: null, // inicia en null siempre - bool
  idTribunal: 'uuid', // tribunal - uuid,
  nombreTribunal: null, // tribunal - string,
  agregaUnidadPolicial: null, // bool
  idPlantilla: null, // plantilla - uuid,
  materializacionTextoFiscal: null, // plantilla - string
  instruccionesEquipoJuridico: null, // plantilla - string
  idInstitucion: 'uuid', // institucion - uuid,
  institucion: null, // institucion - string,
  idUnidadPolicial: 'uuid', // unidad policial - uuid,
  unidadPolicial: null, // unidad policial - string,
  revisarEscrito: null,
  listaDocumentos: [], // array de documentos
  deseaAdjuntarCDD: false // bool
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'enviarsolicitud'
})

const router = useRouter()

function vistaPrevia () {
  launchDialog({
    component: ModalVerEscrito,
    header: 'Ver Escrito',
    props: { data: formData.value },
    width: '67%'
  })
}

function handleEnviarSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  launchConfirmDialog({
    header: 'Solicitar Audiencia de Formalización',
    message: '¿Está seguro de enviar la Solicitud de Audiencia?',
    acceptLabel: 'Aceptar',
    accept: async () => {
      postCrearSolicitudOrden()
    }
  })
}

async function postCrearSolicitudOrden () {
  requestUtil({
    action: dirigirInvestigacion_postCrearSolicitudOrdenDetencion,
    payload: {
      ruc: ruc.value,
      ...formData.value
    },
    resolve: async (data) => {
      toastSuccess('La solicitud ha sido enviada con éxito')
      console.console.log(data)
      await requestUtil({
        action: pam_reservarIniciarTarea,
        payload: {
          taskInstanceId: data?.solicitud?.idTarea,
          idTarea: data?.solicitud?.idTarea
        }
      })
      router.push({ name: 'DIDesarrolloInvestigacion' })
    }
  })
}

async function getPlantilla (idPlantilla) {
  requestUtil({
    action: diligencia_getEscritoMaterializacionDiligencia,
    payload: {
      ruc: ruc.value,
      idPlantilla
    },
    resolve: ({ data }) => {
      formData.value.materializacionTextoFiscal = data.texto
      console.log(formData.value)
    }
  })
}
</script>
