<template>
<AppFieldset
  class="col-12"
  legend="Información de Cámaras"
>
  <div class="col-12 md:col-6 grid px-0 mx-0">
    <div class="col-12">
      <h4 class="mb-2 text-center">
        ¿Existen Cámaras Activadas? (*)
      </h4>
      <span>
        <AppSelectButton
          id="existen-camaras"
          v-model="formData.existeCamara"
          :disabled="readOnly"
          option-label="descripcion"
          option-value="id"
          :options="filterTipoRespuestaBasica"
          :rules="{ required }"
        />
      </span>
    </div>
    <div class="col-12">
      <AppDropdown
        v-if="formData.existeCamara === 'Si'"
        id="ubicacion-camaras"
        v-model="formData.lugarCamara"
        class="mt-0"
        :disabled="readOnly"

        label="Lugar de Ubicación de Cámaras"
        option-label="name"
        option-value="name"
        :options="ubicacionCamarasOptions"
        :rules="{ required }"
        show-clear
      />
    </div>
    <div class="col-12">
      <h4 class="mb-2 text-center">
        ¿Se Incautaron Imágenes? (*)
      </h4>
      <span>
        <AppSelectButton
          id="incautaron-imagenes"
          v-model="formData.incautaronImagenes"
          :disabled="readOnly"
          option-label="descripcion"
          option-value="id"
          :options="filterTipoRespuestaBasica"
          :rules="{ required }"
        />
      </span>
    </div>
    <div class="col-12">
      <AppDropdown
        v-if="formData.incautaronImagenes === 'Si'"
        id="contenido-camara"
        v-model="formData.contenidoCamara"
        class="mt-0"
        :disabled="readOnly"
        label="Contenido de Grabación de Cámara"
        option-label="name"
        option-value="name"
        :options="[
          { name: 'Contiene hecho delictual' },
          { name: 'Permite identificar imputado' },
          { name: 'Imputado' },
        ]"
        :rules="{ required }"
        show-clear
      />
    </div>
  </div>
  <div class="col-12 md:col-6 grid">
    <AppTextarea
      id="observacion-adicional"
      v-model="formData.observacionAdicionalCamara"
      class="col-12 pb-0 ml-2"
      :disabled="readOnly"
      label="Observación Adicional Asociada a Cámaras"
      rows="20"
    />
  </div>
</AppFieldset>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
const { required } = useFormValidation()
const { tipoRespuestaBasica } = useMantenedorStore()

defineProps({
  readOnly: Boolean,
  dataDelito: propTypes.object
})

const { delitoInject } = useDelitoInject()

const formData = delitoInject

const filterTipoRespuestaBasica = computed(() => {
  const fixedLabel = tipoRespuestaBasica.value.map(e => {
    if (e.descripcion.includes('No Informado')) return { ...e, descripcion: 'No Consultado' }
    return e
  })
  return fixedLabel.filter(respuesta => respuesta.codigo !== '4')
})
const ubicacionCamarasOptions = [
  { name: 'Cámaras Pública' },
  { name: 'Cámaras Estableciemiento comercial' },
  { name: 'Cámaras Locomoción Colectiva' },
  { name: 'Cámaras Cajero' },
  { name: 'Cámaras Privada' },
  { name: 'Otras cámaras' },
  { name: 'Sin información' },
  { name: 'Cámara de Recidencia Particular' },
  { name: 'Cámara de funcionario Policial' }
]
</script>
