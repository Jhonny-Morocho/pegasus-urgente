<template>
<section
  v-if="isLoading"
  class="w-full flex flex-column  justify-content-center h-8rem"
>
  <LoaderSkeleton />
</section>
<section
  v-else
  class="w-full flex flex-column justify-content-center"
>
  <div v-if="isResumenCausa">
    <h4 class="mb-2">
      Nombre de la Causa:
    </h4>
    <p>{{ resumenCausa?.nombreCausa }}</p>
    <hr>
    <h4 class="mb-2">
      Delito:
    </h4>
    <p>{{ resumenCausa?.delito }}</p>
    <hr>
    <h4 class="mb-2">
      Fiscal Asignado:
    </h4>
    <p>{{ resumenCausa?.nombreFiscalAsignado }}</p>
    <hr>
  </div>

  <div
    v-if="isAnotacion && data.length"
    class="mt-3"
  >
    <div
      v-for="item in data"
      :key="item"
      class="mb-3"
    >
      <p>{{ checkMaxWidth(item.anotacion) }} ({{ formatDate(item.fechaCreacion) }})</p>
      <hr>
    </div>
  </div>

  <div
    v-if="isSolicitudPjud"
    class="mt-3"
  >
    <div v-if="!data.length">
      <p>No existen registros</p>
    </div>
    <template v-else>
      <div
        v-for="item in data"
        :key="item"
        class="mb-3"
      >
        <p>{{ parseSolicitudPJUD(item) }} ({{ item.fechaActividad }})</p>
        <hr>
      </div>
    </template>
  </div>

  <div
    v-if="isHistorial && data.length"
    class="mt-3"
  >
    <div
      v-for="item in data"
      :key="item"
      class="mb-3"
    >
      <p>
        {{ item.tipoActividad }} el {{ formatDate(item.fechaActualizacion) }} por <strong>{{ item.usuario }}</strong>
      </p>
      <hr>
    </div>
  </div>

  <div v-if="isDirectriz">
    <section v-if="directrizCausa">
      <h4 class="mb-2">
        Causa:
      </h4>
      <p v-if="directrizCausa?.descripcionDirectriz.length > 50">
        {{ directrizCausa?.descripcionDirectriz.substring(0, 49) }}
        <Button
          v-tooltip.top="directrizCausa"
          class="p-button-text font-bold text-2xl p-0 m-0"
          label="..."
        />
      </p>
      <p v-else>
        {{ directrizCausa?.descripcionDirectriz }}
      </p>
      <hr>
    </section>
    <section v-if="directrizRelacion">
      <!-- POR HACER -->
    </section>
  </div>

  <div v-if="isDiligenciaPendiente">
    <div v-if="!data.length">
      <p>No existen registros</p>
    </div>
    <template v-else>
      <div
        v-for="item in data"
        :key="item"
      >
        <h4
          v-if="item.nombreInstitucionEjecutora"
          class="mb-2"
        >
          {{ item.nombreInstitucionEjecutora }}
        </h4>
        <h4 class="mb-2">
          {{ item.nombreTipoActividad }} ({{ formatDate(item.fechaActividad) }})
        </h4>
        <p>{{ item.nombreSubTipoActividad }}{{ item.nombreSubSubTipoActividad ? ` - ${item.nombreSubSubTipoActividad}` : '' }}</p>
        <hr>
      </div>
    </template>
  </div>

  <div v-if="isDiligenciaEjecutada">
    <div v-if="!data.length">
      <p>No existen registros</p>
    </div>
    <template v-else>
      <div
        v-for="item in data"
        :key="item"
      >
        <h4
          v-if="item.nombreInstitucionEjecutora"
          class="mb-2"
        >
          {{ item.nombreInstitucionEjecutora }} ({{ formatDate(item.fechaActividad) }})
        </h4>
        <div class="mb-2 flex justify-content-between align-items-center">
          <h4>
            {{ item.nombreTipoActividad }}
          </h4>
          <Button
            v-if="item.documento"
            class="p-button-text p-button-lg p-0"
            icon="pi pi-file"
            @click="verDocumento(item?.documentoUrl)"
          />
        </div>
        <p>{{ item.nombreSubTipoActividad }}{{ item.nombreSubSubTipoActividad ? ` - ${item.nombreSubSubTipoActividad}` : '' }}</p>
        <hr>
      </div>
    </template>
  </div>

  <div class="flex justify-content-end mb-0 pb-0">
    <Button
      class="p-button-text btn-primary-outline"
      label="Ver todos "
      @click="verTodo"
    />
  </div>
</section>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes, defineEmits } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils/dateTime.util.js'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const emit = defineEmits(['ver-todo', 'ver-documento'])

defineProps({
  data: propTypes.array,
  resumenCausa: propTypes.object,
  directrizCausa: propTypes.object,
  directrizRelacion: propTypes.array,
  isResumenCausa: Boolean,
  isAnotacion: Boolean,
  isSolicitudPjud: Boolean,
  isHistorial: Boolean,
  isDirectriz: Boolean,
  isDiligenciaPendiente: Boolean,
  isDiligenciaEjecutada: Boolean,
  isLoading: Boolean
})

function verTodo () {
  emit('ver-todo')
}

function verDocumento (documentoUrl) {
  emit('ver-documento', documentoUrl)
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}

function parseSolicitudPJUD (_solicitud) {
  let solicitud = ''
  if (_solicitud?.nombreSubTipoActividad) {
    solicitud = _solicitud.nombreSubTipoActividad
  }
  if (_solicitud?.nombreSubSubTipoActividad) {
    solicitud += ' - ' + _solicitud.nombreSubSubTipoActividad
  }

  return solicitud
}

function checkMaxWidth (_item) {
  return _item && _item.length >= 300 ? _item.slice(0, 300) + '...' : _item
}
</script>
