import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import $                    from 'jquery'
import {HOST}               from './const'


class Login extends React.Component {
  constructor(props) {
    super(props)
  }
  submit(e) {
    e.preventDefault()
    const {dispatch} = this.props
    dispatch({type: 'logging in'})
    $.ajax({
      url: `${HOST}_session`, 
      method: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.refs.name.value,
        password: this.refs.pass.value
      })
    })
    .then((res,status,xhr) => {
      dispatch({type: 'login ok', payload: (typeof res==='object' ? res : JSON.parse(res))})
    })
    .catch(err => dispatch({type: 'ajax error', op: 'login', payload: err }))
  }
  render() {
    return (
      <form className="login" onSubmit={this.submit.bind(this)}>
        <input placeholder={t('имя пользователя')} ref="name" required type="name" autofocus />
        <input placeholder={t('пароль')} ref="pass" required type="password" />
        <button type="submit">OK</button>
      </form>
    )
  }
}


export default connect(
  null,
  (dispatch, getState) => {
    return {
      dispatch
    }
  }
)(Login)
