import {bindActionCreators} from 'redux'
import {connect}            from 'react-redux'

function Menu(props) {
  return (
        <nav className="burg">
          <button></button>
          <a href="#people">Люди</a>
          <a href="#month">Месяцы</a>
          <a href="#day">День</a>
        </nav>
  )
}
class HeaderClass extends React.Component {
  render() {
    return (
      <header>
      {this.props.children}
        <Menu />
      </header>
    )
  }
}
module.exports = connect(
)(HeaderClass)
