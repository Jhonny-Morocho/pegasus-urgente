<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre Causa: ${resumenCausa?.nombreCausa}`"
  :page-subtitle="`RUC: ${ ruc }`"
  page-title="Revisar y Responder Solicitud a otra FL"
/>
<TabMenu
  :active-index="activeIndex"
  class="mt-6 mt-b"
  :model="tabsMenuOpciones"
/>
<div class="wrapper-routes mb-7">
  <RouterView />
</div>

<AppFooterBtns
  label="Enviar Resultado"
  @back-step="handleBackStep"
  @next-step="handleEviarResultado"
/>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { resumenCausa } from '@/data/gestorSolicitudes/resumenCausa.json'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import { useConfirmDialog } from '@/modules/common/composables'
import { usePageHeaderOptions } from '../composables'
const router = useRouter()

const ruc = resumenCausa.ruc
const activeIndex = ref(0)
const tabsMenuOpciones = [
  { label: 'Antecedentes de la Causa', to: { name: 'EJAntecedentesCausa' } },
  { label: 'Antecedentes de la Solicitud', to: { name: 'EJAntecedentesSolicitud' } }
]
const { itemsMenuSuperior } = usePageHeaderOptions(true)

const { launchConfirmDialog } = useConfirmDialog()

function handleBackStep () {
  router.push({ name: 'BandejaEjecutor' })
}

function handleEviarResultado () {
  launchConfirmDialog({
    header: ' Enviar Resultado',
    message: `¿Está seguro de  Enviar el Resultado?`,
    accept: () => {
      router.push({ name: 'BandejaEjecutor' })
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

.btn-aprobar {
    background-color: $primary-color;
    transition: all 0.5s ease;
    &:hover{
    background-color: $primary-color-hover !important;
    }
}
</style>
