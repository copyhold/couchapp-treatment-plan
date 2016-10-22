import {createStore,applyMiddleware} from 'redux'
import reducer                       from './reducer'
import thunk                         from 'redux-thunk'
import createLogger                  from 'redux-logger'
import $                             from 'jquery'
import {ROOT}                        from './const'


export default function configureStore(initialState) {
  const logger = createLogger()
  const store = createStore(reducer, initialState, applyMiddleware(thunk,middleware))

  return store
}
function middleware({getState, dispatch}) {
  return function(next) {
    return function(action) {
      switch (action.type) {
        case 'route':
          const path = action.payload.split('/')
          switch (path[0]) {
            case '#people':
              const m = action.payload.match(/^#people\/(\d+)$/)
              if (m) {
                next(action)
                return dispatch(load_person(m[1]))
              }
              break
          }
      }
      next(action)
    }
  }
}

function load_person(id) {
  return function(dispatch,getstate) {
    dispatch({type:'loading person'})
    return $.getJSON(`${ROOT}/${id}`)
    .then(person => {
      dispatch({type: 'person loaded', payload: person})
    })
    .catch(err => dispatch({ type: 'ajax error', op: 'person load', payload: err}))
  }
}
