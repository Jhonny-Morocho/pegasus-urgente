<template>
<section>
  <div class="grid w-full">
    <div class="col-12 md:col-3">
      <AppFieldset legend="RUC">
        <div class="w-full text-center">
          <h1 id="nroRUC">
            {{ dataCausa.ruc }}
          </h1>
        </div>
      </AppFieldset>
    </div>
    <div class="col-12 md:col-6">
      <AppFieldset legend="Identificacion Denuncia">
        <FieldsetIdentificacionDeLaCausa
          class="w-full"
          :data-identificacion-denuncia="dataIdentificacionDenuncia"
        />
      </AppFieldset>
    </div>
    <div class="col-12 md:col-3 text-center">
      <div style="border: solid #e0e0e0 1px; border-radius: 4px; margin-top: 17px">
        <img
          alt=""
          class="img_poder_judicial"
          src="@/assets/images/poderjudicial.png"
        >
      </div>
    </div>
  </div>
  <TabView>
    <TabPanel header="Información de la Causa">
      <InformacionDeLaCausa />
    </TabPanel>
    <TabPanel header="Historial de la Causa">
      <HistorialDeLaCausa />
    </TabPanel>
    <TabPanel header="Catálogo Documental Digital">
      <CatalogoDocumentalDigital />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import InformacionDeLaCausa from '@/modules/global/views/ficha-causa/InformacionDeLaCausa.vue'
import HistorialDeLaCausa from '@/modules/global/views/ficha-causa/HistorialDeLaCausa.vue'
import CatalogoDocumentalDigital from '@/modules/global/views/ficha-causa/CatalogoDocumentalDigital.vue'
import FieldsetIdentificacionDeLaCausa from '../components/ficha-causa/FieldsetIdentificacionDeLaCausa.vue'
import { computed, ref } from 'vue'
import { useFichaCausaStore } from '../composables'
import { useCrearCausaStore } from '@/modules/ingreso/composables'
const { causaSeleccionada } = useFichaCausaStore()
const { causa } = useCrearCausaStore()

const dataIdentificacionDenuncia = ref([])
const dataCausa = computed(() => {
  return causa.value ? causa.value : causaSeleccionada.value
})

console.log('ficha causa')
</script>
