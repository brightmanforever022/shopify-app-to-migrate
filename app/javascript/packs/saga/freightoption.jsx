import { put, takeLatest, call } from 'redux-saga/effects'
import request from '../helper/request'
import getErrorText from '../helper/serverErrors'
import getMsgText from '../helper/toastMessage'

import {
  LOAD_FREIGHTOPTIONS,
  LOAD_FREIGHTOPTION,
  CREATE_FREIGHTOPTION,
  FREIGHTOPTIONS_TOGGLE,
  FREIGHTOPTION_TOGGLE,
  UPDATE_FREIGHTOPTION,
  DELETE_FREIGHTOPTION,
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

function* loadFreightoptions({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/freightoptions`,
      {params: data}
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: FREIGHTOPTIONS_TOGGLE,
        payload: {
          ...res.data
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* createFreightoption({data}) {
  let res
  try {
    res = yield call(
      request.post,
      `/freightoptions`,
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

function* loadFreightoption({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/freightoptions/${data.id}`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

function* updateFreightoption({data}) {
  let res
  try {
    res = yield call(
      request.patch,
      `/freightoptions/${data.id}`,
      data
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: FREIGHTOPTION_TOGGLE,
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

function* deleteFreightoption({data}) {
  let res
  try {
    res = yield call(
      request.delete,
      `/freightoptions/${data.id}`
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

export function* freightoption() {
  yield takeLatest(LOAD_FREIGHTOPTIONS, loadFreightoptions)
  yield takeLatest(LOAD_FREIGHTOPTION, loadFreightoption)
  yield takeLatest(CREATE_FREIGHTOPTION, createFreightoption)
  yield takeLatest(UPDATE_FREIGHTOPTION, updateFreightoption)
  yield takeLatest(DELETE_FREIGHTOPTION, deleteFreightoption)
}

