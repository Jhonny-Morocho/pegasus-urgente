<template>
<div class="p-fluid">
  <div
    v-if="isLoading"
    class="mb-2"
  >
    <LoaderSkeleton height="30vh" />
  </div>
  <AppFieldset
    v-else
    legend="Relato del Hecho"
  >
    <Button
      class="ml-3 mb-2 p-button-outlined w-auto"
      icon="pi pi-external-link"
      icon-pos="right"
      label="Ver Denuncia"
      :loading="isLoadingBtnVerDenuncia"
      @click="handleVerDenuncia"
    />
    <EditorRelato
      :is-loading-plantilla="isLoading"
      no-dropdown
      :plantilla-options="plantillaOptions"
      :relato="propRelato"
      @editor-relato:guardar-relato="guardarRelato"
    />
  </AppFieldset>

  <AppFieldset
    :collapsed="false"
    :disabled="false"
    legend="Agregar Comentarios"
  >
    <AppInput
      id="input-filtro"
      v-model="inputFiltro"
      class="col-12 md:col-4 md:col-offset-8"
      label="Buscar"
      style="width: 250px"
    />

    <div class="col-12">
      <AppDataTable
        :loading="isLoadingComentarios"
        :rows="paginacionComentarios?.tamanoPagina"
        :total-records="paginacionComentarios?.elementosTotales"
        :value="filtroComentarios"
        @page="getComentarios"
      >
        <Column>
          <template #loading>
            <span>Cargando...</span>
          </template>
        </Column>
        <Column header="Comentario">
          <template #body="{ data }">
            {{ data?.comentario }}
          </template>
        </Column>
        <Column header="Autor - Rol">
          <template #body="{ data }">
            {{ data?.autor }} - {{ data?.rol }}
          </template>
        </Column>
        <Column header="Fecha">
          <template #body="{ data }">
            {{ formatDate(data?.fechaCreacion) }}
          </template>
        </Column>
      </AppDataTable>
    </div>

    <div class="col-12 md:col-8 mt-4">
      <AppInput
        id="id-comentario"
        v-model="comentario"
        class="mb-0"
        label="Comentario"
      />
    </div>

    <div class="col-12 md:col-4 mt-4">
      <Button
        class="h-full"
        :disabled="isLoadingComentarios"
        label="Guardar Comentario"
        @click="postGuardarComentario"
      />
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRelatoStore, useAntecedentesCausaStore, useDelitoStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables/useDirigirInvestigacionStore'
import { requestUtil, appUtil, dateTimeUtil } from '@/utils'
import { useAppToast, useAppGlobalProperties } from '@/modules/common/composables'
import { useDialog } from 'primevue/usedialog'
import EditorRelato from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import ModalVerDenuncia from '@/modules/dirigir-investigacion/components/modals/ModalVerDenuncia.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const dialog = useDialog()
const { toastSuccess, toastError, toastWarning } = useAppToast()
const { includeWord } = appUtil
const { $userName, $userRoles } = useAppGlobalProperties()

const inputFiltro = ref('')

const {
  relato_getRelatoByIdDenuncia,
  relato_editarRelato,
  relato_guardarRelato,
  relato_SET_DEFAULT_STATE,
  relato
} = useRelatoStore()

const {
  delitos,
  delito_getDelitoByIdDenuncia
} = useDelitoStore()

const {
  ruc,
  idDenuncia,
  dirigirInvestigacion_getComentariosRelato,
  dirigirInvestigacion_postGuardarComentarioRelato
} = useDirigirInvestigacionStore()

const {
  antecedentesCausa_getAntecedentesCausa
} = useAntecedentesCausaStore()

const {
  sujetosIntervinientes,
  sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()

const propRelato = computed(() => {
  return {
    relato: relato.value?.relato
  }
})

const isLoading = ref(false)
const isLoadingComentarios = ref(false)
const isLoadingBtnVerDenuncia = ref(false)
const comentario = ref('')
const comentarios = ref([])
const paginacionComentarios = ref({
  firstRecord: 0
})
const infoDenuncia = ref(null)
const antecedentesCausa = ref(null)

const filtroComentarios = computed(() => {
  const comentariosParse = comentarios.value

  if (inputFiltro.value) {
    return comentariosParse?.filter(
      (com) =>
        includeWord(com.comentario, inputFiltro.value) || // Comentario
        includeWord(com.autorRol, inputFiltro.value) // Autor - ROL
    )
  }
  return comentariosParse
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
    loader: (l) => (isLoading.value = l)
  })
}

async function getComentarios (pagination = undefined) {
  requestUtil({
    action: dirigirInvestigacion_getComentariosRelato,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    },
    loader: (v) => {
      isLoadingComentarios.value = v
    },
    resolve: (data) => {
      if (data) {
        comentarios.value = data?.data
        paginacionComentarios.value = data?.paginacion
      }
    }
  })
}

async function postGuardarComentario () {
  const rolUsuario = $userRoles.value.find(el => el.includes('jefe')) ? 'Fiscal Jefe' : 'Fiscal'

  if (!comentario.value) {
    toastWarning('Debe ingresar un comentario para poder Guardar')
    return
  }

  isLoadingComentarios.value = true

  requestUtil({
    action: dirigirInvestigacion_postGuardarComentarioRelato,
    payload: {
      relatoId: idDenuncia.value,
      comentario: comentario.value,
      autor: $userName.value,
      rol: rolUsuario
    },
    resolve: async () => {
      comentario.value = ''
      getComentarios()
      toastSuccess('Comentario guardado correctamente')
    }
  })
}

function guardarRelato (data) {
  const { idCausa } = { idCausa: 'a4ccfd9f-dcef-483e-bc84-571bb53f4302' } // causaActual.value?.causa
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

async function handleVerDenuncia () {
  const params = {
    page: 0,
    size: 50
  }

  await requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (isLoadingBtnVerDenuncia.value = l)
  })

  await requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (isLoadingBtnVerDenuncia.value = l)
  })

  await requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: { ruc: ruc.value },
    resolve: (data) => {
      antecedentesCausa.value = data

      dialog.open(ModalVerDenuncia, {
        props: {
          header: 'Ver Denuncia',
          style: {
            width: '70%'
          },
          modal: true,
          dismissableMask: true
        },
        data: {
          relato: relato.value,
          infoDenuncia: infoDenuncia.value,
          antecedentesCausa: antecedentesCausa.value,
          delitos: delitos.value,
          sujetos: sujetosIntervinientes.value
        },
        onClose: (options) => {
          if (options?.data) {
            console.log('ModalVerDenuncia -> onClose ->', options)
          }
        }
      })
    },
    loader: (l) => (isLoadingBtnVerDenuncia.value = l)
  })
}

onMounted(() => {
  getRelatoById()
  getComentarios()
})

const plantillaOptions = [
  {
    idPlantilla: 1,
    labelPlantilla: 'Plantilla 1 - Robo Morada'
  }
]

function formatDate (value) {
  let fechaCreacion = value

  fechaCreacion = dateTimeUtil.addNMinutes(fechaCreacion, -180)

  return fechaCreacion
}
</script>
