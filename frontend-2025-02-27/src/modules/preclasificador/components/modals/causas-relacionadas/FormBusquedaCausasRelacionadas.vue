<template>
<AppForm
  class="grid"
  :form-submitted="formSubmitted"
  validation-scope="formEditarDiligenciaSugerida"
>
  <AppInput
    id="nombreVictima"
    v-model="formData.nombreVictima"
    class="col-3"
    label="Nombre Victima"
  />
  <AppInput
    id="nroDocumentoImputado"
    v-model="formData.nroDocumentoVictima"
    class="col-3"
    label="N° Documento Víctima"
  />
  <AppInput
    id="nombreImputado"
    v-model="formData.nombreImputado"
    class="col-3"
    label="Nombre Imputado"
  />
  <AppInput
    id="nroDocumentoImputado"
    v-model="formData.nroDocumentoImputado"
    class="col-3"
    label="N° Documento Imputado"
  />
  <AppInput
    id="delito"
    v-model="formData.delito"
    class="col-3"
    label="Delito"
  />
  <AppInput
    id="direccionDelito"
    v-model="formData.direccionDelito"
    class="col-3"
    label="Dirección del Delito"
  />
  <AppInput
    id="fechaHoraDelitoDesde"
    v-model="formData.fechaHoraDelitoDesde"
    class="col-3"
    label="Fecha y Hora del Delito (desde)"
  />
  <AppInput
    id="fechaHoraDelitoHasta"
    v-model="formData.fechaHoraDelitoHasta"
    class="col-3"
    label="Fecha y Hora del Delito (hasta)"
  />
  <AppInput
    id="unidadPolicial"
    v-model="formData.unidadPolicial"
    class="col-3"
    label="Unidad Policial"
  />
  <AppInput
    id="palabraClaveRelato"
    v-model="formData.palabraClaveRelato"
    class="col-3"
    label="Palabra Clave del Relato"
  />
  <div class="col-12 grid">
    <div class="col-3 flex flex-column">
      <label
        class="text-center mb-2 pb-2"
        for="tipoBusqueda"
      >
        Coincidencia Vinculante
      </label>
      <AppSelectButton
        id="tipoBusqueda"
        v-model="formData.tipoBusqueda"
        class=""
        option-label="lbl"
        option-value="value"
        :options="[
          { lbl: 'Total', value: 'Combinada' },
          { lbl: 'Parcial', value: 'Vinculante' }
        ]"
      />
    </div>
  </div>
  <div class="col-12 flex justify-content-center">
    <Button
      id="btnBuscar"
      class="justify-content-center btn-form"
      icon="pi pi-search"
      icon-pos="right"
      label="Buscar"
      style="width: 240px"
      @click="buscarCausasRelacionadas"
    />
  </div>
</AppForm>
</template>

<script setup>
import { reactive } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'

import { useMenuSuperiorPreclasificadorStore } from '@/modules/preclasificador/composables/useMenuSuperiorPreclasificadorStore'

const { menuSuperiorPreclasificador_getCausasRelacionadas } = useMenuSuperiorPreclasificadorStore()
const formData = reactive({
  nombreVictima: '',
  nroDocumentoVictima: '',
  nombreImputado: '',
  nroDocumentoImputado: '',
  delito: '',
  direccionDelito: '',
  fechaHoraDelitoDesde: '',
  fechaHoraDelitoHasta: '',
  unidadPolicial: '',
  palabraClaveRelato: '',
  tipoBusqueda: null
})
const { formSubmitted } = useFormValidation({
  formData,
  validationScope: 'formBusquedaCausasRelacionadas'
})

function buscarCausasRelacionadas () {
  console.log('buscarCausasRelacionadas()')
  requestUtil({
    action: menuSuperiorPreclasificador_getCausasRelacionadas,
    payload: {
      numeroDenuncia: '12345678-1234-1234-1234-123456789012',
      rutDenunciante: '',
      nombreDenunciante: '',
      tipoDocumentoDenunciante: '',
      rutVictima: '',
      tipoDocumentoVictima: '',
      rutImputado: '',
      tipoDocumentoImputado: '',
      fechaHoraDelito: '2020-01-01T12:00:00',
      fechaDenuncia: '',
      calle: 'ALAMEDA',
      numeroCalle: '222',
      comuna: '12345678-1452-1452-1452-777777777777',
      region: '14785236-9654-9654-9654-789654125418',
      relato: 'prueba',
      palabraClave: '',
      tipoConsulta: 'Vinculante',

      nombreVictima: formData.nombreVictima,
      nroDocumentoVictima: formData.nroDocumentoVictima,
      nombreImputado: formData.nombreImputado,
      nroDocumentoImputado: formData.nroDocumentoImputado,
      delito: formData.delito,
      direccionDelito: formData.direccionDelito,
      fechaHoraDelitoDesde: formData.fechaHoraDelitoDesde,
      fechaHoraDelitoHasta: formData.fechaHoraDelitoHasta,
      unidadPolicial: formData.unidadPolicial,
      palabraClaveRelato: formData.palabraClaveRelato,
      tipoBusqueda: formData.tipoBusqueda
    },
    resolve: (v) => {
      console.log('resolve', v)
    },
    reject: (err) => {
      console.log('reject', err)
    }
  })
}
</script>
