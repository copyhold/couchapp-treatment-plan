import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import moment               from 'moment'
import Header               from './header'
import {DESIGN,ROOT}        from './const'
import {load_person}        from './store'
import $                    from 'jquery'

class Person extends React.Component {
  constructor(props){
    super(props)
    this.state = { edit: false }
  }
  render() {
    const {person} = this.props
    if (!person) return null
    return (
      <section className="main person">
      <Header>
      <h3>{person.get('name')}</h3>
      <button onClick={_=>document.getElementById('editclient').showModal()}>{t('Изменить')}</button>
      </Header>
      <main>
      <PersonalData  person={person} />
      <PersonVisits visits={person.get('visits')} />
      <dialog id="editclient" className="clientdialog">
        <button className="close heavy small"  onClick={_=>document.getElementById('editclient').close()}></button>
        <div className="content">
          <h2>{ t('Редактировать данные человека') }</h2>
          <form onSubmit={this.submit.bind(this)}>
            <input required key={person.get('_id')}      value={person.get('_id')}     placeholder={t('Теудат зеут')} name="tz"      ref="tz"    pattern="\d{9}" />
            <input required key={person.get('name')}     defaultValue={person.get('name')}    placeholder={t('Имя')}         name="name"    ref="name"  />
            <input required key={person.get('phone')}    defaultValue={person.get('phone')}   placeholder={t('Телефон')}     name="phone"   ref="phone" type="tel"      />
            <input required key={person.get('email')}    defaultValue={person.get('email')}   placeholder={t('Эл.почта')}    name="email"   ref="email" type="email"    />
            <input required key={person.get('address')}  defaultValue={person.get('address')} placeholder={t('Адрес')}       name="address" ref="name"  />
            <button type="button" onClick={this.delete.bind(this)} >{t('Удалить')}</button>
            <button>OK</button>
          </form>
        </div>
      </dialog>
      </main>
      </section>
    )
  }
  delete() {
    if (!confirm(t('Вы уверены, что хотите удалить все! данные об этом человеке?'))) return
    $.ajax({
      method: 'delete',
      url: `${ROOT}${this.props.person.get('_id')}?rev=${this.props.person.get('_rev')}`
    })
    .then(_ => {
      dispatch(load_clients())
      window.location.hash = '#people'
    })
  }
  submit(e) {
    e.preventDefault()
    const form = $(e.target)
    const tz = this.props.person.get('_id')
    $.ajax({
      method: 'post',
      url: `${DESIGN}/_update/update_client/${tz}`, 
      data: form.serialize()
    })
    .then(res => {
      form.parents('dialog')[0].close()
      this.props.dispatch({type: 'client updated'})
      return this.props.dispatch(load_person(tz))
    })
    .catch(err => this.props.dispatch({type: 'ajax error', op: 'edit client', payload: err }))
  }
}

function PersonVisits({visits}) {
  if (!visits) return null
  return (
    <div className="personvisits">
      <h3>Визиты</h3>
      <ul>
      {
        visits.toJS().map(visit => {
          return (
            <li>
            <time>{moment(visit.start).format('MM/DD/YYYY HH:mm')}</time>
            <b>{ visit.bed }</b>
            { visit.notes>0 && (
            <div className="notes">
              {
                visit.notes.map(note => <Note note={note} />)
              }
            </div>
            )}
            </li>
          )
        })
      }
      </ul>
    </div>
  )
}
export class PersonalData extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {person} = this.props
    if (!person) return null
    const {fields} = this.props
    function check(field) {
      return ((fields && fields.indexOf(field)>=0) || !fields) && person.has(field)
    }
    return (
      <dl className="persondata">
      { check('value') && [
        <dt>{t('Теудат зеут')}</dt>,
        <dd>{ person.get('value') }</dd>
      ]}
      { check('_id') && [
        <dt>{t('Теудат зеут')}</dt>,
        <dd>{ person.get('_id') }</dd>
      ]}
      { check('phone') && [
        <dt>{t('Телефон')}</dt>,
        <dd>{ person.get('phone') }</dd>
      ]}
      { check('email') && [
        <dt>{t('Эл.почта')}</dt>,
        <dd>{ person.get('email') }</dd>
      ]}
      { check('address') && [
        <dt>{t('Адрес')}</dt>,
        <dd>{ person.get('address') }</dd>
      ]}
      { check('birthday') && [
        <dt>{t('День Рождения')}</dt>,
        <dd>{ person.get('birthday') }</dd>
      ]}
      { check('notes') && [
        <dt>{t('Заметки')}</dt>,
        <Notes person={person}/>
      ]}
      </dl>
    )
  }
}
function Notes({person}) {
  const visitnotes = person
  .get('visits')
  .map(visit => visit
       .get('notes', [])
       .map(note => note.set('date', visit.get('start')))
  )
  .flatten(1)
  .concat(person.get('notes', []))
  .toJS()
  return (
        <dd className="notes">
        { 
          visitnotes.map(note => {
            return <Note note={note} />
          })
        }
        <AddNote />
        </dd>
  )
}
function Note({note}) {
  return  (
    <p>
    <span>{note.text}</span>
    <time>{moment(note.date).format('MM/DD/YYYY HH:mm')}</time>
    <sup>{note.author}</sup>
    </p>
  )
}
export default connect(
  state => {
    return {
      person: state.get('person')
    }
  },
  (dispatch, getstate) => {
    return {
      dispatch,
      save: bindActionCreators(save, dispatch),
      update: data => { return { type: 'update person', payload: data } }
    }
  }
)(Person)

const AddNote = connect(
  state => {
    return {
      person: state.get('person')
    }
  },
  (dispatch) => {
    return {
      perform: bindActionCreators(tz => {
        const text = $('#notetext').val()
        if (text.length<5) return dispatch({type: 'note add fail'})
        $.post(`${DESIGN}/_update/add_note/${tz}`, { text: text })
        .then(_ => {
          $('#notetext').val('')
          dispatch(load_person(tz))
          return dispatch({ type: 'note added' })
        })
        .catch(err => dispatch({type: 'ajax error',op: 'add note', payload: err}))
      }, dispatch)
    }
  }
)(({person,perform}) => {
  return (
    <div className="addnote">
      <textarea required id="notetext" placeholder={ t('Писать здесь') } ></textarea>
      <button onClick={perform.bind(this, person.get('_id'))} >{t('Добавить') }</button>
    </div>
  )
})

function save() {
  return function(dispatch, getState) {
    dispatch({ type: 'updating person' })
    const {person} = getState()
    return $.ajax({
      method: 'put',
      url: `/krovati/_design/krovati-couch/_update/person/${person.get('value')}`,
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
