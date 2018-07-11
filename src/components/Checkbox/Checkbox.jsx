import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./style/index.scss"

export default class Checkbox extends Component {
  static propTypes = {
    type: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.any,
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    children: PropTypes.any,
    style: PropTypes.object,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    extra: PropTypes.any
  }

  static defaultProps = {
    prefixCls: "checkbox",
    type: "checkbox",
    disabled: false
  }

  constructor(props) {
    super(props)

    const checked = "checked" in props ? props.checked : props.defaultChecked

    this.state = {
      checked
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if ("checked" in nextProps) {
      return {
        checked: nextProps.checked
      }
    }
    return null
  }

  handleChange = event => {
    // event.stopPropagation()
    const { onChange, disabled } = this.props

    if (disabled) return

    // 如果 props 中没有传入 checked
    if (!("checked" in this.props)) {
      this.setState({
        checked: event.target.checked
      })
    }

    if (onChange) {
      onChange(event.target.value || event.target.checked, this.props)
    }
  }

  render() {
    const {
      disabled,
      readOnly,
      type,
      onClick,
      onFocus,
      onBlur,
      value,
      children,
      prefixCls, // eslint-disable-line
      labelClassName,
      extra,
      style,
      className,
      ...otherProps
    } = this.props

    const { checked } = this.state
    const checkboxWrapperClasses = classNames(`${prefixCls}-wrapper`, {
      "is-checked": checked,
      "is-disabled": disabled,
      [className]: !!className
    })

    const checkboxClasses = classNames(`${prefixCls}-input`)

    const labelCls = classNames(`${prefixCls}-label`, {
      [labelClassName]: labelClassName
    })

    return (
      <div style={style} className={checkboxWrapperClasses}>
        <label className={labelCls}>
          <input
            {...otherProps}
            className={checkboxClasses}
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            onClick={onClick}
            onChange={this.handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value}
            checked={!!checked}
          />
          <span className={`${prefixCls}-inner`} />
          <span className={`${prefixCls}-label-content`}>{children}</span>
        </label>
        {extra && <span className={`${prefixCls}-extra`}>{extra}</span>}
      </div>
    )
  }
}
