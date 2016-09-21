import moment from 'moment'
import $ from 'jquery'

export default class Dash extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      beds: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 8
        }
      ]
    }
  }

  componentDidMount() {
    // here load data
  }
  render() {
    return <Day day={moment()} {...this.state} />
  }
}


class Day extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const daystart = moment(this.props.day.startOf('day').add(16,'hours')) 
    const dayend = moment(this.props.day.startOf('day').add(22,'hours')) 
    return (
      <section className="beds">
      { this.props.beds.map(bed => <Bed bed={bed} daystart={daystart} dayend={dayend} />) }
      <TimeSeries daystart={daystart} dayend={dayend}/> 
      </section>
    )
  }
}
const TimeSeries(props) {
  const periods = props.dayend.diff(props.daystart) / ( 10 * 60 * 1000 )
  return (
    <section class="time">
      <ul>
      </ul>
    </section>
  )
}
class Bed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visits: []
    }
  }

  componentDidMount() {
    const id = this.props.bed.id,
          day = this.props.daystart.toDate();
    $.getJSON(`/krovati/_design/krovati-couch/_list/by_bed_json/by_bed?key=[${id}, ${day.getFullYear()}, ${day.getMonth()}, ${day.getDate()}]`)
    .then(data => {
      this.setState({
        visits: data
      })
    })
    .catch(err => console.log(err))
  }
  
  render() {
    return (
      <section className="bed">
        <header>
          <h3>{`Кроватка №${this.props.bed.id}`}</h3>
        </header>
        <div className="list">
        { 
          this.state.visits.map(visit => {
            return <Period start={moment(new Date(visit.visit.start))} end={moment(new Date(visit.visit.end))} visit={visit} {...this.props} />
          })
        }
        </div>
      </section>
    )
  }
  
}
class Period extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const visit = this.props.visit ? <Visit visit={this.props.visit} /> : null
    const height = this.props.dayend.diff(this.props.daystart)
    const style = {
      marginTop: this.props.start.diff(this.props.daystart) * 100 / height + '%',
      height:    this.props.end.diff(this.props.start) * 100 / height + '%'
    }
    return (
      <time style={style} className={ visit ? 'occupied' : 'free' }>
      { visit } 
      </time>
    )
  }
}

function Visit(props) {
  return (
    <div className="visit">{ props.visit.client.name }</div>
  )
}
