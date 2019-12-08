import regeneratorRuntime from 'regenerator-runtime'
import { put, takeLatest, call } from 'redux-saga/effects'
import request from '../helper/request'
import getErrorText from '../helper/serverErrors'
import getMsgText from '../helper/toastMessage'

import {
  LOAD_TEMPLATES,
  LOAD_TEMPLATE,
  CREATE_TEMPLATE,
  TEMPLATES_TOGGLE,
  TEMPLATE_TOGGLE,
  UPDATE_TEMPLATE,
  DELETE_TEMPLATE,
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

function* loadTemplates({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/templates`,
      {params: data}
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: TEMPLATES_TOGGLE,
        payload: {
          ...res.data
        }
      })
      data.cb && data.cb(res.data)
    }
  }
}

function* createTemplate({data}) {
  let res
  try {
    res = yield call(
      request.post,
      `/templates`,
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

function* loadTemplate({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/templates/${data.id}`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

function* updateTemplate({data}) {
  let res
  try {
    res = yield call(
      request.patch,
      `/templates/${data.id}`,
      data
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      yield put({
        type: TEMPLATE_TOGGLE,
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

function* deleteTemplate({data}) {
  let res
  try {
    res = yield call(
      request.delete,
      `/templates/${data.id}`
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

function* loadVariant({data}) {
  let res
  try {
    res = yield call(
      request.get,
      `/templates/variants/${data.id}`
    )
  } catch (error) {
    yield put(errorHandler(error))
  } finally {
    if (res) {
      data.cb && data.cb(res.data)
    }
  }
}

export function* template() {
  yield takeLatest(LOAD_TEMPLATES, loadTemplates)
  yield takeLatest(LOAD_TEMPLATE, loadTemplate)
  yield takeLatest(CREATE_TEMPLATE, createTemplate)
  yield takeLatest(UPDATE_TEMPLATE, updateTemplate)
  yield takeLatest(DELETE_TEMPLATE, deleteTemplate)
}

