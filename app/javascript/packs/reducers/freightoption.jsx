import {
  FREIGHTOPTIONS_TOGGLE,
  FREIGHTOPTION_TOGGLE
} from '../helper/types'

const initState = {
  freightoptions: [],
  freightoption: {},
  hasNext: false,
  hasPrevious: false,
  totals: 0,
  totalPages: 1,
  currentPage: 1
}

export default (state = initState, action) => {
  const { type, payload } = action
  if (type === FREIGHTOPTIONS_TOGGLE) {
    return {
      ...state,
      freightoptions: JSON.parse(JSON.stringify(payload.freightoptions)),
      hasNext: payload.hasNext,
      hasPrevious: payload.hasPrevious,
      totals: payload.totals,
      totalPages: payload.totalPages,
      currentPage: payload.currentPage
    }
  }

  if (type === FREIGHTOPTION_TOGGLE) {
    return {
      ...state,
      freightoption: JSON.parse(JSON.stringify(payload.freightoption))
    }
  }
  return state
}