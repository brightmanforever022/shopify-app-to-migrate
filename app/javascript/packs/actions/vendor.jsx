import {
  LOAD_VENDORS,
  LOAD_VENDOR,
  CREATE_VENDOR,
  UPDATE_VENDOR,
  DELETE_VENDOR,
} from '../helper/types'

export const loadVendors = (data) => ({
  type: LOAD_VENDORS,
  data: data
})

export const createVendor = (data) => ({
  type: CREATE_VENDOR,
  data: data
})

export const loadVendor = (data) => ({
  type: LOAD_VENDOR,
  data: data
})

export const updateVendor = (data) => ({
  type: UPDATE_VENDOR,
  data: data
})

export const deleteVendor = (data) => ({
  type: DELETE_VENDOR,
  data: data
})
