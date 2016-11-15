import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import moment               from 'moment'
import Select               from 'react-select'
import $                    from 'jquery'

import Header         from './header'
import {PersonalData} from './person'
import {DESIGN}       from './const'
import {load_clients} from './dash'

class People extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      add: false,
      error: null,
      search: ''
    }
  }
  submit(e) {
    e.preventDefault()
    const form = $(e.target)
    const tz = this.refs.tz.value
    $.ajax({
      method: 'post',
      url: `${DESIGN}/_update/add_client/${tz}`, 
      data: form.serialize()
    })
    .then(res => {
      const {error,msg} = (typeof res==='object' ? res : JSON.parse(res))
      if (error) {
        return this.setState({error: t(msg, 'en')})
      }
      form.parents('dialog')[0].close()
      this.props.dispatch({type: 'client added'})
      this.props.dispatch(load_clients())
    })
    .catch(err => dispatch({type: 'ajax error', op: 'create client', payload: err }))
  }
  render() {
    return (
      <section className="main people">
      <Header>
      <input type="text" onChange={e=>this.setState({search: e.target.value.toLowerCase()})} placeholder="поиски человека" value={this.state.search} />
      <button onClick={_=>document.getElementById('addclient').showModal()}>Добавить</button>
      </Header>
      <main>
      {
        this.props.people.map(client => <Client search={this.state.search} client={client} />)
      }
      </main>
      <dialog id="addclient" className="clientdialog">
        <button className="close heavy small"  onClick={_=>document.getElementById('addclient').close()}></button>
        <div className="content">
          <h2>{ t('Добавить человека') }</h2>
          <form onSubmit={this.submit.bind(this)}>
            <input required placeholder={t('Теудат зеут')} name="tz"      ref="tz"    pattern="\d{9}" />
            <input required placeholder={t('Имя')}         name="name"    ref="name"  />
            <input required placeholder={t('Телефон')}     name="phone"   ref="phone" type="tel" />
            <input required placeholder={t('Эл.почта')}    name="email"   ref="email" type="email" />
            <input required placeholder={t('Адрес')}       name="address" ref="name"  />
            <button>OK</button>
          </form>
          { this.state.error && <p className="alert">{this.state.error}</p> }
        </div>
      </dialog>
      </section>
    )
  }
}



function Client(props) {
  const {client,search} = props
  if (search && search.length>2 && (client.get('label')+client.get('phone')+client.get('value')).toLowerCase().indexOf(search)<0) return null
  return (
    <div class="client">
      <h3><a href={ `#people/${client.get('value')}` }>{client.get('label')}</a></h3>
      <PersonalData person={client} fields={['value','phone']} />
    </div>
  )
}

module.exports = connect(
  state => {
    return {
      people: state.get('clients')
    }
  }, 
  (dispatch, getState) => {
    return {
      dispatch
    }
  }
)(People)

