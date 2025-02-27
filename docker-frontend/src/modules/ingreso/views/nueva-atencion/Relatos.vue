<template>
<section>
  <div class="mb-4">
    <AppFieldset legend="Relato del Hecho">
      <RelatoEditor
        can-edit
        :is-loading-plantilla="isLoading"
        :plantilla-options="plantillaOptions"
        :read-only="modoLectura"
        :relato="relato"
        @editor-relato:generar-plantilla="generarPlantilla"
        @editor-relato:guardar-relato="guardarRelato"
      />
    </AppFieldset>
  </div>
  <AppBtnNextTeleported
    label="Documentos"
    :loading="loadingStepDocumentos"
    @click="nextStep"
  />
</section>
</template>

<script setup>
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useAppToast } from '@/modules/common/composables'
import RelatoEditor from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import { useMantenedorStore, usePamStore, useRelatoStore } from '@/modules/global/composables'
import { appUtil, requestUtil } from '@/utils'
import { defineEmits, onMounted, ref } from 'vue'

const { toastSuccess, toastError, toastWarning } = useAppToast()
const { mantenedor_getIdTipoSujetoByCodigo } = useMantenedorStore()

const { getIntervinientes, getEspecies, getDelitos, relato_getPropuestaRelatoById, relato_guardarRelato, relato_editarRelato, relato, relato_getRelatoByIdDenuncia, relato_getPropuestaPlantilla } = useRelatoStore()
const { procesoPam } = usePamStore()

const isLoading = ref(false)
const loadingStepDocumentos = ref(false)
const modoLectura = ref(false)

function createContract (data) {
  return {
    idRelato: data.idRelato,
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
onMounted(() => {
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
    loader: (loading) => (isLoading.value = loading)
  })
}

function generarPlantilla (_data) {
  const id = '1'
  const idDenunciante = mantenedor_getIdTipoSujetoByCodigo('1')
  const idVictima = mantenedor_getIdTipoSujetoByCodigo('6')
  const idImputado = mantenedor_getIdTipoSujetoByCodigo('3')
  const idTestigo = mantenedor_getIdTipoSujetoByCodigo('15')

  const payload = createContract({
    idRelato: id,
    denunciantes: getIntervinientes(idDenunciante),
    victimas: getIntervinientes(idVictima),
    imputados: getIntervinientes(idImputado),
    testigos: getIntervinientes(idTestigo),
    delitos: getDelitos(),
    especies: getEspecies()
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
    resolve: () => console.log('llego plantilla por id'),
    reject: (r) => {
      toastError('Ocurrio un error inesperado, intente nuevamente')
      console.log('error generarPlantillaPorId: ', r)
    },
    loader: (loading) => (isLoading.value = loading)
  })
}

function guardarRelato (data) {
  data.idDenuncia = procesoPam.value.idDenuncia
  data.idProcedimiento = procesoPam.value.idCausa
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

const plantillaOptions = [
  {
    idPlantilla: 1,
    labelPlantilla: 'Plantilla 1 - Robo Morada'
  }
]

const emit = defineEmits(['next-step'])

function nextStep () {
  if (relato?.value) {
    loadingStepDocumentos.value = true
    setTimeout(() => {
      loadingStepDocumentos.value = false
      emit('next-step', '/ingreso/denuncia-directa/nueva-denuncia/documentos')
    }, 600)
  } else toastWarning('Debes registrar el Relato del Hecho')
}
</script>
