<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-title="Vista de Audiencia de Formalización"
/>
<section>
  <AppFieldset
    class="pb-3 mt-4"
    legend="Identificación de la Causa"
  >
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>RUC: </strong>{{ resumenCausa?.ruc }}</p>
      <p><strong>Nombre Causa: </strong>{{ resumenCausa?.nombreCausa }}</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Fiscalia: </strong>Casablanca</p>
      <p><strong>Fiscal Asignado: </strong>{{ resumenCausa?.fiscalPropuesto }}</p>
    </div>
    <div class="col-12 md:col-6 lg:col-4 pl-4">
      <p><strong>Estado de la Causa: </strong>Vigente</p>
      <p><strong>Etapa de la Causa: </strong>Tramitación</p>
    </div>
  </AppFieldset>
  <section class="flex justify-content-center mb-4">
    <TabMenu :model="tabsRevisarAntecedentes" />
  </section>

  <AppBtnsSteps @back-step="salirSinGuardar" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5 mr-6"
      icon="pi pi-save"
      icon-pos="right"
      label="Guardar"
      @click="guardar"
    />
    <Button
      class="btn-primary px-5"
      icon="pi pi-send"
      icon-pos="right"
      label="Guardar y Finalizar"
      @click="guardarYFinalizar"
    />
  </AppBtnRightTeleported>

  <div class="wrapper-routes">
    <RouterView />
  </div>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import { ref } from 'vue'
import { useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { useRouter } from 'vue-router'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { requestUtil } from '@/utils'

const router = useRouter()

const { resumenCausa } = useTramitarAudiencia()

const baseUrl = '/tramitar-audiencia/vista-audiencia'

const tabsRevisarAntecedentes = ref([
  { label: 'Minuta de Audiencia', to: `${baseUrl}/minuta-audiencia` },
  { label: 'Antecedentes de la Causa', to: `${baseUrl}/antecedentes-causa` },
  { label: 'Diligencias', to: `${baseUrl}/diligencias` },
  { label: 'Documentos', to: `${baseUrl}/documentos` },
  { label: 'Historial', to: `${baseUrl}/historial` },
  { label: 'Registro de Audiencia', to: `${baseUrl}/registro-audiencia` }
])

const itemsMenuSuperior = ref([
  {
    label: 'Procesos Transversales',
    icon: 'pi pi-building',
    disabled: () => false,
    items: []
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',
    disabled: () => false,
    items: []
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => router.go()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    disabled: () => true
  }
])

/* --- Guardar --- */

const { ruc, tramitarAudiencia_postRegistroAudiencia } = useTramitarAudiencia()

const { launchConfirmDialog } = useConfirmDialog()

const { toastSuccess } = useAppToast()

function salirSinGuardar () {
  launchConfirmDialog({
    header: 'Registro de Audiencia',
    message: 'Se encuentra por salir sin guardar los cambios',
    acceptLabel: 'Salir',
    accept: () => {
      router.push({ name: 'TABandejaTramitarAudiencia' })
    }
  })
}

async function guardar () {
  // va a tareas en curso de la bandeja y se puede seguir editando
  requestUtil({
    action: tramitarAudiencia_postRegistroAudiencia,
    payload: {
      ruc: ruc.value,
      registroAudiencia: {}
    },
    resolve: () => {
      toastSuccess('Exitoso, Registro Audiencia guardado')
    }
  })
}

async function guardarYFinalizar () {
  // va a bandeja de tareas finalizadas y ya no se puede editar
  launchConfirmDialog({
    header: 'Registro Audiencia',
    message: '¿Estás seguro de querer Registrar Audiencia?',
    accept: () => {
      requestUtil({
        action: tramitarAudiencia_postRegistroAudiencia,
        resolve: () => {
          toastSuccess('Exitoso, Audiencia Registrada')
          setTimeout(() => router.push({ name: 'TABandejaTramitarAudiencia' }), 500)
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
::v-deep(.p-tabmenu) {
  .p-tabmenu-nav {
    .p-tabmenuitem {
      a.p-menuitem-link {
        height: 100%;
      }
    }
  }
}
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.btn-aprobar {
  background-color: $primary-color;
  transition: all 0.5s ease;
  &:hover {
    background-color: $primary-color-hover !important;
  }
}
</style>
