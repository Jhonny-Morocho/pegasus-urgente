<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombre}`"
  :page-subtitle="`RUC: ${resumenCausa.ruc}`"
  page-title="Evaluación de Informe Psiquiátrico"
/>
<section class="mt-6">
  <AppFieldset legend="Informe Psiquiátrico">
    <div class="grid w-full mb-2">
      <div class="col-6 pl-4">
        <p>
          <strong>Identificación de informe psiquiátrico: </strong>{{ informePsiquiatrico?.identificacionInforme }}
        </p>
        <p>
          <strong>Institución Emisora: </strong>{{ informePsiquiatrico?.institucionEmisora }}
        </p>
        <p>
          <strong>Responsable quién firma informe: </strong>{{ informePsiquiatrico?.responsable }}
        </p>
      </div>
      <div class="col-6 pl-4">
        <p>
          <strong>Fecha de informe: </strong>{{ informePsiquiatrico?.fechaInforme }}
        </p>
        <p>
          <strong>RUN Imputado: </strong>{{ informePsiquiatrico?.runImputado }}
        </p>
        <p>
          <strong>Nombre Imputado: </strong>{{ imputado?.nombreCompleto }}
        </p>
        <Button
          class="p-button-outlined mt-3 col-4"
          icon="pi pi-file"
          icon-pos="right"
          label="Ver Informe"
          @click="openVerInforme"
        />
      </div>
    </div>
  </AppFieldset>
  <AppFieldset legend="Evaluación Fiscal / Abogado sobre el imputado">
    <AppForm
      :form-submitted="formSubmitted"
      validation-scope="evaluacion-fiscal"
    >
      <div class="grid w-full mb-2 justify-content-between">
        <div class="col-4 pl-4">
          <h4 class="mt-3">
            ¿Es Imputable?
          </h4>
          <AppSelectButton
            id="esImputable"
            v-model="formData.esImputable"
            class="col-6 p-fluid m-0 w-full"
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false }
            ]"
            :rules="{ required }"
          />
          <div v-if="formData.esImputable === false">
            <h4 class="mt-3">
              ¿Es Peligroso?
            </h4>
            <AppSelectButton
              id="esPeligroso"
              v-model="formData.esPeligroso"
              class="col-6 p-fluid m-0 w-full"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
              :rules="{ required }"
            />
          </div>
        </div>
        <div class="col-7 pl-4">
          <AppTextarea
            id="observaciones"
            v-model="formData.observaciones"
            auto-resize
            class="col-12 mt-4"
            cols="150"
            label="Observaciones"
            rows="5"
            :rules="{
              required
            }"
          />
        </div>
      </div>
    </AppForm>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      :disabled="buttonDisabled || imputadoLoading"
      icon="pi pi-save"
      icon-pos="right"
      label="Registrar Evaluación"
      :loading="imputadoLoading"
      @click="handleDecision"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppForm from '@/modules/common/components/AppForm.vue'
import ModalMostrarData from '@/modules/termino-postermino/components/modals/ModalMostrarData.vue'
import {
  useMenuSuperior,
  usePostermino,
  useTermino
} from '@/modules/termino-postermino/composables'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  useAppDialog,
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { usePamStore } from '@/modules/global/composables'

const router = useRouter()
/*eslint-disable*/
const { launchConfirmDialog } = useConfirmDialog();
const { launchDialog } = useAppDialog();
const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' });
};

const {
  ruc,
  resumenCausa
  // idDenuncia
} = useTermino();

const { itemsMenuSuperior } = useMenuSuperior({ ruc });
const { procesoPam } = usePamStore();

const {
  postermino_getInformePsiquiatrico,
  termino_PamCompletarEvaluarInformePsiquiatrico,
  postermino_postInformePsiquiatrico
} = usePostermino();

const formData = reactive({
  esImputable: null,
  esPeligroso: null,
  observaciones: '',
  option: ''
});

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'evaluacion-fiscal'
});

const buttonDisabled = computed(() => {
  if (formData.esImputable === null) return true;
  return !!(!formData.esImputable && formData.esPeligroso === null);
});

const imputado = computed(() => {
  if (!resumenCausa.value.imputados[0]) return null;
  const { nombre, apellido, ...imputado } = resumenCausa.value.imputados[0];
  return { nombreCompleto: `${nombre} ${apellido}`, ...imputado };
});

/* === Informe Psiquiatrico === */

const informePsiquiatrico = ref([]);

async function getInformePsiquiatrico() {
  requestUtil({
    action: postermino_getInformePsiquiatrico,
    payload: {
      idImputado: imputado.value.idPersona,
      idCausa: resumenCausa.value.idCausa
    },
    resolve: (data) => {
      informePsiquiatrico.value = data;
    }
  });
}

function openVerInforme() {
  launchDialog({
    component: ModalMostrarData,
    header: 'Ver Informe Psiquiátrico',
    props: {
      dataArray: rellenarInforme(informePsiquiatrico.value)
    }
  });
}

const rellenarInforme = (informePsiquiatrico) => {
  const { institucion, responsable, fecha, informe } = informePsiquiatrico;
  return [
    {
      label: 'Responsable Informe',
      value: responsable
    },
    {
      label: 'Institución Responsable',
      value: institucion
    },
    {
      label: 'Fecha',
      value: fecha
    },
    {
      label: 'Informe',
      value: informe
    }
  ];
};

/* ===================== */

/* === Imputado === */

const resultadoEvaluacion = computed(() => {
  const { esImputable, esPeligroso } = formData;
  if (esImputable || esPeligroso) {
    return 'Reactivar Causa Penal';
  } else if (!esImputable && !esPeligroso) {
    return 'Solicitar Sobreseimiento Definitivo';
  }
});

const textoDialog = computed(() => {
  const { esImputable, esPeligroso } = formData;
  if (esImputable) return 'Es Imputable';
  else if (!esImputable) {
    if (esPeligroso) return `No es Imputable - Si es Peligroso`;
    else return `No es Imputable - No es Peligroso`;
  }
});

const { toastError, toastSuccess } = useAppToast();

async function handleDecision() {
  if (isFormValid()) {
    formData.option = resultadoEvaluacion;
    launchDialog({
      component: ModalMostrarData,
      header: `${formData.option}`,
      props: {
        message: `¿Estas seguro de ${formData.option}?`,
        dataArray: [
          {
            label: 'Imputado',
            value: imputado.value.nombreCompleto
          },
          {
            label: textoDialog,
            value: ''
          }
        ]
      },
      width: 'fit-content',
      confirmLabel: 'Aceptar',
      accept: () => {
        postEvaluacionInformePsiquiatrico();
      }
    });
  } else {
    toastError('Hay campos sin completar');
  }
}

const postEvaluacionInformePsiquiatrico = () => {
  const { esImputable, esPeligroso, observaciones: observacion } = formData;
  requestUtil({
    action: postermino_postInformePsiquiatrico,
    payload: {
      ...informePsiquiatrico.value,
      esImputable,
      esPeligroso,
      observacion
    },
    resolve: () => {
      terminarTareaEvaluarInformePsiquiatrico();
    }
  });
};

/* Terminar Tarea PAM */

const terminarTareaEvaluarInformePsiquiatrico = () => {
  requestUtil({
    action: termino_PamCompletarEvaluarInformePsiquiatrico,
    payload: {
      taskId: procesoPam.value?.taskId,
      documento: {},
      esImputable: formData.esImputable,
      enajenadoEsPeligroso: formData.esPeligroso || false
    },
    resolve: () => {
      setTimeout(() => {
        router.push({ name: 'BandejaFiscal' });
        toastSuccess('Evaluación enviada');
      }, 500);
    }
  });
};

onMounted(async () => {
  getInformePsiquiatrico();
});
</script>

<style scoped>
p,
h4 {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
