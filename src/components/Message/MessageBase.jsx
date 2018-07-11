import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

export default class MessageBase extends Component {
  static propTypes = {
    children: PropTypes.any,
    duration: PropTypes.any,
    onClose: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    duration: 3
  }

  componentDidMount() {
    const { onClose, duration } = this.props
    setTimeout(() => {
      onClose()
    }, duration * 1000)
  }

  render() {
    const { children, className } = this.props
    const contentCls = classNames("message-content", {
      [className]: !!className
    })
    return (
      <div className="message">
        <div className={contentCls}>{children}</div>
      </div>
    )
  }
}
