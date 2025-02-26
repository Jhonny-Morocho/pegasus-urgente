<template>
<AppForm
  id="creacionCatalogo"
  class="col-12"
  :form-submitted="formSubmitted"
  validation-scope="formCreacionCatalogo"
>
  <div class="card pl-6">
    <div class="grid formgrid mb-5">
      <div class="col">
        <div class="grid formgrid">
          <div class="col-10">
            <AppDropdown
              id="tipoCatalogo"
              v-model="formData.tipoCatalogo"
              label="Tipo Catálogo"
              option-label="name"
              option-value="name"
              :options="[{ name: 'Archivador' }, { name: 'Causa' }, { name: 'Denuncia' }, { name: 'Folio' }]"
              :rules="{ required }"
              show-clear
            />
          </div>
        </div>
      </div>

      <div class="col">
        <div class="grid formgrid">
          <div class="col-10">
            <AppInput
              id="seleccion"
              v-model="formData.seleccion"
            />
          </div>
        </div>
      </div>

      <div class="col">
        <div class="grid formgrid">
          <div class="col-10">
            <AppInput
              id="nombreCatálogo"
              v-model="formData.nombreCatálogo"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="grid formgrid pt-4 pb-4 flex align-items-center justify-content-end mr-0">
      <div class="col-3">
        <Button
          class="p-button-outlined"
          icon="pi pi-window-maximize"
          icon-pos="right"
          label="Búsqueda Avanzada"
          @click="handleBusquedaAvanzada()"
        />
      </div>
      <div class="col-3">
        <Button
          class="p-button-outlined"
          icon="pi pi-search"
          icon-pos="right"
          label="Buscar"
          @click="handleSearchCatalogo()"
        />
      </div>
    </div>
  </div>
</AppForm>
</template>

<script setup>
import { defineExpose, reactive } from 'vue'
import { useFormValidation, useAppDialog } from '@/modules/common/composables'
import ModalBusquedaAvanzada from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/modal/BusquedaAvanzada'
const { launchDialog } = useAppDialog()

const formData = reactive({
  nombreCatalogo: '',
  tipoCatalogo: 1,
  nivelAcceso: 0,
  disponibilidad: 0,
  descripcion: ''
})

const { formSubmitted, required, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: 'formCreacionCatalogo'
})

defineExpose({ formData, isFormValid, resetFormData })

function handleBusquedaAvanzada () {
  launchDialog({
    component: ModalBusquedaAvanzada,
    header: 'Búsqueda Avanzada',
    width: '70%',
    confirmLabel: 'Confirmar selección',
    cancelLabel: 'Cancelar',
    confirmIcon: '',
    confirmIconPos: ''
    // props: { interviniente: response.interviniente, ruc: ruc.value },
    // accept: async (res) => {
    //  patchProponerDestinoEspecie(especie, res)
    // }
  })
}
</script>
<style scoped>
.end {
  text-align: end;
}

.question {
  color: black;
  background-color: transparent;
  padding: 16px 16px 0px 0px;
}

.question:hover {
  color: black;
  background-color: transparent;
}
</style>
