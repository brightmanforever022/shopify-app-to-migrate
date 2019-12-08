import {
  LOAD_TEMPLATES,
  LOAD_TEMPLATE,
  CREATE_TEMPLATE,
  UPDATE_TEMPLATE,
  DELETE_TEMPLATE,
} from '../helper/types'

export const loadTemplates = (data) => ({
  type: LOAD_TEMPLATES,
  data: data
})

export const createTemplate = (data) => ({
  type: CREATE_TEMPLATE,
  data: data
})

export const loadTemplate = (data) => ({
  type: LOAD_TEMPLATE,
  data: data
})

export const updateTemplate = (data) => ({
  type: UPDATE_TEMPLATE,
  data: data
})

export const deleteTemplate = (data) => ({
  type: DELETE_TEMPLATE,
  data: data
})
