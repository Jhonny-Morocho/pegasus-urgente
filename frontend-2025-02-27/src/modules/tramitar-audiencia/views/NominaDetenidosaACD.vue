<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Preparar ACD y listado de detenidos"
/>
<section class="my-6">
  <TablaNominaDetenidos ref="refTablaNominaDetenidos" />

  <FormSujetosIntervinientes
    class="col-12"
    :form-submitted="formSubmitted"
    :is-collapsed="isCollapsed"
    :is-editando="isEditando"
    :loading-button="loading.addButton"
    :reset-form-data="resetFormData"
    :validation-scope="sujetosIntervinientesValidationScope"
    @agregar-interviniente="agregarInterviniente"
    @cancelar-edicion="cancelarEdicion"
    @handle-submit-form="handleSubmitForm"
    @reset-form-data="resetFormData"
  />

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      icon="pi pi-save"
      icon-pos="right"
      label="Confirmar Nómina"
      @click="confirmarNomina"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import FormSujetosIntervinientes from '@/modules/tramitar-audiencia/components/FormSujetosIntervinientes.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaNominaDetenidos from '@/modules/tramitar-audiencia/components/TablaNominaDetenidos.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import { reactive, ref, provide } from 'vue-demi'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import { useTramitarAudiencia } from '../composables'
import { useMenuSuperior } from '@/modules/tramitar-audiencia/composables'
import { useSujetosIntervinientesProvide } from '@/modules/global/composables'
import { appUtil, requestUtil } from '@/utils'

const router = useRouter()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastWarning } = useAppToast()
const { formData, sujetosIntervinientesValidationScope } = useSujetosIntervinientesProvide()
provide(sujetosIntervinientesValidationScope, formData)

function handleBackStep () {
  router.push({ name: 'TABandejaTramitarAudiencia' })
}

const isCollapsed = ref(true)
const isEditando = ref(false)

const loading = reactive({
  addButton: false
})

function agregarInterviniente () {
  isEditando.value = false
  isCollapsed.value = !isCollapsed.value
  setTimeout(() => {
    appUtil.scrollTo(260)
  }, 100)
}

function cancelarEdicion () {
  resetFormData()
  isEditando.value = false
  isCollapsed.value = true
}

function handleSubmitForm (data) {
  if (!isFormValid()) return
  toastSuccess('Imputado agregado a la Nómina')
  console.log(data)
  requestUtil({
    action: tramitarAudiencia_addNuevoDetenidoACD,
    payload: { ...formData }
  })
}

const {
  ruc,
  resumenCausa,
  tramitarAudiencia_addNuevoDetenidoACD
} = useTramitarAudiencia()

const { itemsMenuSuperior } = useMenuSuperior({ ruc })

const { isFormValid, formSubmitted, resetFormData } = useFormValidation({ formData, validationScope: sujetosIntervinientesValidationScope })

/* === AGREGAR DETENIDO  === */
const refTablaNominaDetenidos = ref(false)

/* === NÓMINA IMPUTADOS === */
async function confirmarNomina () {
  if (!isFormValid()) {
    toastWarning('Hay campos sin rellenar')
    return
  }

  launchConfirmDialog({
    header: 'Confirmar Nómina ACD',
    message: '¿Estás seguro de Confirmar Nómina ACD?',
    accept: () => {
      toastSuccess('Nómina Confirmada')
      setTimeout(() => {
        router.push({ name: 'TABandejaTramitarAudiencia' })
      }, 400)
    }
  })
}
</script>
