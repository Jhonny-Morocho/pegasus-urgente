<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-subtitle="`RUC: ${ruc}`"
  page-title="Ver Toda la Causa"
/>
<div>
  <section class="flex justify-content-center mb-4">
    <TabMenu :model="tabsRevisarAntecedentes" />
  </section>
  <div class="wrapper-routes">
    <RouterView />
  </div>
</div>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import { ref } from 'vue'
import { useTermino } from '@/modules/termino-postermino/composables'
import { useRouter } from 'vue-router'

const router = useRouter()

const { ruc } = useTermino()

const baseUrl = '/termino-postermino/fiscal-jefe/revisar-antecedentes-causa'

const tabsRevisarAntecedentes = ref([
  { label: 'Resumen de la Causa', to: `${baseUrl}/resumen-causa` },
  { label: 'Sujetos Intervinientes', to: `${baseUrl}/sujetos-intervinientes` },
  { label: 'Delitos', to: `${baseUrl}/delitos` },
  { label: 'Relaciones', to: `${baseUrl}/relaciones` },
  { label: 'Especies/Dinero', to: `${baseUrl}/especies-dinero` },
  { label: 'Relato del Hecho', to: `${baseUrl}/relato` },
  { label: 'Documentos', to: `${baseUrl}/documentos` },
  { label: 'Diligencias', to: `${baseUrl}/diligencias` }
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
  &:hover {
    background-color: $primary-color-hover !important;
  }
}
</style>
