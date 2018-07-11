import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./style/index.scss"

/**
 * TODO: 3. dashed
 *
 * FIXME: 后续有了icon后需要把 现有 icon 逻辑修改一下
 */

export default class Button extends Component {
  static propTypes = {
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    children: PropTypes.any,
    type: PropTypes.string,
    htmlType: PropTypes.oneOf(["submit", "button", "reset"]),
    size: PropTypes.oneOf(["small", "default", "large"]),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    icon: PropTypes.any,
    ghost: PropTypes.bool,
    link: PropTypes.bool,
    shape: PropTypes.oneOf(["circle"]),
    className: PropTypes.any,
    bordered: PropTypes.bool
  }

  static defaultProps = {
    size: "default",
    type: "primary",
    ghost: false
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: props.loading
    }
  }

  static delayTimeout = null

  static getDerivedStateFromProps(nextProps, prevState) {
    const preLoading = prevState.loading
    const curLoading = nextProps.loading
    if (preLoading) {
      clearTimeout(Button.delayTimeout)
    }
    // NOTE: 延时 loading
    if (typeof curLoading !== "boolean" && curLoading && curLoading.delay) {
      Button.delayTimeout = setTimeout(() => {
        return { loading: curLoading }
      }, curLoading.delay)
    } else {
      return { loading: curLoading }
    }
  }

  componentWillUnmount() {
    this.delayTimeout && clearTimeout(this.delayTimeout)
  }

  handleClick(e) {
    const { onClick } = this.props
    onClick && onClick(e)
  }

  render() {
    const {
      type,
      loading, // eslint-disable-line
      htmlType,
      size,
      children,
      icon,
      shape,
      ghost,
      link,
      className,
      ...otherProps
    } = this.props
    delete otherProps.bordered
    const loadingState = this.state.loading
    const classes = classNames("button", {
      [`button-${type}`]: type && !link,
      "button-link": link,
      [`button-${size}`]: size,
      "button-loading": loadingState,
      "button-ghost": ghost,
      [`button-${shape}`]: shape,
      [className]: className
    })

    const ComponentTag = otherProps.href ? "a" : "button"

    const iconNode = loadingState ? (
      <i className="icon-loading" />
    ) : (
      icon && <span className="button-icon">{icon}</span>
    )

    return (
      <ComponentTag
        {...otherProps}
        type={otherProps.href ? undefined : htmlType || "button"}
        className={classes}
        onClick={this.handleClick.bind(this)}>
        {iconNode}
        {children}
      </ComponentTag>
    )
  }
}
