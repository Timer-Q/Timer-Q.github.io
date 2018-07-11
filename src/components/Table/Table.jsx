import React, { Component } from "react"
import PropTypes from "prop-types"
import "./style/table.scss"

export default class Table extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array
  }

  renderBodyWithDataSource = () => {
    const { dataSource } = this.props
    console.log(dataSource)
  }

  handleClick = e => {
    console.log(e)
  }

  render() {
    return (
      <React.Fragment>
        <input type="text"/>
        <input type="text" value="12"/>
        <table className="table">
          <thead>
            <tr onClick={this.handleClick}>
              <th>123</th>
              <th>123</th>
              <th>123</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>321</td>
              <td>321</td>
              <td>321</td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}
