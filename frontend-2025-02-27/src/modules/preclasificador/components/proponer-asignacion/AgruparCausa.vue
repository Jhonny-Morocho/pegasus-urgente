<template>
<section class="col-12 p-fluid ">
  <h2 class="mt-0 mb-4 p-2">
    Agrupar Causa
  </h2>
  <AppFieldset
    class="grid pb-3"
    legend="Datos Para Agrupar"
  >
    <TablaCausasAgrupar
      v-model:first="causasRelacionadasFirst"
      v-model:selection="causaPrincipal"
      :loading="loadingState.getCausasRelacionadas"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="causasRelacionadas"
      @page="getCausasRelacionadas"
    >
      <template #acciones>
        <Column
          header="Acciones"
        >
          <template #body="{ data }">
            <div class="text-center">
              <Button
                v-if="ruc !== data?.ruc"
                class="p-button-rounded p-button-danger p-button-outlined"
                icon="pi pi-trash"
                :loading="isLoading.eliminarCausaRelacionada"
                @click="openConfirmEliminarCausaRelacionada(data)"
              />
              <strong v-else>Causa Actual</strong>
            </div>
          </template>
        </Column>
      </template>
    </TablaCausasAgrupar>
    <h4
      v-if="rucCausaPrincipal"
      class="col-12 mt-4"
    >
      La Causa con RUC {{ rucCausaPrincipal }} es la más avanzada. Todas las
      Causas de la tabla se agruparán a la Causa Principal.
    </h4>
    <h4
      v-else
      class="col-12 mt-4"
    >
      Seleccione una Causa como Principal. Todas las Causas de la tabla se
      agruparán a la Causa Principal.
    </h4>

    <AppForm
      id="formulario-agrupacion"
      class="grid mt-4"
      :form-submitted="formSubmitted"
      validation-scope="formulario-agrupacion"
    >
      <AppDropdown
        id="motivoDeAgrupacion"
        v-model="formData.motivoDeAgrupacion"
        class="col-4"
        label="Motivo de Agrupación"
        option-label="descripcion"
        option-value="id"
        :options="motivoAgrupacion"
        placeholder
        :retrieve-data-action="mantenedor_getMotivoAgrupacion"
        :rules="{ required }"
        show-clear
      />
      <AppTextarea
        id="comentario"
        v-model="formData.comentario"
        class="col-12"
        cols="150"
        label="Comentario"
        rows="5"
        :rules="{ required }"
      />
    </AppForm>
  </AppFieldset>
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar Propuesta"
    :loading="isSomethingLoading"
    @click="handleEnviarPropuesta"
  />
</section>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import {
  useAppGlobalProperties,
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import {
  usePamStore,
  useMantenedorStore,
  useCausasRelacionadasStore
} from '@/modules/global/composables'
import { useCausaPreclasificadorStore, useLoadingStates } from '@/modules/preclasificador/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaCausasAgrupar from '@/modules/global/components/causas-relacionadas/TablaCausasAgrupar.vue'

const router = useRouter()

const { toastSuccess, toastWarning, toastError, TOAST_MESSAGES } = useAppToast()

const { launchConfirmDialog } = useConfirmDialog()

const { procesoPam } = usePamStore()

const { $userFiscaliaActual } = useAppGlobalProperties()

const { loadingState } = useLoadingStates()

const {
  motivoAgrupacion,
  mantenedor_getMotivoAgrupacion,
  mantenedor_getTiposSujetos
} = useMantenedorStore()

const {
  ruc,
  causaActual,
  causaPreclasificador_completarAgruparCausa
} = useCausaPreclasificadorStore()

const {
  causasRelacionadas,
  paginacion,
  causasRelacionadas_getCausasRelacionadas,
  causasRelacionadas_eliminarCausasRelacionadas,
  causasRelacionadas_SET_DEFAULT_STATE
} = useCausasRelacionadasStore()

const formData = reactive({
  motivoDeAgrupacion: '',
  comentario: ''
})

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'formulario-agrupacion'
})

const causaPrincipal = ref()

const isLoading = reactive({
  confirmarAgrupacion: false,
  dataMantenedor: false,
  eliminarCausaRelacionada: false
})

const idCausaActual = computed(() => causaActual.value?.causa?.idCausa)

const isSomethingLoading = computed(() => {
  return loadingState.getCausasRelacionadas ||
  loadingState.guardarCausasRelacionadas ||
   isLoading.confirmarAgrupacion ||
   isLoading.dataMantenedor
})

const causasRelacionadasFirst = ref(0)

function getDataMantenedor () {
  requestUtil({
    action: mantenedor_getTiposSujetos,
    loader: (l) => { isLoading.dataMantenedor = l }
  })
}

// LOGIC
const rucCausaPrincipal = computed(() => causaPrincipal.value?.ruc)

function getCausasRelacionadas (pagination = undefined) {
  if (!pagination) {
    causasRelacionadasFirst.value = 0
  }
  requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      idCausa: idCausaActual.value,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => { loadingState.getCausasRelacionadas = l }
  })
}

function completarAgruparCausas (payload) {
  requestUtil({
    action: causaPreclasificador_completarAgruparCausa,
    payload: {
      propuestaAsignacion: payload,
      taskId: procesoPam.value?.taskId
    },
    loader: (l) => { isLoading.confirmarAgrupacion = l },
    resolve: () => {
      toastSuccess('Propuesta Enviada con Éxito')

      router.push({ name: 'PreclasificadorBandeja' })

      causasRelacionadas_SET_DEFAULT_STATE()
    },
    reject: (error) => {
      if (appUtil.includeWord(error.codigo, 'RGP_BANDEJA_APP_0007')) {
        launchConfirmDialog({
          header: 'Error al Agrupar Causas',
          message: error.mensaje,
          acceptClass: 'hidden',
          rejectLabel: 'Cerrar',
          rejectIcon: ''
        })
      }
      if (appUtil.includeWord(error.codigo, 'RGP_BANDEJA_BIZ_0014')) {
        launchConfirmDialog({
          header: 'Causa Judicializada',
          message: error.mensaje?.replace('[', '').replace(']', ''),
          acceptClass: 'hidden',
          rejectLabel: 'Cerrar',
          rejectIcon: ''
        })
      }
      console.error(error)
    }
  })
}

function openConfirmEliminarCausaRelacionada (causa) {
  const { causaId: idCausaEliminar, ruc } = causa
  launchConfirmDialog({
    header: 'Eliminar Causa Relacionada',
    message: `¿Eliminar causa relacionada con RUC: ${ruc}`,
    accept: () => {
      eliminarCausaRelacionada(idCausaEliminar)
    }
  })
}

function eliminarCausaRelacionada (idCausaEliminar) {
  requestUtil({
    action: causasRelacionadas_eliminarCausasRelacionadas,
    payload: {
      idCausaPadre: idCausaActual.value,
      idsCausasHijas: [idCausaEliminar]
    },
    loader: (l) => { isLoading.eliminarCausaRelacionada = l },
    resolve: () => {
      toastWarning('Causa Relacionada Eliminada')
      getCausasRelacionadas()
    }
  })
}

function handleEnviarPropuesta () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (!causaPrincipal.value) {
    toastError('Debes seleccionar una Causa Principal')
    return
  }

  const payload = {
    causas: causasRelacionadas.value.map((c) => {
      return {
        idCausa: c.causaId,
        ruc: c.ruc,
        esPrincipal: c.causaId === causaPrincipal.value.causaId
      }
    }),
    comentario: formData.comentario,
    idMotivoAgrupacion: formData.motivoDeAgrupacion,
    usuario: {
      fiscaliaId: $userFiscaliaActual.value?.fiscalia,
      modulo: 'IYA',
      regionId: $userFiscaliaActual.value?.region,
      zonaId: 2
    }
  }

  launchConfirmDialog({
    message: '¿Estás seguro(a) de enviar propuesta para Agrupar Causa?',
    accept: async () => {
      completarAgruparCausas(payload)
    }
  })
}

onMounted(() => {
  getDataMantenedor()
  getCausasRelacionadas()
})
</script>
