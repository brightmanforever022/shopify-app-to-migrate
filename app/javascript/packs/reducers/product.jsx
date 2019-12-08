import {
  PRODUCTS_TOGGLE,
  PRODUCT_TOGGLE
} from '../helper/types'

const initState = {
  products: [],
  product: {},
  hasNext: false,
  hasPrevious: false,
  totals: 0
}

export default (state = initState, action) => {
  const { type, payload } = action
  if (type === PRODUCTS_TOGGLE) {
    return {
      ...state,
      products: JSON.parse(JSON.stringify(payload.products)),
      hasNext: payload.hasNext,
      hasPrevious: payload.hasPrevious,
      totals: payload.totals
    }
  }

  if (type === PRODUCT_TOGGLE) {
    return {
      ...state,
      product: JSON.parse(JSON.stringify(payload.product))
    }
  }
  return state
}