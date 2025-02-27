<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa?.nombreCausa}`"
  :page-subtitle="`Ruc: ${ruc}`"
  page-title="Consolidar Resultado de Audiencia"
/>
<section>
  <AppFieldset
    class="pb-3 mt-4"
    legend="Causa"
    toggleable
  >
    <div class="col-12 md:col-6 pl-4">
      <p><strong>RUC: </strong>{{ ruc }}</p>
      <p><strong>RIT: </strong>6734-849</p>
    </div>
    <div class="col-12 md:col-6 pl-4">
      <p><strong>Fiscal Asignado: </strong>{{ resumenCausa?.fiscalPropuesto }}</p>
      <p><strong>Nombre Causa: </strong>{{ resumenCausa?.nombreCausa }}</p>
    </div>
  </AppFieldset>
  <section>
    <TabView
      v-model:activeIndex="tabs.active"
      class="tabview m-0  p-0"
      @tab-change="tabChange"
    >
      <TabPanel
        v-for="tab in tabs.items"
        :key="tab.title"
        :header="tab.title"
      >
        <AppFieldset
          class="col-12"
          legend="Seleccionar Relaciones"
        >
          <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0">
            <InputText
              id="filter-text"
              v-model="inputFiltro"
              class="p-inputtext-sm"
              placeholder="Buscar"
            />
            <Button
              class="btn-primary p-button-sm"
              icon="pi pi-search"
            />
          </div>
          <TablaRelaciones
            v-model:first="tables.relaciones.firstRecord"
            class="mb-6"
            deriva-uravit
            :loading="relaciones.isLoading"
            read-only
            :total-records="paginacion?.elementosTotales"
            :value="filtroRelaciones"
            @page="getRelaciones"
          />
        </AppFieldset>
        <div
          v-for="resultado in resultados[tabs.active]"
          :key="resultado"
        >
          <AppFieldset
            class="pb-3 mt-4"
            :legend="resultado.titulo"
          >
            <TablaConsolidarResultados :value="resultado.valores" />
            <div class="flex justify-content-end w-full">
              <p
                v-if="resultado.titulo !== 'Apercibimiento' || resultado.titulo !== 'Medidas Cautelares Vigentes'"
                class="link pr-6"
                @click="openModalVerMas(resultado)"
              >
                Ver Todo >>
              </p>
            </div>
          </AppFieldset>
        </div>
      </TabPanel>
    </TabView>
  </section>
  <AppFieldset
    class="pb-3 mt-4"
    legend="Anotaciones"
  >
    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5 w-full">
      <InputText
        id="filter-text"
        class="p-inputtext-sm"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary p-button-sm"
        icon="pi pi-search"
      />
    </div>
    <TablaAnotaciones
      class="w-full"
      :loading="tables.anotaciones.isLoading"
      :rows="paginacionAnotaciones?.tamanoPagina"
      :total-records="paginacionAnotaciones?.elementosTotales"
      :value="anotaciones"
      @page="getAnotaciones"
    />
  </AppFieldset>

  <div class="grid col-12 justify-content-between">
    <AppFieldset
      class="mt-4 col-7"
      legend="Audios Marcados"
    >
      <TablaAudiosMarcados
        :value="audiosMarcados"
        @play:audio="reproducirAudio"
      />
    </AppFieldset>
    <AppFieldset
      class="mt-4 pt-4 sm:col-12 md:col-5 grid justify-content-center"
      legend="Audio Completo"
    >
      <AudioPlayer
        :key="componentKey"
        :audio="audioSeleccionado"
      />
    </AppFieldset>
  </div>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5 mr-6"
      icon="pi pi-angle-double-right"
      icon-pos="right"
      label="Solicitar Rectificatoria al PJUD"
      @click="solicitarRectificatoriaPJUD"
    />
    <Button
      class="btn-primary px-5"
      icon="pi pi-save"
      icon-pos="right"
      label="Guardar Resultado Audiencia"
      @click="guardarResultado"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import ModalVerMas from '@/modules/tramitar-audiencia/components/modals/ModalVerMas.vue'
import TablaConsolidarResultados from '@/modules/tramitar-audiencia/components/consolidar-resultado-audiencia/TablaConsolidarResultados.vue'
import TablaRelaciones from '@/modules/tramitar-audiencia/components/tables/TablaRelaciones.vue'
import TablaAnotaciones from '@/modules/global/components/historial-causa/TablaAnotaciones.vue'
import TablaAudiosMarcados from '@/modules/tramitar-audiencia/components/consolidar-resultado-audiencia/TablaAudiosMarcados.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AudioPlayer from '@/modules/tramitar-audiencia/components/player/AudioPlayer.vue'
import { computed, onMounted, reactive, ref } from 'vue-demi'
import { appUtil, requestUtil } from '@/utils'
import { useAnotacionCausaStore, useRelacionesStore } from '@/modules/global/composables'
import { useMenuSuperior } from '@/modules/termino-postermino/composables'
import { useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { useAppDialog, useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useRouter } from 'vue-router'

const { ruc, resumenCausa, idDenuncia, audiosMarcados, tramitarAudiencia_getAudiosAudiencia, tramitarAudiencia_getResultadosAudiencia } = useTramitarAudiencia()
const { itemsMenuSuperior } = useMenuSuperior({ ruc })
const { toastSuccess } = useAppToast()
const { launchDialog } = useAppDialog()

const tables = reactive({
  anotaciones: {
    firstRecord: 0,
    isLoading: false
  },
  relaciones: {
    firstRecord: 0,
    isLoading: false
  }
})

const tabs = reactive({
  active: 0,
  items: [
    { title: 'Resultado 1' },
    { title: 'Resultado 2 ' }
  ]
})

function openModalVerMas (resultado) {
  launchDialog({
    component: ModalVerMas,
    header: 'Ver Más',
    props: {
      data: resultado
    }
  })
}
/* === RELACIONES === */
const { paginacion, relaciones, relaciones_getRelaciones } = useRelacionesStore()

const inputFiltro = ref('')
const { includeWord } = appUtil

const filtroRelaciones = computed(() => {
  const relations = relaciones.value
  if (inputFiltro.value) {
    return relations?.filter(
      (relations) =>
        includeWord(relations.nombreCompletoVictima, inputFiltro.value) ||
        includeWord(relations.nombreCompletoImputado, inputFiltro.value) ||
        includeWord(relations.delito, inputFiltro.value) ||
        includeWord(relations.estado, inputFiltro.value) ||
        includeWord(relations.etapa, inputFiltro.value)
    )
  }
  return relations
})

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.relaciones.isLoading = l)
  })
}

// /* === Anotaciones === */

const { paginacion: paginacionAnotaciones, anotaciones, anotacionCausa_getAnotacionesByIdDenuncia } = useAnotacionCausaStore()

async function getAnotaciones (pagination = undefined) {
  if (!pagination) {
    tables.anotaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: anotacionCausa_getAnotacionesByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.anotaciones.isLoading = l)
  })
}

/* ======= RESULTADOS AUDIENCIA ========= */
const resultados = ref([])
function getResultadosAudiencia () {
  requestUtil({
    action: tramitarAudiencia_getResultadosAudiencia,
    resolve: (res) => {
      resultados.value = res
      console.log(resultados.value)
    }
  })
}

/* === AUDIOS === **/
const componentKey = ref(0)
function forceRerender () {
  componentKey.value += 1
}

async function getAudios () {
  requestUtil({
    action: tramitarAudiencia_getAudiosAudiencia
  })
}

const audioSeleccionado = reactive({
  name: '',
  filePath: ''
})

function reproducirAudio (audio) {
  audioSeleccionado.name = audio.name
  audioSeleccionado.filePath = audio.filePath
  forceRerender()
}

// /* ******************** */

const { launchConfirmDialog } = useConfirmDialog()
const router = useRouter()

async function guardarResultado () {
  launchConfirmDialog({
    header: 'Guardar Resultado Audiencia',
    message: '¿Está seguro de Guardar Resultado Audiencia?',
    accept: () => {
      toastSuccess(`Resultado guardado con éxito!`)
      setTimeout(() => router.push({ name: 'TABandejaTramitarAudiencia' }), 500)
    }
  })
}

onMounted(() => {
  getAnotaciones()
  getAudios()
  getRelaciones()
  getResultadosAudiencia()
})
</script>

<style scoped>
p:not(:last-child) {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.link{
  cursor: pointer;
  color: #2C6DDF;
  font-weight: 600;
  font-size: 1.2rem;
}
</style>
