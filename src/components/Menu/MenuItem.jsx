import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

export default class MenuItem extends Component {
  static isMenuItem = true

  static propTypes = {
    index: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    getMenuItems: PropTypes.func,
    activeIndex: PropTypes.array,
    indexPath: PropTypes.array,
    handleSelect: PropTypes.func,
    children: PropTypes.any
  }

  componentDidMount() {
    // 将当前 MenuItem 保存到 Menu 中
    const { getMenuItems, index } = this.props

    getMenuItems(index, this)
  }

  active() {
    const { index, activeIndex } = this.props
    return index === activeIndex
  }

  handleClick = () => {
    // event.stopPropagation()
    const { index, handleSelect } = this.props
    handleSelect([index], this)
  }

  render() {
    const { disabled, children } = this.props
    return (
      <li
        className={classNames("menu-item", {
          "is-active": this.active(),
          "is-disabled": disabled
        })}
        onClick={this.handleClick}>
        {children}
      </li>
    )
  }
}
