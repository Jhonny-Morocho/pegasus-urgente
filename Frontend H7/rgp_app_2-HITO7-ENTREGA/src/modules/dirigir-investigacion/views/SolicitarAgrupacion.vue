<template>
<section>
  <PageHeader
    class="mb-7"
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`RUC: ${ruc}`"
    page-title="Solicitar agrupación"
  />
  <AppForm
    id="id-form-solicitar-agrupacion"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="form-solicitar-agrupacion"
  >
    <AppFieldset legend="Antecedentes de la Causa">
      <ul class="grid list-none m-0">
        <li class="col-12 md:col-6">
          <strong>RUC: </strong>{{ ruc }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Fiscalía Local: </strong>{{ resumenCausa?.nombreFiscaliaLocal }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Nombre Causa: </strong>{{ resumenCausa?.nombreCausa }}
        </li>
        <li class="col-12 md:col-6">
          <strong>Fiscal Asignado: </strong>{{ resumenCausa?.nombreFiscalAsignado }}
        </li>
      </ul>
    </AppFieldset>
    <AppFieldset legend="Solicitud de Agrupación al Fiscal Jefe">
      <TablaAgruparCausas
        :causas-agrupacion="mockCausasAgrupacion"
        class="mb-6"
      />
      <div class="w-full pl-2">
        <p>
          La Causa con RUC <span>{{ ruc }}</span> es la más avanzada. Las otras Causas de la tabla se agruparán a la Causa Principal.
        </p>
        <AppTextarea
          id="motivo-agrupacion"
          v-model="formData.motivoAgrupacion"
          auto-resize
          class="p-fluid mt-4"
          label="Motivo de Agrupación"
          rows="6"
          :rules="{
            required
          }"
        />
      </div>
    </AppFieldset>
  </AppForm>
  <AppBtnsSteps no-button-back />
  <AppBtnRightTeleported>
    <Button
      class="px-5 mr-4 btn-salir"
      icon="pi pi-arrow-left"
      icon-pos="left"
      label="Volver a Revisar Antecedentes de la Causa"
      :loading="isLoading"
      @click="handleBackStep"
    />
  </AppBtnRightTeleported>
  <AppBtnNextTeleported
    class="mr-2"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar Solicitud"
    @click="openModalConfirmacion"
  />
</section>
</template>
<script setup>

import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue'
import { reactive, ref } from 'vue'
import TablaAgruparCausas from '../components/definir-curso-causa/agrupacion/TablaAgruparCausas.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useRouter } from 'vue-router'
import { useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'

const router = useRouter()
const { launchConfirmDialog } = useConfirmDialog()

const { ruc, resumenCausa } = useDirigirInvestigacionStore()
const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const formData = reactive({
  motivoAgrupacion: ''
})
const { required, formSubmitted, isFormValid } = useFormValidation({
  validationScope: 'form-solicitar-agrupacion',
  formData
})

const handleBackStep = () => {
  router.push({ name: 'DIRAResumenCausa' })
}

function openModalConfirmacion () {
  if (!isFormValid()) return
  launchConfirmDialog({
    header: 'Enviar Solicitud de Agrupación ',
    message: `¿Está seguro de querer enviar la solicitud?`,
    accept: () => {
      setTimeout(() => {
        // toastSuccess('¡La consulta ha sido enviada con éxito!')
        router.push({ name: 'BandejaDirigirInvestigacion' })
      }, 369)
    }
  })
}

const mockCausasAgrupacion = ref([
  {
    condicion: '',
    ruc: '11-1',
    rutVictima: '17.764.360-2',
    rutImputado: '16.297.385-1',
    delito: 'Hurto - Hurto 1',
    fiscalia: 'Oriente',
    fiscalAsignado: 'Antonio',
    causaJudicilizada: false,
    tipoCausa: 'Actual'
  },
  {
    condicion: '',
    ruc: '22-2',
    rutVictima: '13.338.454-5',
    rutImputado: '10.764.661-2',
    delito: 'Robo - Robo 2',
    fiscalia: 'Poniente',
    fiscalAsignado: 'Gustavo',
    causaJudicilizada: true,
    tipoCausa: 'Relacionada'
  }
])
</script>
