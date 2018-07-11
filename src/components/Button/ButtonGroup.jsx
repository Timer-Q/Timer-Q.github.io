import React, { Component } from "react"
import PropTypes from "prop-types"
// import Button from "./Button"

export default class ButtonGroup extends Component {
  static propTypes = {
    children: PropTypes.node
  }
  render() {
    const { children, ...otherProps } = this.props
    return <div {...otherProps} className="button-group">{children}</div>
  }
}
