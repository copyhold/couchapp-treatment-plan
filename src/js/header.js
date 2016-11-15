import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import $                    from 'jquery'
import {HOST}               from './const'

function Menu(props) {
  return (
        <nav className="burg">
          <a href="#people">{ t('Люди') }</a>
          <a href="#month">{ t('Месяцы') }</a>
          <a href="#day">{ t('День') }</a>
          <button onClick={props.log_out}>log out</button>
          <button onClick={_ => props.set_locale('he')}>ע</button>
          <button onClick={_ => props.set_locale('ru')}>РУ</button>
        </nav>
  )
}
class Header extends React.Component {
  render() {
    return (
      <header>
      {this.props.children}
        <Menu log_out={this.props.log_out} set_locale={this.props.set_locale}/>
      </header>
    )
  }
}
module.exports = connect(
  null,
  (dispatch, getState) => {
    return {
      set_locale: bindActionCreators(function(locale) { return {type: 'set locale', payload: locale} }, dispatch),
      log_out: bindActionCreators(log_out, dispatch)
    }
  }
)(Header)

function log_out() {
  return (dispatch,getState) => {
    $.ajax({
      url: HOST + '_session',
      method: 'delete'
    })
    .then(_ => dispatch({type: 'logout ok'}))
    .catch(err => dispatch({type: 'ajax error', op: 'logout', payload: err}))
  }
}
