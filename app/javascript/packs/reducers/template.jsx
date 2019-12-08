import {
  TEMPLATES_TOGGLE,
  TEMPLATE_TOGGLE
} from '../helper/types'

const initState = {
  templates: [],
  template: {},
  hasNext: false,
  hasPrevious: false,
  totals: 0
}

export default (state = initState, action) => {
  const { type, payload } = action
  if (type === TEMPLATES_TOGGLE) {
    return {
      ...state,
      templates: JSON.parse(JSON.stringify(payload.templates)),
      hasNext: payload.hasNext,
      hasPrevious: payload.hasPrevious,
      totals: payload.totals
    }
  }

  if (type === TEMPLATE_TOGGLE) {
    return {
      ...state,
      template: JSON.parse(JSON.stringify(payload.template))
    }
  }
  return state
}