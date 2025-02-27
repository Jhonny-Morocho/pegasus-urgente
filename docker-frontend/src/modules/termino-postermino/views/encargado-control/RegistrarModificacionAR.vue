<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombre}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Notificación de Modificaciones a Suspensión Condicional del Procedimiento "
/>

<div v-if="loaders.acuerdoReparatorio">
  <LoaderSkeleton />
</div>
<section
  v-else
  class="mt-4"
>
  <div class="grid w-full mt-4">
    <AppFieldset
      class="col-5 mr-5"
      legend="Notificación cambio condiciones SCP por el Tribunal "
    >
      <div class="col-12 pl-4">
        <p>
          <strong>Tribunal: </strong>{{
            acuerdoReparatorio
              ? mantenedor_getNombreJuzgado(acuerdoReparatorio?.idTribunal)
              : '...'
          }}
        </p>
        <p>
          <strong>Número de Resolución: </strong>{{ acuerdoReparatorio?.numeroResolucion }}
        </p>
        <p>
          <strong>Fecha de Resolución: </strong>{{ acuerdoReparatorio?.fechaResolucion }}
        </p>
        <p><strong>RIT: </strong>{{ acuerdoReparatorio?.rit }}</p>
        <p>
          <strong>Imputado: </strong>{{
            `${resumenCausa.imputados?.[0]?.nombre} ${resumenCausa.imputados?.[0]?.apellido}`
          }}
        </p>
      </div>
    </AppFieldset>

    <AppFieldset
      class="col-6"
      legend="Documentos Adjuntos"
    >
      <div class="col-12 pl-4">
        <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
          <InputText
            id="filter-text"
            v-model="inputFiltro"
            class="p-inputtext-sm"
            placeholder="Buscar"
          />
          <Button
            class="btn-primary p-button-sm"
            icon="pi pi-search"
          />
        </div>
        <TablaDocumentos
          v-model:first="tables.documentos.firstRecord"
          :loading="tables.documentos.isLoading"
          read-only
          :rows="paginacionDocumentos?.tamanoPagina"
          :total-records="paginacionDocumentos?.elementosTotales"
          :value="filtroDocumentos"
          @page="getDocumentos"
        />
      </div>
    </AppFieldset>
  </div>

  <AppFieldset legend="Resolución del Tribunal">
    <h2 class="font-normal my-3">
      Texto Resolución del Tribunal – Modificación de la SCP
    </h2>
    <div class="texto col-12 p-4">
      <p>{{ acuerdoReparatorio?.texto }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    class="col-12 mr-5"
    legend="Condiciones Actuales SCP"
  >
    <div class="col-6">
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
    </div>
    <div class="col-6 condiciones">
      <p><strong class="mb-2">Condiciones: </strong></p>
      <ul class="p-0 ml-4">
        <li
          v-for="(idCondicion, index) in acuerdoReparatorio?.idsCondicion"
          :key="index"
        >
          <p>{{ mantenedor_getDescripcionCondicionById(idCondicion) }}</p>
        </li>
      </ul>
    </div>
  </AppFieldset>
  <AppFieldset
    class="mb-4"
    legend="Registrar Modificaciones SCP "
  >
    <AppForm
      class="w-full"
      :form-submitted="formSubmitted"
      validation-scope="formCondiciones"
    >
      <AppDropdown
        id="SCP"
        v-model="formData.subtipoSuspension"
        class="col-4 p-fluid"
        label="Subtipo de Suspensión"
        option-label="descripcion"
        option-value="id"
        :options="subtiposSuspension"
        show-clear
      />
      <div class="grid w-full p-6">
        <ul
          v-for="condicion in condicionesAR"
          id="lista-condiciones"
          :key="condicion"
          class="col-6 grid"
        >
          <div class="flex col-6">
            <Checkbox
              id="condicion"
              v-model="formData.condicionesSeleccionadas"
              :value="condicion.id"
            />
            <span class="ml-3">{{ condicion.descripcion }}</span>
          </div>
        </ul>
      </div>
      <AppTextarea
        id="detalle"
        v-model="formData.detalle"
        class="col-12"
        cols="150"
        label="Detalle Condiciones"
        rows="5"
      />
    </AppForm>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      id="btn-registrar"
      class="btn-primary px-5"
      icon="pi pi-check-circle"
      icon-pos="right"
      label="Registrar Modificación SCP"
      :loading="formData.formSubmitting"
      @click="registrarModificación()"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
/*eslint-disable*/
import PageHeader from '@/modules/common/components/PageHeader.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue';
import TablaDocumentos from '@/modules/termino-postermino/components/evaluar-solitud-reapertura/TablaDocumentos.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables';
import { useRouter } from 'vue-router';
import { appUtil, requestUtil } from '@/utils';
import {
  usePostermino,
  useTermino
} from '@/modules/termino-postermino/composables';
import { useMenuSuperior } from '../../composables';
import {
  useDocumentoStore,
  useMantenedorStore,
  usePamStore
} from '@/modules/global/composables';
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue';

const router = useRouter();
const { launchConfirmDialog } = useConfirmDialog();
const { toastSuccess, toastWarning } = useAppToast();

const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' });
};

const loaders = reactive({
  acuerdoReparatorio: true,
  formSubmitting: false
});

const { ruc, resumenCausa } = useTermino();

const { itemsMenuSuperior } = useMenuSuperior({ ruc });

const {
  postermino_postAcuerdoReparatorio,
  postermino_getAcuerdoReparatorio,
  termino_PamCompletarRegistrarModificaciónAR,
  acuerdoReparatorio
} = usePostermino();

const { documentos, paginacion: paginacionDocumentos } = useDocumentoStore();

const {
  mantenedor_getTiposSujetos,
  mantenedor_getDescripcionTipoSuspensionById,
  mantenedor_getDescripcionSubtipoSuspensionById,
  mantenedor_getSubTiposSuspensionByIdSuspension,
  mantenedor_getDescripcionCondicionById,
  mantenedor_getTiposSuspension,
  mantenedor_getjuzgados,
  mantenedor_getCondicionesAR,
  mantenedor_getEstadosCausa,
  condicionesAR,
  subtiposSuspension,
  mantenedor_getNombreJuzgado
} = useMantenedorStore();

const inputFiltro = ref('');
const { includeWord } = appUtil;
const filtroDocumentos = computed(() => {
  const docs = documentos.value;
  if (inputFiltro.value) {
    return docs?.filter(
      (documento) =>
        includeWord(documento.nombre, inputFiltro.value) ||
        includeWord(documento.descripcion, inputFiltro.value)
    );
  }
  return docs;
});

const tables = reactive({
  documentos: {
    firstRecord: 0,
    isLoading: false
  }
});
console.log({ resumenCausa });

const formData = reactive({
  condicionesSeleccionadas: null,
  detalle: '',
  subtipoSuspension: null
});

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'formCondiciones'
});

/* =========== Acuerdo Reparatorio ============*/

function getAcuerdoReparatorio() {
  console.log({ condicionesAR });
  requestUtil({
    action: postermino_getAcuerdoReparatorio,
    payload: {
      idCausa: resumenCausa.value.idCausa,
      idImputado: resumenCausa.value.imputados[0]?.idPersona
    },
    loader: (l) => {
      loaders.acuerdoReparatorio = l;
    },
    resolve: (data) => {
      formData.condicionesSeleccionadas = data.idsCondicion.map((ids) =>
        ids.toUpperCase()
      );
      requestUtil({
        action: mantenedor_getSubTiposSuspensionByIdSuspension,
        payload: { id: data.idTipoSuspension }
      });
    }
  });
}

function registrarModificación() {
  if (!isFormValid()) {
    toastWarning('Hay campos por rellenar');
    return;
  }

  launchConfirmDialog({
    message: `¿Estás seguro de Registrar Modificación SCP?`,
    header: 'Registrar Modificación SCP',
    accept: () => {
      requestUtil({
        action: postermino_postAcuerdoReparatorio,
        payload: {
          ...acuerdoReparatorio.value,
          idsCondicion: formData.condicionesSeleccionadas,
          texto: formData.detalle
          // idSubtipoSuspension:
          //   formData.subtipoSuspension || acuerdoReparatorio.idSubtipoSuspension
        },

        resolve: () => {
          terminarTareaRegistrarModificacionAR();
        }
      });
    }
  });
}

/* Terminar Tarea PAM */

const { procesoPam } = usePamStore();

const terminarTareaRegistrarModificacionAR = () => {
  console.log('procesoPam', procesoPam);
  requestUtil({
    action: termino_PamCompletarRegistrarModificaciónAR,
    payload: {
      taskId: procesoPam.value?.taskId
    },
    loader: (l) => {
      formData.formSubmitting = l;
    },
    resolve: () => {
      setTimeout(() => {
        toastSuccess('Exitoso! Modificación registrada');
        router.push({ name: 'BandejaFiscal' });
      }, 300);
    }
  });
};

function getMantenedores() {
  requestUtil({ action: mantenedor_getCondicionesAR });
  requestUtil({ action: mantenedor_getTiposSujetos });
  requestUtil({ action: mantenedor_getjuzgados });
  requestUtil({ action: mantenedor_getEstadosCausa });
  requestUtil({ action: mantenedor_getTiposSuspension });
}

onMounted(() => {
  getMantenedores();
  getAcuerdoReparatorio();
});
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.texto {
  border-radius: 8px;
  border: solid 1px #222;
}
.condiciones p {
  margin-bottom: 0.2rem;
  padding-left: 0.4rem;
}
</style>
