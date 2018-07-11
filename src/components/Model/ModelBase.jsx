import React, { Component } from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import classNames from "classnames"
import Transition from "../Transition"
import "./style/model.scss"

export default class Model extends Component {
  static propTypes = {
    title: PropTypes.any,
    footer: PropTypes.any,
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    closable: PropTypes.bool,
    children: PropTypes.any,
    confirmLoading: PropTypes.bool,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    afterClose: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    mask: true,
    visible: false
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible === prevState.visible) return null
    return { visible: nextProps.visible }
  }

  closeModel = event => {
    if (!("visible" in this.props)) {
      this.setState({
        visible: false
      })
    }
    const { onClose } = this.props
    onClose && onClose(event)
  }

  renderMask() {
    const { mask, maskClosable } = this.props

    return (
      mask && (
        <div
          className="model-mask"
          onClick={maskClosable ? this.closeModel : undefined}
        />
      )
    )
  }

  renderDialog() {
    const { title, closable, children, footer } = this.props

    const closer = closable && (
      <button className="model-close" onClick={this.closeModel}>
        &times;
      </button>
    )

    const headerNode = title && (
      <div className="model-content-header">
        {title}
        {closer}
      </div>
    )

    const body = children && (
      <div className="model-content-body">{children}</div>
    )

    const footerNode = footer && (
      <div className="model-content-footer">{footer}</div>
    )

    return (
      <div className="model-content">
        {headerNode}
        {body}
        {footerNode}
      </div>
    )
  }

  render() {
    const { visible } = this.state
    const { style, className, afterClose } = this.props
    const cls = classNames("model", {
      "is-show": visible,
      [className]: className
    })
    return ReactDOM.createPortal(
      <div style={style} className={cls}>
        <Transition visible={visible} classNames="mode-fade">
          {this.renderMask()}
        </Transition>

        <Transition visible={visible} onExited={afterClose} classNames="mode-scale">
          <div className="model-wrapper">{this.renderDialog()}</div>
        </Transition>
      </div>,
      document.body
    )
  }
}
