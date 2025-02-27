<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`Nombre Causa: ${nombreCausa || ''} | RUC: ${ruc}`"
    page-title="Registro de Autorización Telefónica de Medidas Instrusivas o Cautelares"
  />

  <section class="wrapper-routes pt-5">
    <AppFieldset
      legend="Antecedentes de la Causa"
      :loading="isLoadingAntecedentes"
    >
      <ul class="grid list-none m-0">
        <li class="col-12 md:col-6">
          <strong>RUC: </strong>{{ ruc }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Fiscalía Local: </strong>{{ resumenCausa?.fiscalia }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Nombre Causa: </strong>{{ resumenCausa?.nombre }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Fiscal Asignado: </strong>{{ resumenCausa?.fiscalAsignado }}
        </li>
      </ul>
    </AppFieldset>

    <AppFieldset legend="Registro de Autorización">
      <AppForm
        id="registro-autorizacion"
        class="grid w-full m-0"
        :form-submitted="formSubmitted"
        validation-scope="registro-autorizacion"
      >
        <AppMultiSelect
          id="medidas-intrusivas"
          v-model="formData.medidasIntrusivas"
          class="col-12 md:col-4"
          label="Seleccione Medida Intrusiva"
          option-label="descripcion"
          option-value="id"
          :options="medidasIntrusivas"
        />
        <AppMultiSelect
          id="medidas-cautelares"
          v-model="formData.medidasCautelares"
          class="col-12 md:col-4"
          label="Seleccione Medida Cautelare"
          option-label="descripcion"
          option-value="id"
          :options="medidasCautelares"
        />
        <AppCalendar
          id="fecha-hora-registro"
          v-model="formData.fechaHora"
          class="col-12 md:col-4"
          label="Fecha y Hora Registro"
          :rules="{ required }"
        />
        <AppDropdown
          id="tribunal"
          v-model="formData.tribunal"
          class="col-12 md:col-4"
          label="Tribunales"
          option-label="descripcion"
          :options="juzgados"
          :rules="{ required }"
          @change="resetJuezGarantia"
        />
        <AppDropdown
          v-if="formData.tribunal"
          id="juez-garantia"
          v-model="formData.juez"
          class="col-12 md:col-4"
          label="Nombre Juez Garantía"
          option-label="descripcion"
          :options="juecesGarantiaOptions"
          :payload="juezGarantiaPayload"
          :retrieve-data-action="funcionarios_getJuecesByIdTribunal"
          :rules="{ required }"
        />
        <AppDropdown
          id="resultado-autorizacion"
          v-model="formData.resultadoAutorizacion"
          class="col-12 md:col-4"
          label="Resultado de Autorización"
          option-label="descripcion"
          option-value="id"
          :options="resultadosAutorizacion"
          :retrieve-data-action="mantenedor_getListadoResultadoAutorizacion"
          :rules="{ required }"
        />
        <AppTextarea
          id="motivo-urgencia-medida"
          v-model="formData.motivo"
          class="col-12"
          label="Motivo de Urgencia de la Medida"
          rows="4"
          :rules="{ required }"
        />
      </AppForm>
    </AppFieldset>
  </section>

  <AppBtnsSteps
    :button-back-disabled="isLoading"
    @back-step="handleBackStep"
  />
  <AppBtnRightTeleported>
    <Button
      class="px-5 mr-4 btn-salir"
      icon="pi pi-angle-double-right"
      icon-pos="right"
      label="Salir sin Guardar"
      :loading="isLoading"
      @click="handleBackStep"
    />
  </AppBtnRightTeleported>
  <AppBtnNextTeleported
    class="px-5"
    icon="pi pi-save"
    icon-pos="right"
    label="Registrar Autorización"
    :loading="isLoading"
    @click="openModalRegistrarAutorizacion"
  />
</section>
</template>
<script setup>

import { reactive, ref, onMounted, computed } from 'vue'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'
import { useRouter } from 'vue-router'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'
import { useFuncionarios, useMantenedorStore } from '@/modules/global/composables'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const router = useRouter()

const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const { ruc, causa, idDenuncia, dirigirInvestigacion_postRegistrarAutorizacionMedidasIntrusivas } = useDirigirInvestigacionStore()

const { solicitudes_getResumenCausa, resumenCausa } = useSolicitudesStore()

const {
  medidasCautelares,
  mantenedor_getListadoMedidasCautelares,
  medidasIntrusivas,
  mantenedor_getListadoMedidasIntrusivas,
  juzgados,
  mantenedor_getjuzgados,
  resultadosAutorizacion,
  mantenedor_getListadoResultadoAutorizacion
} = useMantenedorStore()

const { juecesPorTribunal, funcionarios_getJuecesByIdTribunal } = useFuncionarios()

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const idCausa = computed(() => causa?.value?.data?.causa?.idCausa)
const nombreCausa = ref('Hurto simple 4 A 40 UTM a Gustavo')
const isLoading = ref(false)

const juecesGarantiaOptions = computed(() => {
  return juecesPorTribunal.value?.map((juez) => {
    return {
      id: juez?.idFuncionario,
      descripcion: `${juez?.nombres} ${juez?.apellidoPaterno} ${juez?.apellidoMaterno ? juez?.apellidoMaterno : ''}`.trim()
    }
  })
})

const juezGarantiaPayload = computed(() => {
  return {
    idTribunal: formData?.tribunal?.id
  }
})

const formData = reactive({
  medidasIntrusivas: [],
  medidasCautelares: [],
  fechaHora: null,
  tribunal: null,
  juez: null,
  resultadoAutorizacion: null,
  motivo: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'registro-autorizacion'
})

function openModalRegistrarAutorizacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  launchConfirmDialog({
    header: 'Registrar la Autorización',
    message: '¿Está seguro de Registrar la Autorización?',
    accept: async () => {
      const autorizacion = {
        ...formData,
        idTribunal: formData.tribunal?.id,
        nombreTribunal: formData.tribunal?.descripcion,
        idJuez: formData.juez?.id,
        nombreJuez: formData.juez?.descripcion,
        resultadoAutorizacion: formData.resultadoAutorizacion
      }

      registrarAutorizacion(autorizacion)
    }
  })
}

async function registrarAutorizacion (autorizacion) {
  requestUtil({
    action: dirigirInvestigacion_postRegistrarAutorizacionMedidasIntrusivas,
    payload: {
      autorizacion: {
        idCausa: idCausa.value,
        idDenuncia: idDenuncia.value,
        idsMedidaCautelar: autorizacion?.medidasCautelares,
        idsMedidaIntrusiva: autorizacion?.medidasIntrusivas,
        idJuezGarantia: autorizacion?.idJuez,
        idResultadoAutorizacion: autorizacion?.resultadoAutorizacion,
        fechaHoraRegistro: autorizacion?.fechaHora,
        motivoUrgencia: autorizacion?.motivo,
        idFiscalia: autorizacion?.idTribunal
      }
    },
    resolve: () => {
      isLoading.value = true
      toastSuccess('El registro ha sido guardado con éxito!')
      setTimeout(() => {
        handleBackStep()
      }, 3000)
    }
  })
}

function handleBackStep () {
  router.push({ name: 'DIDesarrolloInvestigacion' })
}

function resetJuezGarantia () {
  formData.juez = null
}

const isLoadingAntecedentes = ref(false)
async function getAntecedentedCausa () {
  await requestUtil({
    action: solicitudes_getResumenCausa,
    payload: {
      idCausa: idCausa.value
    },
    loader: (l) => { isLoadingAntecedentes.value = l }
  })
}

async function getDataMantenedores () {
  await requestUtil({ action: mantenedor_getListadoMedidasCautelares })
  await requestUtil({ action: mantenedor_getListadoMedidasIntrusivas })
  await requestUtil({ action: mantenedor_getjuzgados })
}

onMounted(() => {
  getDataMantenedores()
  getAntecedentedCausa()
})
</script>

<style lang="scss" scoped>
.btn-salir {
  background-color: $primary-color;
  transition: all 0.5s ease;
  &:hover {
    background-color: $primary-color-hover !important;
  }
}
</style>
