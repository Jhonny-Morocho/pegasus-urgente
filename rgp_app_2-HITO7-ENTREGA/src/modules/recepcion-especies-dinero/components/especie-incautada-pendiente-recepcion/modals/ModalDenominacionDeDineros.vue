<template>
<div class="">
  <Divider />
  <FormDesgloseDinero
    v-if="esRectificar"
    :data="dataDinero"
    @add-desglose="addDesglose"
  />
  <TablaDesgloseDinero
    class="mb-4"
    :data="dineroDesglosado"
  />
  <ResultadoMonto
    :data="dataDinero"
    :monto-original="dataDinero?.monto"
    :monto-total="montoTotal"
  />
</div>
</template>
<script setup>
import { computed, defineProps, ref, defineExpose } from 'vue'
import { useEspecieIncautadaPendienteRecepcionStore } from '@/modules/recepcion-especies-dinero/composables'
import FormDesgloseDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/FormDesgloseDinero.vue'
import TablaDesgloseDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaDesgloseDinero.vue'
import ResultadoMonto from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/ResultadoMonto.vue'
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useSessionStore } from '@/modules/session/composables'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'

const { user } = useSessionStore()

const {
  stepEspeciesIncautadasPendientesDeRecepcion_ingresarDesgloseDinero,
  stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie
} = useEspecieIncautadaPendienteRecepcionStore()

const {
  mantenedor_getNombreDenominacionDinero
} = useMantenedorStore()

const p = defineProps({
  esRectificar: Boolean,
  dataDinero: propTypes.object,
  idEspecie: propTypes.string
})

const {
  toastSuccess,
  toastError
} = useAppToast()

function desglosar (r) {
  const dinerofiltrado = r.dinero?.filter((d) => d.tipoMoneda)
  return {
    tipoMoneda: dinerofiltrado?.find((d) => d.tipoMoneda)?.tipoMoneda ?? null,
    monto: dinerofiltrado?.find((d) => d.monto)?.monto ?? 0,
    desglose: dinerofiltrado?.map((d) => {
      return {
        denominacion: d.denominacion,
        tipo: d.tipo,
        cantidadDinero: d.cantidadDinero,
        idDetalleEspecieDinero: d.idDetalleEspecieDinero,
        divisor: d.total / d.cantidadDinero
      }
    })
  }
}

const dineroDesglosado = ref([])

function updateTabla () {
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: p.idEspecie },
    resolve: (r) => {
      dineroDesglosado.value = desglosar(r)
    }
  })
}
updateTabla()

function addDesglose (data) {
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_ingresarDesgloseDinero,
    payload: {
      idEspecie: p.idEspecie,
      tipoDivisa: data.tipoMoneda ?? p.dataDinero?.tipoMoneda,
      monto: data.total + (p.dataDinero?.dineroDesglosado?.monto ?? 0),
      denominacion: data.denominacion,
      tipo: data.tipo,
      cantidad: data.cantidadDinero,
      total: data.total,
      creadoPor: user.value.preferred_username,
      idFuncionario: user.value.sub
    },
    resolve: (r) => {
      toastSuccess(`Monto ${r.data.find(d => d.monto).monto} agregado.`)
      updateTabla()
    },
    reject: (e) => {
      toastError('ERORR', e)
    }
  })
}

const montoTotal = computed(() => {
  let t = 0
  dineroDesglosado.value?.desglose?.forEach((e) => {
    t += mantenedor_getNombreDenominacionDinero(e.denominacion) * e.cantidadDinero
  })
  return t
})

function retrieveData (retrieve) {
  if (!dineroDesglosado.value) {
    toastError('Debes buscar una fiscalía competente')
    return
  }
  retrieve?.(dineroDesglosado.value)
}

defineExpose({ retrieveData })
</script>
