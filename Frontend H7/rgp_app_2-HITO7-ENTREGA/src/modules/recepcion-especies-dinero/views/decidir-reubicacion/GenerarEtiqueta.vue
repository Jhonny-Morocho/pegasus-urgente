<template>
<AppFieldset
  legend="Generar Etiqueta"
>
  <Especie
    v-if="flujo === 'busqueda' || flujo === 'Reubicar'"

    :especie="getEtiquetaReubicacion"
    :mas-data="dataRue"
  />

  <EspeciesDinero
    v-else
    :especies-dineros="getEtiquetaReubicacion"
  />
  <div class="col-12 flex justify-content-end">
    <Button
      class="p-button-outlined btn-primary-outline"
      icon="pi pi-file"
      icon-pos="right"
      label="Vista Previa"
      type="button"
      @click="vistaPrevia(getEtiquetaReubicacion,dataRue, foto)"
    />
  </div>
</AppFieldset>

<AppBtnNextTeleported
  class="mr-2"
  icon="pi pi-arrow-right"
  icon-pos="right"
  label="Finalizar"
  @click="nextStep"
/>
</template>
<script setup>
import EspeciesDinero from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/EspeciesDinero.vue'
import Especie from '@/modules/recepcion-especies-dinero/components/decidir-reubicacion/Especie.vue'
import ModalVisualizacionEtiquetas from '@/modules/recepcion-especies-dinero/components/decidir-reubicacion/modals/ModalVisualizacionEtiquetas.vue'
import { useBandejaCustodioStore, useIngresoDinero, useStepBusquedaAgregarSepararEspecies } from '@/modules/recepcion-especies-dinero/composables'
import { ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useRouter } from 'vue-router'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const router = useRouter()
const { toastError } = useAppToast()

const { flujo } = useBandejaCustodioStore()
const {
  dataRue, getEtiquetaReubicacion
} = useStepBusquedaAgregarSepararEspecies()
const { stepIngresoDinero_getGenerarDataQr } = useIngresoDinero()
const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()
requestUtil({
  action: mantenedor_getAllTiposEspecie
})

const foto = ref()

const { launchDialog } = useAppDialog()

function generarQr (d) {
  console.log('dataQR', d)
  if (d) {
    requestUtil({
      action: stepIngresoDinero_getGenerarDataQr,
      // payload para el QR
      payload: {
        qr: `RUC: ${d?.ruc}, NUE: ${d?.nue}, RUE: ${
        d?.RUE
      }, Familia Especie: ${mantenedor_getNombreFamiliaEspecie(
        d?.idFamilia
      )}, Tipo Especie: ${mantenedor_getNombreTipoEspecie(
        d?.idTipoEspecie
      )}, Cantidad: ${d?.cantidad}, Es especie peligrosa: ${
        d?.esPeligrosa ? 'Si' : 'No'
      }, Unidad de Medida o Peso: ${d?.unidadMedidaPeso}`
      },
      resolve: (res) => {
        foto.value = res.qrBase64
      },
      reject: (e) => toastError(e)
    })
  }
}
generarQr(dataRue.value.especie)

function vistaPrevia (especie, causa, foto) {
  console.log('foto', foto)
  launchDialog({
    component: ModalVisualizacionEtiquetas,
    header: 'Visualización de Etiqueta',
    props: { especie, causa, foto, modal: true },
    width: '50%',
    cancelLabel: 'Cerrar'
  })
}

function nextStep () {
  router.push('/custodia/custodio')
}
</script>
