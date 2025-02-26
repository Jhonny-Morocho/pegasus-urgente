<template>
<div class="col-12 md:col-6 text-center">
  <LoaderSkeleton v-if="isLoading" />
  <img
    v-else
    alt="imagen QR"
    class="w-8 md:w-6 lg:w-6 m-auto"
    :src="`${foto}`"
    style="border-style: solid; border-radius: 8px"
  >
</div>
<div class="grid col-12 md:col-6 m-auto">
  <div class="col-12 text-center md:text-left">
    <p style="font-size: 1.2em">
      <span class="font-bold">RUE:</span>
      {{ dataEtiqueta.RUE }}
    </p>
  </div>
  <div class="col-12 text-center md:text-left mt-4">
    <Button
      id="vista-previa-etiqueta"
      class="p-button-outlined w-full"
      icon="pi pi-file"
      icon-pos="right"
      label="Vista Previa"
      style="max-width: 256px"
      type="button"
      @click="vistaPreviaEtiquetaGenerada"
    />
  </div>
</div>
</template>

<script setup>
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import ModalVistaPreviaEtiquetaGenerada from '@/modules/recepcion-especies-dinero/components/generar-etiqueta/Modals/ModalVistaPreviaEtiquetaGenerada.vue'
import { propTypes } from '@/modules/common/types'
import { defineProps, ref, watch } from 'vue'
import { useIngresoDinero } from '../../composables'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const isLoading = ref(false)

const { launchDialog } = useAppDialog()
const { stepIngresoDinero_getGenerarDataQr } = useIngresoDinero()

const props = defineProps({
  dataEtiqueta: propTypes.object,
  masData: propTypes.object
})

const { toastError } = useAppToast()

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

requestUtil({
  action: mantenedor_getAllTiposEspecie
})

const foto = ref()

function generarQr (d) {
  isLoading.value = false
  if (d !== {}) {
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
      )}, Cantidad: ${d?.cantidad}, Especie peligrosa: ${
        d?.esPeligrosa ? 'Si' : 'No'
      }, Unidad de Medida o Peso: ${d?.unidadMedidaPeso},
       Nombre Bodega: ${d?.nombreBodega}, Nombre Sector: ${d?.nombreSector}, Nombre Casillero: ${d?.nombreCasillero}`
      },
      resolve: (res) => {
        foto.value = res.qrBase64
      },
      reject: (e) => toastError(e),
      loader: (l) => {
        isLoading.value = l
      }
    })
  }
}
generarQr(props.dataEtiqueta)

watch(
  () => props.dataEtiqueta,
  () => generarQr(props.dataEtiqueta)
)

function vistaPreviaEtiquetaGenerada () {
  launchDialog({
    component: ModalVistaPreviaEtiquetaGenerada,
    width: '50%',
    header: 'Etiqueta Generada',
    props: {
      data: { ...props.dataEtiqueta, foto: foto }
    },
    confirmLabel: 'Cerrar',
    cancelLabel: 'hideCancelLabel'
  })
}
</script>
<style scoped>
.bordeQr {
  border: 5px;
}
</style>
