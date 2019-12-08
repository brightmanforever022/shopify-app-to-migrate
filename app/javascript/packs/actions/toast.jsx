import { TOAST_TOGGLE } from '../helper/types'

export const toggleToast = data => ({
  type: TOAST_TOGGLE,
  payload: data
})