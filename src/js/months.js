import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'
import moment               from 'moment'
import Header               from './header'

module.exports = connect(
  state => {
    return {
      people: state.get('clients')
    }
  }
)(props => {
  return (
      <section className="main months">
      <Header>
      </Header>
      <main>
      months
      </main>
      </section>
  )
})
