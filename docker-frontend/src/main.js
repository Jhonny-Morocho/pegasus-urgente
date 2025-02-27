import { createApp } from 'vue'

// vue extensions
import App from './App.vue'
import router from './router'
import store from './store'

// PrimeVue css
import 'primeflex/primeflex.css'
import 'primevue/resources/themes/mdc-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import '@/assets/styles/app.scss'

// PrimeVue Components
import Message from 'primevue/message'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputMask from 'primevue/inputmask'
import Menubar from 'primevue/menubar'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Paginator from 'primevue/paginator'
import Column from 'primevue/column'
import ProgressBar from 'primevue/progressbar'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Chip from 'primevue/chip'
import Chips from 'primevue/chips'
import Fieldset from 'primevue/fieldset'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import OverlayPanel from 'primevue/overlaypanel'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import Steps from 'primevue/steps'
import Breadcrumb from 'primevue/breadcrumb'
import PanelMenu from 'primevue/panelmenu'
import Sidebar from 'primevue/sidebar'
import ScrollPanel from 'primevue/scrollpanel'
import SelectButton from 'primevue/selectbutton'
import InputSwitch from 'primevue/inputswitch'
import Editor from 'primevue/editor'
import ProgressSpinner from 'primevue/progressspinner'
import BlockUI from 'primevue/blockui'
import Skeleton from 'primevue/skeleton'
import MultiSelect from 'primevue/multiselect'
import FileUpload from 'primevue/fileupload'
import TreeTable from 'primevue/treetable'
import AccordionTab from 'primevue/accordiontab'
import Accordion from 'primevue/accordion'
import AutoComplete from 'primevue/autocomplete'
import TabMenu from 'primevue/tabmenu'
import SplitButton from 'primevue/splitbutton'
import Textarea from 'primevue/textarea'
import Divider from 'primevue/divider'
import Card from 'primevue/card'
import Menu from 'primevue/menu'
import Tooltip from 'primevue/tooltip'
import Image from 'primevue/image'
import BadgeDirective from 'primevue/badgedirective'
import DialogService from 'primevue/dialogservice'
import DynamicDialog from 'primevue/dynamicdialog'

// custom App Components
import AppForm from '@/modules/common/components/AppForm.vue'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import AppInput from '@/modules/common/components/inputs/AppInput.vue'
import AppInputNumber from '@/modules/common/components/inputs/AppInputNumber.vue'
import AppInputMask from '@/modules/common/components/inputs/AppInputMask.vue'
import AppDropdown from '@/modules/common/components/inputs/AppDropdown.vue'
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import AppCheckbox from '@/modules/common/components/AppCheckbox.vue'
import AppCalendar from '@/modules/common/components/AppCalendar.vue'
import AppDataTable from '@/modules/common/components/AppDataTable.vue'
import AppInputDireccion from '@/modules/common/components/inputs/AppInputDireccion.vue'
import SubirArchivoIncrustado from '@/modules/global/components/documentos/SubirArchivoIncrustado.vue'
import AppBanner from '@/modules/common/components/AppBanner.vue'
import MapInput from '@/modules/common/components/inputs/MapInput.vue'
import TheNavbar from '@/modules/common/components/TheNavbar.vue'
import TheSidebar from '@/modules/common/components/TheSidebar.vue'
import AppDialog from '@/modules/common/components/AppDialog.vue'
import AppMenuOptions from '@/modules/common/components/AppMenuOptions.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppMultiSelect from '@/modules/common/components/inputs/AppMultiSelect.vue'
import AppProgressSpinner from '@/modules/common/components/AppProgressSpinner.vue'
import AppEditor from '@/modules/common/components/inputs/AppEditor.vue'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'

/* Componentes Globales */
// Delitos
import TablaDelitos from '@/modules/global/components/delitos/TablaDelitos.vue'
import DelitosFieldset from '@/modules/global/components/delitos/DelitosFieldset.vue'
import EsAnonimoFieldset from '@/modules/global/components/delitos/EsAnonimoFieldset.vue'
import FechaHoraFieldset from '@/modules/global/components/delitos/FechaHoraFieldset.vue'
import LugarDelitoFieldset from '@/modules/global/components/delitos/LugarDelitoFieldset.vue'
import ElementosUsadosFieldset from '@/modules/global/components/delitos/ElementosUsadosFieldset.vue'
import ClasificacionFieldset from '@/modules/global/components/delitos/ClasificacionFieldset.vue'
import EsHallazgoFieldset from '@/modules/global/components/delitos/EsHallazgoFieldset.vue'
import MedioTransporteFieldset from '@/modules/global/components/delitos/MedioTransporteFieldset.vue'
import ExistenLesionadosFallecidosDetenidos from '@/modules/global/components/delitos/ExistenLesionadosFallecidosDetenidos.vue'
import InformacionCamarasFieldset from '@/modules/global/components/delitos/InformacionCamarasFieldset.vue'
import VigilanciaFieldset from '@/modules/global/components/delitos/VigilanciaFieldset.vue'
import SujetosFieldset from '@/modules/global/components/delitos/SujetosFieldset.vue'
import AmbitoNnaFieldset from '@/modules/global/components/delitos/AmbitoNnaFieldset.vue'
import InfoAdicionalFieldset from '@/modules/global/components/delitos/InfoAdicionalFieldset.vue'
import DireccionFieldset from '@/modules/global/components/delitos/DireccionFieldset.vue'

// libraries
import { vueKeycloak } from '@baloise/vue-keycloak'
import mitt from 'mitt'
import AudioVisual from 'vue-audio-visual'
import { plugin, defaultConfig } from '@formkit/vue'
import { formkitInputs, pluginRemoveInnerWrapper } from '@/modules/formKit/index'
import VueGoogleMaps from '@fawmi/vue-google-maps'

// vue global config
import { injectGlobalProperties } from './config/global'

/**
 * [VUE INSTANCE]
 */
const app = createApp(App)

// vue config
app.use(store)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)

// libraries config
app.use(vueKeycloak, {
  initOptions: {
    flow: 'standard',
    checkLoginIframe: false,
    onLoad: 'login-required'
  },
  config: {
    url: process.env.VUE_APP_BASE_URL_SSO,
    realm: process.env.VUE_APP_REALM_SSO,
    clientId: 'vue-client'
  }
})

app.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GMAPS_APIKEY,
    libraries: ['places'],
    language: 'es'
  }
})

const emitter = mitt()
app.provide('emitter', emitter)

app.use(AudioVisual)

app.use(plugin, defaultConfig({
  inputs: formkitInputs,
  plugins: [pluginRemoveInnerWrapper]
}))

// PrimeVue global components
app.component('InputNumber', InputNumber)
app.component('InputMask', InputMask)
app.component('Button', Button)
app.component('TreeTable', TreeTable)
app.component('InputText', InputText)
app.component('Menubar', Menubar)
app.component('Calendar', Calendar)
app.component('DataTable', DataTable)
app.component('Paginator', Paginator)
app.component('Column', Column)
app.component('ProgressBar', ProgressBar)
app.component('TabPanel', TabPanel)
app.component('TabView', TabView)
app.component('Tag', Tag)
app.component('Toast', Toast)
app.component('Dialog', Dialog)
app.component('Dropdown', Dropdown)
app.component('Chip', Chip)
app.component('Chips', Chips)
app.component('Fieldset', Fieldset)
app.component('Checkbox', Checkbox)
app.component('RadioButton', RadioButton)
app.component('OverlayPanel', OverlayPanel)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Steps', Steps)
app.component('Breadcrumb', Breadcrumb)
app.component('PanelMenu', PanelMenu)
app.component('Sidebar', Sidebar)
app.component('ScrollPanel', ScrollPanel)
app.component('SelectButton', SelectButton)
app.component('InputSwitch', InputSwitch)
app.component('Editor', Editor)
app.component('ProgressSpinner', ProgressSpinner)
app.component('BlockUI', BlockUI)
app.component('Skeleton', Skeleton)
app.component('MultiSelect', MultiSelect)
app.component('FileUpload', FileUpload)
app.component('AccordionTab', AccordionTab)
app.component('Accordion', Accordion)
app.component('AutoComplete', AutoComplete)
app.component('TabMenu', TabMenu)
app.component('SplitButton', SplitButton)
app.component('Textarea', Textarea)
app.component('Divider', Divider)
app.component('Card', Card)
app.component('Menu', Menu)
app.component('Message', Message)
app.component('DynamicDialog', DynamicDialog)
app.component('Image', Image)
app.directive('tooltip', Tooltip)
app.directive('badge', BadgeDirective)

// custom global components
app.component('AppForm', AppForm)
app.component('AppFooterBtns', AppFooterBtns)
app.component('AppFieldset', AppFieldset)
app.component('AppInput', AppInput)
app.component('AppDropdown', AppDropdown)
app.component('AppSelectButton', AppSelectButton)
app.component('AppCheckbox', AppCheckbox)
app.component('AppCalendar', AppCalendar)
app.component('AppInputNumber', AppInputNumber)
app.component('AppInputMask', AppInputMask)
app.component('AppTextarea', AppTextarea)
app.component('AppProgressSpinner', AppProgressSpinner)
app.component('AppEditor', AppEditor)
app.component('AppDataTable', AppDataTable)
app.component('AppInputDireccion', AppInputDireccion)
app.component('AppBanner', AppBanner)
app.component('MapInput', MapInput)
app.component('TheNavbar', TheNavbar)
app.component('TheSidebar', TheSidebar)
app.component('AppDialog', AppDialog)
app.component('AppMenuOptions', AppMenuOptions)
app.component('AppMultiSelect', AppMultiSelect)
app.component('SubirArchivoIncrustado', SubirArchivoIncrustado)
app.component('TablaDelitos', TablaDelitos)
app.component('DelitosFieldset', DelitosFieldset)
app.component('EsAnonimoFieldset', EsAnonimoFieldset)
app.component('FechaHoraFieldset', FechaHoraFieldset)
app.component('LugarDelitoFieldset', LugarDelitoFieldset)
app.component('ElementosUsadosFieldset', ElementosUsadosFieldset)
app.component('ClasificacionFieldset', ClasificacionFieldset)
app.component('EsHallazgoFieldset', EsHallazgoFieldset)
app.component('MedioTransporteFieldset', MedioTransporteFieldset)
app.component('ExistenLesionadosFallecidosDetenidos', ExistenLesionadosFallecidosDetenidos)
app.component('InformacionCamarasFieldset', InformacionCamarasFieldset)
app.component('VigilanciaFieldset', VigilanciaFieldset)
app.component('SujetosFieldset', SujetosFieldset)
app.component('AmbitoNnaFieldset', AmbitoNnaFieldset)
app.component('InfoAdicionalFieldset', InfoAdicionalFieldset)
app.component('DireccionFieldset', DireccionFieldset)
app.component('PageHeader', PageHeader)
app.component('AppSteps', AppSteps)

// vue global properties config
injectGlobalProperties(app, store)

app.mount('#app')
