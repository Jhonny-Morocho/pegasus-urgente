<template>
<div class="p-fluid">
  <div v-if="isLoading">
    <LoaderSkeleton height="30vh" />
  </div>
  <AppFieldset
    v-else
    legend="Relato del Hecho"
  >
    <EditorRelato
      :is-loading-plantilla="isLoading"
      no-dropdown
      :plantilla-options="plantillaOptions"
      :relato="propRelato"
      @editor-relato:guardar-relato="guardarRelato"
    />
  </AppFieldset>
</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useRelatoStore } from '@/modules/global/composables'
import { useCausaPreclasificadorStore } from '@/modules/preclasificador/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import EditorRelato from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'

const { toastSuccess, toastError } = useAppToast()

const {
  relato,
  relato_getRelatoByIdDenuncia,
  relato_guardarRelato,
  relato_editarRelato,
  relato_SET_DEFAULT_STATE
} = useRelatoStore()

const { idDenuncia, causaActual } = useCausaPreclasificadorStore()

const isLoading = ref(false)

const propRelato = computed(() => {
  return {
    relato: relato.value?.relato
  }
})

function getRelatoById () {
  relato_SET_DEFAULT_STATE()
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value
    },
    reject: (e) => {
      console.error('ERROR getRelatoById: ', e)
    },
    loader: (loading) => (isLoading.value = loading)
  })
}

function guardarRelato (data) {
  const { idCausa } = causaActual.value?.causa
  const { idRelato } = relato.value
  data.idDenuncia = idDenuncia.value
  data.idProcedimiento = idCausa
  data.idRelato = idRelato
  data.idFuncionarioRol = appUtil.cadenaAleatoria(20)
  if (relato?.value?.idRelato?.length === 36) {
    requestUtil({
      action: relato_editarRelato,
      payload: {
        ...data
      },
      resolve: () => {
        toastSuccess('Se ha modificado el relato del hecho correctamente')
      },
      reject: () => {
        toastError('Ocurrio un error inesperado, intente nuevamente')
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
      console.log('error guardarRelato: ', r)
    }
  })
}

onMounted(() => {
  getRelatoById()
})

const plantillaOptions = [
  {
    idPlantilla: 1,
    labelPlantilla: 'Plantilla 1 - Robo Morada'
  }
]
</script>
