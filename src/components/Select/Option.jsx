import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./style/option.scss"

export default class Option extends Component {
  static propTypes = {
    children: PropTypes.any,
    value: PropTypes.any, // props 自身的 value
    selectedValue: PropTypes.any, // context 传入的 value
    label: PropTypes.string,
    disabled: PropTypes.bool,
    optionClick: PropTypes.func,
    isCached: PropTypes.bool,
    className: PropTypes.string,
    key: PropTypes.any
  }

  /**
   * 点击事件  触发 父组件的 optionClick 方法
   */
  handleClick = event => {
    // event.stopPropagation()
    if (this.props.disabled) return
    const { optionClick, key } = this.props
    optionClick && optionClick(this, key, event)
  }
  /**
   * 根据 selectedValue 和 value 判断是否选中
   */
  isSelected() {
    const { selectedValue, value } = this.props
    if (!value) return false
    if (Array.isArray(selectedValue)) {
      return selectedValue.indexOf(value) > -1
    } else {
      return selectedValue === value
    }
  }

  render() {
    const { disabled, children, isCached, className } = this.props
    const classes = classNames("option", {
      "is-selected": this.isSelected(),
      "is-hover": isCached,
      "is-disabled": disabled,
      [className]: !!className
    })
    return (
      <li className={classes} onClick={e => this.handleClick(e)}>
        {children}
      </li>
    )
  }
}
