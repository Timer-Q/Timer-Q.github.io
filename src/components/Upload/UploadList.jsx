import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { previewFile, isImageUrl } from "./utils.js"
// import Button from "../Button"
import Icon from "../Icon"

export default class UploadList extends Component {
  static propTypes = {
    file: PropTypes.any,
    onRemove: PropTypes.func,
    onSetMain: PropTypes.func,
    post: PropTypes.func,
    size: PropTypes.string,
    actions: PropTypes.array,
    showProgress: PropTypes.bool
  }
  static defaultProps = {
    size: "normal"
  }

  constructor(props) {
    super(props)
    this.isComponentMounted = true
  }

  componentDidMount() {
    this.isComponentMounted = true
  }

  componentDidUpdate() {
    const { file } = this.props
    if (!file) return
    if (file.thumbUrl !== undefined) return
    file.thumbUrl = ""
    previewFile(
      file.originFileObj || file,
      previewDataUrl => {
        if (!this.isComponentMounted) return
        // thumbUrl 的获取实在 forEach 中，render 会在 循环完之后执行，如果不 forceUpdate ，img 的 src 是空的
        file.thumbUrl = previewDataUrl
        this.forceUpdate()
      }
    )
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }
  /**
   * 删除
   */
  handleRemove = (file, event) => {
    event.stopPropagation()
    const { onRemove } = this.props
    onRemove && onRemove(file)
  }

  /**
   * 重新上传
   */
  handleReupload = (file, event) => {
    const { post } = this.props
    event.stopPropagation()
    this.handleRemove(file, event)
    post(file)
  }

  renderProgress = file => {
    const { percent, status } = file
    const { showProgress } = this.props
    const cls = classNames("upload-progress", {
      "upload-progress-loading": !showProgress
    })
    return status === "uploading" ? (
      <div className={cls} style={{ transform: `translateY(-${percent}%)` }}>
        {!showProgress && <Icon size="large" spin type="loading" />}
      </div>
    ) : null
  }

  renderError = file => {
    const { status } = file
    if (status !== "error") return
    return (
      <div className="upload-error" onClick={e => this.handleReupload(file, e)}>
        <span>
          <p className="upload-error-text">icon</p>
          <p className="upload-error-text">上传失败，请重新上传</p>
        </span>
      </div>
    )
  }

  renderButton(file) {
    const { actions } = this.props
    if (actions && actions.length) {
      return actions.map(action => {
        let { onClick, actionActiveKey } = action.props
        const isActived = !!file[actionActiveKey]
        const cls = classNames("upload-list-actions-item")
        if (onClick) {
          onClick = onClick.bind(null, file, isActived)
        }
        return React.cloneElement(action, {
          onClick,
          className: cls
        })
      })
    }
  }

  render() {
    const { file, size } = this.props
    const cls = classNames("upload-list-item", {
      [`upload-list-item-${size}`]: size
    })
    if (!file) return <div>木有鱼丸，木有粗面</div>
    let fileObject = {}
    if (typeof file === "string") {
      fileObject = {
        thumbUrl: file,
        url: file,
        uid: file,
        status: "done"
      }
    } else {
      fileObject = file
    }
    const fileNode = isImageUrl(fileObject.thumbUrl || fileObject.url) ? (
      <div className={cls} key={fileObject.uid}>
        <img
          src={fileObject.thumbUrl || fileObject.url}
          alt={fileObject.name}
        />
        <div className="upload-list-actions">
          {this.renderButton(fileObject)}
        </div>
        {this.renderProgress(fileObject)}
        {this.renderError(fileObject)}
      </div>
    ) : (
      <div className={cls} key={fileObject.uid}>
        <video controls src={fileObject.thumbUrl} />
        <div className="upload-list-actions">
          {this.renderButton(fileObject)}
        </div>
        {this.renderProgress(fileObject)}
        {this.renderError(fileObject)}
      </div>
    )
    return fileNode
  }
}
