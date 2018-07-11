import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./style/anchor.scss"
import { throttle } from "utils"
import { scrollTo, getOffsetTop } from "utils/scroll"
import { getStepIndex } from "./util"
import { Provider } from "./context"

function defaultGetContainer() {
  return window
}

// let onActiveChangeTimer

export default class Anchor extends Component {
  static propTypes = {
    defaultActive: PropTypes.string,
    children: PropTypes.any,
    getContainer: PropTypes.func,
    onActiveChange: PropTypes.func,
    affix: PropTypes.bool,
    index: PropTypes.string,
    offsetTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bounds: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    affix: true,
    getContainer: defaultGetContainer
  }

  static isAnchor = true

  constructor(props) {
    super(props)
    const { defaultActive } = props
    this.state = {
      activeId: defaultActive,
      isFixed: false
    }
    this.scrollTimer = null
    this.links = []
    this.childrenLink = []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { activeId } = nextProps
    const { activeId: currentActiveId } = prevState
    if (activeId && activeId !== currentActiveId) {
      return {
        activeId
      }
    }
    return null
  }

  componentDidMount() {
    this.zIndex = getStepIndex()

    this.handleScroll = throttle(this.scrollListener.bind(this), 100)

    window.addEventListener("scroll", this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  /**
   * 该功能主要针对 PagePart 下的 Anchor
   * 当 PagePart 距离顶部 50px 的时候 吸顶
   * 当 \top\ - height > -50 (当前 PagePart 即将滚离视口) 取消吸顶
   */
  scrollListener = () => {
    const { getContainer, index } = this.props
    let parentContainer
    if (getContainer) {
      parentContainer =
        getContainer() === window
          ? document.getElementById(index)
          : getContainer()
    }
    if (!parentContainer) return
    const parentRect = parentContainer.getBoundingClientRect()

    if (parentRect.top < 10 && parentRect.bottom > 30) {
      if (!this.state.isFixed) {
        this.setState({
          isFixed: true
        })
      }
    } else {
      if (this.state.isFixed) {
        this.setState({
          isFixed: false
        })
      }
    }
    if (this.animating) {
      return
    }

    if (this.state.isFixed) {
      const { offsetTop, bounds, onActiveChange } = this.props
      const activeId = this.getCurrentAnchor(offsetTop, bounds)
      if (activeId) {
        if (activeId !== this.state.activeId) {
          this.setState({
            activeId: activeId
          })
        }
        // clearTimeout(onActiveChangeTimer)
        // 激活 menus
        // if (onActiveChange) {
        //   onActiveChangeTimer = setTimeout(() => {
        //     onActiveChange(activeId, this, this.anchorLinkInstance)
        //   }, 50)
        // }
        onActiveChange(activeId, this, this.anchorLinkInstance)
      } else if (this.childrenLink.indexOf(activeId) < 0 || !activeId) {
        this.setState({
          activeId: undefined
        })
      }
    }
  }

  getCurrentAnchor(offsetTop = 85, bounds = 5) {
    let activeId = ""
    if (typeof document === "undefined") {
      return activeId
    }

    const linkSections = []
    const { getContainer } = this.props
    const container = getContainer()
    this.links.forEach(item => {
      this.childrenLink.push(item.link)
      const target = document.getElementById(item.link)
      if (target) {
        const top = getOffsetTop(target, container)
        if (top < offsetTop + bounds) {
          linkSections.push({
            link: item.link,
            top,
            instance: item.instance
          })
        }
      }
    })

    if (linkSections.length) {
      const maxSection = linkSections.reduce(
        (prev, curr) => (curr.top > prev.top ? curr : prev)
      )
      this.anchorLinkInstance = maxSection.instance
      return maxSection.link
    }
    return ""
  }

  handleClick = href => {
    const { offsetTop, getContainer } = this.props
    this.animating = true
    scrollTo(href, offsetTop, getContainer, () => {
      this.animating = false
    })
  }

  registerLink = link => {
    const diff = this.links.some(item => {
      return item.link === link.link
    })
    if (!diff) {
      this.links.push(link)
    }
  }

  render() {
    const { isFixed, activeId } = this.state
    const { affix, children, style, className } = this.props
    const cls = classNames("anchor", {
      "is-fixed": isFixed && affix,
      [className]: !!className
    })
    const styles = {
      zIndex: this.zIndex,
      ...style
    }
    return (
      <Provider
        value={{
          registerLink: this.registerLink,
          onClick: this.handleClick,
          activeId
        }}>
        <div
          style={styles}
          ref={node => (this.anchorRef = node)}
          className={cls}>
          {children}
        </div>
      </Provider>
    )
  }
}
