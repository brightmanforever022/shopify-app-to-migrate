import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import preloader from './preloader'
import product from './product'
import template from './template'
import attribute from './attribute'
import freightoption from './freightoption'
import vendor from './vendor'
import toast from './toast'

const rootReducer = log => combineReducers({
  preloader,
  product,
  toast,
  template,
  attribute,
  freightoption,
  vendor,
  router: connectRouter(log)
})

export default rootReducer