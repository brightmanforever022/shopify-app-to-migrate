import regeneratorRuntime from 'regenerator-runtime'
import { put, takeLatest, call } from 'redux-saga/effects'
import request from '../helper/request'
import getErrorText from '../helper/serverErrors'
import getMsgText from '../helper/toastMessage'

import {
  LOAD_ATTRIBUTES,
  SEARCH_ATTRIBUTES,
  LOAD_ATTRIBUTE,
  CREATE_ATTRIBUTE,
  ATTRIBUTES_TOGGLE,
  ATTRIBUTE_TOGGLE,
  LIST_STORE,
  UPDATE_ATTRIBUTE,
  DELETE_ATTRIBUTE,
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

function* loadAttributes({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/attributes`,
      {params: data}
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: ATTRIBUTES_TOGGLE,
        payload: {
          ...res.data
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* searchAttributes({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/attributes/list/options`,
      {params: data}
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: ATTRIBUTES_TOGGLE,
        payload: {
          ...res.data
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* createAttribute({data}) {
  let res
  try {
    res = yield call(
      request.post,
      `/attributes`,
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

function* loadAttribute({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/attributes/${data.id}`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

function* listStores({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/attributes/list/stores`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

function* updateAttribute({data}) {
  let res
  try {
    res = yield call(
      request.patch,
      `/attributes/${data.id}`,
      data
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: ATTRIBUTE_TOGGLE,
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

function* deleteAttribute({data}) {
  let res
  try {
    res = yield call(
      request.delete,
      `/attributes/${data.id}`
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

export function* attribute() {
  yield takeLatest(LOAD_ATTRIBUTES, loadAttributes)
  yield takeLatest(SEARCH_ATTRIBUTES, searchAttributes)
  yield takeLatest(LOAD_ATTRIBUTE, loadAttribute)
  yield takeLatest(LIST_STORE, listStores)
  yield takeLatest(CREATE_ATTRIBUTE, createAttribute)
  yield takeLatest(UPDATE_ATTRIBUTE, updateAttribute)
  yield takeLatest(DELETE_ATTRIBUTE, deleteAttribute)
}

