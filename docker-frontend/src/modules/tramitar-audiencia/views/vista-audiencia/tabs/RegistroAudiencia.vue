<template>
<section>
  <AppForm
    :form-submitted="formSubmitted"
    validation-scope="registro-audiencia-form"
  >
    <AppFieldset legend="Suspender Audiencia">
      <h4 class="ml-2 col-12">
        ¿Suspende Audiencia?
      </h4>
      <AppSelectButton
        id="suspender-audiencia"
        v-model="formData.suspenderAudiencia"
        class="col-3 p-fluid"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </AppFieldset>

    <div v-if="formData.suspenderAudiencia">
      <AppFieldset legend="Motivo de la Suspensión">
        <AppFieldset
          class="col-12"
          legend="Seleccionar Relaciones"
        >
          <div
            class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5"
          >
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
            v-model:selection="formData.relacionesSeleccionadas"
            class="mb-6"
            deriva-uravit
            :loading="relaciones.isLoading"
            read-only
            selectable
            :total-records="paginacion?.elementosTotales"
            :value="filtroRelaciones"
            @page="getRelaciones"
          />
        </AppFieldset>

        <div>
          <h3 class="mb-4">
            Seleccione Motivo de la Suspensión
          </h3>
          <div class="w-full flex gap-4">
            <div
              v-for="motivo in motivosSuspension"
              :key="motivo"
              class="flex mb-4"
            >
              <RadioButton
                id="motivos-suspension"
                v-model="suspensionSeleccionada.tipo"
                :value="motivo"
              />
              <span class="ml-2">{{ motivo }}</span>
            </div>
          </div>
          <AppInput
            v-if="
              suspensionSeleccionada.tipo === 'Solicitud MP' ||
                suspensionSeleccionada.tipo === 'Otro'
            "
            id="motivo"
            v-model="suspensionSeleccionada.motivo"
            class
            label="Motivo"
          />
          <div
            v-if="suspensionSeleccionada.tipo === 'Inasistencia Imputado'"
            class="col-12"
          >
            <h4 class="ml-2 w-full">
              ¿Orden Detención?
            </h4>
            <AppSelectButton
              id="orden-detencion"
              v-model="suspensionSeleccionada.requiereOrdenDetencion"
              class="col-3 p-fluid mr-6"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
            />
          </div>
        </div>

        <div class="mt-4">
          <h4 class="col-12">
            Seleccionar fecha para la próxima audiencia
          </h4>
          <AppCalendar
            id="fechaProximaAudiencia"
            v-model="formData.fechaProximaAudiencia"
            class="col-8 p-fluid"
            date-format="dd-mm-yy"
            label="Fecha de la Próxima Audiencia"
            :max-date="null"
            :min-date="new Date()"
            show-time
          />
          <AppTextarea
            id="anotaciones"
            v-model="formData.anotaciones"
            class="col-12 p-fluid"
            cols="127"
            label="Anotaciones"
            rows="6"
          />
        </div>
      </AppFieldset>
    </div>

    <div v-if="!formData.suspenderAudiencia">
      <AppFieldset
        legend="Apercibimiento"
        :toggleable="true"
      >
        <TablaApercibimiento :value="sujetosIntervinientes" />
      </AppFieldset>

      <AppFieldset
        legend="Medidas Cautelares Vigentes"
        :toggleable="true"
      >
        <TablaMedidasCautelares
          read-only
          :value="medidasCautelaresVigentes"
        />
      </AppFieldset>

      <AppFieldset legend="Agregar Medida Cautelar">
        <FormAgregarMedidasCautelares
          class="w-full"
          :lista-imputados="imputados"
          :opciones-medidas-cautelares="listaMedidasCautelares"
          @medidas:agregar="addMedidaCautelar"
        />
      </AppFieldset>

      <AppFieldset legend="Resultado de la Audiencia">
        <AppFieldset
          class="col-12"
          legend="Seleccionar Relaciones"
        >
          <div
            class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5"
          >
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
            v-model:selection="formData.relacionesSeleccionadas"
            class="mb-6"
            deriva-uravit
            :loading="relaciones.isLoading"
            read-only
            selectable
            :total-records="paginacion?.elementosTotales"
            :value="relaciones"
            @page="getRelaciones"
          />
        </AppFieldset>

        <div class="flex">
          <AppFieldset legend="Resultado Audiencia">
            <ul
              v-for="audiencia in resultadosAudiencia"
              id="lista-resultado-audiencia"
              :key="audiencia"
              class="col-12 p-fluid"
            >
              <div>
                <RadioButton
                  id="condicion"
                  v-model="formData.resultadoSeleccionado"
                  :value="audiencia.id"
                />
                <span class="ml-3">{{ audiencia.label }}</span>
              </div>
            </ul>
          </AppFieldset>

          <AppFieldset legend="Resultado Sentencia">
            <ul
              v-for="sentencia in resultadosSentencia"
              id="lista-resultado-sentencia"
              :key="sentencia"
              class="col-12 p-fluid"
            >
              <div>
                <RadioButton
                  id="condicion"
                  v-model="formData.sentenciaSeleccionada"
                  :value="sentencia.id"
                />
                <span class="ml-3">{{ sentencia.value }}</span>
              </div>
            </ul>
          </AppFieldset>

          <AppFieldset legend="Preparación">
            <ul
              v-for="preparacion in preparacionAudiencia"
              id="lista-resultado-sentencia"
              :key="preparacion"
              class="col-12 p-fluid"
            >
              <div>
                <Checkbox
                  id="condicion"
                  v-model="formData.preparacionSeleccionada"
                  :value="preparacion.id"
                />
                <span class="ml-3">{{ preparacion.value }}</span>
              </div>
            </ul>
          </AppFieldset>
        </div>

        <div class="flex">
          <AppFieldset legend="Procedimiento">
            <ul
              v-for="procedimiento in procedimientosAudiencia"
              id="lista-procedimiento-audiencia"
              :key="procedimiento"
              class="col-6 p-fluid"
            >
              <div class="flex">
                <Checkbox
                  id="condicion"
                  v-model="formData.procedimientoSeleccionado"
                  :value="procedimiento.id"
                />
                <span class="ml-3">{{ procedimiento.value }}</span>
              </div>
            </ul>
          </AppFieldset>

          <AppFieldset legend="Salidas Alternativas">
            <ul
              v-for="salidaAudiencia in salidasAlternativasAudiencia"
              id="lista-procedimiento-audiencia"
              :key="salidaAudiencia"
              class="col-12 p-fluid"
            >
              <div>
                <Checkbox
                  id="condicion"
                  v-model="formData.salidaAudienciaSeleccionada"
                  :value="salidaAudiencia.id"
                />
                <span class="ml-3">{{ salidaAudiencia.value }}</span>
              </div>
            </ul>
          </AppFieldset>
        </div>

        <div class="col-12 mb-4 grid w-full">
          <h4 class="ml-2 w-full">
            ¿Incompetencia Judicalizada?
          </h4>
          <AppSelectButton
            id="suspender-audiencia"
            v-model="formData.incompetencia"
            class="col-3 p-fluid mr-6"
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false }
            ]"
          />
          <AppInput
            v-if="formData.incompetencia"
            id="motivo-incompetencia"
            v-model="formData.motivoIncompetencia"
            class="col-8 p-fluid"
            label="Motivo"
          />
        </div>

        <div class="col-12 mb-4 grid">
          <div class="col-3 mr-6">
            <h4>¿Causa Terminada?</h4>
            <AppSelectButton
              id="causa-terminada"
              v-model="formData.causaTerminada"
              class="col-12 p-fluid"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
              :rules="{ required }"
            />
          </div>
          <div class="col-3 mr-6">
            <h4>¿Asiste Víctima?</h4>
            <AppSelectButton
              id="asiste-victima"
              v-model="formData.asisteVictima"
              class="col-12 p-fluid"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
              :rules="{ required }"
            />
          </div>
          <div class="col-3 mr-6">
            <h4>¿Revisión de Cautelares?</h4>
            <AppSelectButton
              id="revision-cautelares"
              v-model="formData.revisionCautelares"
              class="col-12 p-fluid"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
              :rules="{ required }"
            />
          </div>
        </div>
        <div class="col-12 mb-4 grid">
          <div class="col-3 mr-6">
            <h4>¿Ampliación Detención de Imputado?</h4>
            <AppSelectButton
              id="detencion-imputado"
              v-model="formData.ampliarDetencion"
              class="col-12 p-fluid"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
              :rules="{ required }"
            />
          </div>
          <div class="col-3 mr-6">
            <h4>Interposición de Recurso de Audiencia</h4>
            <AppSelectButton
              id="recurso-audiencia"
              v-model="formData.recursoAudiencia"
              class="col-12 p-fluid"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
              :rules="{ required }"
            />
          </div>
          <div
            v-if="formData.recursoAudiencia"
            class="col-3 mr-6"
          >
            <h4>¿Derivar a FR?</h4>
            <AppSelectButton
              id="revision-cautelares"
              v-model="formData.derivarFR"
              class="col-12 p-fluid"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
              :rules="{ required }"
            />
          </div>
        </div>

        <AppTextarea
          v-if="formData.derivarFR"
          id="consulta-FR"
          v-model="formData.consultaFR"
          class="col-12 p-fluid"
          cols="127"
          label="Consulta a FR"
          rows="6"
          :rules="{ required }"
        />

        <div class="col-12">
          <h4>¿Es prioritaria?</h4>
          <AppSelectButton
            id="es-prioritaria"
            v-model="formData.esPrioritaria"
            class="col-3 p-fluid"
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false }
            ]"
          />
        </div>

        <div class="col-12 grid">
          <div class="col-6 grid">
            <h4 class="col-12">
              Seleccionar fecha para la próxima audiencia
            </h4>
            <AppCalendar
              id="fechaProximaAudiencia"
              v-model="formData.fechaProximaAudiencia"
              class="col-8 p-fluid"
              date-format="dd-mm-yy"
              label="Fecha de la Próxima Audiencia"
              :max-date="null"
              :min-date="new Date()"
              show-time
            />
          </div>
          <div class="col-6 grid">
            <h4 class="col-12">
              Seleccionar Condiciones SCP o AR
            </h4>
            <AppDropdown
              id="condicionesSCP"
              v-model="formData.condicionesSCPSeleccionadas"
              class="col-8"
              label="Condiciones SCP o AR"
              option-label="value"
              option-value="id"
              :options="condicionesSCP"
              show-clear
            />
          </div>
        </div>

        <div class="col-12 mb-4">
          <h4>Cargar Audio de Audiencia</h4>
          <div class="flex">
            <FileUpload
              id="seleccionar-archivo"
              accept="audio/*"
              choose-label="Seleccionar Archivo"
              class="btn-fileupload"
              :disabled="isEditando"
              :max-file-size="16000000"
              mode="basic"
              name="demo[]"
              @select="onSelect"
            />
            <span class="pt-2 ml-4">{{ file.nombre }}</span>
          </div>
        </div>

        <AppTextarea
          id="anotaciones"
          v-model="formData.anotaciones"
          class="col-12 p-fluid"
          cols="127"
          label="Anotaciones"
          rows="6"
        />

        <div>
          <Button
            class="p-button-outlined col-3"
            icon="pi pi-save"
            icon-pos="right"
            label="Guardar Registro de Audiencia"
            @click="guardar"
          />
        </div>
      </AppFieldset>

      <AppFieldset
        legend="Especies Dinero"
        :toggleable="true"
      >
        <TablaEspeciesDinero
          v-model:first="tables.especies.firstRecord"
          :loading="tables.especies.isLoading"
          :rows="paginacionEspecies?.tamanoPagina"
          :total-records="paginacionEspecies?.elementosTotales"
          :value="especies"
          @page="getEspecies"
        />
      </AppFieldset>
    </div>
  </AppForm>
</section>
</template>

<script setup>
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import AppInput from '@/modules/common/components/inputs/AppInput.vue'
import TablaApercibimiento from '@/modules/tramitar-audiencia/components/tables/TablaApercibimiento.vue'
import TablaMedidasCautelares from '@/modules/tramitar-audiencia/components/tables/TablaMedidasCautelares.vue'
import FormAgregarMedidasCautelares from '@/modules/tramitar-audiencia/components/FormAgregarMedidasCautelares.vue'
import TablaRelaciones from '@/modules/tramitar-audiencia/components/tables/TablaRelaciones.vue'
import TablaEspeciesDinero from '@/modules/termino-postermino/components/tablas/TablaEspeciesDinero.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  useRelacionesStore,
  useSujetosIntervinientesStore,
  useEspeciesDineroStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { requestUtil, appUtil } from '@/utils'
import { useFormValidation } from '@/modules/common/composables'
import { resultadosAudiencia, resultadosSentencia, preparacionAudiencia, procedimientosAudiencia, salidasAlternativasAudiencia } from '@/modules/tramitar-audiencia/data/data.json'
import { useBase64 } from '@vueuse/core'

const condicionesSCP = ref([])

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  especies: {
    firstRecord: 0,
    isLoading: false
  }
})

const formData = reactive({
  suspenderAudiencia: false,
  incompetencia: null,
  motivoIncompetencia: '',
  causaTerminada: null,
  asisteVictima: null,
  revisionCautelares: null,
  ampliarDetencion: null,
  recursoAudiencia: null,
  consultaFR: '',
  esPrioritaria: null,
  relacionesSeleccionadas: [],
  anotaciones: '',
  resultadoSeleccionado: '',
  sentenciaSeleccionada: '',
  preparacionSeleccionada: '',
  procedimientoSeleccionado: '',
  salidaAudienciaSeleccionada: '',
  fechaProximaAudiencia: '',
  condicionesSCPSeleccionadas: []
})

const { formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'registro-audiencia-form'
})

const motivosSuspension = [
  'Solicitud Defensa',
  'Solicitud MP',
  'Común Acuerdo',
  'Inasistencia Imputado',
  'Otro'
]

// LÓGICA PARA SUSPENDER AUDIENCIA
const suspensionSeleccionada = reactive({
  tipo: '',
  motivo: '',
  requiereOrdenDetencion: null
})

/* ANTECEDENTES AUDIENCIA */

const antecedentesAudiencia = ref()
const medidasCautelaresVigentes = ref([])
async function getAntecedentesAudiencia () {
  requestUtil({
    action: tramitarAudiencia_getAntecedentesAudiencia,
    reject: (e) => console.error(e),
    resolve: (antecedentes) => {
      antecedentesAudiencia.value = antecedentes
      medidasCautelaresVigentes.value = antecedentes.medidasCautelares
    }
  })
}

/* IMPUTADO */
const { sujetosIntervinientes, sujetosIntervinientes_getSujetosByIdGlobal } =
  useSujetosIntervinientesStore()
const { mantenedor_getCodigoTipoSujeto, mantenedor_getTiposSujetos } =
  useMantenedorStore()

const imputados = ref([])
async function getImputados (pagination = undefined) {
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: idDenuncia.value, params },
    // loader: (l) => (tables.sujetos.isLoading = l),
    resolve: (sujetos) => {
      sujetos.data.forEach((s) => {
        s.tipoSujeto = mantenedor_getCodigoTipoSujeto(s?.tipoSujeto)
      })
      imputados.value = sujetos.data.filter((s) => s.tipoSujeto === '3')
    }
  })
}

/* MEDIDAS CAUTELARES */
const {
  idDenuncia,
  tramitarAudiencia_SET_MEDIDAS_CAUTELARES,
  mantenedor_getListaMedidasCautelares,
  tramitarAudiencia_getAntecedentesAudiencia
} = useTramitarAudiencia()

const medidasCautelares = ref([])

const listaMedidasCautelares = ref([])

async function getListaMedidasCautelares () {
  requestUtil({
    action: mantenedor_getListaMedidasCautelares,
    resolve: (medidas) => {
      listaMedidasCautelares.value = medidas
    }
  })
}

const isLoading = ref(false)

async function addMedidaCautelar (medida) {
  // guardar en store para luego enviar a bakend al guardar
  console.log(medida.value)
  medidasCautelares.value.push(medida.value)
  requestUtil({
    action: tramitarAudiencia_SET_MEDIDAS_CAUTELARES,
    payload: { medidasCautelaresSolicitadas: medidasCautelares },
    loader: (l) => (isLoading.value = l)
  })
}

/* === RELACIONES === */
const { paginacion, relaciones, relaciones_getRelaciones } =
  useRelacionesStore()

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

/* === ESPECIES === */

const { especies, especiesDinero_getEspecieByIdDenuncia, paginacionEspecies } =
  useEspeciesDineroStore()

async function getEspecies (pagination = undefined) {
  if (!pagination) {
    tables.especies.firstRecord = 0
  }

  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (l) => (tables.especies.isLoading = l)
  })
}

/* === FILE UPLOAD === */

const file = reactive({
  mimeType: '',
  nombreArchivo: '',
  tamano: '',
  fileBase64: '',
  relacionFront: ''
})

async function onSelect (e) {
  try {
    const archivo = e.files[0]
    if (archivo) {
      file.mimeType = archivo.type
      file.nombreArchivo = archivo.name
      file.tamano = archivo.size

      const base64 = useBase64(archivo)
      await base64.execute()
      const base64String = base64.base64.value
      formData.fileBase64 = base64String.split(',')[1]
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  requestUtil({ action: mantenedor_getTiposSujetos })
  getListaMedidasCautelares()
  getAntecedentesAudiencia()
  getImputados()
  getRelaciones()
  getEspecies()
})
</script>

<style scoped>
h4 {
  margin-bottom: 1rem;
}
</style>
