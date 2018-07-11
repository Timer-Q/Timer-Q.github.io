import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./style/icon.scss"

export default class Icon extends Component {
  static propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    spin: PropTypes.bool,
    size: PropTypes.oneOf(["small", "default", "large"])
  }

  render() {
    const { type, className, spin, size, ...rest } = this.props
    const cls = classNames("icon iconfont", {
      "icon-spin": !!spin || type === "loading",
      [`iconfont-${type}`]: type,
      [`icon-${size}`]: size,
      [className]: className
    })

    return <i {...rest} className={cls} />
  }
}
