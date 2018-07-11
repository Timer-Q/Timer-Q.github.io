import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import ModelBase from "./ModelBase"
import Button from "../Button"
import Icon from "../Icon"

// FIXME: ActionButton 需要写成 class 的方式 因为有 loading 的 state
const ActionButton = props => {
  const onClick = () => {
    const { closeModel, actionFn } = props
    // 处理 promise
    if (actionFn) {
      let result
      if (actionFn.length) {
        result = actionFn(closeModel)
      } else {
        result = actionFn()
        if (!result) {
          closeModel()
        }
      }

      if (result && result.then) {
        result.then(
          args => {
            closeModel(args)
          },
          () => {
            console.log("loading over")
          }
        )
      }
    } else {
      closeModel()
    }
  }

  //eslint-disable-next-line
  const { children, closeModel, actionFn, ...rest } = props
  return (
    <Button {...rest} onClick={onClick}>
      {children}
    </Button>
  )
}

const ComfirmModel = props => {
  const {
    okType,
    onOk,
    okText,
    close,
    maskClosable,
    title,
    iconType,
    content,
    onCancel,
    isShowCancel,
    cancelText,
    type,
    ...rest
  } = props

  const cancelBtn = isShowCancel && (
    <ActionButton
      size="small"
      closeModel={close}
      type="default"
      ghost
      actionFn={onCancel}>
      {cancelText || "取 消"}
    </ActionButton>
  )

  const okBtn = (
    <ActionButton size="small" closeModel={close} type={okType} actionFn={onOk}>
      {okText || "确 定"}
    </ActionButton>
  )

  const footer = (
    <span>
      {cancelBtn}
      {okBtn}
    </span>
  )

  const icon = iconType || "confirm-icon"
  const iconClass = `model-icon-${type}`

  const titleNode = (
    <div className="model-title">
      {<Icon className={iconClass} size="large" type={icon} />} {title}
    </div>
  )

  return (
    <ModelBase
      {...rest}
      title={titleNode}
      onClose={close}
      maskClosable={!!maskClosable}
      footer={footer}>
      {content}
    </ModelBase>
  )
}

export default function confirm(config) {
  let div = document.createElement("div")
  document.body.appendChild(div)

  function close(...args) {
    render({
      ...config,
      visible: false,
      close,
      afterClose: destroy.bind(this, ...args)
    })
  }

  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }

    const triggerCancel =
      args && args.length && args.some(arg => arg && arg.triggerCancel)

    if (config.onCancel && triggerCancel) {
      config.onCancel(...args)
    }
  }

  function render(props) {
    ReactDOM.render(<ComfirmModel {...props} />, div)
  }

  render({ ...config, visible: true, close })

  return {
    destroy: close
  }
}

ComfirmModel.propTypes = {
  okType: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  close: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  maskClosable: PropTypes.bool,
  isShowCancel: PropTypes.bool,
  title: PropTypes.string,
  iconType: PropTypes.string,
  content: PropTypes.any,
  type: PropTypes.string
}

ActionButton.propTypes = {
  children: PropTypes.any,
  closeModel: PropTypes.func,
  actionFn: PropTypes.func
}
