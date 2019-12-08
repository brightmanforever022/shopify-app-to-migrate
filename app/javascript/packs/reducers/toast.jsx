import { TOAST_TOGGLE } from '../helper/types'

const initialState = {
  isOpen: false,
  message: '',
  error: false
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case TOAST_TOGGLE:
      if (payload.isOpen === false) {
        return {
          ...state,
          isOpen: payload.isOpen
        }
      } else {
        return {
          ...state,
          isOpen: payload.isOpen,
          message: payload.message,
          error: payload.error
        }
      }
    default:
      return state
  }
}