import React, { Component } from "react"
import Checkbox from "../Checkbox"

export default class Radio extends Component {
  static defaultProps = {
    prefixCls: "radio",
    type: "radio"
  }
  render() {
    return <Checkbox {...this.props} />
  }
}
