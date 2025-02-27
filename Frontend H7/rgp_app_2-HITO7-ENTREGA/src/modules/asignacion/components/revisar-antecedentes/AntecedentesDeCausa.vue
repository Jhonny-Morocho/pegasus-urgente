<template>
<div class="p-fluid">
  <LoaderSkeleton v-if="isLoading.antecedentes" />
  <section v-show="!isLoading.antecedentes">
    <AntecedentesDeCausaFieldset
      :loading="isLoading.cambiarNombreCausa"
      @cambiar-nombre-causa="openModalCambiarNombreCausa"
    />
    <FiscaliaLocalFieldset />
    <InstitucionDenuncianteFieldset v-if="hasInstitucionDenunciante" />
  </section>
</div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useDynamicDialog } from '@/modules/common/composables'
import {
  useAntecedentesCausaStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useAntecedentesCausaData } from '@/modules/preclasificador/composables'
import {
  useCausaAsignacionStore,
  useFlujoPamAsignacion
} from '@/modules/asignacion/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import ModalCambiarNombreCausa from '@/modules/global/components/antecedentes-causa/ModalCambiarNombreCausa.vue'
import AntecedentesDeCausaFieldset from '@/modules/preclasificador/components/validar-calidad-antecedentes/antecedentes-de-causa/AntecedentesDeCausaFieldset.vue'
import FiscaliaLocalFieldset from '@/modules/preclasificador/components/validar-calidad-antecedentes/antecedentes-de-causa/FiscaliaLocalFieldset.vue'
import InstitucionDenuncianteFieldset from '@/modules/preclasificador/components/validar-calidad-antecedentes/antecedentes-de-causa/InstitucionDenuncianteFieldset.vue'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { launchDynamicDialog } = useDynamicDialog()
const { toastSuccess } = useAppToast()

const { antecedentes, fiscaliaLocal, institucionDenunciante } =
  useAntecedentesCausaData()
const { flujoAsignacion } = useFlujoPamAsignacion()

const { ruc, causaAsignacion_cambiarNombreCausa } = useCausaAsignacionStore()

const { antecedentesCausa_getAntecedentesCausa } = useAntecedentesCausaStore()

const { mantenedor_getTipoDenunciaNombreById } = useMantenedorStore()

const { identificacionDenuncia_SET_ID_CATALOGO } =
  useIdentificacionDenunciaStore()

const isLoading = reactive({
  antecedentes: false,
  cambiarNombreCausa: false
})

const hasInstitucionDenunciante = computed(
  () => tipoDenuncia(antecedentes.idTipoDenuncia) === 'FISICA'
)

function setAntecedentesDeCausa (data) {
  Object.assign(antecedentes, data)
}

function setFiscaliaLocal (data) {
  Object.assign(fiscaliaLocal, data)
}

function setInstitucionDenunciante (data) {
  if (data) {
    Object.assign(institucionDenunciante, data)
  }
}

/** Obtener datos de la causa utilizando el ruc */
function getDatosCausa () {
  requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: { ruc: ruc.value },
    loader: (v) => {
      isLoading.antecedentes = v
    },
    resolve: (data) => {
      // set del idCatalogo
      requestUtil({
        action: identificacionDenuncia_SET_ID_CATALOGO,
        payload: { idCatalogo: data.antecedentes.idCatalogo },
        resolve: () => {}
      })
      // set data en formulario
      setAntecedentesDeCausa(data?.antecedentes)
      setFiscaliaLocal(data?.fiscaliaLocal)
      setInstitucionDenunciante(data?.institucionDenunciante)
    }
  })
}

function openModalCambiarNombreCausa () {
  launchDynamicDialog({
    component: ModalCambiarNombreCausa,
    header: 'Cambiar Nombre de Causa',
    width: '50%',
    data: {
      nombreCausaActual: antecedentes.nombreCausa
    },
    onClose ({ data }) {
      if (data) {
        cambiarNombreCausa(data?.nombreCausa)
      }
    }
  })
}

function cambiarNombreCausa (nombre) {
  requestUtil({
    action: causaAsignacion_cambiarNombreCausa,
    payload: {
      ruc: ruc.value,
      nombre: nombre
    },
    loader: (l) => {
      isLoading.cambiarNombreCausa = l
    },
    resolve: () => {
      getDatosCausa()
      toastSuccess('El nombre de la causa se modificó correctamente')
      flujoAsignacion.requiereCambiarTipificacion = true
    }
  })
}

function tipoDenuncia (idTipoDenuncia) {
  return mantenedor_getTipoDenunciaNombreById(idTipoDenuncia)
}

onMounted(() => {
  getDatosCausa()
})
</script>
