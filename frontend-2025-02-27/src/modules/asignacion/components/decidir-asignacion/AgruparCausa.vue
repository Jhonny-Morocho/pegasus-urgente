<template>
<section class="col-12 p-fluid">
  <h2 class="mt-0 mb-4 p-2">
    Agrupar Causa
  </h2>
  <AppFieldset
    v-if="hasPropuestaAsignacion"
    class="w-full"
    legend="Propuesta del Preclasificador"
  >
    <PropuestaPreclasificador :propuesta="preclasificacion" />
  </AppFieldset>
  <AppFieldset
    class="grid w-full"
    legend="Causas a Agrupar"
  >
    <TablaCausasAgrupar
      v-model:first="causasRelacionadasFirst"
      v-model:selection="causaPrincipal"
      :loading="loadingStates.getCausasRelacionadas"
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
      La Causa con RUC {{ rucCausaPrincipal }} es la más avanzada. Todas las Causas de la tabla se agruparán a la
      Causa Principal.
    </h4>
    <h4
      v-else
      class="col-12 mt-4"
    >
      Seleccione una Causa como Principal. Todas las Causas de la tabla se agruparán a la Causa Principal.
    </h4>

    <AppForm
      id="form-agrupar-causa"
      class="grid mt-4"
      :form-submitted="formSubmitted"
      validation-scope="form-agrupar-causa"
    >
      <AppDropdown
        id="motivoDeAgrupacionAsignacion"
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
    label="Confirmar Agrupacion"
    :loading="isSomethingLoading"
    @click="handleConfirmarAgrupacion"
  />
</section>
</template>

<script setup>
import { reactive, ref, h, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import { useFormValidation, useAppToast, useDynamicDialog, useConfirmDialog } from '@/modules/common/composables'
import { useCausasRelacionadasStore, useMantenedorStore, usePamStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useCausaAsignacionStore, useLoadingStates } from '@/modules/asignacion/composables'
import Button from 'primevue/button'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaCausasAgrupar from '@/modules/global/components/causas-relacionadas/TablaCausasAgrupar.vue'
import PropuestaPreclasificador from '@/modules/asignacion/components/propuesta-asignacion/PropuestaPreclasificador.vue'
import ModalConfirmacionAgrupacion from '@/modules/asignacion/components/modals/ModalConfirmacionAgrupacion.vue'

const { launchDynamicDialog } = useDynamicDialog()
const { launchConfirmDialog } = useConfirmDialog()

const router = useRouter()

const { includeWord } = appUtil

const { toastSuccess, toastWarning, toastError, TOAST_MESSAGES } = useAppToast()

const { loadingStates } = useLoadingStates()

const { procesoPam } = usePamStore()

const {
  ruc,
  preclasificacion,
  idDenuncia,
  causaActual,
  hasPropuestaAsignacion,
  causaAsignacion_completarAgruparCausas
} = useCausaAsignacionStore()

const {
  motivoAgrupacion,
  mantenedor_getMotivoAgrupacion,
  mantenedor_getTiposSujetos
} = useMantenedorStore()

const { paginacion: paginacionSujetos, sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

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

const { isFormValid, required, formSubmitted } = useFormValidation({
  formData,
  validationScope: 'form-agrupar-causa'
})

const causaPrincipal = ref()
const idCausaActual = computed(() => causaActual.value?.causa?.idCausa)

const isLoading = reactive({
  completarAgruparCausas: false,
  getSujetos: false,
  dataMantenedor: false,
  eliminarCausaRelacionada: false
})

const isSomethingLoading = computed(() => {
  return loadingStates.getCausasRelacionadas ||
    loadingStates.guardarCausasRelacionadas ||
    isLoading.completarAgruparCausas ||
    isLoading.getSujetos ||
    isLoading.dataMantenedor
})

const causasRelacionadasFirst = ref(0)

async function handleConfirmarAgrupacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (!causaPrincipal.value) {
    toastError('Debes seleccionar una causa como principal para proceder con la agrupación')
    return
  }

  // si el formulario es valido, parsear la data y crear el payload
  const payload = {
    // codigoFiscalia: $userDefaultFiscalia.value?.idFiscalia,
    complejidad: causaActual.value?.causa?.complejidad,
    estadoPropuestaAsignacion: 'aprobada', // RECHAZADA?
    idMotivoAgrupacion: formData.motivoDeAgrupacion,
    causas: causasRelacionadas.value.map((c) => {
      return {
        idCausa: c.causaId,
        esPrincipal: c.causaId === causaPrincipal.value.causaId
      }
    }),
    comentario: formData.comentario,
    idDenuncia: idDenuncia.value,
    ruc: ruc.value
  }

  // mostrar modal de confirmacion de agrupacion
  const dialogRef = launchDynamicDialog({
    component: ModalConfirmacionAgrupacion,
    header: 'Confirmar Agrupación',
    width: '42%',
    data: {
      causas: causasRelacionadas.value.map((c) => {
        return {
          idCausa: c.causaId,
          esPrincipal: c.causaId === causaPrincipal.value.causaId,
          ruc: c.ruc
        }
      }),
      ruc: ruc.value,
      numeroIntervinientes: numeroIntervinientes.value
    },
    templates: {
      footer: () => {
        return [
          h(Button, { label: 'Cerrar', icon: 'pi pi-times', onClick: () => dialogRef.close() }),
          h(Button, {
            label: 'Confirmar Agrupación',
            icon: 'pi pi-send',
            onClick: () => {
              completarAgruparCausas(payload)
              console.log('🚀 ~ file: AgruparCausa.vue:232 ~ handleConfirmarAgrupacion ~ payload', payload)
              dialogRef.close()
            }
          })
        ]
      }
    }
  })
}

// eslint-disable-next-line no-unused-vars
function completarAgruparCausas (payload) {
  requestUtil({
    action: causaAsignacion_completarAgruparCausas,
    payload: {
      causa: payload,
      idInstanciaTarea: procesoPam.value?.taskId
    },
    loader: (value) => {
      isLoading.completarAgruparCausas = value
    },
    resolve: () => {
      toastSuccess('Causas Agrupadas exitosamente!')

      router.push({ name: 'BandejaAsignacion' })

      causasRelacionadas_SET_DEFAULT_STATE()
    },
    reject: (error) => {
      if (includeWord(error.codigo, 'RGP_BANDEJA_APP_0007')) {
        launchConfirmDialog({
          header: 'Error al Agrupar Causas',
          message: error.mensaje,
          acceptClass: 'hidden',
          rejectLabel: 'Cerrar',
          rejectIcon: ''
        })
      }
      if (includeWord(error.codigo, 'RGP_BANDEJA_BIZ_0014')) {
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

function setPropuestaCausa () {
  const { agruparCausa } = preclasificacion.value
  formData.comentario = agruparCausa?.comentario
  formData.motivoDeAgrupacion = agruparCausa?.idMotivoAgrupacion
}

const numeroIntervinientes = computed(() => {
  const sujetosDuplicidad = causasRelacionadas.value.reduce((prev, curr) => parseInt(curr?.intervinientes?.length || 0) + prev, 0)

  return sujetosDuplicidad + paginacionSujetos.value?.elementosTotales
})

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
    loader: (l) => {
      loadingStates.getCausasRelacionadas = l
    }
  })
}

function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value
    },
    loader: (l) => {
      isLoading.getSujetos = l
    }
  })
}

function getDataMantenedor () {
  requestUtil({
    action: mantenedor_getTiposSujetos,
    loader: (l) => {
      isLoading.dataMantenedor = l
    }
  })
}

onMounted(() => {
  getDataMantenedor()
  getCausasRelacionadas()
  setPropuestaCausa()
  getSujetos()
})
</script>
