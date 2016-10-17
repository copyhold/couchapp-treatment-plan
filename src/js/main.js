import React from 'react'
import ReactDOM from 'react-dom'
import Dash from './dash'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import configureStore from './store'

const store = configureStore()

require('!style!css!sass!../css/style.scss')
require('!style!css!react-select/dist/react-select.css')
ReactDOM.render(<Provider store={store}><Dash /></Provider>, document.getElementById('app'))
