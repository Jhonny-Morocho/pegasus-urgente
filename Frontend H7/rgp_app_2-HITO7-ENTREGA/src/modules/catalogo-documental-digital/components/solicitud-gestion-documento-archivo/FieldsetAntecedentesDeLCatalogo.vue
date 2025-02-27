<template>
<section>
  <AppFieldset
    class="p-fluid my-0 py-1"
    v-bind="$attrs"
  >
    <AppForm
      id="creacionSolicitud"
      class="col-12"
      :form-submitted="formSubmitted"
      validation-scope="formCreacionSolicitud"
    >
      <div class="col-12 md:col-12 p-fluid">
        <div class="grid formgrid flex justify-content-start">
          <div class="col-4">
            <AppDropdown
              id="tipoCatalogo"
              v-model="formData.tipoCatalogo"
              label="Tipo Catálogo"
              option-label="nombre"
              option-value="id"
              :options="tipoCatalogo"
              :rules="{ required }"
            />
          </div>
          <div class="col-4">
            <AppInput
              id="value"
              v-model="formData.nombreCatalogo"
              label="RUC/Denuncia/Folio/Archivador"
              :rules="{ required }"
            />
          </div>
        </div>
      </div>
    </AppForm>
  </AppFieldset>
  <div
    class="grid formgrid pt-4 pb-4 flex align-items-center justify-content-end mr-0"
  >
    <div class="col-2">
      <Button
        class="p-button-outlined px-6"
        icon="pi pi-window-maximize"
        icon-pos="right"
        label="Búsqueda Avanzada"
        @click="handleBusquedaAvanzada()"
      />
    </div>
    <div class="col-3 pl-7">
      <Button
        class="p-button-outlined w-full"
        icon="pi pi-search"
        icon-pos="right"
        label="Buscar"
        @click="handleSearchCatalogo()"
      />
    </div>
  </div>
</section>
</template>

<script setup>
// COMPONENTS
import ModalBusquedaAvanzada from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/modal/BusquedaAvanzada'

// UTILS
import { useRoute } from 'vue-router'
import { onMounted, defineExpose, reactive, defineEmits, defineProps, watch, ref } from 'vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { useFormValidation, useAppToast, useAppDialog } from '@/modules/common/composables'
import { useCreacionYGestionDeCDD, useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'

const { launchDialog } = useAppDialog()
const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()
const { tipoCatalogo, mantenedorCDD_getTipoCatalogo } = useMantenedorCDD()
const { creacionYGestionDeCDD_buscarCatalogoByNombre, creacionYGestionDeCDD_SET_DEFAULT_STATE } = useCreacionYGestionDeCDD()

// VALUES
const route = useRoute()
const disponibleValue = ref(false)
const emit = defineEmits(['isShowResult', 'isLoadingTable'])

const formData = reactive({
  tipoCatalogo: '',
  nombreCatalogo: ''
})

const props = defineProps({
  obtenerData: Boolean
})

// LOGIC
onMounted(async () => {
  requestUtil({ action: mantenedorCDD_getTipoCatalogo })
})

watch(
  () => props.obtenerData,
  () => {
    if (props.obtenerData) {
      handleSearchCatalogo()
    }
  }
)

const { formSubmitted, required, isFormValid, resetFormData } =
  useFormValidation({
    formData,
    validationScope: 'formCreacionSolicitud'
  })

function handleBusquedaAvanzada () {
  launchDialog({
    component: ModalBusquedaAvanzada,
    header: 'Búsqueda Avanzada',
    width: '70%',
    confirmLabel: 'Confirmar selección',
    cancelLabel: 'Cancelar',
    confirmIcon: '',
    confirmIconPos: ''
  })
}

const tablaDocumentos = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})

function handleSearchCatalogo () {
  console.log(route.path)
  emit('isLoadingTable', true)
  creacionYGestionDeCDD_SET_DEFAULT_STATE()
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  if (route.path.includes('solicitud-eliminacion')) {
    disponibleValue.value = true
  }

  requestUtil({
    action: creacionYGestionDeCDD_buscarCatalogoByNombre,
    payload: {
      payload: {
        ...formData,
        disponibleFisico: disponibleValue.value
      },
      params: {
        search: tablaDocumentos?.filters?.buscador?.trim().length
          ? tablaDocumentos.filters.buscador
          : undefined,
        page: tablaDocumentos?.page || 0,
        size: tablaDocumentos?.rows || 10

      }
    },
    resolve: () => {
      emit('isLoadingTable', false)
      emit('isShowResult', true)
      toastSuccess('Se encontró el catálogo exitosamente')
    },
    reject: () => {
      emit('isLoadingTable', false)
      emit('isShowResult', false)
      toastError(
        `No se encontró el catálogo ${formData.nombreCatalogo} en la búsqueda`
      )
    }
  })
}

defineExpose({ formData, isFormValid, resetFormData })
</script>
