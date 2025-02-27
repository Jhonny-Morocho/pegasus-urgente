<template>
<AppFieldset
  class="pr-0 w-12"
  legend="Denominación de Dineros"
>
  <FormDesgloseDinero
    :data="dinero"
    @add-desglose="addDesglose"
  />
  <div class="col-12 pr-4">
    <TablaDesgloseDinero
      :data="dinero"
    />
  </div>
  <ResultadoMonto
    :data="especiesIncautadas.dineroDesglosado"
    :monto-original="dinero?.monto"
    :monto-total="montoTotal"
  />
</AppFieldset>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { computed, defineProps, defineEmits } from 'vue'
import FormDesgloseDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/FormDesgloseDinero.vue'
import TablaDesgloseDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaDesgloseDinero.vue'
import ResultadoMonto from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/ResultadoMonto.vue'
import { useAppToast } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useEspecieIncautadaPendienteRecepcionStore } from '@/modules/recepcion-especies-dinero/composables'
import { useSessionStore } from '@/modules/session/composables'
import { useMantenedorStore } from '@/modules/global/composables'

const prop = defineProps({
  readOnly: Boolean,
  seleccionarData: propTypes.object
})

const {
  mantenedor_getNombreDenominacionDinero
} = useMantenedorStore()

const dinero = computed(() => prop.seleccionarData?.dineroDesglosado)

const {
  toastSuccess,
  toastError
} = useAppToast()

const {
  especiesIncautadas,
  stepEspeciesIncautadasPendientesDeRecepcion_ingresarDesgloseDinero
} = useEspecieIncautadaPendienteRecepcionStore()

const { user } = useSessionStore()

const emit = defineEmits(['actualizar-tabla'])

function addDesglose (data) {
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_ingresarDesgloseDinero,
    payload: {
      idEspecie: especiesIncautadas.value.idEspecie,
      tipoDivisa: data.tipoMoneda ?? dinero.value.tipoMoneda,
      monto: data.total + (dinero.value?.monto ?? 0),
      denominacion: data.denominacion,
      tipo: data.tipo,
      cantidad: data.cantidadDinero,
      total: data.total,
      creadoPor: user.value.preferred_username,
      idFuncionario: user.value.sub
    },
    resolve: (r) => {
      toastSuccess('Agregado!')
      emit('actualizar-tabla', especiesIncautadas.value)
    },
    reject: (e) => {
      toastError('ERORR')
    }
  })
}

const montoTotal = computed(() => {
  let t = 0
  dinero.value?.desglose.forEach((e) => {
    t += +mantenedor_getNombreDenominacionDinero(e.denominacion) * e.cantidadDinero
  })
  return t
})
</script>
