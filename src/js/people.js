import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import moment               from 'moment'
import Select               from 'react-select'

import Header         from './header'
import {PersonalData} from './person'

class People extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      add: false,
      search: ''
    }
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
      <dialog id="addclient">
        <button className="close heavy small"  onClick={_=>document.getElementById('addclient').close()}></button>
        <div className="content">
          <h2>{ t('Добавить человека') }</h2>
          <form>
            <input placeholder={t('Имя')}     name="name" ref="name"  />
            <input placeholder={t('Телефон')} name="name" ref="phone" />
            <input placeholder={t('Адрес')}   name="name" ref="name"  />
            <button>OK</button>
          </form>
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
  }
)(People)

