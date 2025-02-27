<template>
<hr>
<main class="px-3 pt-3">
  <AppFieldset legend="Seleccionar Solicitud">
    <AppForm
      id="form-selector-solicitud"
      class="w-full"
      :form-submitted="formSubmitted"
      validation-scope="form-selector-solicitud"
    >
      <section class="w-full formgrid grid">
        <AppDropdown
          v-if="props.isCitacionComunicacion"
          id="tipo-actividad"
          v-model="formData.idTipoActividad"
          class="col-12 md:col-4"
          label="Seleccionar Solicitud"
          :loading="isLoading.getTiposActividad"
          option-label="descripcion"
          option-value="id"
          :options="tiposActividadCitacion"
          :rules="{ required }"
          show-clear
          @change="getSubtiposActividad"
        />
        <AppDropdown
          v-if="formData.idTipoActividad || !props.isCitacionComunicacion"
          id="subtipo-actividad"
          v-model="formData.subtipoActividad"
          class="col-12 md:col-4"
          :label="labelSubtipoActividad"
          :loading="
            isLoading.getTiposActividad || isLoading.getSubtiposActividad
          "
          option-label="descripcion"
          :options="actividadesSubtipo"
          :rules="{ required }"
          show-clear
          @change="getSubSubtiposActividad"
        />
        <AppDropdown
          v-if="formData.subtipoActividad?.isParent"
          id="sub-subtipo-actividad"
          v-model="formData.idSubSubtipoActividad"
          class="col-12 md:col-4"
          :label="labelSubSubtipoActividad"
          :loading="isLoading.getSubSubtiposActividad"
          option-label="descripcion"
          option-value="id"
          :options="actividadesSubSubtipo"
          :rules="{ required }"
          show-clear
          @change="handleAtributosLastLevel"
        />
        <AppDropdown
          v-if="!isEmpty(atributos.hasDropdownDiligencias)"
          id="tipo-diligencia"
          v-model="formData.idTipoDiligencia"
          class="col-12 md:col-8"
          label="Tipo Diligencia"
          option-label="descripcion"
          option-value="id"
          :options="tiposAutorizacionDiligencia"
          :retrieve-data-action="mantenedor_getTiposAutorizacionDiligencia"
          :rules="{ required }"
          show-clear
        />
        <AppCalendar
          v-if="!isEmpty(atributos.hasFecha)"
          id="fecha-solicitud"
          v-model="formData.fechaSolicitud"
          class="col-12 md:col-4"
          label="Fecha"
          :rules="{ required }"
        />
      </section>
      <section class="w-full formgrid grid mt-2">
        <div
          v-show="!isEmpty(atributos.hasReservada)"
          class="col-12 md:col-4"
        >
          <h4 class="w-full">
            ¿Es Reservada?
          </h4>
          <AppSelectButton
            id="es-reservada"
            v-model="formData.esReservada"
            class="w-full"
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false },
            ]"
          />
        </div>
        <div
          v-show="!hasUrgente"
          class="col-12 md:col-4"
        >
          <h4 class="w-full">
            ¿Es Urgente?
          </h4>
          <AppSelectButton
            id="es-urgente"
            v-model="formData.esUrgente"
            class="w-full"
            disabled
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false },
            ]"
          />
        </div>
      </section>
    </AppForm>
  </AppFieldset>
  <section class="flex flex-row-reverse gap-3 w-full">
    <Button
      class="p-button-primary px-4"
      icon="pi pi-angle-double-right"
      icon-pos="right"
      label="Continuar"
      :loading="isSomethingLoading"
      @click="handleContinuar"
    />
    <Button
      class="p-button-text px-4"
      icon="pi pi-times"
      label="Cancelar"
      @click="handleCancelar"
    />
  </section>
</main>
</template>

<script setup>
import { reactive, inject, computed, onMounted } from 'vue'
import { isEmpty } from 'lodash'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'

const dialogRef = inject('dialogRef')

const props = reactive({
  idProceso: dialogRef.value?.data?.idProceso,
  isCitacionComunicacion: dialogRef.value?.data?.isCitacionComunicacion
})

const { TOAST_MESSAGES, toastError } = useAppToast()

const {
  tiposActividad,
  actividadesSubtipo,
  actividadesSubSubtipo,
  tiposAutorizacionDiligencia,
  mantenedor_getTiposActividad,
  mantenedor_getActividadHijo,
  mantenedor_getAtributos,
  mantenedor_getTiposAutorizacionDiligencia,
  mantenedor_RESET_ATRIBUTOS
} = useMantenedorStore()

const { atributos } = useSolicitudesStore()

const formData = reactive({
  idTipoActividad: null,
  subtipoActividad: null,
  idSubSubtipoActividad: null,
  esReservada: null,
  esUrgente: null,
  fechaSolicitud: null,
  idTipoDiligencia: null
})

const hasUrgente = computed(() => isEmpty(atributos.hasUrgente))

const { formSubmitted, required, resetFormData, isFormValid } =
  useFormValidation({
    formData,
    validationScope: 'form-selector-solicitud'
  })

// CODIGO 7: CITACIONES | CODIGO 17: COMUNICACIONES
const tiposActividadCitacion = computed(() =>
  tiposActividad.value?.filter(
    (actividad) => actividad.codigo === '7' || actividad.codigo === '17'
  )
)

// CODIGO 24: SOLICITUDES
const tipoActividadOtros = computed(() =>
  tiposActividad.value?.find((actividad) => actividad.codigo === '24')
)

const isLoading = reactive({
  getTiposActividad: false,
  getSubtiposActividad: false,
  getSubSubtiposActividad: false,
  getAtributos: false
})

const isSomethingLoading = computed(() => {
  const loadingStates = Object.values(isLoading)
  return loadingStates.some((loading) => loading)
})

const labelSubtipoActividad = computed(() =>
  props?.isCitacionComunicacion
    ? 'Seleccionar Modalidad'
    : 'Seleccionar Solicitud'
)

const labelSubSubtipoActividad = computed(() =>
  props?.isCitacionComunicacion ? 'Seleccionar Glosa' : 'Seleccionar Solicitud'
)

function getActividadHijo ({ loader, idActividad, isSubSubtipo }) {
  requestUtil({
    action: mantenedor_getActividadHijo,
    loader,
    payload: {
      idCausaProceso: props.idProceso,
      idActividad: idActividad,
      subsubtipo: isSubSubtipo
    }
  })
}

async function getAtributos ({ idActividad }) {
  await requestUtil({
    action: mantenedor_getAtributos,
    payload: {
      idActividad: idActividad
    },
    loader: (l) => {
      isLoading.getAtributos = l
    }
  })

  formData.esUrgente = !!parseInt(atributos.hasUrgente?.valorDefecto)
}

function getTiposActividad () {
  resetFormData()

  requestUtil({
    action: mantenedor_getTiposActividad,
    loader: (l) => {
      isLoading.getTiposActividad = l
    },
    resolve: () => {
      if (!props.isCitacionComunicacion) {
        formData.idTipoActividad = tipoActividadOtros.value?.id
        getSubtiposActividad()
      }
    }
  })
}

function getSubtiposActividad () {
  mantenedor_RESET_ATRIBUTOS()

  formData.subtipoActividad = null
  formData.idSubSubtipoActividad = null

  if (!formData.idTipoActividad) return

  getActividadHijo({
    loader: (l) => {
      isLoading.getSubtiposActividad = l
    },
    idActividad: formData.idTipoActividad
  })
}

function getSubSubtiposActividad () {
  mantenedor_RESET_ATRIBUTOS()

  formData.idSubSubtipoActividad = null

  if (!formData.subtipoActividad) return

  if (!formData.subtipoActividad?.isParent) {
    getAtributos({
      idActividad: formData.subtipoActividad?.id
    })

    return
  }

  getActividadHijo({
    loader: (l) => {
      isLoading.getSubSubtiposActividad = l
    },
    idActividad: formData.subtipoActividad?.id,
    isSubSubtipo: true
  })
}

function handleAtributosLastLevel () {
  mantenedor_RESET_ATRIBUTOS()

  if (!formData.idSubSubtipoActividad) return

  getAtributos({
    idActividad: formData.idSubSubtipoActividad
  })
}

function handleContinuar () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  const data = {
    ...formData,
    selectorSubTipo: formData.subtipoActividad?.id,
    selectorSubSubTipo: formData.idSubSubtipoActividad,
    fromSelector: !props.isCitacionComunicacion
  }

  dialogRef.value.close(data)
}

function handleCancelar () {
  resetFormData()
  dialogRef.value.close()
}

onMounted(() => {
  mantenedor_RESET_ATRIBUTOS()
  getTiposActividad()
})
</script>
