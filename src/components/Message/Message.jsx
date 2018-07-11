import React, { Component } from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import MessageBase from "./MessageBase"
import Transition from "../Transition"
import "./style/message.scss"

class Message extends Component {
  static propTypes = {
    children: PropTypes.any,
    content: PropTypes.any,
    onClose: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  add = config => {
    const { key } = config
    // const {maxCount} = this.props
    this.setState(previousState => {
      const messages = previousState.messages
      const messageIndex = messages.map(message => message.key).indexOf(key)
      const updatedMessages = messages.concat()
      if (messageIndex > -1) {
        updatedMessages.splice(messageIndex, 1, config)
      } else {
        updatedMessages.push(config)
      }
      return {
        messages: updatedMessages
      }
    })
  }

  remove(key) {
    this.setState(previousState => {
      return {
        messages: previousState.messages.filter(message => message.key !== key)
      }
    })
  }

  render() {
    const { messages } = this.state
    const { onClose } = this.props
    return (
      <Transition in={true}>
        <div className="message-wrapper">
          {messages.map((message, index) => {
            const key = message.updateKey || message.key
            return (
              <MessageBase
                key={index}
                {...message}
                onClose={this.remove.bind(this, key, onClose)}>
                {message.content}
              </MessageBase>
            )
          })}
        </div>
      </Transition>
    )
  }
}

Message.newInstance = function newNotificationInstance(config, cb) {
  const div = document.createElement("div")
  document.body.appendChild(div)

  let called
  function getRef(node) {
    if (called) return
    called = true
    cb({
      notice(props) {
        node.add(props)
      },
      removeNotice(key) {
        node.remove(key)
      },
      destroy() {
        ReactDOM.unmountComponentAtNode(div)
        div.parentNode.removeChild(div)
      },
      component: node
    })
  }

  ReactDOM.render(<Message {...config} ref={getRef} />, div)
}

export default Message
