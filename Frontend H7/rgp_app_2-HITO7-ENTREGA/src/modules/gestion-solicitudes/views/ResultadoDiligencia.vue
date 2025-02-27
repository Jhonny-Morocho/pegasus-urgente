<template>
<section class="mt-4">
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-description="Nombre Causa:  Hurto simple 4 A 40 UTM a Gustavo"
    page-subtitle="RUC 2200938215-8 "
    page-title="Resultado Diligencia"
  />
  <AntecedentesSolicitud
    class="my-6"
    :data="antecedentesSolicitud"
    hide-instrucciones-fiscal
    ver-solicitud
  />
  <!-- Pide Cuenta automatico -->
  <RespuestaSolicitudOtraFiscalia :data="resultadoSolicitudOtraFiscalia" />
  <AppFooterBtns
    no-button-next
    @back-step="handleBackStep"
  />
</section>
</template>
<script setup>
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import AntecedentesSolicitud from '@/modules/gestion-solicitudes/components/AntecedentesSolicitud.vue'
import RespuestaSolicitudOtraFiscalia from '@/modules/gestion-solicitudes/components/RespuestaSolicitudOtraFiscalia.vue'
import { usePageHeaderOptions } from '../composables'
import { requestUtil } from '@/utils'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { itemsMenuSuperior } = usePageHeaderOptions()
const router = useRouter()

const {
  antecedentesSolicitud,
  idDenuncia,
  resultadoSolicitudOtraFiscalia,
  gestionSolicitudes_getAntecedentes,
  gestionSolicitudes_getRespuestaSolicitudOtraFiscalia
} = useGestionSolicitudesStore()

function getAntecedentes () {
  requestUtil({
    action: gestionSolicitudes_getAntecedentes,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

function getRespuestaSolicitudOtraFiscalia () {
  requestUtil({
    action: gestionSolicitudes_getRespuestaSolicitudOtraFiscalia,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

function handleBackStep () {
  router.push({ name: 'bandejaGestor' })
}

onMounted(() => {
  getAntecedentes()
  getRespuestaSolicitudOtraFiscalia()
})
</script>
