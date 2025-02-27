<template>
<hr>
<LoaderSkeleton v-if="isLoadingResumen" />
<main
  v-else
  id="comprobante-resumen"
>
  <section class="w-full my-4 px-3">
    <h2>Datos Causa</h2>
    <ul class="flex flex-column gap-3 pl-0">
      <li>
        <span class="text-color-secondary">RUC: </span>
        {{ ruc }}
      </li>
      <li>
        <span class="text-color-secondary">Fecha Creación: </span>
        {{ antecedentes.data.antecedentes?.fechaHoraRecepcion.split('T')[0] }}
      </li>
      <li>
        <span class="text-color-secondary">Fiscalía: </span>
        {{ antecedentes.data.fiscaliaLocal?.nombreFiscalia }}
      </li>
      <li>
        <span class="text-color-secondary">Fiscal Asignado: </span>
        {{ antecedentes.data?.fiscaliaLocal?.nombreAtendedor || 'N/A' }}
      </li>
      <li>
        <span class="text-color-secondary">Tipo de Denuncia: </span>
        {{ mantenedor_getTipoDenunciaNombreById(antecedentes.data?.antecedentes?.idTipoDenuncia) }}
      </li>
      <li>
        <span class="text-color-secondary">Nombre Denunciante: </span>
        <span>
          {{ `${computedSujetos.denunciante?.nombres} ${computedSujetos.denunciante?.apellidoPaterno} ` }}
        </span>
      </li>
      <li>
        <span class="text-color-secondary">Nombre Víctima(s): </span>
        <span
          v-for="(victima, index) in computedSujetos.victimas"
          :key="index"
        > {{ `${victima.nombres} ${victima.apellidoPaterno}` }} <span v-if="index !== computedSujetos.victimas.length - 1">, </span> </span>
        <span v-if="computedSujetos.victimas.length === 0"> N/A</span>
      </li>
      <li>
        <span class="text-color-secondary">Nombre Imputado(s): </span>
        <span
          v-for="(imputado, index) in computedSujetos.imputados"
          :key="index"
        > {{ `${imputado.nombres} ${imputado.apellidoPaterno}  ` }} <span v-if="index !== computedSujetos.imputados.length - 1">, </span> </span>
        <span v-if="computedSujetos.imputados.length === 0"> N/A</span>
      </li>
      <li>
        <span class="text-color-secondary">Tipo Delito: </span>
        <span
          v-for="({ delito }, index) in delitos.data"
          :key="index"
        >
          {{ `${delito?.tipoDelito}` }}<span v-if="index !== delitos.data.length - 1">{{ ', ' }}</span>
        </span>
      </li>
    </ul>
  </section>
  <section class="w-full mt-6 px-3">
    <h2>Servicios Solicitados</h2>
    <TablaServiciosSolicitados
      class="w-full mt-3"
      :value="[]"
    />
  </section>
  <section class="w-full mt-6 px-3">
    <h2>Documentos Adjuntos</h2>
    <TablaDocumentosAdjuntos
      class="w-full mt-3"
      :value="[]"
    />
  </section>
</main>
<section class="w-full flex flex-row-reverse mt-7">
  <Button
    class="px-4 p-button-primary"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar"
    @click="handleEnviar"
  />
  <Button
    class="mx-3 px-4 p-button-outlined"
    icon="pi pi-print"
    icon-pos="right"
    label="Imprimir"
    @click="handleImprimir"
  />
</section>
</template>

<script setup>
/*eslint-disable*/
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useFichaCausaData } from '../../composables'
import html2pdf from 'html2pdf.js'
import { inject, onMounted, computed } from 'vue'
import TablaDocumentosAdjuntos from '../comprobante-resumen/TablaDocumentosAdjuntos.vue'
import TablaServiciosSolicitados from '../comprobante-resumen/TablaServiciosSolicitados.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useFichaCausaStore } from '../../composables/fichaCausaStore'

const { mantenedor_getCodigoTipoSujeto, mantenedor_getTiposSujetos, mantenedor_getTipoDenunciaNombreById } = useMantenedorStore()
const { ruc } = useFichaCausaStore()
const { sujetosIntervinientes: sujetos, delitos, antecedentes } = useFichaCausaData()

const dialogRef = inject('dialogRef')

function handleEnviar() {
  dialogRef.value.close()
}

function handleImprimir() {
  const comprobanteResumenEl = document.querySelector('#comprobante-resumen')

  const options = {
    margin: 1,
    filename: 'comprobante-resumen-causa.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { dpi: 300, letterRendering: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'p' }
  }

  html2pdf().set(options).from(comprobanteResumenEl).save()
}

const computedSujetos = computed(() => {
  return {
    denunciante: sujetos?.data.find((sujeto) => mantenedor_getCodigoTipoSujeto(sujeto.tipoSujeto) === '1'),
    victimas: sujetos?.data.filter((sujeto) => mantenedor_getCodigoTipoSujeto(sujeto.tipoSujeto) === '6'),
    imputados: sujetos?.data.filter((sujeto) => mantenedor_getCodigoTipoSujeto(sujeto.tipoSujeto) === '3')
  }
})

const isLoadingResumen = computed(() => {
  return sujetos.isLoading || antecedentes.isLoading || delitos.isLoading
})

onMounted(() => {
  requestUtil({ action: mantenedor_getTiposSujetos })
  console.log({ sujetos })
  console.log({ delitos })
  console.log({ computedSujetos })
})
</script>

<style scoped lang="scss">
li {
  list-style: none;
}
</style>
