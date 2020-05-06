import { put, takeLatest, call } from 'redux-saga/effects'
import request from '../helper/request'
import getErrorText from '../helper/serverErrors'
import getMsgText from '../helper/toastMessage'

import {
  LOAD_SETTINGS,
  SETTINGS_TOGGLE,
  UPDATE_SETTINGS,
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

function* loadSettings({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/settings`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

function* updateSettings({data}) {
  let res
  try {
    res = yield call(
      request.patch,
      `/settings/1`,
      data
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: SETTINGS_TOGGLE,
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

export function* settings() {
  yield takeLatest(LOAD_SETTINGS, loadSettings)
  yield takeLatest(UPDATE_SETTINGS, updateSettings)
}
