import regeneratorRuntime from 'regenerator-runtime'
import { all } from 'redux-saga/effects'
import { product } from './product'
import { template } from './template'
import { attribute } from './attribute'
import { freightoption } from './freightoption'
import { vendor } from './vendor'

export default function* rootSaga() {
  yield all([
    product(),
    template(),
    attribute(),
    freightoption(),
    vendor()
  ])
}