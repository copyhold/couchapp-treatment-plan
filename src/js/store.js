import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

export default function configureStore(initialState) {
  const logger = createLogger()
  const store = createStore(reducer, initialState, applyMiddleware(thunk))

  return store
}
