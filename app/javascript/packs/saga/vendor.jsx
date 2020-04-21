import { put, takeLatest, call } from 'redux-saga/effects'
import request from '../helper/request'
import getErrorText from '../helper/serverErrors'
import getMsgText from '../helper/toastMessage'

import {
  LOAD_VENDORS,
  LOAD_VENDOR,
  CREATE_VENDOR,
  VENDORS_TOGGLE,
  VENDOR_TOGGLE,
  UPDATE_VENDOR,
  DELETE_VENDOR,
  TOAST_TOGGLE,
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

function* loadVendors({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/vendors`,
      {params: data}
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: VENDORS_TOGGLE,
        payload: {
          ...res.data
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* createVendor({data}) {
  let res
  try {
    res = yield call(
      request.post,
      `/vendors`,
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

function* loadVendor({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/vendors/${data.id}`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

function* updateVendor({data}) {
  let res
  try {
    res = yield call(
      request.patch,
      `/vendors/${data.id}`,
      data
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: VENDOR_TOGGLE,
        payload: {
          ...res.data
        }
      })
      yield put({
        type: TOAST_TOGGLE,
        payload: {
          isOpen: true,
          error: false,
          message: getMsgText('updated')
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* deleteVendor({data}) {
  let res
  try {
    res = yield call(
      request.delete,
      `/vendors/${data.id}`
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
          message: getMsgText('deleted')
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

export function* vendor() {
  yield takeLatest(LOAD_VENDORS, loadVendors)
  yield takeLatest(LOAD_VENDOR, loadVendor)
  yield takeLatest(CREATE_VENDOR, createVendor)
  yield takeLatest(UPDATE_VENDOR, updateVendor)
  yield takeLatest(DELETE_VENDOR, deleteVendor)
}

