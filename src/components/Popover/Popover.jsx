import React, { Component } from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import classNames from "classnames"
import Transition from "../Transition"
import "./style/popover.scss"

export default class Popover extends Component {
  static propTypes = {
    children: PropTypes.any,
    content: PropTypes.any,
    placement: PropTypes.oneOf([
      "top",
      "top-start",
      "top-end",
      "right",
      "right-start",
      "right-end",
      "bottom",
      "bottom-start",
      "bottom-end",
      "left",
      "left-start",
      "left-end"
    ]),
    trigger: PropTypes.oneOf(["click", "hover", "focus"]),
    transitionName: PropTypes.string,
    isShowPopper: PropTypes.bool,
    isCache: PropTypes.bool,
    bound: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    transitionName: "dropdown",
    trigger: "click",
    isCache: true,
    bound: {
      top: 0,
      left: 0,
      width: 0
    }
  }

  isFirstRender = true

  constructor(props) {
    super(props)
    this.state = {
      isShowPopper: props.isShowPopper || false
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!("isShowPopper" in nextProps)) return null
    if (nextProps.isShowPopper === prevState.isShowPopper) {
      return null
    }
    return {
      isShowPopper: nextProps.isShowPopper
    }
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.childrenDom = ReactDom.findDOMNode(this.childrenRef)
    if (!this.childrenDom) return
    const { trigger } = this.props
    if (trigger === "hover") {
      this.childrenDom.addEventListener("mouseenter", () => {
        this.togglePopper(this.childrenDom)
      })
    }
    if (trigger === "click") {
      this.childrenDom.addEventListener(
        "click",
        () => {
          this.togglePopper(this.childrenDom)
        },
        false
      )
    }
    if (trigger === "focus") {
      if (
        this.childrenDom.nodeName === "INPUT" ||
        this.childrenDom.nodeName === "TEXTAREA"
      ) {
        this.childrenDom.addEventListener("focus", () => {
          this.togglePopper(this.childrenDom)
        })
      } else {
        this.childrenDom.addEventListener("mousedown", () => {
          this.togglePopper(this.childrenDom)
        })
      }
    }
  }

  componentDidUpdate() {
    this.childrenStyle = this.getComputedStyle(this.childrenDom)
  }

  closePopover = event => {
    if (!this.childrenDom || !this.contentRef) return

    if (
      !(
        this.childrenDom.contains(event.target) ||
        this.contentRef.contains(event.target) ||
        this.childrenDom === event.target ||
        this.contentRef === event.target
      )
    ) {
      if (!("isShowPopper" in this.props)) {
        this.setState({
          isShowPopper: false
        })
      } else {
        const { children } = this.props
        const { onClick } = children.props
        onClick && onClick()
      }
    }
  }

  getComputedStyle(childrenDom) {
    if (!childrenDom) return
    const { top, left, height, width } = childrenDom.getBoundingClientRect()

    const scrollLeft = window.scrollX || window.pageXOffset
    const scrollTop = window.scrollY || window.pageYOffset
    // const offsetLeft = childrenDom.offsetLeft
    // const offsetTop = childrenDom.offsetTop

    const { bound } = this.props

    return {
      top: `${top + height + scrollTop + (bound.top || 0)}px`,
      left: `${left + scrollLeft + (bound.left || 0)}px`,
      minWidth: `${width + (bound.width || 0)}px`
    }
  }

  togglePopper(childrenDom) {
    this.childrenStyle = this.getComputedStyle(childrenDom)

    if (this.isFirstRender) {
      this.isFirstRender = false
    }

    if ("isShowPopper" in this.props) return

    this.setState({
      isShowPopper: !this.state.isShowPopper
    })
    // if (this.contentRef && this.state.isShowPopper) {
    //   this.contentRef.focus()
    // }
  }

  handleContentBlur = () => {
    if (!("isShowPopper" in this.props)) {
      // setTimeout 的作用是：
      // 点击 children 会先触发 blur 事件 然后触发 click 事件
      // 这样在 blur 中取到的 activeElement 是 body
      setTimeout(() => {
        const { activeElement } = document
        // eslint-disable-next-line
        const childrenDom = ReactDom.findDOMNode(this.childrenRef)
        if (
          !(
            childrenDom.contains(activeElement) || childrenDom === activeElement
          )
        ) {
          if (this.state.isShowPopper) {
            this.setState({
              isShowPopper: false
            })
          }
        }
      })
    }
  }

  getChildrenRef = node => {
    this.childrenRef = node
  }

  render() {
    const {
      children,
      content,
      isCache,
      transitionName,
      style,
      className
    } = this.props
    const { isShowPopper } = this.state

    if (isShowPopper) {
      document.addEventListener("click", this.closePopover, false)
    } else {
      document.removeEventListener("click", this.closePopover, false)
    }

    const newChildren = React.cloneElement(React.Children.only(children), {
      className: children.props.className,
      ref: this.getChildrenRef
    })

    const contentCls = classNames("popover-content", {
      // "is-hide": !isShowPopper
    })

    const contentNode = (
      <div style={{ display: isCache || isShowPopper ? "" : "none" }}>
        {content}
      </div>
    )

    const cls = classNames("popover", {
      [className]: !!className
    })

    return (
      <div style={style} className={cls}>
        {newChildren}
        {!this.isFirstRender &&
          ReactDom.createPortal(
            <div
              tabIndex="0"
              ref={node => (this.contentRef = node)}
              style={this.childrenStyle}
              className={contentCls}>
              <Transition transitionName={transitionName} in={isShowPopper}>
                {contentNode}
              </Transition>
            </div>,
            document && document.body
          )}
      </div>
    )
  }
}
