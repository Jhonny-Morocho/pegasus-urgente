<template>
<div>
  <AppFieldset
    class="w-full"
    :collapsed="isColapsed"
    legend="Resumen de la Causa"
    :toggleable="colapse"
  >
    <div
      v-if="loaderResumenCausa"
      class="col-12"
    >
      <LoaderSkeleton />
    </div>
    <div
      v-else
      class="grid w-full resumen_container"
    >
      <div class="col-12 md:col-6 pl-4">
        <p
          v-if="!hideAlerta"
          class="flex align-self-center"
        >
          <strong class="flex align-self-center mr-2">Alertas:</strong>
          <span
            v-if="causa?.alertas?.length"
            class="flex"
          >
            <ChipAlerta
              v-for="(alerta, index) in causa?.alertas"
              :key="index"
              :alerta="alerta"
              class="m-1"
            />
          </span>
          <span v-else>Sin Alertas</span>
        </p>
        <p><strong>RUC: </strong>{{ antecedentes?.ruc }}</p>
        <p><strong>Nombre Causa: </strong>{{ causa?.nombre }}</p>
        <p>
          <strong>Causa Reservada: </strong>{{ causa?.esReservada ? 'Si' : 'No' }}
        </p>
        <p>
          <strong>Fecha Creación Causa: </strong>{{ causa?.antecedentes?.fechaHoraDenuncia || 'N/A' }}
        </p>
        <p>
          <strong>Fiscalía Local: </strong>{{ fiscaliaLocal?.nombreFiscalia || 'N/A' }}
        </p>
        <p>
          <strong>Fiscal Asignado: </strong>{{ causa?.antecedentes?.fiscalAsignado || 'N/A' }}
        </p>
        <p>
          <strong>Plazo investigación: </strong>{{ causa?.plazoInvestigacionDias }} DÍAS
        </p>
      </div>
      <div class="col-12 md:col-6 pr-4">
        <p>
          <strong>Estado de la Causa: </strong>{{ antecedentes?.estado || 'N/A' }}
        </p>
        <p>
          <strong>Proceso de la Causa: </strong>{{ causa?.descripcionProceso || 'N/A' }}
        </p>
        <p>
          <strong>Etapa de las Relaciones de la Causa: </strong>{{ causa?.etapaRelacionesCausa || 'N/A' }}
        </p>
        <p>
          <strong>Fecha Asignación: </strong>{{ causa?.fechaAsignacion || 'N/A' }}
        </p>
        <p>
          <strong>Fecha Formalización: </strong>{{ causa?.fechaFormalizacion || 'N/A' }}
        </p>
        <p>
          <strong>Fecha de Término o Suspensión: </strong>{{ causa?.fechaTerminoOSuspension || 'N/A' }}
        </p>
        <p>
          <strong>Fecha de Prescripción: </strong>{{ causa?.fechaPrescripcion || 'N/A' }}
        </p>
      </div>
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
/*eslint-disable*/
import { onMounted, defineProps, ref } from 'vue';
import { requestUtil } from '@/utils';
import { useAntecedentesCausaStore } from '@/modules/global/composables';
import { useTermino } from '../../composables';
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue';

defineProps({
  colapse: {
    type: Boolean,
    default: false
  },
  hideAlerta: Boolean
});

const { ruc, resumenCausa: causa } = useTermino();
const {
  antecedentes,
  fiscaliaLocal,
  antecedentesCausa_getAntecedentesCausa,
  antecedentesCausa_getResumenFichaCausa,
  antecedentesCausa_getDenuncia
} = useAntecedentesCausaStore();

const loaderResumenCausa = ref(true);
const isColapsed = ref(true);

const variableParche = ref({});

async function getDataInicial() {
  isColapsed.value = false;
  requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: { ruc: ruc.value },
    resolve: (data) => {
      console.log(data);
    },
    loader: (l) => {
      loaderResumenCausa.value = l;
    }
  });
  // requestUtil({
  //   action: antecedentesCausa_getResumenFichaCausa,
  //   payload: { ruc: ruc.value },
  //   resolve: (data) => {
  //     console.log(data)
  //     variableParche.value = data
  //     requestUtil({
  //       action: antecedentesCausa_getDenuncia,
  //       payload: { idDenuncia: data.causa.idDenuncia },
  //       resolve: (data) => {
  //         console.log(data)
  //         variableParche.value = data
  //       }
  //     })
  //   }
  // })
}

onMounted(async () => {
  getDataInicial();
});
</script>
<style scoped>
.resumen_container p {
  margin-bottom: 1.25rem;
}
</style>
