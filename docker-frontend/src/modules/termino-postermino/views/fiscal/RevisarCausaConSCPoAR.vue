<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa?.nombre}`"
  :page-subtitle="`RUC: ${resumenCausa?.ruc}`"
  page-title="Revisar Causa Con Suspensión Condicional del Procedimiento"
/>
<section class="mt-6 w-full">
  <LoaderSkeleton v-if="loaders.acuerdoReparatorio" />
  <AppFieldset
    v-else
    legend="Registro de Incumplimiento"
  >
    <div class="w-full mb-4">
      <Message
        class="w-full"
        :closable="false"
        :severity="evaluacionCumplimiento"
      >
        {{
          mantenedor_getDescripcionEvaluacionCumplimientosById(
            registroActual?.idEvaluacionCumplimiento
          )
        }}
      </Message>
    </div>

    <div class="grid w-full mb-4">
      <div class="col-6 pl-4">
        <p>
          <strong>Imputado: </strong>{{ nombreImputado || `No encontrado` }}
        </p>
      </div>
      <div class="col-6 pl-4">
        <p><strong>Observación: </strong>{{ registroActual?.observacion }}</p>
      </div>
    </div>

    <AppFieldset
      class="col-12"
      legend="Cumplimientos Registrados a la Fecha"
    >
      <TablaCumplimiento
        :loading="loaders.registroCumplimiento"
        :value="registroCumplimiento?.listaRegistros"
      />
    </AppFieldset>

    <AppFieldset
      class="col-12"
      legend="Causa"
    >
      <div class="grid w-full mb-4">
        <div class="col-4 pl-4">
          <p><strong>RUC: </strong>{{ resumenCausa?.ruc }}</p>
          <p><strong>Nombre Causa: </strong>{{ resumenCausa?.nombre }}</p>
          <p><strong>Delitos: </strong>{{ nombresDelitos }}</p>
        </div>
        <div class="col-4 pl-4">
          <p>
            <strong>Estado de la Causa: </strong>{{ antecedentes?.estado || 'N/A' }}
          </p>
          <p>
            <strong>Fiscal Asignado: </strong>{{ resumenCausa?.fiscalPropuesto || 'N/A' }}
          </p>
        </div>
        <div class="col-4 pl-4">
          <p>
            <strong>Fecha Creación Causa: </strong>{{ resumenCausa?.fechaCreacion.split('T')[0] || 'N/A' }}
          </p>
          <p>
            <strong>Nombre Fiscalía: </strong>{{ fiscaliaLocal?.nombreFiscalia || 'N/A' }}
          </p>
        </div>
      </div>
    </AppFieldset>

    <AppFieldset
      class="w-full"
      legend="Tipo de Suspensión y Condiciones SCP"
    >
      <div>
        <p>
          <strong>Tipo de Suspensión: </strong>{{
            mantenedor_getDescripcionTipoSuspensionById(
              acuerdoReparatorio?.idTipoSuspension
            )
          }}
        </p>
        <p>
          <strong>Subtipo de Suspensión: </strong>{{
            mantenedor_getDescripcionSubtipoSuspensionById(
              acuerdoReparatorio?.idSubtipoSuspension
            )
          }}
        </p>
        <p>
          <strong>Condiciones establecidas: </strong>
          {{ nombresCondiciones }}
        </p>
        <p>
          <strong>Detalle de condiciones: </strong>{{ acuerdoReparatorio.detalleCondiciones }}
        </p>
      </div>
    </AppFieldset>

    <div class="mt-4 col-12">
      <h4>Seleccione Decisión antes de enviar:</h4>
      <AppSelectButton
        id="solicitar-audiencia"
        v-model="formData.esSolicitudAudiencia"
        class="w-full"
        option-label="descripcion"
        option-value="value"
        :options="[
          { descripcion: 'Solicitar Audiencia', value: true },
          { descripcion: 'Continuar Monitoreo', value: false }
        ]"
        :rules="{ required }"
      />
    </div>

    <AppFieldset
      v-if="formData.esSolicitudAudiencia"
      class="col-12"
      legend="Solicitar Audiencia para Revocación / Revisión de Condiciones"
    >
      <AppForm
        id="revisar-causa-form"
        class="col-12"
        :form-submitted="formSubmitted"
        validation-scope="revisar-causa-form"
      >
        <ComunicarCierreEscrito
          v-model="formData"
          class="col-12"
          :fiscalia="fiscaliaLocal"
        />
      </AppForm>
    </AppFieldset>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    :disabled="formData.esSolicitudAudiencia === null"
    label="Enviar Solicitud"
    @click="handleEnviarEscrito"
  />
</section>
</template>

<script setup>
/*eslint-disable*/
import PageHeader from '@/modules/common/components/PageHeader.vue';
import AppFieldset from '@/modules/common/components/AppFieldset.vue';
import TablaCumplimiento from '@/modules/termino-postermino/components/tablas/TablaCumplimiento.vue';
import ComunicarCierreEscrito from '@/modules/termino-postermino/components/ComunicarCierreEscrito.vue';
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue';
import { ref, onMounted, reactive, computed } from 'vue';
import { requestUtil } from '@/utils';
import {
  useMenuSuperior,
  usePostermino,
  useTermino
} from '@/modules/termino-postermino/composables';
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables';
import { useRouter } from 'vue-router';
import {
  useAntecedentesCausaStore,
  useDelitoStore,
  useMantenedorStore,
  usePamStore
} from '@/modules/global/composables';
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue';

const { resumenCausa, ruc, idDenuncia } = useTermino();
const {
  mantenedor_getNombreTipoSujeto,
  mantenedor_getDescripcionTipoSuspensionById,
  mantenedor_getDescripcionSubtipoSuspensionById,
  mantenedor_getDescripcionCondicionById,
  mantenedor_getCondicionesAR,
  mantenedor_getCodigoEvaluacionCumplimientosById,
  mantenedor_getDescripcionEvaluacionCumplimientosById,
  evaluacionCumplimientos
} = useMantenedorStore();

const { launchConfirmDialog } = useConfirmDialog();
const { toastSuccess } = useAppToast();
const { itemsMenuSuperior } = useMenuSuperior({ ruc });
const { procesoPam } = usePamStore();

const formData = reactive({
  seDerivaEquipoJuridico: null,
  idTribunal: '',
  idPlantilla: null,
  documentosSeleccionados: [],
  textoFiscal: '',
  instruccionFiscal: '',
  seRevisaEscrito: null,
  adjuntaCarpeta: false,
  esSolicitudAudiencia: null
});
const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'revisar-causa-form'
});

const loaders = reactive({
  acuerdoReparatorio: true,
  registroCumplimiento: true
});

const nombreImputado = computed(() => {
  if (resumenCausa.value.imputados.length < 1) return null;
  const { nombre, apellido } = resumenCausa.value.imputados.find(
    (imputado) => imputado.idPersona === idImputadoConsultado.value
  );
  return `${nombre} ${apellido}`;
});

const evaluacionCumplimiento = computed(() => {
  if (!registroActual.value) return null;
  if (
    mantenedor_getCodigoEvaluacionCumplimientosById(
      registroActual?.value.idEvaluacionCumplimiento
    ) === '1'
  ) {
    return 'success';
  } else if (
    mantenedor_getCodigoEvaluacionCumplimientosById(
      registroActual?.value.idEvaluacionCumplimiento
    ) === '3'
  ) {
    return 'error';
  }
});

/* Acuerdo Reparatorio */
const {
  postermino_getRegistroCumplimiento,
  acuerdoReparatorio,
  registroCumplimiento,
  postermino_postDecisionRevisarCausa,
  termino_PamCompletarRevisarCausa,
  postermino_getAcuerdoReparatorio
} = usePostermino();

const idImputadoConsultado = ref(procesoPam.value.taskInputData.idImputado);

function getAcuerdoReparatorio() {
  requestUtil({
    action: postermino_getAcuerdoReparatorio,
    payload: {
      idCausa: resumenCausa?.value.idCausa,
      idImputado: idImputadoConsultado.value
    },
    loader: (l) => {
      loaders.acuerdoReparatorio = l;
    }
  });
}

const registroActual = ref(null);

function getRegistroCumplimiento() {
  requestUtil({
    action: postermino_getRegistroCumplimiento,
    payload: {
      idCausa: resumenCausa?.value.idCausa,
      idImputado: idImputadoConsultado.value
    },
    loader: (l) => {
      loaders.registroCumplimiento = l;
    },
    resolve: (data) => {
      registroActual.value = data.listaRegistros[0];
    }
  });
}

const nombresCondiciones = computed(() => {
  const condicionesArray = acuerdoReparatorio?.value.idsCondicion.map(
    (condicionId) => mantenedor_getDescripcionCondicionById(condicionId)
  );
  return condicionesArray.join(', ');
});

/******************/

/* ANTECEDENTES CAUSA */

const { antecedentes, fiscaliaLocal, antecedentesCausa_getAntecedentesCausa } =
  useAntecedentesCausaStore();

async function getAntecedentesCausa() {
  requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: { ruc: ruc.value },
    resolve: (data) => {
      console.log(data);
    }
  });
}

/******************/

/* DELITOS */

const { delitos, delito_getDelitoByIdDenuncia } = useDelitoStore();

const nombresDelitos = computed(() => {
  const nombresArray = delitos.value.map(({ delito }) => delito?.tipoDelito);
  return nombresArray.join(' - ');
});

// Pendiente filtar delitos de imputado siendo consultado
async function getDelitos(pagination = undefined) {
  console.log({ procesoPam });

  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value
    },
    resolve: () => console.log({ delitos })
  });
}

/******************/

/******************/

const handleEnviarEscrito = () => {
  if (!isFormValid()) {
    return;
  }
  if (formData.esSolicitudAudiencia) {
    launchConfirmDialog({
      message: `¿Está seguro de Solicitar Audiencia?`,
      header: 'Solicitar Audiencia',
      accept: () => {
        postDecisionRevisarCausa();
      }
    });
  } else {
    launchConfirmDialog({
      message: `¿Está seguro de Continuar el Monitoreo?`,
      header: 'Continuar el Monitoreo',
      accept: () => {
        postDecisionRevisarCausa();
      }
    });
  }
};

const postDecisionRevisarCausa = () => {
  const {
    idTribunal: idJuzgado,
    seDerivaEquipoJuridico,
    idPlantilla,
    instruccionFiscal,
    documentosSeleccionados: idsDocumento,
    textoFiscal: textoEscrito,
    seRevisaEscrito,
    esSolicitudAudiencia
  } = formData;
  requestUtil({
    action: postermino_postDecisionRevisarCausa,
    payload: {
      idCausa: resumenCausa.value.idCausa,
      idFiscalia: '0a5f2032-9c4f-4ebb-b87f-5b2eb5684e1a',
      idFiscal: 'Thomas',
      seDerivaEquipoJuridico,
      idPlantilla,
      idsDocumento,
      idJuzgado,
      textoEscrito,
      seRevisaEscrito,
      instruccionFiscal,
      esSolicitudAudiencia
    },
    resolve: () => {
      terminarTareaRevisarCausa();
    }
  });
};

/* Terminar Tarea PAM */

const terminarTareaRevisarCausa = () => {
  requestUtil({
    action: termino_PamCompletarRevisarCausa,
    payload: {
      taskId: procesoPam.value?.taskId,
      revocacionRevisionCondicion: true
    },
    resolve: () => {
      toastSuccess(`Registro guardado con éxito!`);
      setTimeout(() => router.push({ name: 'BandejaFiscal' }), 500);
    }
  });
};

const router = useRouter();
const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' });
};

function getMantenedores() {
  requestUtil({ action: mantenedor_getCondicionesAR });
}

onMounted(async () => {
  getAntecedentesCausa();
  getDelitos();
  getAcuerdoReparatorio();
  getMantenedores();
  getRegistroCumplimiento();
  console.log({ resumenCausa });
});
</script>

<style scoped>
p,
h4 {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.p-message.p-message-error {
  justify-content: center !important;
}
</style>
