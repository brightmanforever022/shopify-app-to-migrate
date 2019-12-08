import { createStore, compose, applyMiddleware } from 'redux'
import { createBrowserHistory } from 'history'
import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'
import createRootReducer from './reducers'
import rootSaga from './saga'

const initialState = {}
const sagaMiddleware = createSagaMiddleware()

export const history = createBrowserHistory()

const middleware = [thunkMiddleware, routerMiddleware(history), sagaMiddleware]
export const store = createStore(createRootReducer(history), initialState, compose(applyMiddleware(...middleware)))

sagaMiddleware.run(rootSaga)
