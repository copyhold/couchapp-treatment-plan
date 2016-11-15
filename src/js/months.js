import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import moment               from 'moment'
import Header               from './header'
import $                    from 'jquery'
import {DESIGN}             from './const'
import {Map,List,Range}     from 'immutable'

import {set_day} from './dash'

class Months extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start: moment().startOf('month').subtract(3,'month'),
      load: Map()
    }
  }

  componentDidMount() {
    this.load_data()
  }
  componentDidUpdate(prevprops, prevstate) {
    if (prevstate.start!=this.state.start) this.load_data()
  }
  load_data() {
    const end = moment(this.state.start).add(5, 'month')
    $.get(`${DESIGN}/_view/day-load?group_level=3&startkey=[${this.state.start.year()},${this.state.start.month()},1]&endkey=[${end.year()},${end.month()},1]`)
    .then(res => {
      const data = (typeof res==='object' ? res.rows : JSON.parse(res).rows)
      var load = Map()
      data.forEach(row => {
        load = load.setIn(row.key, Map(row.value))
      })
      this.setState({ 
        load: load
      })
    })
  }
  render() {
    return (
      <section className="main months">
      <Header>
      <div className="changestart">
      <button onClick={_=>this.setState({ start: moment(this.state.start).subtract(1,'month')})}></button>
      <span>{ this.state.start.format('YYYY MMM')}</span>
      <button onClick={_=>this.setState({ start: moment(this.state.start).add(1,'month')})}></button>
      </div>
      </Header>
      <main>
      {
        '     '.split('').map((_,k) => {
          const current = moment(this.state.start).add(k,'month')
          return <Month start={current} data={this.state.load.getIn([current.year(), current.month()])} />
        })
      }
      </main>
      </section>
    )
  }
}

function MONTH({start, data, day_length,...props}) {
  const end = moment(start).endOf('month') 
  const current = moment(start).startOf('month')
  return (
    <div onClick={jump} className="month" data-month={current.month()}>
    <h3>{ current.format('MMMM') }</h3>
    {
      Range(0,start.daysInMonth()).map(day => {
        var hr = null
        if (data) {
          const load = data.getIn([current.date(),'sum'],0)
          hr = <hr style = { { width: `${ load * 100 / day_length}%` } } />
        }
        const out = <i data-dow={current.day()}>{hr}{current.date()}</i>
        current.add(1,'day')
        return out
      })
    }
    </div>
  )
  function jump(e) {
    if (e.target.tagName!=='I') return
    props.set_day(moment(start).add(parseInt(e.target.innerText)-1, 'day'))
    document.location.hash = '#day'
  }
}
const Month = connect(
  state => {
    return {
      day_length: 60 * (state.get('end') - state.get('start'))
    }
  },
  (dispatch,getState) => {
    return {
      set_day: bindActionCreators(set_day, dispatch)
    }
  }
)(MONTH)

module.exports = connect(
  state => {
    return {
      people: state.get('clients')
    }
  }
)(Months)

