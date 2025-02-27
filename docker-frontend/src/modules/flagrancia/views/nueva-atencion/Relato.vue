<template>
<LoaderSkeleton v-if="isLoadingPage === true" />
<section v-else>
  <AppFieldset legend="Relato del Hecho">
    <RelatoEditor
      can-edit
      :is-disabled="isFolioCerrado"
      :is-loading-plantilla="isLoading"
      :plantilla-options="plantillaOptions"
      :read-only="isFolioCerrado"
      :relato="relato"
      @editor-relato:generar-plantilla="generarPlantilla"
      @editor-relato:guardar-relato="guardarRelato"
    />
  </AppFieldset>
  <AppBtnNextTeleported
    v-if="$hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`]) || esNuevaAtencionFiscal"
    label="Documentos"
    :loading="isLoadingNextStep"
    @click="handleSubmitForm"
  />
</section>
</template>

<script setup>
import { defineEmits, onMounted, ref, computed } from 'vue'
import RelatoEditor from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useMantenedorStore, usePamStore, useRelatoStore } from '@/modules/global/composables'
import { appUtil, requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useProcedimientosBandejaStore } from '@/modules/flagrancia/composables/useProcedimientosBandejaStore'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const { getIntervinientes, getEspecies, getDelitos, relato_getPropuestaRelatoById, relato_getPropuestaPlantilla, relato_guardarRelato, relato_editarRelato, relato, relato_getRelatoByIdDenuncia } = useRelatoStore()
const { esNuevaAtencionFiscal, estadoFolio } = useProcedimientosBandejaStore()

const { mantenedor_getIdTipoSujetoByCodigo } = useMantenedorStore()
const { toastSuccess, toastError, toastWarning } = useAppToast()
const { procesoPam } = usePamStore()

const isLoadingNextStep = ref(false)
const isLoading = ref(false)
const isLoadingPage = ref(false)
const emit = defineEmits(['next-step'])
const isFolioCerrado = computed(() => estadoFolio.value === 'Cerrado')

function createContract (data) {
  return {
    idRelato: parseInt(data.idRelato),
    identificacionDenuncia: 'IDENTIFICACION_DENUNCIA',
    institucionDenunciante: 'INSTITUCION_DENUNCIANTE',
    fiscaliaLocal: 'FISCALIA_LOCAL',
    denunciantes: data.denunciantes,
    victimas: data.victimas,
    imputados: data.imputados,
    testigos: data.testigos,
    especies: data.especies,
    delitos: data.delitos
  }
}

// GET RELATO BY ID
onMounted(() => {
  isLoadingPage.value = true
  getRelatoById()
})

function getRelatoById () {
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: procesoPam.value,
    reject: (e) => {
      toastError('Ocurrio un error inesperado')
      console.log('ERROR getRelatoById: ', e)
    },
    loader: (l) => {
      if (isLoadingPage.value === true) isLoadingPage.value = l
      isLoading.value = l
    }
  })
}

// GENERAR PLANTILLA
function generarPlantilla (data) {
  const idDenunciante = mantenedor_getIdTipoSujetoByCodigo('1')
  const idVictima = mantenedor_getIdTipoSujetoByCodigo('6')
  const idImputado = mantenedor_getIdTipoSujetoByCodigo('3')
  const idTestigo = mantenedor_getIdTipoSujetoByCodigo('15')

  const id = '1'
  const payload = createContract({
    idRelato: data,
    denunciantes: getIntervinientes(idDenunciante),
    victimas: getIntervinientes(idVictima),
    imputados: getIntervinientes(idImputado),
    testigos: getIntervinientes(idTestigo),
    especies: getEspecies(),
    delitos: getDelitos()
  })

  if (payload.especies[0].ambitoEspecie === '1') {
    payload.especies = []
  }

  payload.delitos.forEach((delito) => {
    if (delito.lugarOcurrencia === 'LUGAR_OCURRENCIA') {
      delito.lugarOcurrencia = 'NO ESPECIFICADO'
    }
  })
  payload.denunciantes.forEach((interviniente) => {
    if (interviniente.nombre.includes('NOMBRE')) {
      interviniente.nombre = 'No Aplica'
    }
  })
  payload.victimas.forEach((interviniente) => {
    if (interviniente.nombre.includes('NOMBRE')) {
      interviniente.nombre = 'No Aplica'
    }
  })
  payload.imputados.forEach((interviniente) => {
    if (interviniente.nombre.includes('NOMBRE')) {
      interviniente.nombre = 'No Aplica'
    }
  })

  payload.testigos.forEach((interviniente) => {
    if (interviniente.nombre.includes('NOMBRE')) {
      interviniente.nombre = 'No Aplica'
    }
  })

  requestUtil({
    action: relato_getPropuestaPlantilla,
    payload: { ...payload, id },
    resolve: () => {
      if (!relato.value?.relato) {
        generarPlantillaPorId()
      }
      toastSuccess('Plantilla Generada')
    },
    reject: (r) => {
      toastError('Ocurrio un error inesperado, intente nuevamente')
      console.log('error generarPlantilla: ', r)
    },
    loader: (loading) => (isLoading.value = loading)
  })
}

function generarPlantillaPorId () {
  const id = '1'
  requestUtil({
    action: relato_getPropuestaRelatoById,
    payload: { id },
    reject: (r) => {
      toastError('Ocurrio un error inesperado, intente nuevamente')
      console.log('error generarPlantillaPorId: ', r)
    },
    loader: (loading) => (isLoading.value = loading)
  })
}

// GUARDAR O EDITAR RELATO
function guardarRelato (data) {
  data.idDenuncia = procesoPam?.value.idDenuncia
  data.idProcedimiento = procesoPam?.value.idCausa
  data.idPlantilla = data.idPlantilla ? data.idPlantilla : 0
  data.idFuncionarioRol = appUtil.cadenaAleatoria(20)

  if (relato?.value?.idRelato?.length === 36) {
    requestUtil({
      action: relato_editarRelato,
      payload: { ...data },
      loader: (l) => (isLoading.value = l),
      resolve: () => {
        toastWarning('Relato Modificado')
      },
      reject: (r) => {
        toastError('Ocurrio un error inesperado, intente nuevamente')
        console.log('error guardarRelato(editar): ', r)
      }
    })
    return
  }

  requestUtil({
    action: relato_guardarRelato,
    payload: { ...data },
    loader: (l) => (isLoading.value = l),
    resolve: () => toastSuccess('Relato Guardado'),
    reject: (r) => {
      toastError('Ocurrio un error inesperado, intente nuevamente')
      console.log('error guardarRelato: ', r)
    }
  })
}

function handleSubmitForm () {
  if (relato.value.relato) {
    isLoadingNextStep.value = true
    setTimeout(() => {
      isLoadingNextStep.value = false
      emit('next-step', 'FlagranciaNuevaAtencionDocumentos')
    }, 600)
  } else toastError('Debes registrar el Relato del Hecho')
}
const plantillaOptions = [
  {
    idPlantilla: 1,
    labelPlantilla: 'Plantilla 1 - Robo Morada'
  }
]
</script>
