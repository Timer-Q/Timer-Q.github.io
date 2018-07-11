import React, { Component } from "react"
import PropTypes from "prop-types"
import "./style/card.scss"

export default class Card extends Component {
  static propTypes = {
    mode: PropTypes.string,
    title: PropTypes.string,
    extra: PropTypes.any,
    children: PropTypes.any,
    cover: PropTypes.any,
    actions: PropTypes.any,
    style: PropTypes.object,
    bodyStyle: PropTypes.object,
    coverStyle: PropTypes.object,
    contentStyle: PropTypes.object
  }

  static defaultProps = {
    contentStyle: {
      height: "120px"
    }
  }

  renderHead() {
    const { title, extra } = this.props
    return (
      (title || extra) && (
        <div className="card-head">
          {title}
          {extra}
        </div>
      )
    )
  }

  renderCover() {
    const { cover, coverStyle } = this.props
    return (
      cover && (
        <div style={coverStyle} className="card-cover">
          {cover}
        </div>
      )
    )
  }

  renderBody() {
    const { children, bodyStyle } = this.props

    return (
      children && (
        <div style={bodyStyle} className="card-body">
          {children}
        </div>
      )
    )
  }

  // TODO: actions 按钮
  renderAction() {
    const { actions } = this.props
    return actions && <div>{actions}</div>
  }

  render() {
    const { style, contentStyle } = this.props

    const head = this.renderHead()
    const coverNode = this.renderCover()
    const body = this.renderBody()
    const actionNode = this.renderAction()

    return (
      <div style={style} className="card">
        {head}
        <div style={contentStyle} className="card-content">
          {coverNode}
          {body}
        </div>
        {actionNode}
      </div>
    )
  }
}
