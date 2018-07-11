import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./style/index.scss"

export default class Textarea extends Component {
  static propTypes = {
    value: PropTypes.any,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    title: PropTypes.any
  }

  static defaultProps = {
    prefixCls: "input"
  }

  getTextAreaClassName() {
    const { prefixCls, className, disabled } = this.props
    return classNames(prefixCls, className, {
      "is-disabled": disabled
    })
  }

  handleChange = event => {
    // if (!('value' in this.props)) {
    //   this.
    // }
    const { onChange } = this.props
    onChange && onChange(event.target.value)
  }

  render() {
    const cls = this.getTextAreaClassName()
    // eslint-disable-next-line
    const { prefixCls, title, ...rest } = this.props
    return (
      <React.Fragment>
        {title && <div className="input-title">{title}</div>}
        <textarea
          {...rest}
          onChange={e => this.handleChange(e)}
          className={cls}
        />
      </React.Fragment>
    )
  }
}
