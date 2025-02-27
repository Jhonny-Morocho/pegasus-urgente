<template>
<AppFieldset legend="Búsqueda por RUE">
  <AppForm
    id="form-busequeda-por-rue"
    class="grid col-12"
    :form-submitted="formSubmitted"
    validation-scope="form-busequeda-por-rue"
  >
    <div class="col-12 md:col-6 lg:col-4 flex">
      <AppInput
        id="ingresar-rue"
        v-model="formData.rue"
        class="my-auto w-full"
        label="Ingresar RUE"
        style="border-radius: 4px 0px 0px 4px; height: 35px;"
      />
      <Button
        class="p-button btn-primary my-auto"
        :disabled="!formData.rue || buscandoPorRueLoading"
        :icon="buscandoPorRueLoading ? 'pi pi-spinner pi-spin' : 'pi pi-search'"
        style="border-radius: 0px 4px 4px 0px; height:35px; max-width: 35px;"
        type="button"
        @click="buscarPorRue(formData.rue)"
      />
    </div>
  </AppForm>
</AppFieldset>
<AppFieldset
  :collapsed="collapsed"
  legend="Causa"
  :toggleable="!nextStepDisabled"
>
  <Causa :data-causa="causa" />
</AppFieldset>
<AppFieldset
  collapsed="true"
  legend="Especies"
  :toggleable="!nextStepDisabled"
>
  <Especie :especie="especie" />
</AppFieldset>
<AppBtnNextTeleported
  class="mr-2"
  :disabled="nextStepDisabled"
  icon="pi pi-arrow-right"
  icon-pos="right"
  label="Seleccionar Reubicación"
  @click="nextStep"
/>
</template>
<script setup>
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import Especie from '@/modules/recepcion-especies-dinero/components/decidir-reubicacion/Especie.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useFormValidation, useAppToast } from '@/modules/common/composables'
import { useFijacionFotografica, useIdentificacionNueStore, useIngresoDinero, useStepBusquedaAgregarSepararEspecies } from '../../composables'
import { requestUtil } from '@/utils'
const { toastSuccess } = useAppToast()

const formData = reactive({
  rue: null
})

const { formSubmitted } = useFormValidation({
  formData,
  validationScope: 'form-busequeda-por-rue'
})

const especie = ref()
const causa = ref()
const { stepBusquedaAgregarSepararEspecies_busquedaPorRue } = useStepBusquedaAgregarSepararEspecies()
const { fijacionfotografica_getDataEspecieFijacion } = useFijacionFotografica()
const { stepIdentificacionNue_obtenerCausaPorRUC } = useIdentificacionNueStore()
const { stepIngresoDinero_getGenerarEtiqueta } = useIngresoDinero()
const collapsed = ref(true)
const buscandoPorRueLoading = ref(false)
const nextStepDisabled = ref(true)

function buscarPorRue (rue) {
  buscandoPorRueLoading.value = true
  //
  // mockDataCausa,
  // mockEspecie
  requestUtil({
    action: fijacionfotografica_getDataEspecieFijacion,
    payload: {
      rue
    },
    resolve: (d) => {
      console.log('res reubicacion', d)

      busquedaEspecie(rue)
      busquedaPorRUC(d.ruc)

      setTimeout(() => {
        toastSuccess(`Especie asociada a RUE: ${rue} encontrada!`)
        buscandoPorRueLoading.value = false
        collapsed.value = false
        nextStepDisabled.value = false
      }, 1000)
    }
  })
}

function busquedaEspecie (rue) {
  requestUtil({
    action: stepIngresoDinero_getGenerarEtiqueta,
    payload: { rue },
    resolve: (res) => {
      console.log('res by id', res)
      especie.value = res
    }
  })
}
function busquedaPorRUC (ruc) {
  requestUtil({
    action: stepIdentificacionNue_obtenerCausaPorRUC,
    payload: { ruc },
    resolve: (r) => {
      console.log('r ruc', r)
      causa.value = r.fichaCausa
    }
  })
}

const router = useRouter()

function nextStep () {
  requestUtil({
    action: stepBusquedaAgregarSepararEspecies_busquedaPorRue,
    payload: {
      especie: especie.value,
      causa: causa.value
    }
  })
  router.push('/custodia/custodio/decidir-reubicacion/seleccionar-reubicacion')
}
</script>
