import React, { Component } from "react"
import PropTypes from "prop-types"
import { Provider } from "./context"

import "./style/menu.scss"
class Menu extends Component {
  static propTypes = {
    children: PropTypes.node,
    onSelect: PropTypes.func, // 菜单激活回调 (index: 选中菜单项的 indexPath: 选中菜单项的 index path)
    mode: PropTypes.string, // horizontal,vertical 水平的 还是垂直的
    defaultActive: PropTypes.string, // 当前激活菜单的 index
    defaultOpeneds: PropTypes.string, // 当前打开的submenu的 key 数组
    uniqueOpened: PropTypes.bool, // 是否只保持一个子菜单的展开
    anchor: PropTypes.bool, // 是否使用锚点功能
    activeIndex: PropTypes.array,
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.instanceType = "Menu"
    this.state = {
      activeIndex: null,
      openedMenus: props.defaultOpeneds ? props.defaultOpeneds.slice(0) : [],
      indexPath: null
    }
    this.menuItems = {}
    this.submenus = {}
  }

  static getDerivedStateFromProps(nextProps) {
    // let nextState = {
    //   activeIndex: null,
    //   indexPath: null
    // }
    // if (nextProps.activeIndex) {
    //   nextState.activeIndex = nextProps.activeIndex
    // }
    // if (nextProps.indexPath) {
    //   nextState.indexPath = nextProps.indexPath
    // }

    return {
      activeIndex: nextProps.activeIndex,
      indexPath: nextProps.indexPath
    }
  }

  componentDidMount() {
    // this.openActiveItemMenus()
  }

  /**
   * MenuItem click 调用事件
   * @param {*} indexs 点击的 MenuItem 以及 其父组件的 index(props) 组成的数组
   * @param {*} instance 点击的 MenuItem
   */
  handleSelect = (indexs, instance) => {
    let { indexPath, openedMenus } = this.state

    const { onSelect } = this.props
    if (onSelect) {
      onSelect(indexs, openedMenus, instance)
    }

    if (!("indexPath" in this.props)) {
      indexPath = indexs

      this.setState({ indexPath })
    }
  }

  getMenuItems = (menuItemsIndex, menuItems) => {
    this.menuItems[menuItemsIndex] = menuItems
  }

  getSubmenus = (submenusIndex, submenus) => {
    this.submenus[submenusIndex] = submenus
  }

  // openActiveItemMenus() {
  //   let { indexPath, submenus } = this.state
  //   const { menuItems } = this

  //   if (activeIndex && this.props.mode === "vertical") {
  //     let indexPath = menuItems[activeIndex].indexPath()
  //     // 展开该菜单项的路径上所有子菜单
  //     indexPath.forEach(index => {
  //       const submenu = submenus[index]

  //       submenu && this.openMenu(index, submenu.indexPath())
  //     })
  //   }
  // }

  openMenu = index => {
    let { openedMenus } = this.state
    const { mode } = this.props

    if (openedMenus.indexOf(index) !== -1) return
    // 将不在该菜单路径下的其余菜单收起
    // if (this.props.uniqueOpened) {
    //   openedMenus = openedMenus.filter(index => {
    //     return indexPath.indexOf(index) !== -1
    //   })
    // }

    if (mode === "horizontal") {
      openedMenus = [index]
    } else {
      if (openedMenus.indexOf(index) < 0) {
        openedMenus.push(index)
      }
    }

    this.setState({ openedMenus })
  }

  closeMenu = index => {
    let { openedMenus } = this.state

    openedMenus.splice(openedMenus.indexOf(index), 1)
    this.setState({ openedMenus })
  }

  render() {
    const { mode, children, addonBefore, addonAfter } = this.props
    const { openedMenus, activeIndex, indexPath } = this.state
    return (
      <Provider
        value={{
          getMenuItems: this.getMenuItems,
          getSubmenus: this.getSubmenus,
          openedMenus: openedMenus,
          openMenu: this.openMenu,
          mode: mode,
          closeMenu: this.closeMenu,
          handleSelect: this.handleSelect,
          activeIndex: activeIndex,
          indexPath: indexPath
        }}>
        <div className="menu-wrapper">
          <div className="menu">
            {addonBefore}
            <div className="menu-item-wrapper">
              {React.Children.map(children, child => {
                return React.cloneElement(child, {
                  handleSelect: this.handleSelect.bind(this)
                })
              })}
            </div>
            {addonAfter}
          </div>
        </div>
      </Provider>
    )
  }
}

export default Menu
