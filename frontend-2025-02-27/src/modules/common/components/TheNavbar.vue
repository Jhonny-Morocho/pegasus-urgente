<template>
<Menubar class="navbar">
  <template #start>
    <div class="navbar__start">
      <div class="navbar__start__img">
        <img
          alt="logo-fiscalia"
          class="logo"
          height="40"
          src="@/assets/images/logo-fiscalia.png"
        >
      </div>
      <Breadcrumb
        class="navbar__start__breadcrumb"
        :home="home"
        :model="breadcrumbs"
      >
        <template #item="{ item }">
          <RouterLink
            v-slot="{ navigate, isActive }"
            custom
            :to="item.to"
          >
            <a
              :class="{
                'active-link': isActive,
                'active-link-exact': item.exact
              }"
              @click="item.to ? navigate() : () => {}"
            >
              <template v-if="item.to !== '/'">{{ item.label }}</template>
              <i
                v-else
                :class="item.icon"
              />
            </a>
          </RouterLink>
        </template>
      </Breadcrumb>
    </div>
  </template>
  <template #end>
    <div class="navbar__end">
      <Divider layout="vertical" />

      <div class="mx-2">
        <span class="p-input-icon-right">
          <i class="pi pi-search" />
          <InputText
            placeholder="Buscar"
            type="text"
          />
        </span>
      </div>
      <Divider layout="vertical" />
      <div class="btn-notificacion flex justify-content-evenly">
        <Button
          v-if="hasBtnDiagramaPam"
          :class="!isLoadingDiagramaPam ? 'btn-logPam mr-2 ml-2' : 'p-button-text'"
          :loading="isLoadingDiagramaPam"
          type="button"
          @click="handleDiagramaPam"
        >
          <i
            v-if="isLoadingDiagramaPam"
            class="pi pi-spin pi-spinner text-white"
            style="font-size: 2rem"
          />
          <img
            v-else
            alt="logo-fiscalia"
            class="logoPam"
            src="@/assets/images/icono_pam_3.png"
          >
        </Button>
      </div>
      <Card
        v-if="user"
        class="navbar__end__user"
      >
        <template #content>
          <div class="navbar__end__user__content">
            <img
              alt="user"
              class="navbar__end__user__content__img"
              src="/favicon.ico"
            >
            <div class="navbar__end__user__content__info">
              <div>
                {{ user.preferred_username }}
              </div>
            </div>
            <SplitButton
              class="navbar__end__user__content__btn-settings"
              :model="settingItems"
            />
          </div>
        </template>
      </Card>
    </div>
  </template>
</Menubar>
</template>

<script setup>
/* eslint-disable no-unreachable */

import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSessionStore } from '@/modules/session/composables'
import ModalDiagramaPam from '@/modules/global/components/modals/ModalDiagramaPam.vue'

import { requestUtil } from '@/utils'
import { useAppDialog, useAppGlobalProperties, useAppToast } from '../composables'
import { usePamStore } from '@/modules/global/composables'

const route = useRoute()
const { user, session_logout, session_SET_FISCALIA_ACTUAL } = useSessionStore()
const { procesoPam, pam_getDiagramaProcesoPrincipal, pam_getDiagramaProcesoActual } = usePamStore()

const { toastSuccess } = useAppToast()

const { $userFiscalias } = useAppGlobalProperties()

const { launchDialog } = useAppDialog()

const router = useRouter()

const home = {
  icon: 'pi pi-home',
  to: '/'
}

const settingItems = ref([
  {
    label: 'Salir',
    icon: 'pi pi-sign-out',
    command: () => {
      localStorage.clear()
      requestUtil({
        action: session_logout,
        resolve: () => {
          localStorage.clear()
          console.log('bye-bye')
          router.push('/')
        }
      })
    }
  },
  {
    separator: true
  }
])

function setUserRoleSettings () {
  const fiscalias = $userFiscalias.value
  fiscalias.forEach((f) => {
    settingItems.value.push({
      label: `Cambiar a Fiscalía: ${f.fiscalia}`,
      command: () => cambiarFiscalia(f)
    })
  })
}

function cambiarFiscalia (fiscalia) {
  session_SET_FISCALIA_ACTUAL(fiscalia)
  toastSuccess(`Te has Cambiado a la Fiscalía ${fiscalia.fiscalia}, recargando...`)
  setTimeout(() => {
    router.go()
  }, 1000)
}

onMounted(() => {
  setUserRoleSettings()
})

// WIP CC
const breadcrumbs = computed(() => {
  if (route.path === '/' || !route.meta?.breadcrumb) return []

  const resolvedBreadCrumbs = []

  let parentRoute = route

  // busca en profundidad breadcrumbs en rutas padres
  while (true) {
    resolvedBreadCrumbs.unshift({
      label: parentRoute.meta.breadcrumb.label,
      exact: false,
      to: parentRoute.meta.breadcrumb.previousTo ?? ''
    })

    if (!parentRoute.meta?.breadcrumb?.previousTo) break

    const resolve = router.resolve({
      name: parentRoute.meta.breadcrumb.previousTo.name
    })

    parentRoute = resolve
  }

  const resolvedBreadCrumbsLength = resolvedBreadCrumbs.length

  // si hay más de 1 breadcrumb reorganiza a donde debe navegar el anterior breadcrumb
  if (resolvedBreadCrumbsLength > 1) {
    // mapea los breadcrumbs
    const toBreadcrumbs = resolvedBreadCrumbs.slice(1, resolvedBreadCrumbsLength).map((bc) => bc.to)

    // setea el nombre de la ruta al breadcrumb anterior en indice
    for (const i in toBreadcrumbs) {
      if (!resolvedBreadCrumbs[i]) break
      resolvedBreadCrumbs[i].to = toBreadcrumbs[i]
    }
  }

  // setea el último breadcrumb con exact y vacio para que no tenga acción de enrutado
  resolvedBreadCrumbs[resolvedBreadCrumbsLength - 1].exact = true
  resolvedBreadCrumbs[resolvedBreadCrumbsLength - 1].to = ''

  return resolvedBreadCrumbs
})

const isLoadingDiagramaPam = ref(false)

async function handleDiagramaPam () {
  if (!procesoPam.value?.taskId) {
    // Por si acaso en esas casualidades de la vida no estuviera el taskId (parche para que no falle?)
    return
  }

  const { taskId } = procesoPam.value

  let imagenProcesoPrincipal = null
  let imagenProcesoActual = null

  isLoadingDiagramaPam.value = true
  // NO QUITAR AWAIT
  await requestUtil({
    action: pam_getDiagramaProcesoPrincipal,
    payload: { taskId: taskId },
    resolve: (imagen) => {
      imagenProcesoPrincipal = imagen
    }
  })
  await requestUtil({
    action: pam_getDiagramaProcesoActual,
    payload: { taskId: taskId },
    resolve: (res) => {
      imagenProcesoActual = res
    }
  })

  isLoadingDiagramaPam.value = false
  launchDialog({
    component: ModalDiagramaPam,
    width: '90%',
    showHeader: false,
    props: {
      taskId: taskId,
      imagenProcesoPrincipal: imagenProcesoPrincipal,
      imagenProcesoActual: imagenProcesoActual
    }
  })
}

const noDiagramaPamRoutes = [
  '/',
  '/preclasificador',
  '/asignacion',
  '/custodia',
  '/ingreso/denuncia-directa',
  '/ingreso/denuncia-oficio',
  '/ingreso/denuncia-fisica',
  '/ingreso/solicitar-documentacion',
  '/dirigir-investigacion',
  '/termino-postermino/fiscal',
  '/termino-postermino/fiscal-jefe',
  '/gestion-solicitudes/gestor',
  '/gestion-solicitudes/ejecutor',
  '/gestion-solicitudes/fiscal',
  '/termino-postermino/gestion-direccion-investigacion'
]

const hasBtnDiagramaPam = computed(() => {
  return !noDiagramaPamRoutes.some((path) => path === route.path)
})
</script>

<style lang="scss">
.navbar {
  position: fixed;
  width: 100%;
  background-color: $bg-navbar;
  border: none;
  border-radius: 0;
  height: $navbar-height;
  padding: 0;
  display: flex;
  align-items: center;
  z-index: 100;
  border-bottom: 2px solid #ced4da;

  &__start {
    display: flex;
    align-items: center;

    &__img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: $sidebar-width;
      height: 72px;
      background-color: white;
      border-bottom: 2px solid $secondary-color;
    }

    &__breadcrumb {
      background-color: transparent;
      border: none;
      border-radius: 0;

      li,
      span {
        color: $text-light !important;
      }

      a.active-link {
        cursor: pointer;
        color: $text-light;

        &:hover {
          filter: brightness(90%);
        }

        &-exact {
          color: $secondary-color;
        }
      }
    }
  }

  &__end {
    display: flex;
    align-items: center;

    &__btn {
      margin-left: 4px;
      margin-right: 4px;

      span.p-button-icon {
        color: $text-light;
      }
    }

    &__user {
      display: flex;
      background-color: #adb5bd;

      .p-card-body {
        padding: 3px 8px;
      }
      .p-card-content {
        padding: 6px 0;
      }

      &__content {
        display: flex;
        align-items: center;
        &__img {
          height: 40px;
          border-radius: 50%;
        }
        &__info {
          padding: 0 8px;
          & div:nth-child(0n + 1) {
            color: $primary-color;
            font-weight: 700;
          }
          & div:nth-child(0n + 3) {
            color: $text-dark-medium;
          }
        }
        &__btn-settings {
          & button:nth-child(0n + 1) {
            display: none;
          }
          & button:nth-child(0n + 2) {
            background-color: transparent;
            border-radius: 4px;

            &:hover {
              background-color: $bg-navbar;
            }

            & .p-button-icon {
              color: $text-dark-medium;
            }
          }
        }
      }
    }
  }
}

.btn-badge {
  font-size: 22px;
  padding-top: 8%;
  color: white;
}
.p-overlay-badge .p-badge {
  top: 11px !important;
  background-color: #fca149 !important;
}
.p-splitbutton .p-splitbutton-defaultbutton {
  display: none !important;
}
.btn-logPam {
  background-color: #606e84 !important;
  border-color: #606e84 !important;
}
.logoPam {
  background-color: #606e84 !important;
  border-color: #606e84 !important;
  width: 80%;
  z-index: 3;
}
.diagrama {
  text-align: center !important;
}
</style>
