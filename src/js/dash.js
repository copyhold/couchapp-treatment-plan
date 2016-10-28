import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import moment               from 'moment'
import Select               from 'react-select'
import {Map,fromJS}         from 'immutable'
import classnames           from 'classnames'
import $                    from 'jquery'

import {HOST} from './const'
import People from './people'
import Person from './person'
import Months from './months'
import Header from './header'
import Login  from './login'

class DashClass extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.sign_in()
    this.props.load_clients()
    this.props.load_beds()
  }
  render() {
    let out=null
    const m = this.props.location.match(/^people\/(\d+)$/)
    if (m) {
      out = <Person id={m[1]} />
    }
    switch (this.props.location) {
      case 'month':
        out = <Months />
        break
      case 'people':
        out = <People />
        break
      case 'day':
        out = <Day />
        break
    }
    if (this.props.user.isEmpty()) {
      out = <Login />
    }
    if (!out) {
      window.location.hash = '#month'
    }
    return out
  }
}

export default connect(
  state => {
    return {
      user: state.get('user'),
      locale: state.get('locale'),
      location: state.get('location')
    }
  },
  (dispatch, getState) => {
    return {
      load_clients: bindActionCreators(load_clients, dispatch),
      load_beds:    bindActionCreators(load_beds, dispatch),
      sign_in:      bindActionCreators(sign_in, dispatch)
    }
  }
)(DashClass)


class DayClass extends React.Component {
  constructor(props) {
    super(props)
  }

  set_day() {
    this.props.set_day(this.refs.day.value)
  }

  render() {
    const daystart = moment(this.props.day).add(this.props.start, 'hours')
    const dayend   = moment(this.props.day).add(this.props.end,   'hours') 
    return (
      <section className="main beds">
      <Header>
        <label class="set-day" >
          <input type="date" ref="day" defaultValue={this.props.day.format('YYYY-MM-DD')} />
          <button onClick={this.set_day.bind(this)} >set</button>
        </label>
      </Header>
      <main>
        { this.props.beds.map(bed => <Bed bed={bed} visits={bed.get('visits')} daystart={daystart} dayend={dayend} />) }
        <TimeSeries duration={moment.duration(10,'minutes')} daystart={daystart} dayend={dayend}/> 
      </main>
      <VisitModal />
      </section>
    )
  }
}
const Day = connect(
  state => {
    return {
      day:   state.get('day'),
      start: state.get('start'),
      end:   state.get('end'),
      beds:  state.get('beds')
    }
  },
  (dispatch, getState) => {
    return {
      set_day: bindActionCreators(set_day, dispatch)
    }
  }
)(DayClass)

function TimeSeries(props) {
  const periods = props.dayend.diff(props.daystart) / props.duration
  const current = moment(props.daystart)
  const out = []
  while (current.isBefore(props.dayend)) {
    out.push(<li>{ current.format('HH:mm') }</li>)
    current.add(props.duration)
  }
  return (
    <section className="times">
      <header>times</header>
      <ul className="list">{ out }</ul>
    </section>
  )
}
class BedClass extends React.Component {
  constructor(props) {
    super(props)
  }

  addVisit(e) {
    const clicktime = parseInt(moment(this.props.dayend).diff(this.props.daystart) * (e.clientY-e.target.offsetTop) / e.target.clientHeight)
    this.props.create_visit({
      start: moment(this.props.daystart).add(clicktime,'ms'),
      bed: this.props.bed.get('id')
    })
  }
  render() {
    const {visits} = this.props
    return (
      <section className="bed">
        <header>
          <h3>{`Кроватка №${this.props.bed.get('id')}`}</h3>
        </header>
        <div className="list" onClick={this.addVisit.bind(this)}>
        { 
          this.props.visit.getIn(['visit','bed'])==this.props.bed.get('id') 
            ? <Period start={this.props.visit.getIn(['visit','start'])} end={this.props.visit.getIn(['visit','end'])} daystart={this.props.daystart} dayend={this.props.dayend} /> 
            : null 
        }
        { 
          visits && visits.map(visit => {
            return <Visit visit={visit} daystart={this.props.daystart} dayend={this.props.dayend} />
          })
        }
        </div>
      </section>
    )
  }
}
const Bed = connect(
  state => {
    return {
      visit: state.get('visit')
    }
  },
  (dispatch, getState) => {
    return {
      create_visit: bindActionCreators(create_visit, dispatch),
      select_visit: bindActionCreators(select_visit, dispatch)
    }
  }
)(BedClass)

class VisitModalClass extends React.Component {
  constructor(props) {
    super(props)
  }
  change_visit_minute(evt) {
    const start = moment(this.props.visit.getIn(['visit','start'])).minute(evt.target.value)
    const end = moment(start).add(this.props.length, 'minutes')
    this.props.update(this.props.visit.setIn(['visit','start'],start).setIn(['visit','end'], end))
  }
  change_visit_hour(evt) {
    const start = moment(this.props.visit.getIn(['visit','start'])).hour(evt.target.value)
    const end = moment(start).add(this.props.length, 'minutes')
    this.props.update(this.props.visit.setIn(['visit','start'],start).setIn(['visit','end'], end))
  }
  set_length(evt) {
    const end = moment(this.props.visit.getIn(['visit','start'])).add(evt.target.value, 'minutes')
    this.props.update(this.props.visit.setIn(['visit','end'], end))
  }
  select_client(client) {
    this.props.update(this.props.visit.set('client', Map(client)))
  }
  set_note(e) {
    this.props.update(this.props.visit.setIn(['visit','note'], e.target.value))
  }
  send_visit() {
    if (this.props.visit.get('client', Map()).isEmpty()) {
      return alert('выбери меня')
    }
    this.props.submit(this.props.visit)
    this.props.hide()
  }
  render() {
    const visit  = this.props.visit.get('visit')
    const client = this.props.visit.get('client', Map())
    
    if (!visit) return null
    return (
        <dialog open className="modal">
          <header>
            <h2>{ `${this.props.visit.get('new') ? 'Добавить' : 'Редактировать'} visit`}</h2>
            <button onClick={this.props.hide} className="close"></button>
          </header>
          <main>
            <Select
            autofocus={true}
            value={client.get('value')}
            onChange={this.select_client.bind(this)}
            options={this.props.clients.toJS()} />
            <label>
            <input type="number" min={0} max={23} value={moment(visit.get('start')).format('HH')} onChange={this.change_visit_hour.bind(this)} />
            <input type="number" step={5} min={0} max={59} value={moment(visit.get('start')).format('mm')} onChange={this.change_visit_minute.bind(this)} />
            </label>
            <div style={ {display: "flex", flexWrap: "wrap",justifyContent:"space-between" } }>
              <span style={{flex: "1 0 100%"}}>Длительность</span>
              <label>20 <input checked={ 20==this.props.length } value="20" type="radio" name="length" onChange={this.set_length.bind(this)} /></label>
              <label>30 <input checked={ 30==this.props.length } value="30" type="radio" name="length" onChange={this.set_length.bind(this)} /></label>
              <label>40 <input checked={ 40==this.props.length } value="40" type="radio" name="length" onChange={this.set_length.bind(this)} /></label>
            </div>
            <textarea onChange={this.set_note.bind(this)}>{visit.get('note')}</textarea>
            <button onClick={this.send_visit.bind(this)}>Записать</button>
            <button onClick={this.props.hide}>Отменить</button>
          </main>
        </dialog>
    )
  }
}
const VisitModal = connect(
  state => {
    const visit = state.get('visit'),
          start = moment(visit.getIn(['visit','start'])),
          end   = visit.getIn(['visit','end']),
          len   = end ? moment(end).diff(start,'minutes') : 40;
    return {
      length: len,
      visit: state.get('visit'),
      clients: state.get('clients')
    }
  },
  (dispatch, getState) => {
    return {
      hide: bindActionCreators(() => { return { type: 'deselect visit' }}, dispatch),
      update: bindActionCreators(select_visit, dispatch),
      submit: bindActionCreators(save_visit, dispatch)
     }
  }
)(VisitModalClass)
class Period extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const visit = this.props.visit ? <Visit visit={this.props.visit} /> : null
    const height = moment(this.props.dayend).diff(this.props.daystart)
    const style = {
      top: moment(this.props.start).diff(this.props.daystart) * 100 / height + '%',
      height: this.props.end ? moment(this.props.end).diff(this.props.start) * 100 / height + '%' : '3%'
    }
    return (
      <time style={style} className={ visit ? 'occupied' : 'free' }>
      { visit } 
      </time>
    )
  }
}

const Visit = connect(
  null,
  (dispatch, getState) => {
    return {
      select_visit: bindActionCreators(select_visit, dispatch)
    }
  }
)(({select_visit, visit,dayend,daystart}) => {
  const height = moment(dayend).diff(daystart)
  const style = {
    top: moment(visit.getIn(['visit','start'])).diff(daystart) * 100 / height + '%',
    height: moment(visit.getIn(['visit','end'])).diff(visit.getIn(['visit','start'])) * 100 / height + '%'
  }
  return (
    <div 
    style={style}
    className={classnames("visit", visit.get('status', 'occupied'))} 
    onClick={e => { e.stopPropagation(); select_visit(visit) }}>
    <span>{ visit.getIn(['client','name']) }</span>
    <span className="time">{ moment(visit.getIn(['visit','start'])).format('HH:mm') }</span>
    <span className="note">{ visit.getIn(['visit','note'])  }</span>
    </div>
  )
})

function save_visit(visit) {
  return (dispatch, getState) => {
    dispatch({type: 'saving visit'})
    return $.ajax({
      method: 'put',
      url: `/krovati/_design/krovati-couch/_update/add_visit/${visit.getIn(['client','value'])}`,
      xhrfields: { withCredentials: true },
      data: {
        start: visit.getIn(['visit','start']).toString(),
        end:   visit.getIn(['visit','end']).toString(),
        note:  visit.getIn(['visit','note']),
        bed:   visit.getIn(['visit','bed'])
      }
    })
    .then(_=>{
      dispatch({type: 'visit saved'})
      dispatch(load_bed_data(visit.getIn(['visit','bed'])))
    })
    .catch(err => dispatch({ type: 'ajax error', payload: err}))

  }
}

function load_beds() {
  return (dispatch, getState) => {
    dispatch({type: 'loading beds'})
    const day = getState().get('day')
    return $.get({
      url: `/krovati/_design/krovati-couch/_list/clients_json/by_date?key=[${day.year()},${day.month()},${day.date()}]`,
      xhrfields: { withCredentials: true }
    })
    .then(beds => dispatch({ type: 'beds loaded', payload: beds }))
    .catch(err => dispatch({ type: 'ajax error', op: 'beds load', payload: err}))
  }
}
function load_clients() {
  return (dispatch, getState) => {
    dispatch({type: 'loading clients'})
    return $.ajax({
      url: `/krovati/_design/krovati-couch/_list/clients_json/clients`,
      xhrFields: { withCredentials: true },
    })
    .then(clients => dispatch({type: 'clients loaded', payload: clients }))
    .catch(err => dispatch({ type: 'ajax error',op: 'clients load', payload: err}))
  }
}
function load_bed_data(bed_id) {
  return (dispatch, getState) => {
    dispatch({type: 'loading visits'})
    const day = getState().get('day')
    return $.get({
      url: `/krovati/_design/krovati-couch/_list/by_bed_json/by_bed?key=[${bed_id},${day.year()},${day.month()},${day.date()}]`,
      xhrfields: { withCredentials: true }
    })
    .then(data => {
      dispatch({type: 'visits loaded', payload: { bed: bed_id, visits: data }})
    })
    .catch(err => dispatch({ type: 'ajax error', op: 'visits load', payload: err}))
  }
}

function select_visit(visit) {
  return {
    type: 'select visit',
    payload: visit
  }
}

function create_visit(visit) {
  return {
    type: 'initiate visit',
    payload: visit
  }
}
function set_day(day) {
  return (dispatch, getState) => {
    dispatch({ type: 'set day', payload: day })
    return dispatch(load_beds())
  }
}
function sign_in() {
  return (dispatch, getState) => {
    return $.ajax({
      url: HOST + '_session',
      xhrfields: { withCredentials: true }
    })
    .then(res => {
      const data =  JSON.parse(res)
      if (!data.userCtx.name) return dispatch({type: 'logout ok'})
      dispatch({ type: 'login ok', payload: data.userCtx})
    })
    .catch(err => dispatch({type: 'ajax error', op: 'login', payload: err }))
  }
}
