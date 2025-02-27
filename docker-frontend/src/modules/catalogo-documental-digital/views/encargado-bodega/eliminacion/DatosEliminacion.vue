<template>
<section>
  <AntecedentesSolicitante :data="antecedentesSolicitud" />

  <AntecedentesCatalogo :data="catalogoSolicitud" />

  <AntecedentesDocumentoDevolucion :data="documentoAgendamiento" />

  <AppFieldset
    class="p-fluid"
    :legend="esDevolucion? 'Ingresar datos para la devolución de documento físico': 'Ingresar datos para la destrucción de documento físico'"
  >
    <DocumentoDestruccion
      v-if="!esDevolucion"
      ref="formValidacionDestruccion"
      :validacion="resultValidacion"
      @validacion-datos="habilitarBtn"
    />
    <DocumentoDevolucion
      v-if="esDevolucion"
      ref="formValidacionDevolucion"
      @validacion-datos="habilitarBtn"
    />
    <ValidacionDocumento
      v-if="datosValidados"
      :data="documentoReingreso"
    />
  </AppFieldset>

  <AppBtnNextTeleported
    class="btn-primary"
    :disabled="!datosValidados"
    icon="pi pi-arrow-right"
    label="Firmar Comprobante"
    @click="enviarRegistro"
  />
</section>
</template>

<script setup>
// COMPONENTS
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesCatalogo'
import AntecedentesDocumentoDevolucion from '@/modules/catalogo-documental-digital/components/agendamiento-devolucion-documento/AntecedentesDocumentoDevolucion'
import AntecedentesSolicitante from '@/modules/catalogo-documental-digital/components/common/components/AntecedentesSolicitante'
import DocumentoDevolucion from '@/modules/catalogo-documental-digital/components/Registro-destruccion/DocumentoDevolucion.vue'
import DocumentoDestruccion from '@/modules/catalogo-documental-digital/components/Registro-destruccion/DocumentoDestruccion.vue'
import ValidacionDocumento from '@/modules/catalogo-documental-digital/components/Registro-destruccion/ValidacionDocumento.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

// UTILS
import { ref } from 'vue'
import { requestUtil } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

// COMPOSABLES
import { useSolicitudesEncargadoBodega } from '@/modules/catalogo-documental-digital/composables'
const route = useRoute()
const router = useRouter()
const {
  antecedentesSolicitud,
  catalogoSolicitud, documentoAgendamiento, documentoReingreso,
  solicitudesEncargadoBodega__SET_DATA_MINISTRO_FE_Y_QUIEN_DESTRUYE,
  solicitudesEncargadoBodega__SET_DATA_INTERVINIENTE_DEVOLUCION
} = useSolicitudesEncargadoBodega()

// VALUES
const esDevolucion = route.path.includes('devolucion') ?? true
const formValidacionDevolucion = ref({})
const formValidacionDestruccion = ref({})

// LOGIC

function enviarRegistro () {
  if (esDevolucion) {
    requestUtil({
      action: solicitudesEncargadoBodega__SET_DATA_INTERVINIENTE_DEVOLUCION,
      payload: formValidacionDevolucion.value.formData,
      resolve: () => {
        router.push({ name: 'CddRDDFirmarComprobante' })
      }
    })
  } else {
    requestUtil({
      action: solicitudesEncargadoBodega__SET_DATA_MINISTRO_FE_Y_QUIEN_DESTRUYE,
      payload: formValidacionDestruccion.value.formData,
      resolve: () => {
        router.push({ name: 'CddREDFirmarComprobante' })
      }
    })
  }
}

const datosValidados = ref(null)

function habilitarBtn (validado) {
  if (validado) {
    datosValidados.value = true
  }
}
</script>
