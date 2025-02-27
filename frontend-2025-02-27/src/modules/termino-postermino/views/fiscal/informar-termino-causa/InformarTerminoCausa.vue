<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombre}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Informar Término de la causa"
/>
<div class="flex justify-content-end p-3">
  <Button
    class="p-button-outlined p-button-danger px-5 py-3"
    icon="pi pi-external-link"
    icon-pos="right"
    label="Ver Resolucion / Acta"
    @click="verResolucion"
  />
</div>
<section class="mt-4">
  <AppForm
    :form-submitted="formSubmitted"
    validation-scope="informarTerminoCausaForm"
  >
    <AppFieldset
      v-if="isVictimaIdentificada"
      legend="Comunicar Término de la Causa"
    >
      <div class="p-inputgroup">
        <AppDropdown
          id="plantilla-comunicar-termino"
          v-model="formData.textoComunicarTermino"
          class="col-12 md:col-4"
          label="Plantilla"
          option-label="name"
          option-value="value"
          :options="plantillaComunicarTerminoOptiones"
          placeholder
          show-clear
        />
      </div>
      <AppEditor
        id="editor-comunicar-termino"
        v-model="formData.textoComunicarTermino"
        class="col-12"
        editor-style="height: 256px"
        :rules="{ required }"
      />
    </AppFieldset>
    <div>
      <p>¿Desea Declarar Término Públicamente?</p>
      <div class="p-inputgroup">
        <AppSelectButton
          id="declarar-termino-publicamente"
          v-model="isTerminoPublico"
          class="mb-6 mt-4 col-12 md:col-3 p-fluid"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false }
          ]"
        />
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="isTerminoPublico"
        class="mb-7 mt-1 public-term"
      >
        <AppFieldset
          legend="Declaración de Término"
          :toggleable="true"
        >
          <div class="p-inputgroup">
            <AppDropdown
              id="declaracion-termino"
              v-model="formData.textoDeclaracionPublica"
              class="col-12 md:col-4"
              label="Plantilla"
              option-label="name"
              option-value="value"
              :options="plantillaTerminoPublicoOptiones"
              placeholder
              show-clear
            />
          </div>

          <AppEditor
            id="editor-termino-publico"
            v-model="formData.textoDeclaracionPublica"
            class="col-12"
            editor-style="height: 256px"
            :rules="{ required }"
          />
        </AppFieldset>
      </div>
    </Transition>
    <AppFieldset
      v-if="isCausaConEspecies"
      legend="Especies / Dinero"
      toggleable
    >
      <TablaEspeciesDinero
        v-model:first="tables.especies.firstRecord"
        :loading="tables.especies.isLoading"
        :rows="paginacionEspecies?.tamanoPagina"
        :total-records="paginacionEspecies?.elementosTotales"
        :value="especies"
        @page="getEspecies"
      />
      <div class="w-full flex flex-row-reverse">
        <div class="col-3 flex justify-content-center">
          <Button
            class="btn-primary px-5"
            icon="pi pi-send"
            icon-pos="right"
            label="Enviar a Custodio"
            @click="enviarCustodio"
          />
        </div>
      </div>
    </AppFieldset>
    <div class="mb-8 mt-6">
      <AppFieldset
        v-if="isCausaPorDrogas"
        legend="Comunicar Ley de Drogas a Tribunal"
        :toggleable="true"
      >
        <div class="p-inputgroup">
          <AppDropdown
            id="termino-tribunales"
            v-model="formData.tribunal"
            class="col-12 md:col-4"
            label="Tribunales"
            option-label="descripcion"
            option-value="id"
            :options="juzgados"
            placeholder
            :retrieve-data-action="mantenedor_getjuzgados"
            show-clear
          />
          <AppDropdown
            id="termino-tribunales-plantilla"
            v-model="formData.textoLeyDeDrogas"
            class="col-12 md:col-4"
            label="Plantilla"
            option-label="name"
            option-value="value"
            :options="plantillaTribunalesOptiones"
            placeholder
            show-clear
          />
        </div>

        <AppEditor
          id="editor-termino-tribunales"
          v-model="formData.textoLeyDeDrogas"
          class="col-12"
          editor-style="height: 256px"
          :rules="{ required }"
        />
      </AppFieldset>
    </div>
  </AppForm>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar Respuesta"
      @click="enviarRespuesta"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
/* eslint-disable */
import TablaEspeciesDinero from '@/modules/termino-postermino/components/tablas/TablaEspeciesDinero.vue';
import PageHeader from '@/modules/common/components/PageHeader.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import AppDropdown from '@/modules/common/components/inputs/AppDropdown.vue';
import AppForm from '@/modules/common/components/AppForm.vue';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import {
  useConfirmDialog,
  useAppToast,
  useFormValidation
} from '@/modules/common/composables';
import {
  useTermino,
  useMenuSuperior
} from '@/modules/termino-postermino/composables';
import {
  useEspeciesDineroStore,
  useMantenedorStore,
  usePamStore
} from '@/modules/global/composables';
import { ref, reactive, onMounted } from 'vue';
import { requestUtil } from '@/utils';
import { useRouter } from 'vue-router';
import AppEditor from '@/modules/common/components/inputs/AppEditor.vue';

const router = useRouter();

const handleBackStep = () => {
  router.push({ name: 'BandejaFiscalJefe' });
};

const { toastSuccess, toastWarning } = useAppToast();
const { launchConfirmDialog } = useConfirmDialog();

const {
  ruc,
  idDenuncia,
  resumenCausa,
  termino_PamCompletarTerminarCausa,
  termino_setDestinoEspecies,
  termino_postEscritoTermino
} = useTermino();

const { itemsMenuSuperior } = useMenuSuperior({ ruc });

const isTerminoPublico = ref(null);
const isVictimaIdentificada = ref(true);
const isCausaPorDrogas = ref(true);
const isCausaConEspecies = ref(true);

const plantillas = reactive({
  plantillaComunicarTermino: 'E68AE068-03E6-4F48-9D1F-C75A2E81E9F0',
  plantillaDeclaracionTerminoPublico: 'E68AE068-03E6-4F48-9D1F-C75A2E81E9F0',
  plantillaTerminoDrogasTribunales: 'E68AE068-03E6-4F48-9D1F-C75A2E81E9F0'
});

const formData = reactive({
  textoComunicarTermino: null,
  textoDeclaracionPublica: null,
  textoLeyDeDrogas: null,
  tribunal: null
});

const { mantenedor_getjuzgados, juzgados } = useMantenedorStore();

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'informarTerminoCausaForm'
});

function enviarCustodio() {
  requestUtil({
    action: termino_setDestinoEspecies
  });
}

const tables = reactive({
  especies: {
    firstRecord: 0,
    isLoading: false
  }
});

function verResolucion() {
  // solo se abre si hubo audiencia o resolución en tribunales (comprobar antecedentes audiencia)
  const routeData = router.resolve({ name: 'TPTFActaDeAudiencia' });
  window.open(routeData.href, '_blank');
}

const { procesoPam } = usePamStore();

const loadingPostEscrito = ref(false);

function enviarRespuesta() {
  if (!isFormValid()) {
    toastWarning('Rellene los escritos correspondientes al caso.');
    return;
  }

  launchConfirmDialog({
    header: 'Informar Término de la causa',
    message: '¿Está seguro de Informar Término de la causa?',
    acceptLabel: 'Aceptar',
    accept: () => {
      postEscritos();
    }
  });
}

const postEscritos = () => {
  const { idCausa } = resumenCausa.value;
  requestUtil({
    action: termino_postEscritoTermino,
    payload: {
      idCausa,
      idFiscalia: '0a5f2032-9c4f-4ebb-b87f-5b2eb5684e1a',
      idPlantillaComunicarTermino: plantillas.plantillaComunicarTermino,
      idPlantillaDeclararTermino: plantillas.plantillaDeclaracionTerminoPublico,
      idPlantillaComunicarTerminoTribunal:
        plantillas.plantillaTerminoDrogasTribunales,
      textoComunicarTermino: formData.textoComunicarTermino,
      textoDeclararTermino: formData.textoDeclaracionPublica,
      textoComunicarTerminoTribunal: formData.textoLeyDeDrogas
    },
    loader: (l) => {
      loadingPostEscrito.value = l;
    },
    resolve: () => {
      completarTerminarCausa();
    }
  });
};

const completarTerminarCausa = async () => {
  await requestUtil({
    action: termino_PamCompletarTerminarCausa,
    payload: {
      taskId: procesoPam.value?.taskId,
      accionTermino: 'causaSuspendidaTerminada'
    },
    resolve: () => {
      toastSuccess(`Informe enviado con éxito!`);
      setTimeout(() => router.push({ name: 'BandejaFiscal' }), 500);
    }
  });
};

const { especies, especiesDinero_getEspecieByIdDenuncia, paginacionEspecies } =
  useEspeciesDineroStore();

const getEspecies = async (pagination = undefined) => {
  if (!pagination) {
    tables.especies.firstRecord = 0;
  }

  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (l) => (tables.especies.isLoading = l)
  });
};

onMounted(async () => {
  getEspecies();
});

const plantillaComunicarTerminoOptiones = [
  {
    name: 'Plantilla Comunicar Término',
    value: 'Texto plantilla Comunicar Término.'
  }
];

const plantillaTerminoPublicoOptiones = [
  {
    name: 'Declaración de Término',
    value: 'Texto plantilla Declaración de Término.'
  }
];

const plantillaTribunalesOptiones = [
  {
    name: 'Comunicar Ley de Drogas a Tribunal',
    value: 'Texto plantilla Comunicar Ley de Drogas a Tribunal.'
  }
];
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
</style>
