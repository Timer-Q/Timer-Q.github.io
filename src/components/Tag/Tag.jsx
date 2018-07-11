import React, { Component } from "react"
import PropTypes from "prop-types"
import "./style/tag.scss"

export default class Tag extends Component {
  static propTypes = {
    children: PropTypes.any,
    closeable: PropTypes.bool,
    onClose: PropTypes.func
  }
  static defaultProps = {
    closeable: true
  }

  handleCLoseClick() {
    const { onClose } = this.props
    onClose && onClose()
  }

  renderCloseBtn() {
    const { closeable } = this.props
    return closeable ? (
      <span className="tag-close-btn" onClick={this.handleCLoseClick.bind(this)}> &times;</span>
    ) : null
  }

  render() {
    return (
      <div className="tag">
        {this.props.children} {this.renderCloseBtn()}
      </div>
    )
  }
}
