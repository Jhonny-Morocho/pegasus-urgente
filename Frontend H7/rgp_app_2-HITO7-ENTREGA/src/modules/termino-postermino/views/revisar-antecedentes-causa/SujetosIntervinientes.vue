<template>
<section>
  <AppFieldset legend="Lista de Sujetos/Intervinientes">
    <div class="col-12 flex justify-content-between mt-0">
      <AppInput
        id="input-filtro"
        v-model="inputFiltro"
        class="m-0 p-0"
        label="Buscar Interviniente"
        style="width: 250px"
      />
    </div>
    <TablaSujetos
      v-model:first="firstRecord"
      class="col-12"
      :is-editando="isEditando"
      :loading="isLoading"
      :read-only="!isCollapsed"
      :rows="paginacion?.tamanoPagina"
      see-more-option
      :total-records="paginacion?.elementosTotales"
      :value="filtroSujetos"
      @relacion:ver-mas="setModoLectura"
    />
  </AppFieldset>

  <div
    v-if="formData.readonly === true"
    class="flex justify-content-center mt-3"
  >
    <Button
      id="agregar-interviniente"
      class="p-button-outlined my-3 px-5"
      :icon="isCollapsed ? 'pi pi-plus' : 'pi pi-minus'"
      icon-pos="right"
      :label="isCollapsed ? 'Agregar Interviniente' : 'Cancelar'"
      @click="toggleFormularioIntervinientes"
    />
  </div>
  <AppForm
    id="sujeto-interviniente"
    :form-readonly="formData.readonly"
    :form-submitted="formSubmitted"
    :validation-scope="sujetosIntervinientesValidationScope"
  >
    <AppFieldset
      v-if="!isCollapsed"
      legend="Identificación Interviniente"
      :toggleable="true"
    >
      <SujetosIntervinientesIdentificacion @set-tipo-sujeto="formData.tipoSujeto = $event" />
      <SujetosIntervinientesDatosComplementarios
        class="mb-5"
        :tipo-persona="formData.representaInstitucion"
        :tipo-sujeto-dual="formData.esVictima"
      />
      <SujetosIntervinientesInfoContacto />

      <div class="col-12">
        <div class="grid">
          <div class="col-12 text-center">
            <div
              v-if="formData.readonly"
              class="flex justify-content-center"
            >
              <Button
                class="btn-form px-6"
                icon="pi pi-minus-circle"
                icon-pos="right"
                label="Cerrar"
                style="width: auto"
                @click="toggleFormularioIntervinientes"
              />
            </div>
            <div
              v-else
              class="flex justify-content-end"
            >
              <Button
                v-if="!isEditando"
                class="btn-form px-6"
                icon="pi pi-save"
                icon-pos="right"
                label="Guardar Interviniente"
                :loading="isLoading"
                style="width: auto"
                @click="handleSubmitForm"
              />

              <div
                v-else
                class="flex"
              >
                <div class="mr-4">
                  <Button
                    class="p-button-outlined p-button-warning"
                    icon="pi pi-times"
                    label="Cancelar"
                    @click="toggleFormularioIntervinientes"
                  />
                </div>
                <div>
                  <Button
                    class="p-button-warning"
                    icon="pi pi-save"
                    label="Modificar Interviniente"
                    :loading="isLoading"
                    @click="handleSubmitForm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppFieldset>
  </AppForm>
</section>
</template>
<script setup>
import { ref, provide, onMounted, computed } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import { useFormValidation } from '@/modules/common/composables'
import { populateInterviniente } from '@/modules/global/contracts'
import { useSujetosIntervinientesStore, useSujetosIntervinientesProvide } from '@/modules/global/composables'
import SujetosIntervinientesInfoContacto from '@/modules/global/components/sujetos-intervinientes/SujetosIntervinientesInfoContacto.vue'
import SujetosIntervinientesIdentificacion from '@/modules/global/components/sujetos-intervinientes/SujetosIntervinientesIdentificacion.vue'
import SujetosIntervinientesDatosComplementarios from '@/modules/global/components/sujetos-intervinientes/SujetosIntervinientesDatosComplementarios.vue'
import TablaSujetos from '@/modules/termino-postermino/components/tablas/TablaSujetosIntervinientes.vue'
import { useTermino } from '../../composables'

const { sujetosIntervinientes, paginacion, sujetosIntervinientes_getSujetosByIdGlobal, sujetosIntervinientes_getSujetosByIdRelacionSujeto } = useSujetosIntervinientesStore()

const { idDenuncia } = useTermino()

const firstRecord = ref(0)
const isLoading = ref(false)
const isCollapsed = ref(true)
const inputFiltro = ref('')

const { formData, sujetosIntervinientesValidationScope } = useSujetosIntervinientesProvide()

provide(sujetosIntervinientesValidationScope, formData)

const { formSubmitted } = useFormValidation({
  formData,
  validationScope: sujetosIntervinientesValidationScope
})

function toggleFormularioIntervinientes () {
  isCollapsed.value = !isCollapsed.value
  formData.readonly = false
}

function setModoLectura (sujeto) {
  console.log(sujeto.value)
  const { idRelacionSujeto } = sujeto.value
  console.log({ idRelacionSujeto })
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
    payload: {
      idRelacionSujeto: idRelacionSujeto
    },
    resolve: (response) => {
      isCollapsed.value = false
      formData.readonly = true
      populateInterviniente(response, formData)
    },
    reject: (e) => console.log(e)
  })
}

async function getSujetos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (isLoading.value = l)
  })
}

onMounted(async () => {
  getSujetos()
})

const { includeWord } = appUtil

const filtroSujetos = computed(() => {
  const sujetos = sujetosIntervinientes.value

  if (inputFiltro.value) {
    return sujetos?.filter(
      (sujeto) =>
        includeWord(sujeto.nombres, inputFiltro.value) ||
        includeWord(sujeto.apellidoPaterno, inputFiltro.value) ||
        includeWord(sujeto.apellidoMaterno, inputFiltro.value) ||
        includeWord(sujeto.numeroDocumento, inputFiltro.value) ||
        includeWord(sujeto.descripcionTipoSujeto, inputFiltro.value)
    )
  }
  return sujetos
})
</script>
