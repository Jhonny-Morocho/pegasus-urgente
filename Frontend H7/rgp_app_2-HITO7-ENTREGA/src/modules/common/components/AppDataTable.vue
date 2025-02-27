<template>
<DataTable
  ref="dt"
  current-page-report-template="Mostrando registros del {first} al {last} de un total de {totalRecords} registros."
  :paginator="isDefaultPaginator"
  paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
  responsive-layout="stack"
  row-hover
  :rows="10"
  :rows-per-page-options="[5, 10, 15]"
  striped-rows
  v-bind="$attrs"
>
  <template
    v-if="title"
    #header
  >
    <div class="flex">
      <h3 class="m-0">
        {{ title }}
      </h3>
    </div>
  </template>
  <template #empty>
    No existen registros
  </template>
  <template #loading>
    <AppProgressSpinner />
  </template>
  <template
    v-for="(_, scopedSlotName) in $slots"
    #[scopedSlotName]="slotData"
  >
    <slot
      :name="scopedSlotName"
      v-bind="slotData || {}"
    />
  </template>
  <template
    v-if="!isDefaultPaginator && !noPaginator"
    #footer
  >
    <Paginator
      current-page-report-template="Mostrando registros del {first} al {last} de un total de {totalRecords} registros."
      :rows="10"
      :rows-per-page-options="[5, 10, 15]"
      template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      v-bind="$attrs"
    />
  </template>
</DataTable>
</template>

<script>
import { computed, defineComponent, inject, ref } from 'vue'
import AppProgressSpinner from './AppProgressSpinner.vue'

export default defineComponent({
  name: 'AppDataTable',
  components: { AppProgressSpinner },
  props: {
    title: {
      type: String,
      default: ''
    },
    origenTabla: {
      type: String,
      default: ''
    },
    noPaginator: Boolean
  },
  setup (props, ctx) {
    const emitter = inject('emitter')
    const dt = ref()
    const exportCsv = () => {
      if (dt?.value) {
        dt.value.exportCSV()
      }
    }
    emitter.on('table:export', (tabla) => {
      if (tabla === props.origenTabla) {
        exportCsv()
      }
    })
    const isDefaultPaginator = computed(() => ctx?.attrs['total-records'] <= 0)
    return {
      dt,
      isDefaultPaginator
    }
  }
})
</script>
