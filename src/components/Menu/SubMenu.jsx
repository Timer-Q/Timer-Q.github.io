import React, { Component } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import Icon from "../Icon"
import { loopMenuItemRecursively } from "./utils"

export default class SubMenu extends Component {
  static propTypes = {
    children: PropTypes.any,
    getSubmenus: PropTypes.func,
    handleSelect: PropTypes.func,
    index: PropTypes.string,
    openedMenus: PropTypes.array,
    mode: PropTypes.string,
    openMenu: PropTypes.func,
    closeMenu: PropTypes.func,
    title: PropTypes.string,
    indexPath: PropTypes.array,
    anchor: PropTypes.string,
    href: PropTypes.string,
    activeIndex: PropTypes.array
  }

  static getDerivedStateFromProps(nextProps) {
    const { indexPath } = nextProps
    if (indexPath) {
      return {
        indexPath
      }
    } else {
      return null
    }
  }

  static isSubMenu = true

  constructor(props, context) {
    super(props, context)
    this.instanceType = "SubMenu"

    this.state = {
      active: null,
      indexPath: null
    }

    const { indexPath, index } = props

    this.isActive = indexPath && indexPath.indexOf(index) >= 0
  }

  componentDidMount() {
    this.props.getSubmenus(this.props.index, this)
  }

  getSubmenuRefDomInfo() {
    if (!this.subMenuRef) return
    const { top, height } = this.subMenuRef.getBoundingClientRect()
    return top + height
  }

  isChildrenSelected() {
    const { activeIndex } = this.props
    const result = { isChildrenSelected: false }
    loopMenuItemRecursively(this.props.children, activeIndex, result)
    return result.isChildrenSelected
  }

  opened() {
    return this.props.openedMenus.indexOf(this.props.index) !== -1
  }

  handleMouseEnter() {
    if (this.props.mode === "horizontal" && !this.isActive) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.props.openMenu(this.props.index, this.props.indexPath)
      }, 300)
    }
  }

  handleMouseLeave() {
    clearTimeout(this.timeout)
    const { mode } = this.props
    if (mode === "horizontal") {
      this.timeout = setTimeout(() => {
        this.props.closeMenu(this.props.index, this.props.indexPath)
      }, 300)
    }
  }

  handleActiveChange = (itemIndex, menuItemInstance) => {
    const { handleSelect, index } = this.props
    const indexs = [index].concat(itemIndex)
    handleSelect && handleSelect(indexs, menuItemInstance)
  }

  renderChildren = () => {
    const { children } = this.props
    const newChildren = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          handleSelect: this.handleActiveChange.bind(this)
        })
      }
    })
    return <ul className="sub-menu-wrapper">{newChildren}</ul>
  }

  render() {
    this.isActive = this.isChildrenSelected()
    const isOpened = this.opened()
    const classes = classNames("sub-menu", {
      "is-active": this.isActive,
      "is-opened": isOpened
    })

    const { title } = this.props

    return (
      <li
        className={classes}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        ref={node => (this.subMenuRef = node)}>
        <div className="sub-menu-title">
          <span>
            {title}
            <Icon className="menu-icon" type="down" />
          </span>
        </div>
        {this.renderChildren()}
      </li>
    )
  }
}
