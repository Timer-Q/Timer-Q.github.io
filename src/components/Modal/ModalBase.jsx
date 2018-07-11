import React, { Component } from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import classNames from "classnames"
import Transition from "../Transition"
import "./style/modal.scss"

export default class Modal extends Component {
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

  closeModal = event => {
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
          className="modal-mask"
          onClick={maskClosable ? this.closeModal : undefined}
        />
      )
    )
  }

  renderDialog() {
    const { title, closable, children, footer } = this.props

    const closer = closable && (
      <button className="modal-close" onClick={this.closeModal}>
        &times;
      </button>
    )

    const headerNode = title && (
      <div className="modal-content-header">
        {title}
        {closer}
      </div>
    )

    const body = children && (
      <div className="modal-content-body">{children}</div>
    )

    const footerNode = footer && (
      <div className="modal-content-footer">{footer}</div>
    )

    return (
      <div className="modal-content">
        {headerNode}
        {body}
        {footerNode}
      </div>
    )
  }

  render() {
    const { visible } = this.state
    const { style, className, afterClose } = this.props
    const cls = classNames("modal", {
      "is-show": visible,
      [className]: className
    })
    return ReactDOM.createPortal(
      <div style={style} className={cls}>
        <Transition in={visible} transitionName="mode-fade">
          {this.renderMask()}
        </Transition>

        <Transition in={visible} onExited={afterClose} transitionName="mode-scale">
          <div className="modal-wrapper">{this.renderDialog()}</div>
        </Transition>
      </div>,
      document.body
    )
  }
}
