<template>
<hr>
<section class="p-3 pb-0 mb-0">
  <AppForm
    id="searchCausas"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="formSearchCausas"
  >
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid">
        <AppDropdown
          id="tipoSujeto"
          v-model="formData.tipoSujeto"
          class="col-6 md:col-6"
          label="Tipo Sujeto"
          option-label="descripcion"
          option-value="id"
          :options="tiposSujeto"
          show-clear
        />

        <AppInput
          id="nombreSujeto"
          v-model="formData.nombreSujeto"
          class="col-6 md:col-6"
          label="Nombre del Sujeto"
        />
      </div>
      <div class="grid formgrid">
        <AppDropdown
          id="familiaDelito"
          v-model="formData.familiaDelito"
          class="col-6 md:col-6"
          label="Familia Delito"
          option-label="descripcion"
          option-value="id"
          :options="familiasDelito"
          show-clear
        />

        <AppDropdown
          id="tipoDelito"
          v-model="formData.tipoDelito"
          class="col-6 md:col-6"
          label="Delito"
          option-label="descripcion"
          option-value="id"
          :options="tiposDelito"
          show-clear
        />
      </div>
      <div class="grid formgrid">
        <AppCalendar
          id="fechaDesde"
          v-model="formData.fechaDesde"
          class="col-6 md:col-6 pt-2"
          label="Fecha / Hora Delito (desde)"
          show-time
        />

        <AppCalendar
          id="fechaHasta"
          v-model="formData.fechaHasta"
          class="col-6 md:col-6 pt-2"
          label="Fecha / Hora Delito (hasta)"
          show-time
        />
      </div>
      <div class="col-6">
        <div class="grid p-fluid">
          <div class="p-inputgroup">
            <InputText placeholder="Palabra Clave Relato del Hecho" />
            <Button
              class="col-6 md:col-6 btn-primary p-button-sm"
              icon="pi pi-plus"
              @click="null"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 py-5 pb-4 grid formgrid flex align-items-center justify-content-end ml-0∫">
      <div class="col-4 p-fluid">
        <Button
          class="p-button-outlined"
          icon="pi pi-search"
          icon-pos="right"
          label="Buscar"
          @click="handlerSearchCausas()"
        />
      </div>
    </div>
  </AppForm>
  <AppFieldset
    class="p-fluid pb-6"
    legend="Resultado de Búsqueda"
  >
    <div class="col-12">
      <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
        <InputText
          id="filter-text"
          v-model="filtroTexto"
          class="p-inputtext-sm"
          placeholder="Buscar"
        />
        <Button
          class="btn-primary p-button-sm"
          icon="pi pi-search"
        />
      </div>
    </div>
    <TabPanel>
      <div v-if="loading">
        <LoaderSkeleton />
      </div>
      <AppDataTable
        v-else
        :loading="loading"
        :rows="listDatos?.paginacion?.tamanoPagina"
        style="width: 100%"
        :total-records="listDatos?.paginacion?.elementosTotales"
        :value="listDatos?.data"
      >
        <Column header="Seleccionar">
          <template #body="{ data }">
            <Checkbox
              id="idCheck"
              v-model="data.id"
              binary
            />
          </template>
        </Column>
        <Column
          field="folio"
          header="RUC/Folio"
        >
          <template #body="{ data }">
            {{ data.folio }}
          </template>
        </Column>
        <Column
          field="denunciante"
          header="Denuciante"
        >
          <template #body="{ data }">
            {{ data.denunciante }}
          </template>
        </Column>
        <Column
          field="imputado"
          header="Imputado"
        >
          <template #body="{ data }">
            {{ data.imputado }}
          </template>
        </Column>
        <Column
          field="delito"
          header="Delito"
        >
          <template #body="{ data }">
            {{ data.delito }}
          </template>
        </Column>
        <Column
          field="direccionDelito"
          header="Dirección Delito"
        >
          <template #body="{ data }">
            {{ data.direccionDelito }}
          </template>
        </Column>
        <Column
          field="estado"
          header="Estado"
        >
          <template #body="{ data }">
            {{ data.estado }}
          </template>
        </Column>
      </AppDataTable>
    </TabPanel>
  </AppFieldset>

  <div class="end py-5">
    <Button
      class="btn-primary p-button-sm"
      label="Confirmar selección"
      @click="null"
    />
  </div>
  {{ causas }}
</section>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { requestUtil } from '@/utils'
import datos from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/modal/BusquedaAvanzada.vue'
import { useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'
import { useFormValidation, useAppToast } from '@/modules/common/composables'
const { toastError } = useAppToast()

const { causas, catalogoDocumentalDigital_searchCausas, mantenedorCDD_SET_CAUSAS_DEFAULT_STATE } = useMantenedorCDD()

const formData = reactive({
  tipoSujeto: '',
  nombreSujeto: '',
  familiaDelito: '',
  tipoDelito: '',
  fechaDesde: '',
  fechaHasta: ''
})

const { formSubmitted } = useFormValidation({
  formData,
  validationScope: 'formSearchCausas'
})

// const listDatos = ref(datos)
const listDatos = JSON.parse(JSON.stringify(datos))
const filtroTexto = ref('')

onMounted(() => {
  mantenedorCDD_SET_CAUSAS_DEFAULT_STATE()
})

function handlerSearchCausas () {
  formData.ruc = '1212122'

  // Buscar catalogo
  requestUtil({
    action: catalogoDocumentalDigital_searchCausas,
    payload: formData,
    resolve: () => {

    },

    reject: () => {
      toastError(`La solicitud no pudo ser cargado con exitosamente`)
    }

  })
}

</script>

<style scoped>
.end {
  text-align: end;
}
</style>
