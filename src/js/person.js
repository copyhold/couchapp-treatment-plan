import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import moment               from 'moment'
import Header               from './header'

class Person extends React.Component {
  render() {
    const {person} = this.props
    if (!person) return null
    return (
      <section className="main person">
      <Header><h3>{person.get('name')}</h3></Header>
      <main>
      <PersonalData  person={person} />
      <PersonVisits visits={person.get('visits')} />
      </main>
      </section>
    )
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
            { visit.notes.length>0 && (
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
        <dt>Теудат зеут</dt>,
        <dd>{ person.get('value') }</dd>
      ]}
      { check('_id') && [
        <dt>Теудат зеут</dt>,
        <dd>{ person.get('_id') }</dd>
      ]}
      { check('phone') && [
        <dt>Телефон</dt>,
        <dd>{ person.get('phone') }</dd>
      ]}
      { check('address') && [
        <dt>Адрес</dt>,
        <dd>{ person.get('address') }</dd>
      ]}
      { check('birthday') && [
        <dt>День Рождения</dt>,
        <dd>{ person.get('birthday') }</dd>
      ]}
      { check('notes') && [
        <dt>Заметки</dt>,
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
      save: bindActionCreators(save, dispatch),
      update: data => { return { type: 'update person', payload: data } }
    }
  }
)(Person)


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
