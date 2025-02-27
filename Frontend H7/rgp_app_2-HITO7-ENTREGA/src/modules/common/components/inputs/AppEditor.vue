<template>
<div
  class="flex flex-column field"
  :class="[
    { 'mb-1': (v$.model.$invalid && formSubmittedAppForm) || customValidation },
    [$attrs.class]
  ]"
>
  <span class="p-float-label">
    <Editor
      :id="id"
      v-model="v$.model.$model"
      class="w-full"
      :class="{ 'editor-invalid': (v$.model.$invalid && formSubmittedAppForm) || customValidation }"
      :editor-style="`height: ${height}; width: ${width}`"
      v-bind="vBind"
    >
      <template #toolbar>
        <span class="ql-formats">
          <select class="ql-header">
            <option value="2">Título</option>
            <option value="3">Subtítulo</option>
            <option selected />
          </select>
          <select class="ql-size">
            <option value="small">Pequeño</option>
            <option selected />
            <option value="large">Grande</option>
            <option value="huge">Gigante</option>
          </select>
        </span>
        <span class="ql-formats">
          <button
            v-tooltip.top="'Negrita'"
            class="ql-bold"
          />
          <button
            v-tooltip.top="'Cursiva'"
            class="ql-italic"
          />
          <button
            v-tooltip.top="'Subrayado'"
            class="ql-underline"
          />
          <button
            v-tooltip.top="'Tachado'"
            class="ql-strike"
          />
        </span>
        <span class="ql-formats">
          <button
            v-tooltip.top="'Lista Numerada'"
            class="ql-list"
            value="ordered"
          />
          <button
            v-tooltip.top="'Lista con Viñetas'"
            class="ql-list"
            value="bullet"
          />
          <select class="ql-align">
            <option selected />
            <option value="right" />
            <option value="center" />
            <option value="justify" />
          </select>
        </span>
        <span class="ql-formats">
          <button
            v-tooltip.top="'Aumentar Sangría'"
            class="ql-indent"
            value="+1"
          />
          <button
            v-tooltip.top="'Disminuir Sangría'"
            class="ql-indent"
            value="-1"
          />
        </span>
        <span class="ql-formats">
          <select class="ql-color" />
          <select class="ql-background" />
        </span>
        <span class="ql-formats">
          <button
            v-tooltip.top="'Enlace'"
            class="ql-link"
          />
          <button
            v-tooltip.top="'Cita'"
            class="ql-blockquote"
          />
        </span>
        <span class="ql-formats">
          <button
            v-tooltip.top="'Borrar Formato'"
            class="ql-clean"
          />
        </span>
      </template>
    </Editor>
    <small
      v-if="((v$.model.$invalid && formSubmittedAppForm) || customValidation) || v$.model.$pending.$response"
      class="p-error-message p-error"
    >
      <span>
        {{ v$.$silentErrors[0].$message }}
      </span>
    </small>
  </span>
</div>
</template>

<script>
import { defineComponent } from 'vue'

import { useValidationComponent, defaultValidationComponentProps } from '@/modules/common/composables'

export default defineComponent({
  name: 'AppInput',

  inheritAttrs: false,

  props: {
    ...defaultValidationComponentProps,
    height: {
      type: String,
      default: '256px'
    },
    width: {
      type: String,
      default: '80vw' // vw correcto para resolución 1280x800
    },
    modelValue: {
      type: String,
      default: null
    },
    customValidation: Boolean
  },

  setup: () => ({ ...useValidationComponent() })
})
</script>
<style scoped lang="scss">
.editor-invalid{
    border: 1px solid red;
    border-radius: 5px;
}
</style>
