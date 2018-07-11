import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Checkbox from "./Checkbox"
/**
 * CheckBoxGroup 实现思路：
 * 1. values(props.value) 是数组，state 中的 value 初始化为 props.value
 * 2.1.1 values(props.value) 是通过 props 传入
 * 2.1.2 通过 onChange 处理当前 Checkbox 的 value, values(props.value).indexOf(value) > -1 ? splice : push
 * 2.1.3 处理完成后 传入 props 中的 onChange 事件中 抛出去
 * 2.1.4 外面接收到后 更新 props 中的 valus(props.value) 重新渲染
 *
 * 2.2.1 values(props.value) 没有通过 props 传入
 * 2.2.2 onChange 处理后直接保存到 state 中，重新渲染
 * 2.2.3 将 处理完的 values(props.value) 传入 props 中的 onChange 事件 抛出去
 *
 * TODO: 批量选中
 */
export default class CheckboxGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue || []
    }
  }

  static propTypes = {
    options: PropTypes.array.isRequired,
    defaultValue: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    mode: PropTypes.oneOf(["horizontal", "vertical"])
  }

  static defaultProps = {
    options: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ("value" in nextProps) {
      if (prevState.value === nextProps.value) return null
      return {
        value: nextProps.value || []
      }
    }
    return null
  }

  getOptions() {
    const { options } = this.props
    return options.map(option => {
      if (typeof option === "string") {
        return {
          value: option,
          label: option
        }
      }
      return option
    })
  }

  toggleOption = optionValue => {
    const optionIndex = this.state.value.indexOf(optionValue)
    const value = [...this.state.value]
    if (optionIndex === -1) {
      value.push(optionValue)
    } else {
      value.splice(optionIndex, 1)
    }
    // 如果 state 中的 value 是由 props 中的 value 初始化而来 则不允许直接修改 value
    // 而是通过 onChange 方法将现在的 value 抛出去 由父组件修改
    if (!("value" in this.props)) {
      this.setState({ value })
    }

    const { onChange } = this.props
    if (onChange) {
      // NOTE: 这里传入 value 还是 e 还要再商定
      onChange(value)
    }
  }

  render() {
    const { props, state } = this
    const options = this.getOptions()
    let children = props.children

    const cls = classNames("checkbox-group", {
      [`checkbox-group-${props.mode}`]: props.mode
    })

    if (options && options.length > 0) {
      children = options.map(option => {
        return (
          <Checkbox
            key={option.value}
            disabled={"disabled" in option ? option.disabled : props.disabled}
            value={option.value}
            checked={state.value.indexOf(option.value) > -1}
            onChange={this.toggleOption.bind(this, option.value)}>
            {option.label}
          </Checkbox>
        )
      })
    } else {
      const { disabled } = this.props
      children = React.Children.map(children, child => {
        const checked = state.value.indexOf(child.props.value) > -1
        return React.cloneElement(child, {
          onChange: this.toggleOption,
          checked,
          disabled
        })
      })
    }
    return (
      <div className={cls}>
        {children}
      </div>
    )
  }
}
