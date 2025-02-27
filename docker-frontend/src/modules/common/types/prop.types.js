export const propTypes = {
  array: {
    type: Array,
    default: () => []
  },

  object: {
    type: Object,
    default: () => null
  },

  string: {
    type: String,
    default: ''
  },

  number: {
    type: Number,
    default: 0
  },

  boolean: {
    type: Boolean,
    default: () => false
  }
}
