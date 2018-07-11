import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

export default class TimeLineItem extends Component {
  static propTypes = {
    children: PropTypes.any,
    head: PropTypes.any,
    className: PropTypes.string,
    title: PropTypes.any,
    titleStyle: PropTypes.object,
    subTitle: PropTypes.any
  }

  render() {
    const {
      children,
      head,
      title,
      subTitle,
      className,
      titleStyle,
      ...rest
    } = this.props
    const headClasses = classNames("timeline-item-head", {
      "timeline-item-head-auto": !head,
      "timeline-item-head-icon": head
    })

    const itemCls = classNames("timeline-item", {
      [className]: className
    })

    const subTitleNode = subTitle ? (
      <span className="timeline-item-subtitle">{subTitle}</span>
    ) : null

    const titleNode = title ? (
      <div style={titleStyle} className="timeline-item-title">
        {title}
        {subTitleNode}
      </div>
    ) : null

    const newChildren = React.Children.map(children, child => {
      return React.cloneElement(child, {
        className: "timeline-item-content-row"
      })
    })

    return (
      <li {...rest} className={itemCls}>
        <div className={headClasses}>{head}</div>
        {titleNode}
        <div className="timeline-item-tail" />
        <div className="timeline-item-content">{newChildren}</div>
      </li>
    )
  }
}
