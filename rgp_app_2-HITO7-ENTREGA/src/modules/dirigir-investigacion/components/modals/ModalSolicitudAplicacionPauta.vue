<template>
<hr class="mb-4 mt-0">
<section class="px-3 pt-3 pb-0 mb-2">
  <ul class="grid list-none pl-3 mb-4">
    <li class="col-12 md:col-6">
      <strong>RUC:</strong> {{ idGlobal || 'N/A' }}
    </li>
    <li class="col-12 md:col-6">
      <strong>Fiscal Asignado:</strong> {{ dataModal.fiscalAsignado || 'N/A' }}
    </li>
  </ul>
  <AppFieldset
    class="p-3"
    legend="Identificación del Sujeto / Interviniente"
  >
    <ul class="grid list-none w-full mt-2 mx-0 px-0">
      <li class="col-12 md:col-6 px-2">
        <strong>Tipo Sujeto:</strong> {{ mantenedor_getNombreTipoSujeto(sujeto?.tipoSujeto) || 'N/A' }}
      </li>
      <li class="col-12 md:col-6">
        <strong>N° Documento:</strong> {{ sujeto?.numeroDocumento || 'N/A' }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Nombre Completo:</strong> {{ sujeto?.nombres || 'N/A' }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Edad:</strong> {{ sujeto?.edad || 'N/A' }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Dirección:</strong> {{ sujeto?.direccion || 'N/A' }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Comuna:</strong> {{ sujeto?.comuna || 'N/A' }}
      </li>
    </ul>
    <div class="grid mx-0 px-0 w-full">
    <!--  -->
    </div>
  </AppFieldset>
  <AppFieldset
    class="p-3"
    legend="Pautas Aplicadas"
  >
    <TablaPautasAplicadas
      :value="pautasAplicadas"
      @eliminar-pauta="eliminarPauta"
    />
  </AppFieldset>
  <AppFieldset
    class="px-3 pt-3 pb-0"
    legend="Lista de Pautas Identificadas"
  >
    <div class="col-12 md:col-8 p-fluid">
      <AppDropdown
        id="pauta"
        v-model="pauta"
        label="Seleccionar Pauta"
        option-label="descripcion"
        option-value="descripcion"
        :options="pautaOptions"
      />
    </div>
    <div class="col-12 md:col-4 p-fluid">
      <Button
        class="btn-form"
        icon="pi pi-save"
        icon-pos="right"
        label="Aplicar Pauta"
        @click="aplicarPauta"
      />
    </div>
  </AppFieldset>
  <div class="flex flex-row-reverse">
    <Button
      class="p-button-text"
      label="Cerrar"
      @click="dialog.close()"
    />
  </div>
</section>
</template>
<script setup>
import { inject, ref } from 'vue'
import TablaPautasAplicadas from '@/modules/dirigir-investigacion/components/TablaPautasAplicadas.vue'
import { useMantenedorStore } from '@/modules/global/composables'

const {
  mantenedor_getNombreTipoSujeto
} = useMantenedorStore()

/*
Evaluar si corresponde la aplicación de pauta obligatoria, según el delito y las características de los intervinientes.
Si de acuerdo con el delito y la víctima corresponde la aplicación de pauta obligstoria, entonces alertar al fiscal.
*/

const dialog = inject('dialogRef')

const { idGlobal, sujeto } = dialog.value?.data

const pauta = ref('')

async function eliminarPauta (pautaAEliminar) {
  console.log('🚀 ~ file: ModalSolicitudAplicacionPauta.vue ~ line 111 ~ eliminarPauta ~ pautaAEliminar', pautaAEliminar)
}

async function aplicarPauta () {
  console.log('🚀 ~ file: ModalSolicitudAplicacionPauta.vue ~ line 146 ~ aplicarPauta ~ aplicarPauta')
}

const dataModal = {
  fiscalAsignado: 'Samuel Nuñez Parga'
}

const pautasAplicadas = [
  // {
  //   idPauta: 'idPauta 1',
  //   pauta: 'pauta 1',
  //   usuarioQueAplica: 'usuarioQueAplica',
  //   evaluacionRiesgo: 'evaluacionRiesgo'
  // },
  // {
  //   idPauta: 'idPauta 2',
  //   pauta: 'pauta 2',
  //   usuarioQueAplica: 'usuarioQueAplica',
  //   evaluacionRiesgo: 'evaluacionRiesgo'
  // }
]

const pautaOptions = [
  { id: '1', descripcion: 'Pauta de Intimidación' },
  { id: '2', descripcion: 'Pauta Det. Necesidades' },
  { id: '3', descripcion: 'Pauta Delitos Violentos' },
  { id: '4', descripcion: 'Pauta Reticencia Delitos Violentos' },
  { id: '5', descripcion: 'Pauta VIF Sin Contacto' },
  { id: '6', descripcion: 'Pauta VIF Flagrancia' },
  { id: '7', descripcion: 'Pauta VIF' },
  { id: '7', descripcion: 'Pauta NNA' }
]
</script>
