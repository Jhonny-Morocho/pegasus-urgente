<template>
<div>
  <AppForm
    id="medidascautelares"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="medidascautelares"
  >
    <div class="grid px-1">
      <AppDropdown
        id="imputado"
        v-model="formData.imputado"
        class="col-12 md:col-6 lg:col-3 p-inputtext-sm"
        label="Seleccione Imputado"
        option-label="nombreCompletoImputado"
        option-value="idRelacionImputado"
        :options="relacionesSeleccionadas"
        :rules="{ required }"
        show-clear
      />
      <AppDropdown
        id="medida-cautelar"
        v-model="formData.medidaCautelar"
        class="col-12 md:col-6 lg:col-3"
        :label="
          isIntrusiva
            ? 'Seleccione Medida Intrusiva'
            : 'Seleccione Medida Cautelar'
        "
        option-label="descripcion"
        option-value="id"
        :options="medidasCautelares"
        :retrieve-data-action="mantenedor_getListadoMedidasCautelares"
        :rules="{ required }"
        show-clear
      />
      <AppInput
        id="descripcion-medida-cautelar"
        v-model="formData.descripcion"
        class="col-12 lg:col-6"
        :label="
          isIntrusiva
            ? 'Descripción Medida Intrusiva'
            : 'Descripción Medida Cautelar'
        "
        :rules="{ required }"
      />
      <div class="col-12 md:col-6 md:col-offset-3 lg:col-3 lg:col-offset-9">
        <Button
          class="btn-aprobar"
          icon="pi pi-save"
          icon-pos="right"
          :label="
            isIntrusiva
              ? 'Agregar Medida Instrusiva'
              : 'Agregar Medida Cautelar'
          "
          :loading="loadingState"
          @click="agregarMedida()"
        />
      </div>
    </div>
  </AppForm>

  <div>
    <h3 class="mt-4 pl-2">
      Medida{{ isIntrusiva ? "s" : "" }}
      {{ isIntrusiva ? "Intrusivas" : "Cautelar" }} a Solicitar:
    </h3>
    <AppDataTable
      class="w-full mt-4"
      :loading="loadingState"
      :rows="paginacionRelacionesConMedidas?.tamanoPagina"
      :total-records="paginacionRelacionesConMedidas?.elementosTotales"
      :value="relacionesConMedidas"
      @eliminar-sujeto="eliminarMedida"
      @page="getMedidasSolicitar"
    >
      <Column :header="isIntrusiva ? 'Medida Intrusiva' : 'Medida Cautelar'">
        <template #body="{ data }">
          {{
            mantenedor_getDescripcionMedidasCautelaresById(data.idMedida) ??
              "Sin Información"
          }}
        </template>
      </Column>
      <Column header="Imputado">
        <template #body="{ data }">
          {{ data?.nombreCompletoImputado ?? "Sin Información" }}
        </template>
      </Column>
      <Column
        :header="
          isIntrusiva
            ? ' Descripción Medida Intrusiva'
            : 'Descripción Medida Cautelar'
        "
      >
        <template #body="{ data }">
          {{ data?.descripcion ?? "Sin Información" }}
        </template>
      </Column>
      <Column
        class="text-center"
        header="Acciones"
        style="width: 79px"
      >
        <template #body="{ data }">
          <Button
            class="p-button-rounded p-button-outlined p-button-danger"
            icon="pi pi-trash"
            @click="eliminarMedidaLocal(data)"
          />
        </template>
      </Column>
    </AppDataTable>
  </div>
</div>
</template>

<script setup>
import { reactive, ref, defineProps, onMounted } from 'vue'

// composables
import {
  useMantenedorStore,
  useRelacionesStore
} from '@/modules/global/composables'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useSolicitudesStore } from '../../composables'

// utils
import { requestUtil } from '@/utils'

const { toastError, toastSuccess, TOAST_MESSAGES } = useAppToast()

const {
  medidasCautelares,
  mantenedor_getTipoMedida,
  mantenedor_getEstadoMedidaHito,
  mantenedor_getListadoMedidasCautelares,
  mantenedor_getDescripcionMedidasCautelaresById
} = useMantenedorStore()

const {
  relacionesConMedidas,
  paginacionRelacionesConMedidas,
  relaciones_deleteMedidaCautelar,
  relaciones_postAgregarMedidaCautelar,
  relaciones_getRelacionesConMedidasCautelares
} = useRelacionesStore()

const { idDenuncia, relacionesSeleccionadas } = useSolicitudesStore()

const { launchConfirmDialog } = useConfirmDialog()

defineProps({
  isIntrusiva: Boolean
})

const firstRecord = ref(0)
const loadingState = ref(false)

const formData = reactive({
  imputado: null,
  medidaCautelar: null,
  descripcion: ''
})

const { required, isFormValid, formSubmitted, resetFormData } =
  useFormValidation({
    formData,
    validationScope: 'medidascautelares'
  })

onMounted(() => {
  getMantenedor().then(() => {
    getMedidasSolicitar()
  })
})

const getMantenedor = () => {
  const promiseArray = []
  promiseArray.push(requestUtil({ action: mantenedor_getTipoMedida }))
  promiseArray.push(requestUtil({ action: mantenedor_getEstadoMedidaHito }))
  return Promise.all(promiseArray)
}

function agregarMedida () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  postMedidas({ ...formData })
}

function postMedidas (data) {
  loadingState.value = true
  const { imputado, medidaCautelar, descripcion } = data
  requestUtil({
    action: relaciones_postAgregarMedidaCautelar,
    payload: {
      codEstado: '0', // CODIGO 0:  A Solicitar
      idRelacionSujeto: imputado, // idRelacionImputado
      codTipoMedida: 'MEDIDAS_CAUTELAR',
      idMedida: medidaCautelar, // el id de la medida cautelar seleccionada
      descripcion: descripcion // lo escrito en el campo descripcion del formulario
    },
    resolve: () => {
      toastSuccess('La Medida Cautelar ha sido ingresada con éxito')
      getMedidasSolicitar()
    },
    reject: () => {
      toastError('Ocurrió un error al agregar la Medida Cautelar')
      loadingState.value = false
    }
  })
}

function getMedidasSolicitar (pagination = undefined) {
  loadingState.value = true
  // Atentos si cambia el campo código de tipoMedida y finalmente le colocan un número
  // tipoMedidaId.value = tipoMedida?.value.find(
  //   (m) => m.codigo === 'MEDIDAS_CAUTELAR'
  // ).id

  const idsRelacionesImputados = relacionesSeleccionadas.value.map(
    ({ idRelacionImputado }) => idRelacionImputado
  )

  if (!pagination) {
    firstRecord.value = 0
  }

  requestUtil({
    action: relaciones_getRelacionesConMedidasCautelares,
    payload: {
      params: {
        'id-denuncia': idDenuncia.value,
        'cod-tipo-medida': 'MEDIDAS_CAUTELAR',
        'cod-estados': 0, // CODIGO 0: A Solicitar
        'id-relaciones': idsRelacionesImputados.join(','), // acepta uno o varios ids separados por comas
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (l) => {
      loadingState.value = l
    },
    resolve: () => {
      resetFormData()
      if (relacionesSeleccionadas.value?.length === 1) {
        formData.imputado = relacionesSeleccionadas.value[0].idRelacionImputado
      }
    },
    reject: () =>
      toastError(
        'Ocurrió un error al cargar la tabla Medida Cautelar a Solicitar'
      )
  })
}

function eliminarMedidaLocal (data) {
  launchConfirmDialog({
    message: `¿Estás seguro(a) de eliminar esta medida cautelar?`,
    accept: async () => {
      loadingState.value = true
      requestUtil({
        action: relaciones_deleteMedidaCautelar,
        payload: { idMedida: data.id },
        resolve: () => {
          getMedidasSolicitar()
        }
      })
    },
    reject: () => {
      loadingState.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.btn-aprobar {
  background-color: $primary-color;
  transition: all 0.5s ease;
  &:hover {
    background-color: $primary-color-hover !important;
  }
}
</style>
