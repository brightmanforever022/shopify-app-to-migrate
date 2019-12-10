import {
    LOAD_ATTRIBUTES,
    SEARCH_ATTRIBUTES,
    LOAD_ATTRIBUTE,
    CREATE_ATTRIBUTE,
    UPDATE_ATTRIBUTE,
    DELETE_ATTRIBUTE,
  } from '../helper/types'
  
  export const loadAttributes = (data) => ({
    type: LOAD_ATTRIBUTES,
    data: data
  })

  export const searchAttributes = (data) => ({
    type: SEARCH_ATTRIBUTES,
    data: data
  })
  
  export const createAttribute = (data) => ({
    type: CREATE_ATTRIBUTE,
    data: data
  })
  
  export const loadAttribute = (data) => ({
    type: LOAD_ATTRIBUTE,
    data: data
  })
  
  export const updateAttribute = (data) => ({
    type: UPDATE_ATTRIBUTE,
    data: data
  })
  
  export const deleteAttribute = (data) => ({
    type: DELETE_ATTRIBUTE,
    data: data
  })
  