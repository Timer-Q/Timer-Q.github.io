import React, { Component } from "react"
import PropTypes from "prop-types"
import "./style/model.scss"
import ModelBase from "./ModelBase"
import Button from "../Button"

export default class Model extends Component {
  static propTypes = {
    title: PropTypes.any,
    mask: PropTypes.bool,
    closable: PropTypes.bool,
    children: PropTypes.any,
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    confirmLoading: PropTypes.bool,
    visible: PropTypes.bool,
    okType: PropTypes.string,
    onCancle: PropTypes.func,
    onOk: PropTypes.func,
    maskClosable: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.object
  }

  static defaultProps = {
    mask: true,
    visible: false,
    maskClosable: true
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

  handleClose = () => {
    this.closeModel()
  }

  handleOk = event => {
    event.stopPropagation()
    const { onOk } = this.props
    onOk && onOk(event)
  }

  handleCancel = event => {
    event.stopPropagation()
    const { onCancle } = this.props
    onCancle && onCancle(event)
  }

  closeModel() {
    if (!("visible" in this.props)) {
      this.setState({
        visible: false
      })
    }
    const { onCancle } = this.props
    onCancle && onCancle()
  }

  renderMask() {
    const { mask } = this.props
    return mask && <div className="model-mask" />
  }

  renderFooter() {
    const { cancelText, okText, confirmLoading, okType } = this.props
    return (
      <div>
        <Button
          size="small"
          type="default"
          ghost
          onClick={e => this.handleCancel(e)}>
          {cancelText || "取 消"}
        </Button>
        <Button
          size="small"
          type={okType}
          loading={confirmLoading}
          onClick={this.handleOk}>
          {okText || "确 定"}
        </Button>
      </div>
    )
  }

  render() {
    const { visible } = this.state
    return (
      <ModelBase
        {...this.props}
        footer={this.renderFooter()}
        visible={visible}
        onClose={this.handleCancel}
      />
    )
  }
}
