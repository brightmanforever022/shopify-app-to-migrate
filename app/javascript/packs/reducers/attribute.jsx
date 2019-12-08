import {
    ATTRIBUTES_TOGGLE,
    ATTRIBUTE_TOGGLE
  } from '../helper/types'
  
  const initState = {
    attributes: [],
    attribute: {},
    hasNext: false,
    hasPrevious: false,
    totals: 0,
    totalPages: 1,
    currentPage: 1
  }
  
  export default (state = initState, action) => {
    const { type, payload } = action
    if (type === ATTRIBUTES_TOGGLE) {
      return {
        ...state,
        attributes: JSON.parse(JSON.stringify(payload.attributes)),
        hasNext: payload.hasNext,
        hasPrevious: payload.hasPrevious,
        totals: payload.totals,
        totalPages: payload.totalPages,
        currentPage: payload.currentPage
      }
    }
  
    if (type === ATTRIBUTE_TOGGLE) {
      return {
        ...state,
        attribute: JSON.parse(JSON.stringify(payload.attribute))
      }
    }
    return state
  }