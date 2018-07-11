import React from "react"
import Icon from "../Icon"
import Message from "./Message"

let key = 0
let messageInstance
let defaultTop

function getMessageInstance(cb) {
  if (messageInstance) {
    cb(messageInstance)
    return
  }
  Message.newInstance(
    {
      style: { top: defaultTop }
    },
    instance => {
      if (messageInstance) {
        cb(messageInstance)
        return
      }
      messageInstance = instance
      cb(messageInstance)
    }
  )
}

function notice(content, duration, type, onClose) {
  let iconType = {
    info: "info-circle",
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-circle",
    loading: "loading"
  }[type]

  if (typeof duration === "function") {
    onClose = duration
  }

  const target = key++
  getMessageInstance(instance => {
    instance.notice({
      key: target,
      duration,
      className: `message-${type}`,
      style: {},
      content: (
        <React.Fragment>
          <Icon type={iconType} />
          {content}
        </React.Fragment>
      ),
      onClose
    })
  })

  return () => {
    if (messageInstance) {
      messageInstance.removeNotice(target)
    }
  }
}

Message.info = (content, duration, onClose) => {
  return notice(content, duration, "info", onClose)
}

Message.warning = Message.warn = (content, duration, onClose) => {
  return notice(content, duration, "warning", onClose)
}

Message.error = (content, duration, onClose) => {
  return notice(content, duration, "error", onClose)
}

Message.success = (content, duration, onClose) => {
  return notice(content, duration, "success", onClose)
}

export default Message
