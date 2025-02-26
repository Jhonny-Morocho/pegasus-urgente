<template>
<hr>
<section class="mt-4">
  <AppFieldset legend="Mapa de Georreferenciacion">
    <AppForm
      id="form-georreferencia"
      class="grid col-12"
      :form-submitted="formSubmitted"
      validation-scope="formBusquedaMapa"
    >
      <div class="col-12 md:col-6">
        <div class="p-inputgroup">
          <Dropdown
            id="delitos"
            v-model="formData.idDelito"
            option-label="delitoDenunciado"
            option-value="idDelito"
            :options="listaGeorreferenciaDelitos"
            placeholder="Seleccione Tipo de Delito"
            :rules="{ required }"
            show-clear
          />
          <Button
            class="btn-primary px-4"
            icon="pi pi-search"
            @click="getGeorreferenciaDelito"
          />
        </div>
      </div>
      <MapInput
        id="map"
        class="col-12"
        :position="positionDelito"
        @set-map-values="setMap"
      />
      <div class="col-12 grid">
        <AppInput
          id="region"
          v-model="formData.region"
          class="col-12 md:col-6"
          label="Región"
        />
        <AppInput
          id="comuna"
          v-model="formData.comuna"
          class="col-12 md:col-6"
          label="Comuna"
        />
        <AppInput
          id="calle"
          v-model="formData.calle"
          class="col-12 md:col-6"
          label="Calle"
        />
        <AppInput
          id="numero"
          v-model="formData.numero"
          class="col-12 md:col-6"
          label="Número"
        />
        <div class="col-12 md:col-6 md:col-offset-6">
          <Button
            id="btnConsultarGeorreferenciacion"
            class="btn-form w-full"
            :disabled="!hasPosition"
            icon="pi pi-search"
            icon-pos="right"
            label="Consultar Competencia Territorial"
            style="width: 320px"
            @click="consultarCompetenciaTerritorial"
          />
        </div>
      </div>
    </AppForm>
  </AppFieldset>
  <AppFieldset legend="Resultado Georreferenciacion">
    <TablaGeorreferenciacion
      v-model:selection="fiscaliasSeleccionadas"
      :value="fiscaliasCompetentes"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { onMounted, reactive, defineExpose, computed, ref, defineProps } from 'vue'
import TablaGeorreferenciacion from '@/modules/preclasificador/components/tablas/TablaGeorreferenciacion.vue'
import { useCompetenciaTerritorialStore } from '@/modules/preclasificador/composables/'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'

const { toastWarning, toastSuccess } = useAppToast()

const props = defineProps({
  idGlobal: propTypes.string,
  delito: propTypes.array
})

const idGlobal = ref(props?.idGlobal)
const delito = ref(props?.delito)
const fiscaliasSeleccionadas = ref([])

const {
  listaGeorreferenciaDelitos,
  fiscaliasCompetentes,
  competenciaTerritorial_getGeorreferenciaDelito,
  competenciaTerritorial_getListaGeorreferenciaDelitos,
  competenciaTerritorial_consultarCompetenciaTerritorial,
  competenciaTerritorial_getCompetenciaDelito,
  competenciaTerritorial_SET_LISTA_GEORREFERENCIA_DELITOS
} = useCompetenciaTerritorialStore()

const formData = reactive({
  idDelito: '',
  delito: '',
  region: '',
  comuna: '',
  calle: '',
  numero: ''
})

const { formSubmitted, isFormValid, required, resetFormData } = useFormValidation({
  formData,
  validationScope: 'formBusquedaMapa'
})

const positionDelito = reactive({
  latitude: null,
  longitude: null
})

function getGeorreferenciaDelito () {
  const georrefencia = competenciaTerritorial_getGeorreferenciaDelito(formData.idDelito)
  positionDelito.latitude = georrefencia.latitud
  positionDelito.longitude = georrefencia.longitud
  formData.delito = georrefencia.delitoDenunciado
}

async function getListaGeorreferenciaDelitos () {
  if (!delito.value.length) {
    requestUtil({
      action: competenciaTerritorial_getListaGeorreferenciaDelitos,
      payload: {
        ruc: idGlobal.value
      }
    })
  } else {
    setListaFromDelito()
  }
}

const hasPosition = computed(() => {
  return (positionDelito.latitude && positionDelito.longitude)
})

async function consultarCompetenciaTerritorial () {
  if (!isFormValid() || !hasPosition.value) {
    return
  }

  const competenciaDelito = competenciaTerritorial_getCompetenciaDelito(formData.idDelito)

  if (competenciaDelito) {
    toastWarning('Ya consultaste la competencia territorial de este delito')
    return
  }
  const payload = {
    ...formData,
    latitud: positionDelito.latitude,
    longitud: positionDelito.longitude
  }

  requestUtil({
    action: competenciaTerritorial_consultarCompetenciaTerritorial,
    payload: payload,
    resolve: () => {
      resetFormData()
      Object.assign(positionDelito, {
        latitude: null,
        longitude: null
      })
      toastSuccess('Competencia Territorial Encontrada')
    }
  })
}

async function setListaFromDelito () {
  console.log(delito.value)
  competenciaTerritorial_SET_LISTA_GEORREFERENCIA_DELITOS(delito.value)
}

onMounted(async () => {
  getListaGeorreferenciaDelitos()
})

function setMap (value) {
  formData.region = value.region
  formData.comuna = value.comuna
  formData.calle = value.calle
  formData.numero = value.numero
}

function retrieveData (retrieve) {
  if (!fiscaliasSeleccionadas.value.length) {
    toastWarning('Debes seleccionar alguna fiscalía')
    return
  }

  const data = fiscaliasSeleccionadas.value.map((fiscalia) => {
    return {
      idDelito: fiscalia.idDelito,
      idFiscalia: fiscalia.idFiscalia
    }
  })

  retrieve?.(data)
}

defineExpose({ retrieveData })

</script>
<style lang="scss" scoped>
.buttonSearch {
  width: 4rem;
  height: 2.5rem;
  margin-top: 7px;
}
</style>
