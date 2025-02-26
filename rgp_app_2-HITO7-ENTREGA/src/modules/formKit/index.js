import { createInput } from '@formkit/vue'

// FormKit Components
import FormKitDropdown from './FormKitDropdown.vue'
import FormKitInput from './FormKitInput.vue'
import FormKitCalendar from './FormKitCalendar.vue'
import FormKitFieldset from './FormKitFieldset.vue'
import FormKitSelectButton from './FormKitSelectButton.vue'
import FormKitEditor from './FormKitEditor.vue'
import FormKitCheckbox from './FormKitCheckbox.vue'
import FormKitInputSwitch from './FormKitInputSwitch.vue'
import FormKitInputMask from './FormKitInputMask.vue'
import FormKitAppSteps from './FormKitAppSteps.vue'

export const DropdownDefinition = createInput(FormKitDropdown, {
  props: []
})

export const InputDefinition = createInput(FormKitInput, {
  props: []
})

export const CalendarDefinition = createInput(FormKitCalendar, {
  props: []
})

export const FieldsetDefinition = createInput(FormKitFieldset, {
  props: []
})

export const SelectButtonDefinition = createInput(FormKitSelectButton, {
  props: []
})
export const EditorDefinition = createInput(FormKitEditor, {
  props: []
})

export const CheckboxDefinition = createInput(FormKitCheckbox, {
  props: []
})

export const InputSwitchDefinition = createInput(FormKitInputSwitch, {
  props: []
})

export const InputMaskDefinition = createInput(FormKitInputMask, {
  props: []
})

export const AppStepsDefinition = createInput(FormKitAppSteps, {
  props: []
})

export const formkitInputs = {
  FormKitDropdown: DropdownDefinition,
  FormKitInput: InputDefinition,
  FormKitCalendar: CalendarDefinition,
  FormKitFieldset: FieldsetDefinition,
  FormKitSelectButton: SelectButtonDefinition,
  FormKitEditor: EditorDefinition,
  FormKitCheckbox: CheckboxDefinition,
  FormKitInputSwitch: InputSwitchDefinition,
  FormKitInputMask: InputMaskDefinition,
  FormKitAppSteps: AppStepsDefinition
}

export const pluginRemoveInnerWrapper = (inputNode) => {
  inputNode.on('created', ({ payload: node }) => {
    const definition = { ...node.props.definition }
    const schema = definition.schema

    definition.schema = function (extensions = {}) {
      const ext = { ...extensions, ...{ inner: { $el: null }, outer: { $el: null }, wrapper: { $el: null } } }

      return schema(ext)
    }

    node.props.definition = definition
  })
}
