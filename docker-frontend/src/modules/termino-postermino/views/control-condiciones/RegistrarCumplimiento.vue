<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-title="Registro de Cumplimiento o Incumplimiento"
/>
<section class="mt-5">
  <AppFieldset legend="Nuevo Registro">
    <AppForm
      :form-submitted="formSubmitted"
      validation-scope="nuevo-registro"
    >
      <div class="flex mb-3">
        <AppInput
          id="ruc-causa"
          v-model="formData.ruc"
          class="col-4 p-inputtext-sm mr-3 p-0"
          label="Ingresar RUC"
          :rules="{ required }"
        />
        <Button
          class="btn-primary p-2"
          icon="pi pi-search"
          style="height: min-content"
          @click="getImputados"
        />
      </div>
      <div class="grid">
        <AppDropdown
          id="lista-imputados"
          v-model="formData.idImputado"
          class="col-4"
          label="Imputados"
          :loading="loaders.imputados"
          option-label="nombreCompleto"
          option-value="idPersona"
          :options="imputados"
          :rules="{ required }"
          @change="getRegistroCumplimiento"
        />
        <AppDropdown
          id="condiciones"
          v-model="formData.idCondicion"
          class="col-4"
          :disabled="formData.idImputado === null"
          label="Condiciones a Registrar"
          option-label="descripcion"
          option-value="id"
          :options="listaCondiciones"
          :rules="{ required }"
        />
        <AppInput
          id="lugar"
          v-model="formData.lugar"
          class="col-4"
          :disabled="formData.idImputado === null"
          label="Lugar"
          :rules="{ required }"
        />
      </div>
      <div class="grid">
        <AppCalendar
          id="fecha-hora"
          v-model="formData.fechaHora"
          class="col-4"
          :disabled="formData.idImputado === null"
          label="Fecha y Hora"
          :rules="{ required }"
        />
        <AppDropdown
          id="evaluacion cumplimiento"
          v-model="formData.idEvaluacion"
          class="col-4"
          :disabled="formData.idImputado === null"
          label="Evaluación de Cumplimiento"
          option-label="descripcion"
          option-value="id"
          :options="evaluacionCumplimientos"
          :rules="{ required }"
        />
      </div>
      <AppTextarea
        id="observaciones"
        v-model="formData.observacion"
        class="col-12"
        cols="150"
        :disabled="formData.idImputado === null"
        label="Observaciones"
        rows="5"
        :rules="{ required }"
      />
    </AppForm>
  </AppFieldset>
  <AppFieldset
    legend="Cumplimientos Registrados a la Fecha"
    :toggleable="true"
  >
    <TablaCumplimiento
      :loading="loaders.registroCumplimiento"
      :value="registroCumplimiento?.listaRegistros"
    />
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      :disabled="!registroCumplimiento"
      icon="pi pi-save"
      icon-pos="right"
      label="Guardar Decisión"
      :loading="loaders.postRegistro"
      @click="guardarRegistro"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
/*eslint-disable*/
import PageHeader from '@/modules/common/components/PageHeader.vue';
import AppFieldset from '@/modules/common/components/AppFieldset.vue';
import TablaCumplimiento from '@/modules/termino-postermino/components/tablas/TablaCumplimiento.vue';
import ModalMostrarData from '@/modules/termino-postermino/components/modals/ModalMostrarData.vue';
import AppCalendar from '@/modules/common/components/AppCalendar.vue';
import {
  useMenuSuperior,
  usePostermino,
  useTermino
} from '@/modules/termino-postermino/composables';
import {
  useAppDialog,
  useAppToast,
  useFormValidation
} from '@/modules/common/composables';
import { requestUtil } from '@/utils';
import { onMounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import {
  useMantenedorStore,
  usePamStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables';
import { form } from '@formkit/inputs';

const router = useRouter();
const { launchDialog } = useAppDialog();
const { toastSuccess } = useAppToast();

const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' });
};

const { resumenCausa } = useTermino();

const { itemsMenuSuperior } = useMenuSuperior({ ruc: resumenCausa?.value.ruc });

const {
  postermino_getRegistroCumplimiento,
  postermino_postRegistroCumplimiento,
  termino_PamCompletarRegistrarCumplimientoIncumplimiento,
  registroCumplimiento
} = usePostermino();
const { sujetosIntervinientes_getSujetosByIdGlobal } =
  useSujetosIntervinientesStore();
const {
  mantenedor_getCodigoTipoSujeto,
  mantenedor_getTiposSujetos,
  mantenedor_getCondicionesAR,
  mantenedor_getTiposEvaluacionCumplimientos,
  evaluacionCumplimientos,
  mantenedor_getDescripcionCondicionById
} = useMantenedorStore();

const formData = reactive({
  ruc: resumenCausa?.value.ruc,
  idImputado: null,
  idCondicion: null,
  lugar: '',
  fechaHora: '',
  idEvaluacion: '',
  observacion: ''
});

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'nuevo-registro'
});

const imputados = ref([]);
const loaders = reactive({
  imputados: true,
  registroCumplimiento: true,
  postRegistro: false
});

async function getImputados() {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: resumenCausa?.value.idDenuncia
    },
    resolve: ({ data }) => {
      listarImputados(data);
    },
    loader: (l) => (loaders.imputados = l)
  });
}

function listarImputados(sujetos) {
  const imputadosEnSujetos = sujetos.filter(
    ({ tipoSujeto }) => mantenedor_getCodigoTipoSujeto(tipoSujeto) === '3'
  );
  imputados.value = imputadosEnSujetos.map((imputado) => {
    return {
      nombreCompleto: `${imputado.nombres} ${imputado.apellidoMaterno} ${imputado.apellidoPaterno}`,
      ...imputado
    };
  });
  formData.idImputado = imputados.value[0].idPersona;
  getRegistroCumplimiento();
}

/*======== Registro Cumplimiento ========*/

const listaCondiciones = ref(null);

function getRegistroCumplimiento() {
  const { idImputado } = formData;
  requestUtil({
    action: postermino_getRegistroCumplimiento,
    payload: {
      idCausa: resumenCausa?.value.idCausa,
      idImputado: idImputado
      // idImputado: '05a66b84-3a52-87dd-29ce-da02b5294eea'
    },
    resolve: (data) => {
      listaCondiciones.value = listarCondiciones(data.idsCondiciones);
    },

    loader: (l) => (loaders.registroCumplimiento = l)
  });
}

function listarCondiciones(idsCondiciones) {
  return idsCondiciones.map((id) => {
    return {
      id,
      descripcion: mantenedor_getDescripcionCondicionById(id)
    };
  });
}

/*==================================*/

const nombreImputado = computed(() => {
  const imputado = imputados?.value.find(
    (imputado) => imputado.idPersona === formData.idImputado
  );
  return imputado?.nombreCompleto;
});

const descripcionEvaluacion = computed(() => {
  const evaluacion = evaluacionCumplimientos?.value.find(
    (evaluacion) => evaluacion.id === formData.idEvaluacion
  );
  return evaluacion?.descripcion;
});

function guardarRegistro() {
  if (!isFormValid()) return;
  const { idCondicion } = formData;
  launchDialog({
    component: ModalMostrarData,
    header: 'Guardar Registro  ',
    props: {
      message: '¿Está seguro de Guardar el Registro?',
      dataArray: [
        {
          label: 'Imputado',
          value: nombreImputado
        },
        {
          label: mantenedor_getDescripcionCondicionById(idCondicion),
          value: descripcionEvaluacion
        }
      ]
    },
    width: 'fit-content',
    confirmLabel: 'Aceptar',

    accept: () => {
      const {
        observacion,
        idEvaluacion,
        idCondicion,
        fechaHora,
        idImputado,
        lugar
      } = formData;
      requestUtil({
        action: postermino_postRegistroCumplimiento,
        payload: {
          idActividad: registroCumplimiento.value.idActividad,
          idImputado: idImputado,
          idCausa: resumenCausa?.value.idCausa,
          idFiscalia: resumenCausa?.value.idFiscalia,
          idCondicion: idCondicion,
          idEvaluacionCumplimiento: idEvaluacion,
          observacion: observacion,
          fechaHoraRegistro: fechaHora,
          lugar
        },
        resolve: () => {
          setTimeout(() => {
            toastSuccess('Exitoso! Registro guardado');
          }, 300);
          getRegistroCumplimiento();
          terminarTareaRegistrarCumplimientoIncumplimiento();
        },
        loader: (l) => {
          loaders.postRegistro = l;
        }
      });
    }
  });
}

/* Terminar Tarea PAM */

const { procesoPam } = usePamStore();

const terminarTareaRegistrarCumplimientoIncumplimiento = () => {
  requestUtil({
    action: termino_PamCompletarRegistrarCumplimientoIncumplimiento,
    payload: {
      taskId: procesoPam.value?.taskId,
      idImputado: formData.idImputado,
      cumpleCondicionAcuerdo: evaluarIdCumplimiento.value
    },
    resolve: () => {}
  });
};

const evaluarIdCumplimiento = computed(() => {
  const cumplimiento = evaluacionCumplimientos?.value.find(
    (cumplimiento) => cumplimiento.id === formData.idEvaluacion
  );
  if (cumplimiento?.codigo === '1') return true;
  else if (cumplimiento?.codigo === '3') return false;
  else return null;
});

function getMantenedores() {
  requestUtil({ action: mantenedor_getCondicionesAR });
  requestUtil({ action: mantenedor_getTiposSujetos });
  requestUtil({ action: mantenedor_getTiposEvaluacionCumplimientos });
}

onMounted(async () => {
  console.log({ resumenCausa });
  getMantenedores();
  getImputados();
});
</script>
