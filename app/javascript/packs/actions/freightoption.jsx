import {
  LOAD_FREIGHTOPTIONS,
  LOAD_FREIGHTOPTION,
  CREATE_FREIGHTOPTION,
  UPDATE_FREIGHTOPTION,
  DELETE_FREIGHTOPTION,
} from '../helper/types'

export const loadFreightoptions = (data) => ({
  type: LOAD_FREIGHTOPTIONS,
  data: data
})

export const createFreightoption = (data) => ({
  type: CREATE_FREIGHTOPTION,
  data: data
})

export const loadFreightoption = (data) => ({
  type: LOAD_FREIGHTOPTION,
  data: data
})

export const updateFreightoption = (data) => ({
  type: UPDATE_FREIGHTOPTION,
  data: data
})

export const deleteFreightoption = (data) => ({
  type: DELETE_FREIGHTOPTION,
  data: data
})
