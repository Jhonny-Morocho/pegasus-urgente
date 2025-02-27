<template>
<section>
  <section class="flex justify-content-center mb-4">
    <TabMenu
      :active-index="0"
      :model="tabs"
    />
  </section>

  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnNextTeleported
    class="ml-8"
    :disabled="isEditando"
    label="Emitir Instrucciones"
    :loading="isLoadingNextStep"
    @click="handleSubmitForm"
  />
</section>
</template>
<script setup>
import TabMenu from 'primevue/tabmenu'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useStepRegistroContactoStore } from '@/modules/flagrancia/composables'

import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const { isEditando } = useStepRegistroContactoStore()

const isLoadingNextStep = ref(false)
const tabs = [
  { label: 'Registro Contacto', to: { name: 'FlagranciaNuevaAtencionRegistroContactoFiscal' } },
  { label: 'Sujetos Intervinientes', to: { name: 'FlagranciaNuevaAtencionSujetoIntervinientesFiscal' } },
  { label: 'Delitos', to: { name: 'FlagranciaNuevaAtencionDelitoFiscal' } },
  { label: 'Relaciones', to: { name: 'FlagranciaNuevaAtencionRelacionesFiscal' } },
  { label: 'Especies/Dinero', to: { name: 'FlagranciaNuevaAtencionEspeciesDineroFiscal' } },
  { label: 'Relato del Hecho', to: { name: 'FlagranciaNuevaAtencionRelatoHechoFiscal' } },
  { label: 'Documentos', to: { name: 'FlagranciaNuevaAtencionDocumentosFiscal' } }
]

// LOGICA QUE ESTABA EN DOCUMENTOS
function handleSubmitForm () {
  router.push({ name: 'FlagranciaNuevaAtencionDiligenciasEInstruccionesFiscal' })
}
</script>
<style scoped lang="scss">
::v-deep(.p-tabmenu) {
  .p-tabmenu-nav {
    .p-tabmenuitem {
      a.p-menuitem-link {
        height: 100%;
      }
    }
  }
}
</style>
