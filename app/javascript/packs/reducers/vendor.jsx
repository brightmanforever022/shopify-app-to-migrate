import {
  VENDORS_TOGGLE,
  VENDOR_TOGGLE
} from '../helper/types'

const initState = {
  vendors: [],
  vendor: {},
  hasNext: false,
  hasPrevious: false,
  totals: 0,
  totalPages: 1,
  currentPage: 1
}

export default (state = initState, action) => {
  const { type, payload } = action
  if (type === VENDORS_TOGGLE) {
    return {
      ...state,
      vendors: JSON.parse(JSON.stringify(payload.vendors)),
      hasNext: payload.hasNext,
      hasPrevious: payload.hasPrevious,
      totals: payload.totals,
      totalPages: payload.totalPages,
      currentPage: payload.currentPage
    }
  }

  if (type === VENDOR_TOGGLE) {
    return {
      ...state,
      vendor: JSON.parse(JSON.stringify(payload.vendor))
    }
  }
  return state
}