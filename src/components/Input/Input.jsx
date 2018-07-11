import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./style/index.scss"

export default class Input extends Component {
  static propTypes = {
    size: PropTypes.oneOf(["large", "default", "small"]),
    autoComplete: PropTypes.string,
    type: PropTypes.string,
    prefixClass: PropTypes.string.isRequired,
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    onChange: PropTypes.func,
    prefix: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    suffix: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    id: PropTypes.string,
    counter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    readonly: PropTypes.bool,
    bordered: PropTypes.bool,
    className: PropTypes.any,
    title: PropTypes.any,
    children: PropTypes.any,
    style: PropTypes.object,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onPressEnter: PropTypes.func,
    onClear: PropTypes.func
  }

  static defaultProps = {
    prefixClass: "input",
    size: "default",
    type: "text",
    bordered: true
  }

  constructor(props) {
    super(props)
    this.state = {
      valueLength: props.value ? props.value.length : 0
    }
    this.beyondCounter = false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps
    if (!value) return { valueLength: 0 }
    if (prevState.valueLength === nextProps.value.length) return null
    return {
      valueLength: nextProps.value.length
    }
  }

  fixControlledValue(value) {
    if (typeof value === "undefined" || value === null) {
      return ""
    }
    return value
  }

  /**
   * input 有三种形态：
   * 1. 普通input        -> renderInput
   * 2. 带 icon (affix)   -> renderInputWithIcon
   * 3. 带 addon         -> renderInputWithAddon
   */

  getInputClassName() {
    const { prefixClass, size, disabled, bordered } = this.props
    return classNames(prefixClass, {
      "input-small": size === "small",
      "input-large": size === "large",
      "input-default": size === "default",
      "input-disabled": disabled,
      "without-border": !bordered
    })
  }

  // FIXME: this.state.valueLength >= counter 本来在这个判断下面直接 return；
  // but 这样当 valueLength == counter 的时候 就无法触发 onChange，无法触发页面渲染。
  // so 改成了 valueLength >= counter 的时候也会触发 onChange。
  handleChange = e => {
    const { onChange } = this.props
    
    onChange && onChange(e.target.value, e)
  }

  handleBlur = e => {
    const { onBlur } = this.props
    onBlur && onBlur(e)
  }
  handleFocus = e => {
    const { onFocus } = this.props
    onFocus && onFocus(e)
  }

  handleKeyDown = e => {
    const { onPressEnter, onKeyDown } = this.props
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e)
    }
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  handleKeyUp = () => {
    if ("onKeyUp" in this.props) {
      const { onKeyUp } = this.props
      onKeyUp && onKeyUp()
    }
  }

  handleClear = () => {
    const { onClear } = this.props
    onClear && onClear()
  }

  renderInupt() {
    const {
      type,
      addonBefore, // eslint-disable-line
      onPressEnter, // eslint-disable-line
      addonAfter, // eslint-disable-line
      prefixClass, // eslint-disable-line
      suffixClass, // eslint-disable-line
      bordered, // eslint-disable-line
      style, // eslint-disable-line
      children, // eslint-disable-line
      counter, // eslint-disable-line
      autoComplete,
      readonly,
      ...otherProps
    } = this.props

    if ("value" in this.props) {
      otherProps.value = this.fixControlledValue(otherProps.value)
      delete otherProps.defaultValue
    }
    return this.renderInputWithIcon(
      <input
        {...otherProps}
        readOnly={readonly}
        type={type}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onChange={this.handleChange}
        className={this.getInputClassName()}
        autoComplete={autoComplete}
      />
    )
  }

  renderInputWithIcon(child) {
    const { props } = this
    if (!("prefix" in props || "suffix" in props || "counter" in props)) {
      return child
    }
    if (
      process.env.NODE_ENV !== "production" &&
      "suffix" in props &&
      "counter" in props
    ) {
      console.warn(
        "suffix 和 counter 不能同时存在，如果同时存在，优先选用 counter"
      )
    }
    // 加工 prefix
    const prefix = props.prefix ? (
      <span className="input-prefix">{props.prefix}</span>
    ) : null

    // 加工 suffix + counter
    let beyondCounter
    if (props.counter && this.state.valueLength > props.counter) {
      beyondCounter = true
    } else {
      beyondCounter = false
    }

    const cls = beyondCounter ? "input-suffix-error" : null

    const suffix = (
      <span className="input-suffix">
        {props.counter ? (
          <span className={cls}>
            {this.state.valueLength}/{props.counter}
          </span>
        ) : (
          props.suffix || null
        )}
      </span>
    )

    const classes = classNames("input-affix-wrapper", {
      "input-counter": !!props.counter
    })

    return (
      <span className={classes}>
        {prefix}
        {React.cloneElement(child, {
          style: null,
          className: this.getInputClassName()
        })}
        {suffix}
      </span>
    )
  }

  renderInputWithAddon(child) {
    const { props } = this
    if (!props.addonBefore && !props.addonAfter) {
      return child
    }
    const addonBefore = props.addonBefore ? (
      <span className="input-addon">{props.addonBefore}</span>
    ) : null
    const addonAfter = props.addonAfter ? (
      <span className="input-addon">{props.addonAfter}</span>
    ) : null

    const classes = classNames(
      "input-addon-wrapper",
      `input-addon-${props.size}`
    )

    return (
      <span className={classes}>
        {addonBefore}
        {React.cloneElement(child, {})}
        {addonAfter}
      </span>
    )
  }

  render() {
    // eslint-disable-line
    const {
      disabled,
      className,
      placeholder, // eslint-disable-line
      title,
      prefixClass, // eslint-disable-line
      onBlur, // eslint-disable-line
      onFocus, // eslint-disable-line
      onPressEnter, // eslint-disable-line
      onChange, // eslint-disable-line
      onClick, // eslint-disable-line
      bordered, // eslint-disable-line
      addonBefore, // eslint-disable-line
      addonAfter, // eslint-disable-line
      readonly, // eslint-disable-line
      ...rest
    } = this.props
    const classes = classNames("input-wrapper", {
      "is-disabled": !!disabled,
      [className]: className
    })
    return (
      <div {...rest} className={classes}>
        {title && <div className="input-title">{title}</div>}
        {this.renderInputWithAddon(this.renderInupt())}
      </div>
    )
  }
}
