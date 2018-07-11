import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./style/page.scss"

export default class Page extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.any
  }

  render() {
    const { className, style, children } = this.props
    const cls = classNames("page", {
      [className]: className
    })
    return (
      <div style={style} className={cls}>
        {children}
      </div>
    )
  }
}
