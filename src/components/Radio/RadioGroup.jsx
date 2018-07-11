import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Radio from "./Radio"

/**
 * RadioGroup 实现思路：
 * radio 的操作 有不可逆的特点
 */
export default class RadioGroup extends Component {
  static propTypes = {
    value: PropTypes.any,
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    children: PropTypes.node,
    onChange: PropTypes.func,
    mode: PropTypes.oneOf(["horizontal", "vertical"])
  }

  static defaultProps = {
    mode: "horizontal"
  }

  constructor(props) {
    super(props)
    this.state = {
      value:
        props.value ||
        props.defaultValue ||
        this.getCheckedValue(props.children)
    }
  }

  getCheckedValue(children) {
    let value = null
    React.Children.forEach(children, child => {
      if (child && child.props && child.props.checked) {
        value = child.props.value
      }
    })
    return value
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ("value" in nextProps) {
      if (prevState.value === nextProps.value) return null
      return {
        value: nextProps.value
      }
    }
    return null
  }

  handleChange = value => {
    const preValue = this.state.value
    const curValue = value
    if (!("value" in this.props)) {
      this.setState({
        value
      })
    }
    const { onChange } = this.props
    if (onChange && preValue !== curValue) {
      // NOTE: 这里传入 curValue 还是 e 需再商定
      onChange(value)
    }
  }

  renderRadios() {
    // eslint-disable-next-line
    const { disabled, options, name, children } = this.props
    const { value } = this.state
    if (options && options.length > 0) {
      return options.map((option, index) => {
        if (typeof option === "string") {
          return (
            <Radio
              key={index}
              disabled={disabled}
              value={option}
              onChange={this.handleChange}
              checked={value === option}
              name={name}>
              {option}
            </Radio>
          )
        } else {
          return (
            <Radio
              key={index}
              disabled={option.disabled || disabled}
              value={option.value}
              onChange={this.handleChange}
              checked={value === option.value}
              name={name}>
              {option.label}
            </Radio>
          )
        }
      })
    } else {
      const { value, disabled } = this.props
      return React.Children.map(children, child => {
        const checked = value === child.props.value
        return React.cloneElement(child, {
          onChange: this.handleChange,
          checked,
          disabled
        })
      })
    }
  }

  render() {
    const { mode } = this.props // eslint-disable-line
    const cls = classNames("radio-group", {
      [`radio-group-${mode}`]: mode
    })
    return <div className={cls}>{this.renderRadios()}</div>
  }
}
