<template>
<section>
  <AppForm
    id="buscar-duplicidad"
    class="mb-2"
    :form-submitted="formSubmitted"
    validation-scope="CausasRelacionadas"
  >
    <AppFieldset
      class="mt-4"
      legend="Busqueda Causas Relacionadas"
    >
      <DatosBusquedaSimple
        ref="refDatosBusquedaSimple"
        class="col-12"
      />
      <DatosBusquedaAvanzada
        ref="refDatosBusquedaAvanzada"
        class="col-12"
      />
    </AppFieldset>
    <div class="grid mx-2 md:mx-0 lg:mx-2">
      <div
        :class="[showFiltrarCampos ? 'col-12 md:col-4 lg:col-3' : 'col-12 md:col-6 lg:col-4']"
      >
        <p class="mb-2 pl-2">
          Tipo de Búsqueda
        </p>
        <AppSelectButton
          id="es-vinculante"
          v-model="esVinculante"
          class=""
          option-label="name"
          option-value="opt"
          :options="[
            { name: 'Parcial', opt: 'parcial' },
            { name: 'Total', opt: 'total' },
          ]"
        />
      </div>
      <div
        v-if="showFiltrarCampos"
        class="col-12 md:col-4 lg:col-3 lg:col-offset-2 md:flex md:justify-content-center lg:justify-content-end mt-auto"
      >
        <Button
          id="btn-limpiar-campos"
          class="btn-fileupload md:mb-3 md:w-auto"
          icon="pi pi-filter-slash"
          icon-pos="right"
          label="Limpiar campos"
          @click="limpiarFiltros"
        />
      </div>
      <div :class="[showFiltrarCampos ? 'col-12 md:col-4 mt-auto' : 'col-12 md:col-6 lg:col-4 lg:col-offset-4 mt-auto']">
        <Button
          id="btn-buscar-duplicidad"
          class="btn-form md:mb-3"
          icon="pi pi-search"
          icon-pos="right"
          label="Buscar Causas Relacionadas"
          @click="buscarCausasRelacionadas"
        />
      </div>
    </div>
  </AppForm>

  <AppFieldset
    v-if="true"
    class="mb-6"
    legend="Causas Candidatas a Duplicidad"
  >
    <TablaCausasRelacionadas
      v-model:selection="causasSeleccionadas"
      :total-records="causasRelacionadas.length"
      :value="causasRelacionadas"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { reactive, ref, defineExpose, onMounted } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useFormValidation, useAppToast } from '@/modules/common/composables'
import { useCausasRelacionadasStore } from '@/modules/preclasificador/composables'
import DatosBusquedaSimple from '@/modules/global/components/buscar-duplicidad/BuscarDuplicidadDatosBusquedaSimple.vue'
import DatosBusquedaAvanzada from '@/modules/global/components/buscar-duplicidad/BuscarDuplicidadDatosBusquedaAvanzada.vue'
import TablaCausasRelacionadas from '@/modules/dirigir-investigacion/components/TablaCausasRelacionadas.vue'

const showFiltrarCampos = ref(false)

const {
  causasRelacionadas,
  causasRelacionadas_buscarCausasRelacionadas,
  causasRelacionadas_SET_CAUSAS_RELACIONADAS
} = useCausasRelacionadasStore()

const causasSeleccionadas = ref([])

const { toastError, toastWarning } = useAppToast()

const formBuscarDuplicidad = reactive({})
const esVinculante = ref('parcial')

const refDatosBusquedaSimple = ref(null)
const refDatosBusquedaAvanzada = ref(null)

function limpiarFiltros () {
  showFiltrarCampos.value = false
  refDatosBusquedaSimple.value.resetForm()
  refDatosBusquedaAvanzada.value.resetForm()
}

const { formSubmitted, isFormValid } = useFormValidation({
  formData: formBuscarDuplicidad,
  validationScope: 'formBuscarDuplicidad'
})

function tieneAlMenosUnCampo (simple, avanzada) {
  // eslint-disable-next-line eqeqeq
  return Boolean(Object.values(simple).concat(Object.values(avanzada)).find(f => f != ''))
}

function buscarCausasRelacionadas () {
  const datosBusquedaSimple = refDatosBusquedaSimple.value.formData
  const datosBusquedaAvanzada = refDatosBusquedaAvanzada.value.formData

  if (!tieneAlMenosUnCampo(datosBusquedaSimple, datosBusquedaAvanzada) || !isFormValid()) {
    toastError(
      'Para buscar causas relacionadas, debe ingresar al menos un valor',
      2000
    )
    return
  }

  const formDataBuscarDuplicidad = {
    tipoDocumentoDenunciante: datosBusquedaAvanzada.tipoDocumentoDenunciante,
    rutDenunciante: datosBusquedaAvanzada.numeroDocumentoDenunciante,
    nombreDenunciante: datosBusquedaAvanzada.nombreDenunciante.toUpperCase(),

    tipoDocumentoVictima: datosBusquedaAvanzada.tipoDocumentoVictima,
    rutVictima: datosBusquedaAvanzada.numeroDocumentoVictima,
    nombreVictima: datosBusquedaSimple.nombreVictima.toUpperCase(),

    tipoDocumentoImputado: datosBusquedaAvanzada.tipoDocumentoImputado,
    rutImputado: datosBusquedaAvanzada.numeroDocumentoImputado,
    nombreImputado: datosBusquedaSimple.nombreImputado.toUpperCase(),

    numeroDenuncia: datosBusquedaAvanzada.numeroDenuncia,
    fechaDenuncia: datosBusquedaSimple.fechaDelito
      ? dateTimeUtil.formatToBackendWithTime(datosBusquedaSimple.fechaDelito)
      : null,
    unidadPolicial: datosBusquedaAvanzada.unidadPolicial,

    delito: datosBusquedaSimple.delito,
    fechaHoraDelito: datosBusquedaAvanzada.fechaHoraDenunciaDesde
      ? dateTimeUtil.formatToBackendWithTime(
        datosBusquedaAvanzada.fechaHoraDenunciaDesde
      )
      : null,
    palabraClave: datosBusquedaAvanzada.palabrasClave.toUpperCase(),

    region: datosBusquedaAvanzada.region,
    comuna: datosBusquedaAvanzada.comuna,
    calle: datosBusquedaAvanzada.calle,
    numeroCalle: datosBusquedaAvanzada.numero,

    tipoConsulta: esVinculante.value,

    relato: datosBusquedaAvanzada.palabrasClave.toUpperCase()
  }

  const parseParams = {
    page: 0,
    size: 100,
    nombreVictima: formDataBuscarDuplicidad?.nombreVictima,
    nombreImputado: formDataBuscarDuplicidad?.nombreImputado,
    nombreDenunciante: formDataBuscarDuplicidad?.nombreDenunciante,
    nDocumentoVictima: formDataBuscarDuplicidad?.rutVictima,
    nDocumentoImputado: formDataBuscarDuplicidad?.rutImputado,
    nDocumentoDenunciante: formDataBuscarDuplicidad?.rutDenunciante,
    tipoBusqueda: formDataBuscarDuplicidad?.tipoConsulta,
    palabraClaveRelato: formDataBuscarDuplicidad?.relato,
    fechaDelito: formDataBuscarDuplicidad?.fechaDenuncia,
    delitoID: formDataBuscarDuplicidad?.delito,
    tipoDocumentoVictima: formDataBuscarDuplicidad?.tipoDocumentoVictima,
    tipoDocumentoImputado: formDataBuscarDuplicidad?.tipoDocumentoImputado,
    tipoDocumentoDenunciante: formDataBuscarDuplicidad?.tipoDocumentoDenunciante
  }

  requestUtil({
    action: causasRelacionadas_buscarCausasRelacionadas,
    payload: parseParams,
    resolve: (data) => {
      console.log(data)
      if (data?.data.length > 0) {
        showFiltrarCampos.value = false
        toastWarning('Se encontraron posibles Causas Relacionadas')
      } else {
        showFiltrarCampos.value = true
        toastWarning('No se encontraron posibles Causas Relacionadas')
      }
    },
    reject: (err) => {
      toastError('Se ha producido un error al buscar las causas relacionadas')
      console.log(err)
    }
  })
}

function retrieveData (retrieve) {
  if (causasSeleccionadas.value?.length <= 0) {
    toastWarning('No selecciono ninguna causa')
    return
  }

  retrieve?.(causasSeleccionadas.value)
}

defineExpose({ retrieveData })

onMounted(() => {
  // limpiar arreglo de causas al abrir el modal
  causasRelacionadas_SET_CAUSAS_RELACIONADAS([])
})
</script>
