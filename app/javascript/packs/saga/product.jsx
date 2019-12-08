import regeneratorRuntime from 'regenerator-runtime'
import { put, takeLatest, call } from 'redux-saga/effects'
import request from '../helper/request'
import getErrorText from '../helper/serverErrors'
import getMsgText from '../helper/toastMessage'

import {
  LOAD_PRODUCTS,
  LOAD_PRODUCT,
  CREATE_PRODUCT,
  PRODUCTS_TOGGLE,
  PRODUCT_TOGGLE,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  TOAST_TOGGLE,
  LOAD_VARIANT,
  LOAD_VARIANTS
} from '../helper/types'

function errorHandler(error) {
  return {
    type: TOAST_TOGGLE,
    payload: {
      isOpen: true,
      error: true,
      message: getErrorText(error),
    }
  }
}

function* loadProducts({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/products`,
      {params: data}
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: PRODUCTS_TOGGLE,
        payload: {
          ...res.data
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* createProduct({data}) {
  let res
  try {
    res = yield call(
      request.post,
      `/products`,
      data
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: TOAST_TOGGLE,
        payload: {
          isOpen: true,
          error: false,
          message: getMsgText('created')
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* loadProduct({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/products/${data.id}`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

function* updateProduct({data}) {
  let res
  try {
    res = yield call(
      request.patch,
      `/products/${data.id}`,
      data
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: PRODUCT_TOGGLE,
        payload: {
          ...res.data
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* deleteProduct({data}) {
  let res
  try {
    res = yield call(
      request.delete,
      `/products/${data.id}`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: PRODUCTS_TOGGLE,
        payload: {
          ...res.data
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* loadVariant({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/products/variants/${data.id}`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

function* loadVariants({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/products/variants/load`,
      {params: data}
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

export function* product() {
  yield takeLatest(LOAD_PRODUCTS, loadProducts)
  yield takeLatest(LOAD_PRODUCT, loadProduct)
  yield takeLatest(CREATE_PRODUCT, createProduct)
  yield takeLatest(UPDATE_PRODUCT, updateProduct)
  yield takeLatest(DELETE_PRODUCT, deleteProduct)
  yield takeLatest(LOAD_VARIANT, loadVariant)
  yield takeLatest(LOAD_VARIANTS, loadVariants)
}

