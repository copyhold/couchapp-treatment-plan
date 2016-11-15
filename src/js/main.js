import React          from 'react'
import ReactDOM       from 'react-dom'
import Dash           from './dash'
import {createStore}  from 'redux'
import {Provider}     from 'react-redux'
import configureStore from './store'
import translations   from './trans'

const store = configureStore()
require('!style!css!sass!../css/style.scss')
require('!style!css!react-select/dist/react-select.css')

window.t = function(what, source='ru') {
  const locale=store.getState().get('locale')
  if (locale=='ru') return what
  return store.getState().getIn(['translation',locale,what], what)
}
window.addEventListener('hashchange', routechange)
store.dispatch({ type: 'load translation', payload: translations})
ReactDOM.render((
  <Provider store={store}>
    <Dash />
  </Provider>
), document.getElementById('app'))
function routechange() {
  store.dispatch({ type: 'route', payload: location.hash })
}
routechange()
