module.exports = {
  root: true,
  env: {
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    camelcase: 'off',
    'max-len': ['warn', { code: 240 }],
    semi: ['warn', 'never'],
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always'
      }
    ],
    // JavaScript
    'space-before-blocks': 'warn',
    'keyword-spacing': [
      'warn',
      {
        before: true,
        after: true
      }
    ],
    'space-infix-ops': 'warn',
    indent: [
      'warn', 2,
      {
        SwitchCase: 1,
        ignoredNodes: ['TemplateLiteral']
      }
    ],
    quotes: [
      'warn',
      'single',
      {
        allowTemplateLiterals: true
      }
    ],
    'linebreak-style': 0,
    'no-trailing-spaces': 'warn',
    'no-empty': [
      'warn',
      {
        allowEmptyCatch: true
      }
    ],
    'key-spacing': [
      'warn',
      {
        afterColon: true
      }
    ],
    'eol-last': ['warn', 'always'],
    'object-curly-spacing': ['warn', 'always'],
    'object-curly-newline': 'warn',
    'no-multi-spaces': 'warn',
    'comma-dangle': ['warn', 'never'],
    'comma-spacing': [
      'warn', {
        before: false,
        after: true
      }
    ],
    // vue
    'vue/first-attribute-linebreak': ['warn', {
      singleline: 'ignore',
      multiline: 'below'
    }],
    'vue/multi-word-component-names': 'off',
    'vue/component-name-in-template-casing': [
      'warn',
      'PascalCase',
      {
        registeredComponentsOnly: false
      }
    ],
    'vue/attributes-order': [
      'warn',
      {
        alphabetical: true
      }
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        baseIndent: 0
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ],
  settings: {
    'import/resolver': 'webpack'
  }
}
