import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import preloader from './preloader'
import product from './product'
import template from './template'
import attribute from './attribute'
import toast from './toast'

const rootReducer = log => combineReducers({
  preloader,
  product,
  toast,
  template,
  attribute,
  router: connectRouter(log)
})

export default rootReducer