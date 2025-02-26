<template>
<section>
  <div
    id="pdf"
    class="grid"
  >
    <p
      v-if="comprobante.decisionRecepcion === 2 || comprobante.decisionRecepcion === 1"
      class="mt-3 col-12"
      style="font-size: 18px; color: black"
    >
      Comprobante de Recepción
    </p>
    <p
      v-else
      class="mt-3 col-12"
      style="font-size: 18px; color: black"
    >
      Comprobante de Rechazo
    </p>
    <Divider class="mb-0" />
    <div class="grid col-12 md:col-6 pl-4">
      <p class="col-12 my-2">
        Institución que entrega:
        <span class="font-bold">
          {{ comprobante.institucion ?? "No definido" }}
        </span>
      </p>
      <p class="col-12 my-2">
        Unidad:
        <span class="font-bold">
          {{ comprobante?.idUnidadEntrega ?? "No definido" }}
        </span>
      </p>
      <p class="col-12 my-2">
        Destacamento:
        <span class="font-bold">
          {{ comprobante?.idDestacamentoEntrega ?? "No definido" }}
        </span>
      </p>
      <p class="col-12 my-2">
        Nombre quien Entrega:
        <span class="font-bold">
          {{ comprobante?.nombreQuienEntrega ?? "No definido" }}
        </span>
      </p>
      <p class="col-12 my-2">
        Cargo quien entrega:
        <span class="font-bold">
          {{ comprobante?.idCargoQuienEntrega ?? "No definido" }}
        </span>
      </p>
    </div>
    <div class="grid col-12 md:col-6 pl-4">
      <p class="col-12 my-2">
        Fiscalía que Recepciona:
        <span class="font-bold">
          {{ comprobante?.fiscaliaRecepciona ?? "No definido" }}
        </span>
      </p>
      <p class="col-12 my-2">
        Nombre Receptor(a):
        <span class="font-bold">
          {{ comprobante?.nombreReceptor ?? "No definido" }}
        </span>
      </p>
      <p class="col-12 my-2">
        Cargo quien Recepciona:
        <span class="font-bold">
          {{ comprobante?.cargoReceptor ?? "No definido" }}
        </span>
      </p>
      <p class="col-12 my-2">
        Fecha / Hora Recepción:
        <span class="font-bold">
          {{ formatFecha(comprobante?.fechaRecepcion) }}
        </span>
      </p>
      <p class="col-12 my-2">
        RUC:
        <span class="font-bold">
          {{ comprobante.ruc ?? "No definido" }}
        </span>
      </p>
    </div>
    <div class="grid col-12 md:col-6 pl-4">
      <p class="col-12 my-2">
        Clase Especie Peligrosa:
        <span class="font-bold">
          {{
            comprobante?.especiesODinerosNoIngresados?.find(
              (e) => e.idClasePeligro
            )?.idClasePeligro ?? "No hay especie Peligrosa"
          }}
        </span>
      </p>
      <p class="col-12 my-2">
        Peso Especie Peligrosa:

        <span class="font-bold">
          {{
            comprobante?.especiesODinerosNoIngresados?.find(
              (e) => e.idClasePeligro
            )?.peso ?? "No hay especie Peligrosa"
          }}
        </span>
      </p>
      <p
        v-if="dataEspecie?.destinoDinero?.motivoDeRechazo"
        class="col-12 my-2"
      >
        Motivo de Rechazo: {{ comprobante?.motivoDeRechazo }}
      </p>
    </div>
    <div class="grid col-12 pl-4">
      <p class="col-12 mt-2">
        Observaciónes:
      </p>
      <p
        v-for="e in comprobante?.especiesODinerosNoIngresados"
        :key="e.idCustodiaEvidencia"
        class="font-bold col-12"
      >
        - {{ e.observaciones }}
      </p>
    </div>
    <div class="mb-8 col-12">
      <TablaEspeciesRecepcionadas
        class="mt-3"
        :data="comprobante.especiesRecepcionadas"
      />
    </div>
    <div class="col-12 mt-8 mb-8 mx-3 flex justify-content-around">
      <div class="col-3 text-center">
        <hr>
        <p>Firma de {{}}</p>
      </div>
      <div class="col-3 text-center">
        <hr>
        <p>Firma de {{}}</p>
      </div>
    </div>
  </div>
  <Button
    class="boton p-button-raised p-button-plain px-4 ml-2"
    icon="pi pi-print"
    icon-pos="right"
    label="Imprimir"
    @click="handleComprobanteResumen"
  />
</section>
</template>

<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { useComprobanteDeRecepcionRechazoStore } from '@/modules/recepcion-especies-dinero/composables'
import { dateTimeUtil } from '@/utils'
import html2pdf from 'html2pdf.js'
import TablaEspeciesRecepcionadas from '@/modules/recepcion-especies-dinero/components/comprobante-de-recepcion-rechazo/TablaEspeciesRecepcionadas.vue'

const {
  comprobante
} = useComprobanteDeRecepcionRechazoStore()

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function handleComprobanteResumen () {
  const opt = {
    margin: 1,
    filename: 'documento.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { dpi: 300, letterRendering: true },
    jsPDF: { unit: 'in', format: 'a3', orientation: 'p' }
  }
  html2pdf().set(opt).from(document.querySelector('#pdf')).save('comprobante')
}
</script>

<style scoped>
hr {
  margin-bottom: none;
}
.boton {
  background-color: #606e84 !important;
}
</style>
