<template>
<main>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Ficha Causa"
  />

  <section id="ficha-causa">
    <HeaderFichaCausa
      :is-loading="resumenCausa.isLoading"
      :resumen-causa="resumenCausa.data"
      :ruc="ruc"
      @ver-info-fiscal="openModalInfoFiscal"
    />

    <section class="flex-justify-content-center mb-4 mt-5">
      <TabMenu :model="tabsFichaCausa" />
    </section>

    <main class="wrapper-routes">
      <RouterView />
      <ScrollTop
        class="scrolltop"
        :class="[notTransversal ? 'scrolltop-ingreso' : 'scrolltop-general']"
        icon="pi pi-arrow-up"
        :threshold="100"
      />
    </main>
  </section>

  <AppFooterBtns
    v-if="notTransversal"
    label="Finalizar Ingreso"
    no-button-back
    @next-step="finalizar"
  />
</main>
</template>

<script setup>
import { defineProps, ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppGlobalProperties, useAppToast, useDynamicDialog } from '@/modules/common/composables'
import { useFichaCausa, useFichaCausaData, useFichaCausaStore } from '../composables'
import ScrollTop from 'primevue/scrolltop'
import HeaderFichaCausa from '../components/HeaderFichaCausa.vue'
import ModalRecomendacionPreclasificador from '../components/modals/ModalRecomendacionPreclasificador.vue'
import ModalInfoFiscal from '../components/modals/ModalInfoFiscal.vue'
import ModalComprobanteResumen from '../components/modals/ModalComprobanteResumen.vue'
import html2pdf from 'html2pdf.js'
import { useCrearCausaStore } from '@/modules/ingreso/composables'

const props = defineProps({
  ruc: {
    type: String,
    required: true
  }
})

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()
const { toastSuccess } = useAppToast()

const { $userName, $userRoles } = useAppGlobalProperties()

const { flujoOrigen } = useFichaCausa()

const {
  causa,
  origenCausa,
  fichaCausa_recomendacionPreclasificador
} = useFichaCausaStore()

const { resumenCausa, getResumenCausa } = useFichaCausaData()

const { getAnotaciones } = useFichaCausaData()

const { crearCausa_SET_DEFAULT_STATE } = useCrearCausaStore()

const notTransversal = computed(() => {
  return origenCausa.value !== flujoOrigen.TRANSVERSAL
})

const router = useRouter()

const ruc = computed(() => props.ruc)

const isLoading = reactive({
  modalRecomendacion: false
})

function openModalInfoFiscal () {
  launchDialog({
    component: ModalInfoFiscal,
    header: 'Detalles Fiscal Asignado',
    cancelIcon: '',
    cancelLabel: 'Cerrar',
    acceptClass: 'hidden',
    width: '60%',
    props: {
      info: {
        nombre: resumenCausa.data?.nombreFiscalAsignado,
        cargo: 'Fiscal', // DE DONDE SALE EL CARGO?
        fiscalia: resumenCausa.data?.nombreFiscaliaLocal,
        telefono: 'No Informado', // DE DONDE SALE EL TELEFONO
        anexo: 'No Informado', // DE DONDE SALE EL ANEXO
        email: 'No Informado' // DE DONDE SALE EL EMAIL
      }
    }
  })
}

function finalizar () {
  switch (origenCausa.value) {
    case flujoOrigen.DENUNCIA_DIRECTA:
      crearCausa_SET_DEFAULT_STATE()
      router.push({ name: 'BandejaDenunciaDirecta' })
      break
    case flujoOrigen.DENUNCIA_OFICIO:
      crearCausa_SET_DEFAULT_STATE()
      router.push({ name: 'BandejaDenunciaOficio' })
      break
    case flujoOrigen.DENUNCIA_FISICA:
      crearCausa_SET_DEFAULT_STATE()
      router.push({ name: 'BandejaDenunciaFisica' })
      break
  }
}

function handleExportar () {
  const fichaCausaEl = document.querySelector('#ficha-causa')

  const options = {
    margin: 0.5,
    filename: 'ficha-causa.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { dpi: 300, letterRendering: true },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    jsPDF: { unit: 'cm', format: 'letter', orientation: 'p' }
  }

  html2pdf().set(options).from(fichaCausaEl).save()
}

function openModalComprobanteResumen () {
  launchDynamicDialog({
    component: ModalComprobanteResumen,
    header: 'Comprobante Resumen Causa',
    width: '70%'
  })
}

function openModalRecomendacion () {
  launchDialog({
    component: ModalRecomendacionPreclasificador,
    header: 'Recomendación a Preclasificación',
    cancelIconPos: 'right',
    confirmLabel: 'Enviar',
    confirmIcon: '',
    props: {
      data: {
        ruc: ruc.value,
        institucion: 'Fiscalia',
        fiscalia: 'Santiago',
        medioRecepcion: 'Presencial',
        fechaHoraIngreso: dateTimeUtil.formatToFrontendWithTime(),
        atendedorJuridico: $userName.value
      }
    },
    accept: ({ recomendacion }) => {
      recomendarPreclasificacion(recomendacion)
    }
  })
}

function recomendarPreclasificacion (recomendacion) {
  const rolUsuario = $userRoles.value.find((el) => el.includes('atendedor')) ? 'Atendedor Jurídico' : 'Fiscal'

  requestUtil({
    action: fichaCausa_recomendacionPreclasificador,
    payload: {
      ruc: ruc.value,
      causa: {
        causa: {
          ...causa.value,
          registraRecomentacionesPreclasificador: true,
          recomendacionPreclasificacion: recomendacion,
          solicitudAntecedentesEspecificos: false, // donde esta eso?
          contieneEspeciesNoDeclaradas: false, // donde esta eso?
          documentacionCompleta: true // donde esta eso?
        },
        anotacion: {
          denunciaId: causa.value.idDenuncia,
          anotacion: recomendacion,
          autor: $userName.value,
          rol: rolUsuario,
          etapa: 'Ingreso - Ficha Causa'
        }
      }
    },
    resolve: () => {
      toastSuccess('Recomendación Enviada con Éxito')
      getAnotaciones()
    }
  })
}

onMounted(() => {
  getResumenCausa()
})

const itemsMenuSuperior = ref([
  {
    visible: () => notTransversal.value,
    label: 'Solicitar',
    icon: 'pi pi-info-circle',
    items: [
      {
        label: 'Antecedentes Específicos',
        command: () => console.log('Antecedentes Específicos'),
        disabled: () => true
      }
    ]
  },
  {
    visible: () => origenCausa.value === flujoOrigen.DENUNCIA_DIRECTA,
    label: 'Recomendar a Preclasificador',
    icon: 'pi pi-phone',
    command: () => openModalRecomendacion(),
    disabled: () => isLoading.modalRecomendacion
  },
  {
    visible: () => notTransversal.value,
    label: 'Comprobante Resumen',
    icon: 'pi pi-book',
    command: () => openModalComprobanteResumen(),
    disabled: () => false
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-sync',
    command: () => router.go()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: () => handleExportar()
  },
  {
    label: 'Descargar Carpeta Investigativa',
    icon: 'pi pi-cloud-download',
    command: () => console.log('Descargar Carpeta'),
    disabled: () => true
  },
  {
    label: 'Ver Carpeta Investigativa',
    icon: 'pi pi-folder-open',
    command: () => console.log('Ver Carpeta'),
    disabled: () => true
  }
])

const tabsFichaCausa = [
  {
    label: 'Información de la Causa',
    icon: 'pi pi-info-circle',
    to: { name: 'FCInformacionCausa' }
  },
  {
    label: 'Historial de la Causa',
    icon: 'pi pi-clock',
    to: { name: 'FCHistorialCausa' }
  },
  {
    label: 'Catálogo Documental Digital',
    icon: 'pi pi-folder',
    to: { name: 'FCCatalogoDocumentalDigital' }
  }
]
</script>

<style lang="scss" scoped>
::v-deep(.scrolltop) {
  width: 3rem;
  height: 3rem;
  border-radius: 4px;
  background-color: var(--primary-color);
  transition: all 0.3s;

  &:hover {
    background-color: var(--primary-color);
    transform: scale(1.1);
  }
}

::v-deep(.scrolltop-general) {
  margin-bottom: -0.1rem !important;
}

::v-deep(.scrolltop-ingreso) {
  margin-bottom: 3.5rem !important;
}
</style>
