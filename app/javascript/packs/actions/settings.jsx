import {
  LOAD_SETTINGS,
  UPDATE_SETTINGS,
} from '../helper/types'

export const loadSettings = (data) => ({
  type: LOAD_SETTINGS,
  data: data
})

export const updateSettings = (data) => ({
  type: UPDATE_SETTINGS,
  data: data
})

