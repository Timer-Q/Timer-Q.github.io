import React, { Component } from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"
import PropTypes from "prop-types"
import Button from "../Button"
import Icon from "../Icon"
import Input from "../Input"
import "./style/tabs.scss"

const stepWidth = 200

export default class Tabs extends Component {
  static propTypes = {
    defaultActiveKey: PropTypes.string,
    activeKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onTabClick: PropTypes.func,
    onNextClick: PropTypes.func,
    onPrevClick: PropTypes.func,
    onChange: PropTypes.func,
    onEdit: PropTypes.func,
    onTitleEdit: PropTypes.func,
    children: PropTypes.any,
    destroyInactiveTabPane: PropTypes.bool,
    closable: PropTypes.bool,
    isAddTab: PropTypes.bool,
    addText: PropTypes.string,
    editable: PropTypes.bool,
    addButton: PropTypes.any,
    className: PropTypes.string,
    inputMaxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object
  }

  static defaultProps = {
    isAddTab: true,
    editable: true
  }

  constructor(props) {
    super(props)
    this.state = {
      activeKey: null,
      isNavOverflow: false,
      showOverflowNav: false,
      translateX: 0,
      editKey: null
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.activeKey !== prevState.activeKey &&
      "activeKey" in nextProps
    ) {
      return {
        activeKey: nextProps.activeKey
      }
    }
    return null
  }

  componentDidMount() {
    this.getRefsInfo
  }

  componentDidUpdate = () => {
    this.getRefsInfo
    this.getIsNavOverflow()
  }
  /**
   * 判断 tabs 是否超出长度
   */
  getIsNavOverflow = () => {
    const { navRect, navBarRect } = this.refsInfo

    if (navBarRect.width > navRect.width && !this.isNavOverflow) {
      this.isNavOverflow = true
    }
    if (navBarRect.width <= navRect.width && this.isNavOverflow) {
      this.isNavOverflow = false
    }
  }
  /**
   * @param {*} direction 方向 -1: left 1: right
   * tabs 整体 水平 translate 事件
   */
  handleNavBarTranslate = direction => {
    if (!direction) return

    const { navRect, navBarRect } = this.refsInfo

    if (navBarRect.width <= navRect.width) {
      return
    }
    // 向左移
    if (direction < 0) {
      // 如果tabs 最右边 已经不超出 或者超出的部分 小于 stepWidth
      // 让 tabs 向左移动 tabs 的宽度 多出来的距离
      // 即 让tabs 最右边正好不超出
      if (
        navBarRect.right <= navRect.right ||
        (navBarRect.right > navRect.right &&
          navBarRect.right - navRect.right < stepWidth)
      ) {
        this.setState({
          translateX: navRect.width - navBarRect.width
        })
        return
      }
    }
    // 向右移
    if (direction > 0) {
      if (
        navBarRect.left >= navRect.left ||
        (navBarRect.left < navRect.left &&
          Math.abs(navBarRect.left) < stepWidth)
      ) {
        this.setState({
          translateX: 0
        })
        return
      }
    }

    const distance = direction * stepWidth

    const translateX = this.state.translateX + distance
    this.setState({
      translateX
    })
  }
  /**
   * 点击一个 tab 的时候 判断该tab 是否部分被隐藏 然后移动 tabs
   */
  handleOneTabTranslate = () => {
    const { navRect } = this.refsInfo
    // eslint-disable-next-line
    const { left, right } = document
      .querySelector(".tabs-tab.is-actived")
      .getBoundingClientRect()
    const { translateX } = this.state
    if (left < navRect.left) {
      this.setState({
        translateX: translateX - (left - navRect.left)
      })
    }
    if (right > navRect.right) {
      this.setState({
        translateX: translateX - (right - navRect.right)
      })
    }
  }

  /**
   * 删除 tab 的时候 让最后一个不被隐藏
   */
  removeTabTranslate = () => {
    const { navRect, navBarRect } = this.refsInfo
    if (navBarRect.width > navRect.width) {
      if (!this.state.isNavOverflow) {
        this.setState({
          isNavOverflow: true
        })
      }

      const { left, right } = document
        .querySelector(".tabs-tab.is-actived")
        .getBoundingClientRect()

      if (left < navRect.left || right > navRect.right) {
        this.setState({
          translateX: navBarRect.left - left
        })
      }
    } else if (this.state.isNavOverflow) {
      this.setState({
        isNavOverflow: false
      })
      if (this.state.translateX !== 0) {
        this.setState({
          translateX: 0
        })
      }
    }
  }

  /**
   * 新增 tab 的时候 让最后一个不被隐藏
   */
  addTabTranslate = () => {
    const { navRect, navBarRect } = this.refsInfo
    if (navBarRect.width > navRect.width) {
      if (!this.state.isNavOverflow) {
        this.setState({
          isNavOverflow: true
        })
      }
      this.setState({
        translateX: navRect.width - navBarRect.width
      })
    } else if (this.state.isNavOverflow) {
      this.setState({
        isNavOverflow: false
      })
      if (this.state.translateX !== 0) {
        this.setState({
          translateX: 0
        })
      }
    }
  }
  /**
   * 获取 tabs 外层 和 tabs 的 dom信息
   */
  get getRefsInfo() {
    // eslint-disable-next-line
    const navEl = ReactDOM.findDOMNode(this.navRef)
    const navRect = navEl.getBoundingClientRect()

    // eslint-disable-next-line
    const navBarEl = ReactDOM.findDOMNode(this.navBarRef)
    const navBarRect = navBarEl.getBoundingClientRect()

    this.refsInfo = {
      navEl,
      navRect,
      navBarEl,
      navBarRect
    }

    return this.refsInfo
  }

  /**
   * tab 点击事件
   * @param {*} tab
   * @param {*} event
   */
  handleTabClick(tab, index, event) {
    event.stopPropagation()
    this.activedTabEl = event.target
    if (!("activeKey" in this.props) && tab.key !== this.state.activeKey) {
      this.setState({ activeKey: tab.key })
    }
    if (tab.key !== this.state.activeKey) {
      const { onChange } = this.props
      onChange && onChange(tab.key, tab)
    }
    setTimeout(() => {
      this.handleOneTabTranslate(tab, index)
    })
  }

  /**
   * 删除tab
   */
  handleRemove = (tab, event) => {
    event.stopPropagation()
    const { onEdit } = this.props
    onEdit && onEdit("remove", tab.key, tab)
    setTimeout(() => {
      this.removeTabTranslate()
    })
  }

  /**
   * 增加 tab
   */
  handleAdd = event => {
    event.stopPropagation()
    const { onEdit } = this.props
    onEdit && onEdit("add")
    setTimeout(() => {
      this.addTabTranslate()
    })
  }

  handleChangeEditState = (key, event) => {
    event.stopPropagation()
    if (this.state.editKey) {
      this.setState({
        editKey: null
      })
      return
    }
    this.setState({
      editKey: key
    })
  }

  handleTitleEdit(key, event) {
    const { onTitleEdit } = this.props
    onTitleEdit && onTitleEdit(key, event.target.value)
    this.setState({
      editKey: null
    })
  }

  renderSuffixIcon(key) {
    const { editable } = this.props
    return (
      editable && (
        <Icon onClick={e => this.handleChangeEditState(key, e)} type="edit" />
      )
    )
  }

  renderAddButton() {
    const { isAddTab, addText, addButton } = this.props
    if (isAddTab) {
      return addButton ? (
        addButton
      ) : (
        <Button
          onClick={this.handleAdd}
          icon={<Icon type="plus" />}
          ghost
          shape={!addText ? "circle" : null}
          type="default"
          className="tabs-nav-button">
          {addText}
        </Button>
      )
    }
  }

  renderCloseIcon(pane) {
    const { closable } = this.props
    const { closable: paneClosable } = pane.props
    const isClosable = paneClosable !== undefined ? paneClosable : closable
    return (
      isClosable && (
        <Icon
          className="tabs-tab-close"
          type="close"
          onClick={e => this.handleRemove(pane, e)}
        />
      )
    )
  }

  renderTabs() {
    const { activeKey, editKey } = this.state
    const { children, destroyInactiveTabPane } = this.props
    const tabNavs = []
    const tabPanes = []
    children &&
      React.Children.forEach(children, (child, index) => {
        if (!("tab" in child.props)) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Tabs 的 children 上必须有 tab 属性")
          }
          return
        }
        const { tab } = child.props

        let actived
        // 如果没有默认激活项 把第一个设置为 activevd
        if (!activeKey && index === 0) {
          actived = true
        } else {
          actived = activeKey === child.key
        }

        const classes = classNames("tabs-tab", {
          "is-actived": actived
        })

        tabNavs.push(
          <div
            key={index}
            className={classes}
            onClick={this.handleTabClick.bind(this, child, index)}>
            <div className="tabs-tab-content">
              {editKey === (child.key || index) ? (
                <Input
                  size="small"
                  maxlength={this.props.inputMaxLength}
                  onBlur={this.handleTitleEdit.bind(this, child.key || index)}
                  bordered={false}
                  defaultValue={tab}
                  style={{ maxWidth: "80px" }}
                />
              ) : (
                tab
              )}
              {this.renderSuffixIcon(child.key || index)}
            </div>
            {this.renderCloseIcon(child)}
          </div>
        )
        tabPanes.push(
          React.cloneElement(child, {
            actived,
            destroyInactiveTabPane
          })
        )
      })
    return { tabNavs, tabPanes }
  }

  render() {
    const { tabNavs, tabPanes } = this.renderTabs()
    const { translateX } = this.state

    const { className, style } = this.props

    const tabCls = classNames("tabs", {
      [className]: !!className
    })

    const cls = classNames("tabs-nav", {
      "tabs-nav-overflow": this.isNavOverflow
    })

    return (
      <div style={style} className={tabCls}>
        <div className="tabs-nav-container">
          {this.isNavOverflow && (
            <Icon
              onClick={this.handleNavBarTranslate.bind(this, 1)}
              type="left"
            />
          )}
          <div ref={node => (this.navRef = node)} className={cls}>
            <div
              style={{ transform: `translateX(${translateX}px)` }}
              ref={node => (this.navBarRef = node)}
              className="tabs-nav-bar">
              {tabNavs}
            </div>
          </div>
          {this.isNavOverflow && (
            <Icon
              type="right"
              onClick={this.handleNavBarTranslate.bind(this, -1)}
              style={{ right: "50px" }}
            />
          )}
          {this.renderAddButton()}
        </div>
        <div className="tabs-content">{tabPanes}</div>
      </div>
    )
  }
}
