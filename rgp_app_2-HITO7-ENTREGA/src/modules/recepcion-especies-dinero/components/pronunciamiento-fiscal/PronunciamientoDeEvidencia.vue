<template>
<section>
  <PageHeader
    class="mb-5"
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="'RUC: ' + mock.dataCausa.ruc"
    page-title="Fiscal"
  />
  <AppFieldset legend="Antecedentes de la Causa">
    <FieldsetAntecedentesCausa :data-causa="mock.dataCausa" />
  </AppFieldset>
  <AppFieldset legend="Antecedentes de Recepción">
    <FieldsetAntecedentesRecepcion :data-recepcion="mock.dataRecepcion" />
  </AppFieldset>
  <AppFieldset legend="Antecedentes del Dinero y Pronunciamiento">
    <FieldsetAntecedentesDineroPronunciamiento
      :data-causa="mock.dataCausa"
      :data-pronunciamiento="mock.pronunciamientoEvidencia"
      @abrir-modal-denominacion-dineros="openModalDenominacionDineros"
    />
  </AppFieldset>
  <div class="col-12 flex justify-content-center mb-6">
    <Button
      class="btn-form"
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar Pronunciamiento"
      @click="openModalEnviarPronunciamiento()"
    />
  </div>
  <AppFooterBtns
    label="Solicitar Nue"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { requestUtil } from '@/utils'
// components
import FieldsetAntecedentesCausa from '@/modules/recepcion-especies-dinero/components/pronunciamiento-fiscal/FieldsetAntecedentesCausa.vue'
import FieldsetAntecedentesRecepcion from '@/modules/recepcion-especies-dinero/components/pronunciamiento-fiscal/FieldsetAntecedentesRecepcion.vue'
import FieldsetAntecedentesDineroPronunciamiento from '@/modules/recepcion-especies-dinero/components/pronunciamiento-fiscal/FieldsetAntecedentesDineroPronunciamiento.vue'
import ModalDenominacionDeDineros from '@/modules/recepcion-especies-dinero/components/especie-incautada-pendiente-recepcion/modals/ModalDenominacionDeDineros.vue'
import ModalConfirmacionPronunciamiento from '@/modules/recepcion-especies-dinero/components/pronunciamiento-fiscal/modals/ModalConfirmacionPronunciamiento.vue'
// composables
import { useRouter } from 'vue-router'
import { useIngresoDinero, useItemsMenuSuperiorCadena } from '../../composables'
import { useAppDialog, useAppToast } from '@/modules/common/composables'

const mock = {
  dataCausa: {
    ruc: '12344-6',
    nombreCausa: 'Nombre causa',
    fiscalAsignado: 'fiscalAsignado',
    estadoCausa: 'estadoCausa',
    fiscalia: 'fiscalia',
    delitos: ['Delito 1', 'Delito 2']
  },
  dataRecepcion: {
    nue: '12',
    fechaRecepcion: '12-03-2022',
    tiempoRestante: '4 días',
    fechaIngreso: '01-02-2022',
    institucionEntrega: 'Institución'
  },
  pronunciamientoEvidencia: {
    especiesDineros: [
      {
        id: '123',
        ruc: '12344-6',
        nue: '12',
        familiaEspecie: 'familiaEspecie',
        tipoDinero: '123',
        monto: '123',
        observacion: 'observacion asdf',
        descripcion: 'descr'
      }
    ]
  }
}

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const router = useRouter()
const { launchDialog } = useAppDialog()
const { toastSuccess } = useAppToast()

const { stepIngresoDinero_enviarPronunciamiento } = useIngresoDinero()

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
}

function openModalDenominacionDineros (d) {
  launchDialog({
    component: ModalDenominacionDeDineros,
    props: d
  })
}

function openModalEnviarPronunciamiento () {
  launchDialog({
    component: ModalConfirmacionPronunciamiento,
    header: 'Enviar Pronunciamiento',
    width: '30%',
    confirmLabel: 'Enviar',
    accept: () => {
      requestUtil({
        action: stepIngresoDinero_enviarPronunciamiento,
        payload: {
          idEspecie: '',
          esEvidencia: ''
        },
        resolve: (data) => {
          toastSuccess('¡El pronunciamiento sobre el Dinero ha sido enviado con éxito!')
          router.push({ name: 'BandejaCustodio' }) // debe ser a bandeja fiscal
        }
      })
    }
  })
}
</script>
