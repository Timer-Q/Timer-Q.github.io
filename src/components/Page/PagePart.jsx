import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import Anchor from "../Anchor"

export default class PagePart extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    subtitle: PropTypes.any,
    children: PropTypes.any,
    title: PropTypes.string,
    anchor: PropTypes.string,
    anchors: PropTypes.array
  }

  renderAnchors() {
    const { anchors } = this.props
    return (
      anchors && (
        <Anchor
          getContainer={this.getContainer}
          defaultActive={anchors[0].href || anchors[0].label}>
          {anchors.map((anchor, index) => {
            return (
              <Anchor.Link key={index} href={anchor.href || anchor.label}>
                {anchor.label}
              </Anchor.Link>
            )
          })}
        </Anchor>
      )
    )
  }

  getContainer = () => {
    return this.pagePartRef
  }

  render() {
    const { className, style, children, title, anchor, subtitle } = this.props
    const cls = classNames("page-part", {
      [className]: className
    })

    return (
      <div
        ref={node => (this.pagePartRef = node)}
        style={style}
        className={cls}
        id={anchor}>
        {title && <h1 className="page-part-title">{title}</h1>}
        {/* {anchors && <div className="page-part-subtitle">{this.renderAnchors()}</div>} */}
        {subtitle && <div className="page-part-subtitle">{subtitle}</div>}
        {children}
      </div>
    )
  }
}
