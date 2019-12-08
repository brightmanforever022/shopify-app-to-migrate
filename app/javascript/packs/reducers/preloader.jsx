import { PRELOADER_TOGGLE } from '../helper/types'

const initialState = {
  show: true,
  actionName: ''
}

export default (state = initialState, action) => {
  let { type } = action
  if (type === PRELOADER_TOGGLE) {
    if (
      state.actionName === payload.actionName &&
      payload.show === false
    ) {
        return {
          ...state,
          show: payload.show,
          actionName: payload.actionName
        }
      } else if (payload.show === true) {
        return {
          ...state,
          show: payload.show,
          actionName: payload.actionName
        }
      }
    }
  return state
}

