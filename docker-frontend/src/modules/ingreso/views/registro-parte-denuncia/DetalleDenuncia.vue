<template>
<section>
  <AppBtnNextTeleported
    label="Registrar Parte/Denuncia"
    :loading="loadingRegistrarParte"
    @click="registrarDenuncia"
  />
  <IngresarParteDenuncia />
</section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import IngresarParteDenuncia from '@/modules/global/components/detalle-denuncia/IngresarParteDenuncia.vue'
import { useAppDialog, useAppToast, useAppGlobalProperties } from '@/modules/common/composables'
import ModalRegistrarParteDenuncia from '@/modules/global/components/detalle-denuncia/modals/ModalRegistrarParteDenuncia.vue'
import { useMantenedorStore, useOficinaPartesStore } from '@/modules/global/composables/'

import { requestUtil } from '@/utils'

const loadingRegistrarParte = ref(false)

const router = useRouter()

const { toastSuccess, toastError } = useAppToast()

const { launchDialog } = useAppDialog()

const { oficinaPartes_addParteDenuncia, oficinaPartes_addDenuncia, registroParte, oficinaPartes_LIMPIAR_PARTES } = useOficinaPartesStore()

const { $userSub, $userFiscaliaActual, $userPrincipalRole } = useAppGlobalProperties()

const { mantenedor_getNombreFiscalia } = useMantenedorStore()

onMounted(() => {
  mantenedor_getNombreFiscalia()
})
function registrarDenuncia () {
  const usuario = {
    userSub: $userSub.value,
    region: `${$userFiscaliaActual.value.region}`,
    fiscalia: $userFiscaliaActual.value.fiscalia,
    rol: $userPrincipalRole.value
  }
  launchDialog({
    component: ModalRegistrarParteDenuncia,
    header: 'Registrar Parte/Denuncia',
    width: '40vw',
    confirmLabel: 'Aceptar',
    accept: () => {
      requestUtil({
        action: oficinaPartes_addParteDenuncia,
        payload: registroParte,
        resolve: () => {
          requestUtil({
            action: oficinaPartes_addDenuncia,
            payload: usuario,
            resolve: () => {
              toastSuccess('Denuncia Registrada')
              oficinaPartes_LIMPIAR_PARTES()
              router.push({ name: 'RegistroParte', params: { reset: true } })
            },
            loader: (l) => (loadingRegistrarParte.value = l),
            reject: (r) => {
              console.log('reject: ', r)
              if (r.mensaje.includes('Parte Denuncia ya existe'))toastError('El número Parte Denuncia ya se encuentra registrado')
              else toastError('Ocurrió un error al registrar el parte. Intente Nuevamente')
            }
          })
        },
        reject: (err) => {
          console.log(err)
          toastError('noOK', err)
        }
      })
    }
  })
}
</script>
