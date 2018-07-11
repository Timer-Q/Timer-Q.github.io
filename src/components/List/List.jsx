import React, { Component } from "react"
import PropTypes from "prop-types"
import "./style/list.scss"
import Button from "../Button"

export default class List extends Component {
  static propTypes = {
    isEdit: PropTypes.bool,
    sourceData: PropTypes.any
  }

  renderInfo() {
    const { content } = this.props.sourceData
    return (
      <div className="list-item-main">
        <div className="list-content">
          {content.infoName.map(item => <div key={item}>{item}</div>)}
        </div>
        <div className="list-content">
          <div className="list-info-content">
            <div className="list-info-content-header">
              {content.infoBaseStart[0]}
            </div>
            <div className="list-info-content-text">
              {content.infoBaseStart[1]}
            </div>
            {content.infoBaseStart[2] && (
              <div className="list-info-content-text">
                {content.infoBaseStart[2]}
              </div>
            )}
          </div>
          <div className="list-info-content">
            <div className="list-info-content-line">
              {content.infoBaseThrough[0]}
            </div>
          </div>
          <div className="list-info-content">
            <div className="list-info-content-header">
              {content.infoBaseEnd[0]}
            </div>
            <div className="list-info-content-text">
              {content.infoBaseEnd[1]}
            </div>
            {content.infoBaseEnd[2] && (
              <div className="list-info-content-text">
                {content.infoBaseEnd[2]}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { sourceData } = this.props
    const { addonInfo } = this.props.sourceData
    if (!sourceData) return <div className="list">暂无数据</div>
    return (
      <div className="list">
        <div className="list-item">
          <div className="list-content">{sourceData.title}</div>
          <div className="list-content">
            {this.renderInfo()}
            {addonInfo && (
              <span className="list-item-footer">
                <b>{addonInfo[0]}</b>
                <span>{addonInfo[1]}</span>
                <span>{addonInfo[2]}</span>
              </span>
            )}
          </div>
          <div className="list-item-extra">
            <Button link>删除</Button>
          </div>
        </div>
      </div>
    )
  }
}
