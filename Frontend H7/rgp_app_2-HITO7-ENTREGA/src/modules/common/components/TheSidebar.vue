<template>
<section class="flex flex-column sidebar">
  <div class="sidebar__header">
    <div class="flex justify-content-between w-full px-2">
      <span class="my-auto">MENU</span>
      <Button
        v-if="false"
        icon="pi pi-bars"
        @click="showHideSideBar"
      />
    </div>
  </div>
  <PanelMenu
    v-if="inFichaCausa || inFichaSujeto"
    class="sidebar__panel"
    :model="itemsNavegacion"
  />

  <PanelMenu
    v-else
    class="sidebar__panel"
    :model="menuItems"
  />
  <div class="flex flex-column justify-content-end align-items-end h-full text-white">
    <p class="mr-3 mb-2">
      Fiscalia Actual: {{ $userFiscaliaActual?.fiscalia }}
    </p>
    <p class="mr-3 mb-2">
      v {{ version }}
    </p>
  </div>
  <div class="mb-3 ml-1 mt-2">
    <img
      v-tooltip="'SonarQube 9.5'"
      alt="SonarQube"
      src="@/assets/images/measure.svg"
    >
  </div>
</section>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
import { version } from './../../../../package.json'

// composables
import { useAppGlobalProperties } from '@/modules/common/composables'
import { useSessionStore } from '@/modules/session/composables'
import { useRoute } from 'vue-router'
import { appUtil } from '@/utils'
import { useFichaCausa, useFichaCausaStore } from '@/modules/ficha-causa/composables'

const { perfiles } = useSessionStore()
const { $hasSomeRoles, $userFiscaliaActual } = useAppGlobalProperties()

const { flujoOrigen } = useFichaCausa()
const { origenCausa } = useFichaCausaStore()

// USUARIOS AMBIENTES CAPA Y QA
const atendedorJuridico = computed(() => perfiles?.value[0]?.atendedor_juridico)
const fiscalJefe = computed(() => perfiles?.value[1]?.fiscal_jefe)
const policiaTurno = computed(() => perfiles?.value[5]?.policia_turno)
const fiscalTurno = computed(() => perfiles?.value[6]?.fiscal_turno)
const funcionarioOfPartes = computed(() => perfiles?.value[2]?.funcionario_oficina_partes)
const preclasificador = computed(() => perfiles?.value[3]?.preclasificador)
const digitador = computed(() => perfiles?.value[4]?.digitador)
const fiscal = computed(() => perfiles?.value[7]?.fiscal)
const route = useRoute()
// USUARIOS AMBIENTES RGP2

const menuItems = ref([
  {
    key: 'flagrancia',
    label: 'Turno Flagrancia',
    visible: () =>
      $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`]) ||
      $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]) ||
      $hasSomeRoles(policiaTurno.value) ||
      $hasSomeRoles(fiscalTurno.value),
    items: [
      {
        key: 'flagrancia_bandeja',
        label: 'Equipo Turno',
        icon: 'pi pi-fw pi-inbox',
        to: '/flagrancia',
        visible: () => $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`])
      },
      {
        key: 'flagrancia_bandeja_fiscal',
        label: 'Fiscal Turno',
        icon: 'pi pi-fw pi-inbox',
        to: '/flagrancia',
        visible: () => $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]) || $hasSomeRoles(fiscalTurno.value)
      }
    ]
  },
  {
    key: 'ingreso',
    label: 'Ingreso',
    visible: () => $hasSomeRoles(atendedorJuridico.value) || $hasSomeRoles(funcionarioOfPartes.value) || $hasSomeRoles(digitador.value) || $hasSomeRoles(fiscalJefe.value) || $hasSomeRoles(fiscal.value),
    items: [
      {
        key: 'ingreso_bandeja_dd',
        label: 'Denuncia Directa',
        icon: 'pi pi-fw pi-inbox',
        to: '/ingreso/denuncia-directa',
        visible: () => $hasSomeRoles(atendedorJuridico.value)
      },
      {
        key: 'ingreso_bandeja_do',
        label: 'Denuncia Oficio',
        icon: 'pi pi-fw pi-inbox',
        to: '/ingreso/denuncia-oficio',
        visible: () => $hasSomeRoles(fiscalJefe.value)
      },
      {
        key: 'ingreso_bandeja_dfe',
        label: 'Denuncia Física / Electrónica',
        icon: 'pi pi-fw pi-inbox',
        to: '/ingreso/denuncia-fisica',
        visible: () => $hasSomeRoles(digitador.value)
      },
      {
        key: 'ingreso_of_parte_solicitar',
        label: 'Bandeja Of. de Partes',
        icon: 'pi pi-fw pi-inbox',
        to: '/ingreso/solicitar-documentacion',
        visible: () => $hasSomeRoles(funcionarioOfPartes.value)
      },
      {
        key: 'ingreso_of_parte',
        label: 'Ingreso parte denuncia',
        icon: 'pi pi-fw pi-inbox',
        to: '/ingreso/registrar-parte/registro',
        visible: () => $hasSomeRoles(funcionarioOfPartes.value)
      }
    ]
  },
  {
    key: 'preclasificador',
    label: 'Preclasificador',
    visible: () => $hasSomeRoles(preclasificador.value),
    items: [
      {
        key: 'preclasificador_bandeja',
        label: 'Bandeja',
        icon: 'pi pi-fw pi-inbox',
        to: '/preclasificador'
      }
    ]
  },
  {
    key: 'asignacion',
    label: 'Asignación',
    visible: () => $hasSomeRoles(fiscalJefe.value),
    items: [
      {
        key: 'asignacion_bandeja',
        label: 'Bandeja',
        icon: 'pi pi-fw pi-inbox',
        to: '/asignacion'
      }
    ]
  },
  {
    key: 'custodio',
    label: 'Custodio',
    visible: () => $hasSomeRoles(['zona_2_fiscalia_901_fiscal_EYD', 'zona_2_fiscalia_901_custodio_EYD', 'one-single-role', 'admin']),
    items: [
      {
        key: 'custodio_bandeja',
        label: 'Recepción Especies/Dineros',
        icon: 'pi pi-fw pi-inbox',
        to: '/custodia/custodio',
        visible: () => $hasSomeRoles(['zona_2_fiscalia_901_custodio_EYD', 'one-single-role', 'admin'])
      },
      {
        key: 'custodio_bandeja',
        label: 'Bandeja Fiscal',
        icon: 'pi pi-fw pi-inbox',
        to: '/custodia/fiscal',
        visible: () => $hasSomeRoles(['zona_2_fiscalia_901_fiscal_EYD'])
      },
      {
        key: 'custodio_bandeja',
        label: 'Bandeja Profesional UAF',
        icon: 'pi pi-fw pi-inbox',
        to: '/custodia/uaf',
        visible: () => $hasSomeRoles(['zona_2_fiscalia_901_profesional_UAF_EYD'])
      }
    ]
  },
  {
    key: 'dirigir-investigacion',
    label: 'Dirigir Investigación',
    visible: () => $hasSomeRoles(fiscal.value) || $hasSomeRoles(fiscalJefe.value),
    items: [
      {
        key: 'dirigir_investigacion',
        label: 'Bandeja',
        icon: 'pi pi-fw pi-inbox',
        to: '/dirigir-investigacion'
      }
    ]
  },
  {
    key: 'termino-postermino',
    label: 'Término y Postérmino',
    visible: () => $hasSomeRoles(fiscal.value),
    items: [
      {
        key: 'bandeja_fiscal',
        label: 'Fiscal',
        icon: 'pi pi-fw pi-inbox',
        to: '/termino-postermino/fiscal'
      },
      {
        key: 'bandeja_fiscal_jefe',
        label: 'Fiscal Jefe',
        icon: 'pi pi-fw pi-inbox',
        to: '/termino-postermino/fiscal-jefe'
      },
      {
        key: 'bandeja_fiscal_regional',
        label: 'Fiscal Regional',
        icon: 'pi pi-fw pi-inbox',
        to: '/termino-postermino/fiscal-regional'
      },
      {
        visible: () => $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_jefe_GDI`]),
        key: 'bandeja_gestion_direccion-investigacion',
        label: 'Gestión y Dirección de Investigación',
        icon: 'pi pi-fw pi-inbox',
        to: { name: 'BandejaGestionDireccionInvestigacion' }
      }
    ]
  },
  {
    key: 'catalogo-documental-digital',
    label: 'Catálogo Documental Digital',
    visible: () => $hasSomeRoles(['one-single-role', 'admin']) || $hasSomeRoles(fiscalJefe.value) || $hasSomeRoles(fiscal.value) || $hasSomeRoles(funcionarioOfPartes.value),
    items: [
      {
        key: 'BandejaFiscalCdd',
        label: 'Bandeja Fiscal',
        icon: 'pi pi-fw pi-inbox',
        to: { name: 'BandejaFiscalCdd' },
        visible: () => $hasSomeRoles(['one-single-role', 'admin']) || $hasSomeRoles(fiscalJefe.value) || $hasSomeRoles(fiscal.value)
      },
      {
        key: 'CddBandejaOficinaPartes',
        label: 'Bandeja Of. de Partes',
        icon: 'pi pi-fw pi-inbox',
        to: { name: 'CddBandejaOficinaPartes' },
        visible: () => $hasSomeRoles(['one-single-role', 'admin']) || $hasSomeRoles(funcionarioOfPartes.value)
      },
      {
        key: 'CddBandejaEncargadoBodega',
        label: 'Bandeja Encargado de Bodega',
        icon: 'pi pi-fw pi-inbox',
        to: { name: 'CddBandejaEncargadoBodega' },
        visible: () => $hasSomeRoles(['one-single-role', 'admin'])
      }
    ]
  },
  {
    key: 'gestion-solicitudes',
    label: 'Gestión de Solicitudes',
    visible: () => $hasSomeRoles(['zona_2_fiscalia_901_apaf_GDS', 'zona_2_fiscalia_901_equipo_juridico_GDS', 'zona_2_fiscalia_901_ejecutor_mismafiscalia_GDS', 'zona_2_fiscalia_901_fiscal_GDS']),

    items: [
      {
        key: 'bandeja_gestor',
        label: 'Bandeja Gestor',
        icon: 'pi pi-fw pi-inbox',
        to: '/gestion-solicitudes/gestor',
        visible: () => $hasSomeRoles(['zona_2_fiscalia_901_equipo_juridico_GDS', 'zona_2_fiscalia_901_ejecutor_mismafiscalia_GDS'])
      },
      {
        key: 'bandeja_ejecutor',
        label: 'Bandeja Ejecutor',
        icon: 'pi pi-fw pi-inbox',
        to: '/gestion-solicitudes/ejecutor',
        visible: () => $hasSomeRoles(['zona_2_fiscalia_901_equipo_juridico_GDS', 'zona_2_fiscalia_901_ejecutor_mismafiscalia_GDS'])
      },
      {
        key: 'bandeja_fiscal',
        label: 'Bandeja Fiscal',
        icon: 'pi pi-fw pi-inbox',
        to: '/gestion-solicitudes/fiscal',
        visible: () => $hasSomeRoles(['zona_2_fiscalia_901_fiscal_GDS', 'zona_2_fiscalia_901_apaf_GDS'])
      }
    ]
  },
  {
    key: 'tramitar-audiencia',
    label: 'Tramitar Audiencia',
    visible: () => $hasSomeRoles(['one-single-role', 'admin']),
    items: [
      {
        key: 'bandeja_fiscal',
        label: 'Fiscal',
        icon: 'pi pi-fw pi-inbox',
        to: '/tramitar-audiencia'
      }
    ]
  },
  {
    key: 'gestionar-consulta-fr',
    label: 'Gestionar Consultas',
    visible: () => $hasSomeRoles(['one-single-role', 'admin']),
    items: [
      {
        key: 'bandeja_administrativo',
        label: 'Administrativo',
        icon: 'pi pi-fw pi-inbox',
        to: '/gestionar-consulta-fr/administrativo'
      },
      {
        key: 'bandeja_asesor_juridico',
        label: 'Asesor Jurídico',
        icon: 'pi pi-fw pi-inbox',
        to: '/gestionar-consulta-fr/asesor-juridico'
      },
      {
        key: 'bandeja_fiscal_regional',
        label: 'Fiscal Regional',
        icon: 'pi pi-fw pi-inbox',
        to: '/gestionar-consulta-fr/fiscal-regional'
      }
    ]
  },
])

const { scrollTo } = appUtil

const inFichaCausa = computed(() => route.path.includes('/causa/ficha-causa'))
const inFichaSujeto = computed(() => route.path === '/ficha-sujeto')

const itemsNavegacion = computed(() => {
  if (inFichaCausa.value) {
    return itemsFichaCausa.value
  }
  if (inFichaSujeto.value) {
    return itemsFichaSujeto.value
  }
  return []
})

const itemsFichaCausa = ref([
  {
    key: 'nav-ficha-causa',
    label: 'Navegación rápida  ',
    items: [
      {
        key: 'nav_resumen_causa',
        label: 'Resumen de la Causa',
        command: () => scrollTo('#resumen-causa')
      },
      {
        key: 'nav_info_denuncia',
        label: 'Información de la Denuncia',
        command: () => scrollTo('#informacion-denuncia'),
        visible: () => origenCausa.value === flujoOrigen.DENUNCIA_OFICIO
      },
      {
        key: 'nav_denunciante',
        label: 'Datos del Denunciante',
        command: () => scrollTo('#datos-denunciante')
      },
      {
        key: 'nav_intervinientes',
        label: 'Lista de Intervinientes',
        command: () => scrollTo('#lista-intervinientes')
      },
      {
        key: 'nav_delitos',
        label: 'Delitos',
        command: () => scrollTo('#lista-delitos')
      },
      {
        key: 'nav_relaciones',
        label: 'Relaciones',
        command: () => scrollTo('#relaciones')
      },
      {
        key: 'nav_relato',
        label: 'Relato del Hecho',
        command: () => scrollTo('#relato')
      },
      {
        key: 'nav_especies',
        label: 'Lista de Especies/Dinero',
        command: () => scrollTo('#lista-especies')
      },
      {
        key: 'nav_diligencias',
        label: 'Diligencias',
        command: () => scrollTo('#diligencias')
      },
      {
        key: 'nav_anotaciones',
        label: 'Anotaciones',
        command: () => scrollTo('#anotaciones')
      },
      {
        key: 'nav_audiencias',
        label: 'Audiencias',
        command: () => scrollTo('#audiencias')
      },
      {
        key: 'nav_causas_agrupadas',
        label: 'Causas agrupadas',
        command: () => scrollTo('#causas-agrupadas')
      }
    ]
  }
])

const itemsFichaSujeto = ref([
  {
    key: 'navegacionRapidaFichaSujeto',
    label: 'Navegación rápida  ',
    items: [
      {
        key: 'navegacionRapidaFichaSujeto',
        label: 'Información de Identidad',
        command: () => scrollTo('#fieldset-informacion-de-identidad')
      },
      {
        key: 'navegacionRapidaFichaSujeto',
        label: 'Caracterización',
        command: () => scrollTo('#fieldset-caracterizacion')
      },
      {
        key: 'navegacionRapidaFichaSujeto',
        label: 'Otros documentos asociados',
        command: () => scrollTo('#fieldset-otros-documentos-asociados')
      },
      {
        key: 'navegacionRapidaFichaSujeto',
        label: 'Direcciones',
        command: () => scrollTo('#fieldset-direcciones')
      },
      {
        key: 'navegacionRapidaFichaSujeto',
        label: 'Redes familiares',
        command: () => scrollTo('#fieldset-redes-familiares')
      }
    ]
  }
])

const emit = defineEmits(['show-hide-sidebar'])

function showHideSideBar () {
  emit('show-hide-sidebar', 'holi')
}
</script>

<style lang="scss">
.sidebar {
  position: fixed;
  top: $navbar-height;
  width: $sidebar-width;
  height: calc(100% - 60px);
  background-color: $bg-sidebar;
  z-index: 999;

  .sidebar__header {
    display: flex;
    align-items: center;
    height: 5rem;
    border-bottom: 1px solid #3d648a;
    color: $text-light;

    & div:nth-child(0n + 1) {
      padding-left: 12px;
      letter-spacing: 6px;
      font-size: 10px;
    }
  }

  &__panel {
    & .p-panelmenu-panel {
      border-bottom: 1px solid #3d648a;

      & .p-panelmenu-header-link {
        color: $text-light !important;
        background-color: $bg-sidebar !important;
        border-radius: 0 !important;

        &:hover {
          background-color: $primary-color !important;
        }
      }
    }
  }

  & .p-menuitem-icon {
    color: #3d648a !important;
  }

  .p-panelmenu .p-panelmenu-content > * {
    background-color: $bg-sidebar;
  }

  .p-menuitem-link:hover {
    background-color: $primary-color !important;
  }

  .p-menuitem-link.router-link-active-exact span {
    color: $secondary-color !important;
  }

  .p-menuitem-text {
    color: $text-light !important;
  }

  .p-panelmenu-content {
    background-color: #3d648a;
    padding: 1px 0 !important;
  }
}

.sidebarvistarapida {
  margin-top: 40px;

  & div:nth-child(0n + 1) {
    font-size: 12px;
  }
}
</style>
