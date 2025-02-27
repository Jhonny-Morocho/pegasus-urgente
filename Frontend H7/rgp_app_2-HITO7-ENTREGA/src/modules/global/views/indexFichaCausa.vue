<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Ficha Causa"
  />

  <RouterView />

  <AppBtnsSteps no-button-back />
  <AppBtnNextTeleported
    :label="dataCausa.codigoTipoDenuncia !== '1' ? 'Volver a Bandeja' : 'Finalizar Ingreso'"
    :loading="loadingSUbmitForm"
    @click="handleFinalizar"
  />
</section>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import html2pdf from 'html2pdf.js'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

import { useCrearCausaStore, useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDelitoStore, useDocumentoStore, useEspeciesDineroStore, useFichaCausaStore, useMantenedorStore, useRelacionesStore, useRelatoStore, useSujetosIntervinientesStore } from '../composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import ModalRecomendarPreclasificacion from '../components/ficha-causa/modals/ModalRecomendarPreclasificacion'
import ModalSolicitudAntecedentesEspecificos from '../components/ficha-causa/modals/ModalSolicitudAntecedentesEspecificos.vue'

const route = useRoute()
const router = useRouter()
const { launchDialog } = useAppDialog()
const { toastSuccess } = useAppToast()

const loadingFinalizar = ref(false)
const readMode = computed(() => !!route.query.action)

const dataCausa = computed(() => {
  return causa.value ? causa.value : causaSeleccionada.value
})
onMounted(() => {
  cargarMantenedores()
  mantenedor_getTiposSujetos()
  requestUtil({ action: mantenedor_getAmbitoEspecie })
})

const {
  mantenedor_getTiposEspecies,
  mantenedor_getFamiliaEspecies,
  mantenedor_getFamiliasDelito,
  mantenedor_getTiposDelito,
  mantenedor_getTiposSujetos,
  mantenedor_getAmbitoEspecie,
  mantenedor_getIdentidadGenero,
  mantenedor_getTiposDenuncia
} = useMantenedorStore()

const { ruc, causa, idCausa, idDenuncia, tipoDenuncia, dataDenuncia, processInstanceId, crearCausa_RESET_RUC, crearCausa_completarTareaCausa, crearCausa_SET_DEFAULT_STATE } = useCrearCausaStore()

const { fichaCausa_recomendacionPreclasificador, fichaCausa_getAntecedentesSolicitados, antecedentesSolicitados, causaSeleccionada } = useFichaCausaStore()

function cargarMantenedores () {
  mantenedor_getTiposEspecies()
  mantenedor_getFamiliaEspecies()
  mantenedor_getFamiliasDelito()
  mantenedor_getTiposDelito()
  mantenedor_getIdentidadGenero()
  mantenedor_getTiposDenuncia()
}

const { identificacionDenuncia_SET_DEFAULT_STATE } = useIdentificacionDenunciaStore()
const { sujetosIntervinientes_SET_DEFAULT_STATE } = useSujetosIntervinientesStore()
const { delito_SET_DEFAULT_STATE, delitos } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE, especies } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE, documentos } = useDocumentoStore()

/** Funcion btn Finalizar, limpiar stores correspondientes y enviar a bandeja */
function handleFinalizar () {
  identificacionDenuncia_SET_DEFAULT_STATE() // reset identificacion denuncia store
  sujetosIntervinientes_SET_DEFAULT_STATE() // reset sujetos intervinientes store
  delito_SET_DEFAULT_STATE() // reset delitos store
  relaciones_SET_DEFAULT_STATE() // reset relaciones store
  especiesDinero_SET_DEFAULT_STATE() // reset especies/dinero store
  relato_SET_DEFAULT_STATE() // reset relato store
  documento_SET_DEFAULT_STATE() // reset documento store
  crearCausa_RESET_RUC()
  loadingFinalizar.value = true
  setTimeout(() => {
    loadingFinalizar.value = false
    if (tipoDenuncia.value === 'directa') {
      requestUtil({
        action: crearCausa_completarTareaCausa,
        payload: {
          idInstanciaTarea: processInstanceId.value,
          idDenuncia: idDenuncia.value,
          idCausa: idCausa.value
        },
        resolve: () => {
          crearCausa_SET_DEFAULT_STATE()
          router.push('/ingreso/denuncia-directa?q=4')
        },
        reject: (e) => {
          console.error(e.message)
        }
      })
    } else if (tipoDenuncia.value === 'oficio') {
      router.push('/ingreso/denuncia-oficio?q=4')
    } else if (tipoDenuncia.value === 'fisica') {
      router.push('/ingreso/denuncia-fisica')
    } else {
      router.push('/ingreso/denuncia-directa?q=4')
    }
  }, 600)
}

function handleComprobanteResumen () {
  const opt = {
    margin: 1,
    filename: 'documento.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { dpi: 300, letterRendering: true },
    jsPDF: { unit: 'in', format: 'a3', orientation: 'p' }
  }

  html2pdf().set(opt).from(document.querySelector('#pdf')).save()
}
const itemsMenuSuperior = ref([
  {
    label: 'Solicitar',
    icon: 'pi pi-info-circle',
    items: [
      {
        label: 'Antecedentes Específicos',
        command: () => {
          handleSolicitarAntecedentesEspecificos()
        }
      }
    ],
    visible: () => tipoDenuncia.value === 'directa' && !readMode.value
  },
  {
    label: 'Recomendar a Prec.',
    icon: 'pi pi-folder-open',
    command: () => handleRecomendarPreclasificacion(),
    visible: () => tipoDenuncia.value === 'directa' && !readMode.value
  },
  {
    label: 'Comprobante Resumen.',
    icon: 'pi pi-folder-open',
    command: () => handleComprobanteResumen()
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-question-circle',
    command: () => recargarPagina()
  }
])

function handleRecomendarPreclasificacion () {
  // obtenerSolicitudesAntecedentes() ???
  launchDialog({
    component: ModalRecomendarPreclasificacion,
    header: 'Recomendación a Preclasificación',
    confirmLabel: 'Enviar',
    props: {
      data: {
        id: 1,
        ruc: ruc.value,
        institucion: 'Fiscalia',
        fiscalia: 'Santiago',
        medioRecepcion: 'Presencial',
        fechaHoraIngreso: dateTimeUtil.formatToBackend(new Date()),
        atendedorJuridico: 'Jose Soto Tapia Velasco',
        especieDinero: especies.value.length,
        documentos: documentos.value.length
      }
    },
    accept: ({ recomendacion }) => {
      requestUtil({
        action: fichaCausa_recomendacionPreclasificador,
        payload: {
          ruc: ruc.value,
          causa: {
            ...causa.value,
            registraRecomentacionesPreclasificador: true,
            recomendacionPreclasificacion: recomendacion,

            solicitudAntecedentesEspecificos: false, // donde esta eso?
            contieneEspeciesNoDeclaradas: false, // donde esta eso?
            documentacionCompleta: true // donde esta eso?
          }
        },
        resolve: () => {
          toastSuccess('Recomendación Enviada con Éxito')
        }
      })
    },
    width: '62%'
  })
}

function obtenerSolicitudesAntecedentes () {
  requestUtil({
    action: fichaCausa_getAntecedentesSolicitados,
    payload: { idDenuncia: idDenuncia.value }
  })
}

function handleSolicitarAntecedentesEspecificos () {
  obtenerSolicitudesAntecedentes()
  launchDialog({
    component: ModalSolicitudAntecedentesEspecificos,
    header: 'Solicitud de Antecedentes Específicos',
    props: { ruc },
    accept: (res) => {
      console.log('accept', res)
    },
    reject: () => {
      console.log('reject')
    },
    width: '69%'
  })
}

function getDelitosIds () {
  return delitos?.value?.map((d) => {
    return d.idDetalleHechoDelictual
  })
}

function recargarPagina () {
  location.reload()
}
</script>
