import {
  SETTINGS_TOGGLE,
} from '../helper/types'

const initState = {
  settings: {},
}

export default (state = initState, action) => {
  const { type, payload } = action
  if (type === SETTINGS_TOGGLE) {
    return {
      ...state,
      settings: JSON.parse(JSON.stringify(payload.settings))
    }
  }
  return state
}