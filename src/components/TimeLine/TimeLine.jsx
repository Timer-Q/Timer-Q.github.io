import React, { Component } from "react"
import PropTypes from "prop-types"
import "./style/timeLine.scss"

export default class componentName extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any,
    isShowLastTail: PropTypes.bool
  }

  static defaultProps = {
    isShowLastTail: true
  }

  renderTitle() {
    const { title } = this.props
    return title ? <div className="timeline-title">{title}</div> : null
  }

  renderChildren() {
    const { children, isShowLastTail } = this.props
    const childrenCount = React.Children.count(children)
    return React.Children.map(children, (child, index) => {
      if (index === childrenCount - 1 && !isShowLastTail) {
        return React.cloneElement(child, { className: "timeline-item-last" })
      }
      return child
    })
  }

  render() {
    return (
      <div className="timeline-wrapper">
        {this.renderTitle()}
        <ul className="timeline">
          {this.renderChildren()}
        </ul>
      </div>
    )
  }
}
