<template>
<hr>
<main class="px-3 mt-3 w-full">
  <section
    v-if="direccionOrganismo.isLoading"
    class="w-full px-4 py-5"
  >
    <LoaderSkeleton
      class="w-full"
      height="10vh"
    />
  </section>
  <section
    v-else
    class="w-full grid px-4 py-5"
  >
    <ul class="col-12 md:col-6 flex flex-column gap-3 p-0 list-none">
      <li><strong>Región: </strong> {{ direccionOrganismo.region || 'No Informado' }}</li>
      <li><strong>Comuna: </strong> {{ direccionOrganismo.comuna || 'No Informado' }}</li>
      <li><strong>Calle: </strong> {{ direccionOrganismo.calle || 'No Informado' }}</li>
    </ul>
    <ul class="col-12 md:col-6 flex flex-column gap-3 p-0 list-none">
      <li><strong>Número: </strong> {{ direccionOrganismo.numero || 'No Informado' }}</li>
      <li><strong>Teléfono: </strong> {{ direccionOrganismo.telefono || 'No Informado' }}</li>
      <li><strong>Correo: </strong> {{ direccionOrganismo.correo || 'No Informado' }}</li>
    </ul>
  </section>
  <section class="w-full flex flex-row-reverse">
    <Button
      class="p-button-text"
      label="Cerrar"
      @click="dialogRef.close"
    />
  </section>
</main>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { inject, reactive, computed, onMounted } from 'vue'
import { useDireccionStore } from '@/modules/direccion/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { requestUtil } from '@/utils'

const dialogRef = inject('dialogRef')

const { direccion_getDireccionOrganismoColaborador } = useDireccionStore()

const idOrganismoColaborador = computed(() => dialogRef.value?.data.idOrganismoColaborador)

const direccionOrganismo = reactive({
  isLoading: false,
  region: '',
  comuna: '',
  calle: '',
  numero: '',
  telefono: '',
  correo: ''
})

function getDireccionOrganismoColaborador () {
  requestUtil({
    action: direccion_getDireccionOrganismoColaborador,
    payload: {
      idOrganismoColaborador: idOrganismoColaborador.value
    },
    loader: (l) => { direccionOrganismo.isLoading = l },
    resolve: ({ direccion }) => {
      direccionOrganismo.calle = direccion?.calle
      direccionOrganismo.numero = direccion?.numero
      direccionOrganismo.comuna = direccion?.comuna
      direccionOrganismo.region = direccion?.region
    }
  })
}

onMounted(() => {
  getDireccionOrganismoColaborador()
})
</script>
